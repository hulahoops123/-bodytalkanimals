# BodyTalk Form — Handover Plan

## Kerry's side (she does this)
1. Create a Google account
2. Create a private Google Drive folder (no sharing needed)
3. Create a Google Apps Script under her account:
   - Go to script.google.com → New project
   - Paste the script from APPS_SCRIPT.md
   - Swap in her Drive folder ID
   - Deploy as Web App (Execute as: Me, Access: Anyone)
   - Copy the Web App URL
4. Create an EmailJS account at emailjs.com:
   - Add a service (connect her Gmail)
   - Create a template (copy from EMAILJS_TEMPLATE.md)
   - Note her Service ID, Template ID, and Public Key

## Your side (once Kerry sends credentials)
1. In `app.js` — swap the Apps Script URL in `submitForm()` (the `fetch(...)` call)
2. In `app.js` — swap EmailJS Service ID, Template ID, and Public Key in `emailjs.send(...)`
3. In `index.html` — swap Public Key in `emailjs.init(...)`
4. Remove dev button:
   - Delete the `<!-- DEV SHORTCUT -->` block in `index.html`
   - Delete the `devFill()` method in `app.js`
5. Push to GitHub Pages

## Domain
- Kerry has an existing domain and a separate web developer building her site
- That developer can point a subdomain (e.g. `intake.livebydesign.co.za`) to the GitHub Pages URL
- No repo changes or transfers needed

## Notes
- Repo stays on your GitHub for now
- Kerry owns all her data — nothing passes through your Google or EmailJS accounts
- Apps Script runs under Kerry's Google account and writes directly to her private Drive folder
