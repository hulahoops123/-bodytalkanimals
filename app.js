// ─────────────────────────────────────────────
// CONFIG — update these values for handover
// ─────────────────────────────────────────────
const CONFIG = {
    // Google Apps Script web app URL (saves snapshot to Drive)
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzg-i7Mq-0xLVdFBVZz3ZTd_zwuuuzzMsGr0gNvE2jda4SEcMcE8dbqdRG-oITVwRD9IQ/exec',

    // EmailJS credentials
    EMAILJS_SERVICE_ID:  'service_yyzqiep',
    EMAILJS_TEMPLATE_ID: 'template_6klhwck',
    EMAILJS_PUBLIC_KEY:  'ae8r1L_Oo_pWaOJTW',
};
// ─────────────────────────────────────────────

const { createApp } = Vue;
createApp({
    data() {
        const today = new Date();
        return {
            currentStep: 1,
            submitting: false,
            submitted: false,
            errors: {},
            signaturePad: null,
            signatureData: '',
            showCountryDropdown: false,
            displayDate: today.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
            stepLabels: ['Your Details','Your Animal','Family & Group','Diet & Exercise','Veterinary Care','Health History','Observations','Consent'],
            phoneCountries: [
                { code: 'ZA',    dial: '+27',  short: '🇿🇦 +27',  label: '🇿🇦 South Africa +27'   },
                { code: 'AU',    dial: '+61',  short: '🇦🇺 +61',  label: '🇦🇺 Australia +61'       },
                { code: 'BW',    dial: '+267', short: '🇧🇼 +267', label: '🇧🇼 Botswana +267'       },
                { code: 'CA',    dial: '+1',   short: '🇨🇦 +1',   label: '🇨🇦 Canada +1'           },
                { code: 'DE',    dial: '+49',  short: '🇩🇪 +49',  label: '🇩🇪 Germany +49'         },
                { code: 'GB',    dial: '+44',  short: '🇬🇧 +44',  label: '🇬🇧 United Kingdom +44'  },
                { code: 'IE',    dial: '+353', short: '🇮🇪 +353', label: '🇮🇪 Ireland +353'        },
                { code: 'IN',    dial: '+91',  short: '🇮🇳 +91',  label: '🇮🇳 India +91'           },
                { code: 'KE',    dial: '+254', short: '🇰🇪 +254', label: '🇰🇪 Kenya +254'          },
                { code: 'MU',    dial: '+230', short: '🇲🇺 +230', label: '🇲🇺 Mauritius +230'      },
                { code: 'AE',    dial: '+971', short: '🇦🇪 +971', label: '🇦🇪 UAE (Dubai) +971'   },
                { code: 'NL',    dial: '+31',  short: '🇳🇱 +31',  label: '🇳🇱 Netherlands +31'     },
                { code: 'NZ',    dial: '+64',  short: '🇳🇿 +64',  label: '🇳🇿 New Zealand +64'     },
                { code: 'NG',    dial: '+234', short: '🇳🇬 +234', label: '🇳🇬 Nigeria +234'        },
                { code: 'US',    dial: '+1',   short: '🇺🇸 +1',   label: '🇺🇸 United States +1'    },
                { code: 'ZW',    dial: '+263', short: '🇿🇼 +263', label: '🇿🇼 Zimbabwe +263'       },
                { code: 'OTHER', dial: '',     short: '🌐 Other', label: '🌐 Other'                 },
            ],
            form: {
                // Step 1
                owner_name: '', address: '', owner_email: '', phone: '', phone_country: 'ZA', phone_dial_custom: '', referral: '',
                // Step 2
                pet_name: '', species: '', breed: '', age: '',
                sex: '', spayed_neutered: '', lives: '', sleeps: '',
                since_baby: '', time_with_owner: '', adoption_source: '', adoption_details: '',
                // Step 3
                household_people: '', frequent_contacts: '',
                other_animals: [],
                // Step 4
                food_type: '', food_brand: '', exercise_program: '',
                // Step 5
                vet_name: '', last_vet_visit: '', vaccines: '', vaccine_frequency: '', last_vaccination: '',
                // Step 6
                health_history: '', medications: '',
                concerns: [{ issue: '', severity: 5 }],
                issues_duration: '', unique_circumstances: '', other_attempts: '',
                // Step 7
                energy_level: '', appetite: '', bowel_movements: '', skin_coat: '', anxiety_stress: '',
                body_sensitivity: '', demeanour: '', with_strangers: '', with_other_animals: '',
                additional_info: '',
                // Step 8
                consent_agreed: false,
            }
        };
    },
    computed: {},
    watch: {
        currentStep(val) {
            if (val === 8 && !this.signaturePad) {
                this.$nextTick(() => this.initSignaturePad());
            }
        },
        'form.phone'(val) {
            if (this.form.phone_country !== 'ZA') return;
            let digits = String(val).replace(/\D/g, '');
            if (digits.startsWith('27') && digits.length > 10)
                digits = '0' + digits.slice(2);
            digits = digits.slice(0, 10);
            let formatted = digits;
            if (digits.length > 6) formatted = digits.slice(0,3) + '-' + digits.slice(3,6) + '-' + digits.slice(6);
            else if (digits.length > 3) formatted = digits.slice(0,3) + '-' + digits.slice(3);
            if (formatted !== val) this.form.phone = formatted;
        }
    },
    methods: {
        inputClass(err, val) {
            const base = 'w-full border rounded-lg px-3 py-2.5 text-sm transition-colors ';
            if (err) return base + 'border-red-400 bg-red-50';
            if (val && String(val).trim()) return base + 'border-green-500';
            return base + 'border-gray-300';
        },
        taClass(err, val) {
            const base = 'w-full border rounded-lg px-3 py-2.5 text-sm resize-none overflow-hidden transition-colors ';
            if (err) return base + 'border-red-400 bg-red-50';
            if (val && String(val).trim()) return base + 'border-green-500';
            return base + 'border-gray-300';
        },
        pillClass(model, val) {
            const base = 'cursor-pointer px-4 py-2 rounded-full border text-sm font-medium transition-all select-none';
            return base + (model === val
                ? ' bg-brand-500 text-white border-brand-500'
                : ' bg-white text-gray-600 border-gray-300 hover:border-brand-500 hover:text-brand-600');
        },
        sliderStyle(val, max) {
            const pct = ((val - 1) / (max - 1)) * 100;
            return { background: `linear-gradient(to right, #3d7a6a ${pct}%, #e5e7eb ${pct}%)` };
        },
        phoneKeydown(e) {
            const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'];
            if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
            if (!/^\d$/.test(e.key)) e.preventDefault();
        },
        blurField(field) {
            const v = (this.form[field] || '').trim();
            if (field === 'owner_email') {
                if (!v) this.errors.owner_email = 'Please enter your email address.';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) this.errors.owner_email = 'Please enter a valid email address.';
                else delete this.errors.owner_email;
            } else if (field === 'owner_name') {
                if (!v) this.errors.owner_name = 'Please enter your name.';
                else delete this.errors.owner_name;
            } else if (field === 'address') {
                if (!v) this.errors.address = 'Please enter your address.';
                else delete this.errors.address;
            } else if (field === 'phone') {
                const digits = v.replace(/\D/g, '');
                if (!v) {
                    this.errors.phone = 'Please enter your phone number.';
                } else if (this.form.phone_country === 'ZA' && digits.length !== 10) {
                    this.errors.phone = 'Please enter a 10-digit number (e.g. 083-123-1234).';
                } else if (this.form.phone_country !== 'ZA' && digits.length < 7) {
                    this.errors.phone = 'Please enter a valid phone number.';
                } else {
                    delete this.errors.phone;
                }
            }
        },
        addAnimal() {
            this.form.other_animals.push({ name: '', age: '', type: '', duration: '', relationship: 0 });
        },
        removeAnimal(i) { this.form.other_animals.splice(i, 1); },
        addConcern() { this.form.concerns.push({ issue: '', severity: 5 }); },
        removeConcern(i) { this.form.concerns.splice(i, 1); },
        initSignaturePad() {
            const canvas = document.getElementById('signature-canvas');
            if (!canvas) return;
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width  = canvas.offsetWidth  * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext('2d').scale(ratio, ratio);
            this.signaturePad = new SignaturePad(canvas, {
                backgroundColor: 'rgba(255,255,255,0)',
                penColor: '#1a1a1a',
                minWidth: 0.5,
                maxWidth: 2.5,
            });
        },
        clearSignature() {
            if (this.signaturePad) this.signaturePad.clear();
            this.signatureData = '';
            delete this.errors.signature;
        },
        validate() {
            this.errors = {};

            if (this.currentStep === 1) {
                if (!this.form.owner_name.trim())
                    this.errors.owner_name = 'Please enter your name.';
                if (!this.form.address.trim())
                    this.errors.address = 'Please enter your address.';
                if (!this.form.owner_email.trim()) {
                    this.errors.owner_email = 'Please enter your email address.';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.owner_email)) {
                    this.errors.owner_email = 'Please enter a valid email address.';
                }
                const phoneDigits = this.form.phone.replace(/\D/g, '');
                if (!this.form.phone.trim()) {
                    this.errors.phone = 'Please enter your phone number.';
                } else if (this.form.phone_country === 'ZA' && phoneDigits.length !== 10) {
                    this.errors.phone = 'Please enter a 10-digit number (e.g. 083-123-1234).';
                } else if (this.form.phone_country !== 'ZA' && phoneDigits.length < 7) {
                    this.errors.phone = 'Please enter a valid phone number.';
                }
            }

            if (this.currentStep === 2) {
                if (!this.form.pet_name.trim()) this.errors.pet_name = "Please enter your pet's name.";
                if (!this.form.species.trim())  this.errors.species  = 'Please enter the species.';
                if (!this.form.breed.trim())    this.errors.breed    = 'Please enter the breed.';
                if (!this.form.age.trim())      this.errors.age      = 'Please enter the age.';
            }

            if (this.currentStep === 3) {
                this.form.other_animals.forEach((a, i) => {
                    if (!a.name.trim())
                        this.errors['animal_name_' + i] = 'Please enter a name, or remove this entry.';
                });
            }

            if (this.currentStep === 6) {
                this.form.concerns.forEach((c, i) => {
                    if (!c.issue.trim())
                        this.errors['concern_issue_' + i] = 'Please describe the concern, or remove this entry.';
                });
            }

            if (this.currentStep === 8) {
                if (!this.form.consent_agreed)
                    this.errors.consent_agreed = 'Please agree to the consent form to continue.';
                if (!this.signaturePad || this.signaturePad.isEmpty())
                    this.errors.signature = 'Please sign before submitting.';
            }

            return Object.keys(this.errors).length === 0;
        },
        nextStep() {
            if (!this.validate()) {
                this.$nextTick(() => {
                    const el = document.querySelector('.border-red-400');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
                return;
            }
            this.currentStep++;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        prevStep() {
            this.currentStep--;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        devFill() {
            Object.assign(this.form, {
                owner_name: 'Jane Smith', address: '12 Acacia Ave, Cape Town', owner_email: 'jane@example.com',
                phone: '083-123-4567', phone_country: 'ZA', referral: 'Friend',
                pet_name: 'Buddy', species: 'Dog', breed: 'Labrador', age: '4 years',
                sex: 'Male', spayed_neutered: 'Yes', lives: 'Indoors', sleeps: 'On the bed',
                since_baby: 'Yes', time_with_owner: '4 years', adoption_source: 'Breeder', adoption_details: 'Healthy litter',
                household_people: '2 adults, 1 child', frequent_contacts: 'Grandparents visit weekly',
                other_animals: [{ name: 'Whiskers', type: 'Cat', age: '3 years', duration: '3 years', relationship: 3 }],
                food_type: 'Dry kibble', food_brand: 'Royal Canin', exercise_program: '2 walks daily, 30 min each',
                vet_name: 'Dr. van der Merwe', last_vet_visit: 'March 2026', vaccines: 'Up to date', vaccine_frequency: 'Annual', last_vaccination: 'March 2026',
                health_history: 'Mild hip dysplasia diagnosed age 2', medications: 'Joint supplement daily',
                concerns: [{ issue: 'Excessive licking of paws', severity: 6 }, { issue: 'Anxiety during thunderstorms', severity: 8 }],
                issues_duration: '8 months', unique_circumstances: 'Started after move to new house', other_attempts: 'Tried calming treats',
                energy_level: 'Medium', appetite: 'Good', bowel_movements: 'Regular', skin_coat: 'Slightly dry',
                anxiety_stress: 'Moderate', body_sensitivity: 'Sensitive around hips', demeanour: 'Friendly',
                with_strangers: 'Cautious at first', with_other_animals: 'Good with cats, reactive to dogs',
                additional_info: 'Loves swimming. Dislikes loud noises.',
                consent_agreed: true,
            });
            this.currentStep = 8;
            this.$nextTick(() => this.initSignaturePad());
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        autoResize(e) {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        },
        async submitForm() {
            if (!this.validate()) return;
            this.submitting = true;
            try {
                // 1. Export drawn signature
                this.signatureData = this.signaturePad.toDataURL('image/png');
                await this.$nextTick(); // let Vue render signature into snapshot

                // 2. Briefly bring snapshot on-screen so html2canvas can capture it
                const snapshotEl = document.getElementById('form-snapshot');
                snapshotEl.style.left = '0';
                const capturedCanvas = await html2canvas(snapshotEl, {
                    scale: 1.0,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    width: 1122,
                    height: 795,
                    logging: false,
                });
                snapshotEl.style.left = '-9999px';

                const imageDataUrl = capturedCanvas.toDataURL('image/jpeg', 0.92);

                // 3. Upload to Google Drive, get back a link
                const uploadRes = await fetch(CONFIG.APPS_SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        image:      imageDataUrl,
                        owner_name: this.form.owner_name,
                        pet_name:   this.form.pet_name,
                        date:       this.displayDate,
                    }),
                });
                const uploadData = await uploadRes.json();
                if (uploadData.error) throw new Error(uploadData.error);

                // 4. Send via EmailJS with Drive link
                await emailjs.send(
                    CONFIG.EMAILJS_SERVICE_ID,
                    CONFIG.EMAILJS_TEMPLATE_ID,
                    {
                        owner_name: this.form.owner_name,
                        pet_name:   this.form.pet_name,
                        date:       this.displayDate,
                        snapshot:   uploadData.url,
                    },
                    CONFIG.EMAILJS_PUBLIC_KEY
                );

                this.submitted = true;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (err) {
                console.error(err);
                alert('Something went wrong. Please try again.');
            } finally {
                this.submitting = false;
            }
        }
    }
}).mount('#app');
