# Plan: Signature Capture + A4 Snapshot Email

## Goal
Replace Web3Forms with EmailJS. On submit, capture an A4-landscape snapshot of all 8 form steps (4 columns × 2 rows) with the drawn signature in cell 8, and email it to Kerry as an embedded image.

---

## Libraries to add (CDN, before `</body>`)

```html
<script src="https://cdn.jsdelivr.net/npm/signature_pad@4.2.0/dist/signature_pad.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script>emailjs.init('YOUR_PUBLIC_KEY');</script>
```

---

## Step 8 HTML changes (`index.html`)

1. Update consent checkbox label text — remove "in lieu of a physical signature" since we now capture a real signature.

2. Add signature pad after the checkbox:

```html
<!-- Signature pad -->
<div class="mt-5">
    <label class="field-label mb-2">
        Signature <span class="text-gray-400 font-normal">(draw with mouse or finger)</span>
    </label>
    <div :class="['border rounded-lg overflow-hidden bg-white', errors.signature ? 'border-red-400' : 'border-gray-300']">
        <canvas id="signature-canvas" style="width:100%;height:140px;display:block;touch-action:none;"></canvas>
    </div>
    <div class="flex justify-between items-center mt-1">
        <p v-if="errors.signature" class="err-msg">{{ errors.signature }}</p>
        <span v-else class="text-xs text-gray-400">Sign in the box above</span>
        <button type="button" @click="clearSignature"
                class="text-xs text-gray-400 hover:text-gray-600 transition-colors underline">Clear</button>
    </div>
</div>
```

---

## Snapshot div (`index.html`)

Add inside `#app`, after the closing `</div>` of the wizard (v-else block), before `</div>` of `#app`.

- Dimensions: **1122 × 795 px** (A4 landscape at 96 dpi)
- Grid: `repeat(4, 1fr)` columns × `1fr 1fr` rows
- Font: Arial (html2canvas safe)
- Off-screen: `position:fixed; left:-9999px; top:0`

### Cell layout

| Cell | Step | Key fields |
|------|------|-----------|
| 1 | Your Details | Date, Owner, Address, Email, Phone, Referral |
| 2 | Your Animal | Name, Species, Breed, Age, Sex, Spayed, Lives, Sleeps, Since baby, Time w/ owner, Adoption |
| 3 | Family & Group | Household, Frequent contacts, Other animals (v-for) |
| 4 | Diet & Exercise | Food type, Brand, Exercise |
| 5 | Veterinary Care | Vet name, Last visit, Vaccines, Freq., Last vaccination |
| 6 | Health History | History, Medications, Concerns (v-for w/ severity), Duration, Circumstances, Other attempts |
| 7 | Observations | Energy, Appetite, Bowels, Skin/coat, Anxiety, Body sensitivity, Demeanour, Strangers, Other animals, Notes |
| 8 | Consent | Name, Date, Consent ✓, Signature `<img :src="signatureData">` |

> **Note:** Use `<template v-for>` + inner `<div v-if>` to avoid Vue 3 `v-if`/`v-for` priority conflict.

---

## `app.js` changes

### 1. Add to `data()` return (top level, not inside `form`)
```js
signaturePad: null,
signatureData: '',
```

### 2. Add watcher for `currentStep` (alongside `form.phone` watcher)
Initialise the signature pad the first time step 8 becomes visible:
```js
currentStep(val) {
    if (val === 8 && !this.signaturePad) {
        this.$nextTick(() => this.initSignaturePad());
    }
},
```

### 3. New methods

```js
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
```

### 4. Update `validate()` — step 8 block
```js
if (this.currentStep === 8) {
    if (!this.form.consent_agreed)
        this.errors.consent_agreed = 'Please agree to the consent form to continue.';
    if (!this.signaturePad || this.signaturePad.isEmpty())
        this.errors.signature = 'Please sign before submitting.';
}
```

### 5. Replace `submitForm()`

Remove all Web3Forms code. New implementation:

```js
async submitForm() {
    if (!this.validate()) return;
    this.submitting = true;
    try {
        // Export drawn signature to base64 PNG
        this.signatureData = this.signaturePad.toDataURL('image/png');
        await this.$nextTick(); // let Vue render signature into snapshot

        // Bring snapshot on-screen so html2canvas can capture it
        const snapshotEl = document.getElementById('form-snapshot');
        snapshotEl.style.left = '0';
        const capturedCanvas = await html2canvas(snapshotEl, {
            scale: 1.5,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: 1122,
            height: 795,
            logging: false,
        });
        snapshotEl.style.left = '-9999px';

        const imageDataUrl = capturedCanvas.toDataURL('image/jpeg', 0.82);

        await emailjs.send(
            'YOUR_SERVICE_ID',
            'YOUR_TEMPLATE_ID',
            {
                owner_name: this.form.owner_name,
                pet_name:   this.form.pet_name,
                date:       this.displayDate,
                snapshot:   imageDataUrl,
            },
            'YOUR_PUBLIC_KEY'
        );

        this.submitted = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        console.error(err);
        alert('Something went wrong. Please try again.');
    } finally {
        this.submitting = false;
    }
},
```

---

## EmailJS setup (user action required)

1. Log in to emailjs.com
2. **Add a service** (e.g. Gmail) — note the **Service ID**
3. **Create a template** with:
   - **Subject:** `BodyTalk Intake — {{owner_name}} / {{pet_name}} — {{date}}`
   - **To Email:** Kerry's email address (set in template, not passed as param)
   - **HTML body:**
     ```html
     <p>New intake form submitted by <strong>{{owner_name}}</strong> for <strong>{{pet_name}}</strong> on {{date}}.</p>
     <img src="{{snapshot}}" style="max-width:100%;height:auto;">
     ```
   - Note the **Template ID**
4. Copy your **Public Key** from Account → API Keys
5. Replace all four `YOUR_*` placeholders in `app.js` and the `emailjs.init(...)` call in `index.html`

---

## Image size note

The captured JPEG (A4 at 1.5× scale, quality 0.82) will be roughly **300–600 KB** as a base64 string. This works fine with EmailJS paid plans. On the free tier it may exceed the email body limit — if the email fails silently, lower the scale to `1.0` and quality to `0.70`.
