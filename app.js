const { createApp } = Vue;
createApp({
    data() {
        const today = new Date();
        return {
            currentStep: 1,
            submitting: false,
            submitted: false,
            errors: {},
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
        autoResize(e) {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        },
        async submitForm() {
            if (!this.validate()) return;
            this.submitting = true;

            const fd = new FormData();
            fd.append('access_key', '1207f06d-2a57-40b8-a79a-ad57d6eba0ae');
            fd.append('subject', `BodyTalk Intake — ${this.form.owner_name} / ${this.form.pet_name}`);
            fd.append('from_name', 'BodyTalk Animals Intake Form');

            const flat = {
                'Date': this.displayDate,
                'Owner Name': this.form.owner_name,
                'Address': this.form.address,
                'Owner Email': this.form.owner_email,
                'Phone': (this.form.phone_country === 'OTHER' ? this.form.phone_dial_custom : (this.phoneCountries.find(c => c.code === this.form.phone_country)?.dial || '')) + ' ' + this.form.phone,
                'Referral': this.form.referral,
                'Pet Name': this.form.pet_name,
                'Species': this.form.species,
                'Breed': this.form.breed,
                'Age': this.form.age,
                'Sex': this.form.sex,
                'Spayed/Neutered': this.form.spayed_neutered,
                'Lives': this.form.lives,
                'Sleeps': this.form.sleeps,
                'Had Since Baby': this.form.since_baby,
                'Time With Owner': this.form.time_with_owner,
                'Adoption Source': this.form.adoption_source,
                'Adoption Details': this.form.adoption_details,
                'Household People': this.form.household_people,
                'Frequent Contacts': this.form.frequent_contacts,
                'Food Type': this.form.food_type,
                'Food Brand': this.form.food_brand,
                'Exercise Program': this.form.exercise_program,
                'Veterinarian': this.form.vet_name,
                'Last Vet Visit': this.form.last_vet_visit,
                'Vaccines': this.form.vaccines,
                'Vaccine Frequency': this.form.vaccine_frequency,
                'Last Vaccination': this.form.last_vaccination,
                'Health History': this.form.health_history,
                'Medications': this.form.medications,
                'Issues Duration': this.form.issues_duration,
                'Unique Circumstances': this.form.unique_circumstances,
                'Other Attempts': this.form.other_attempts,
                'Energy Level': this.form.energy_level,
                'Appetite': this.form.appetite,
                'Bowel Movements': this.form.bowel_movements,
                'Skin/Coat': this.form.skin_coat,
                'Anxiety/Stress': this.form.anxiety_stress,
                'Body Sensitivity': this.form.body_sensitivity,
                'Demeanour': this.form.demeanour,
                'With Strangers': this.form.with_strangers,
                'With Other Animals': this.form.with_other_animals,
                'Additional Info': this.form.additional_info,
                'Consent Agreed': 'Yes',
                'Consent Date': this.displayDate,
            };

            for (const [k, v] of Object.entries(flat)) {
                if (v) fd.append(k, v);
            }

            this.form.other_animals.forEach((a, i) => {
                if (a.name) {
                    const stars = '★'.repeat(a.relationship) + '☆'.repeat(5 - a.relationship);
                    fd.append(`Other Animal ${i + 1}`,
                        `${a.name} | Age: ${a.age} | Type: ${a.type} | In family: ${a.duration} | Relationship: ${stars} (${a.relationship}/5)`);
                }
            });

            this.form.concerns.forEach((c, i) => {
                if (c.issue) fd.append(`Concern ${i + 1}`, `${c.issue} (Severity: ${c.severity}/10)`);
            });

            try {
                const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.success) {
                    this.submitted = true;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    alert('Something went wrong. Please try again.');
                }
            } catch {
                alert('Network error. Please check your connection and try again.');
            } finally {
                this.submitting = false;
            }
        }
    }
}).mount('#app');
