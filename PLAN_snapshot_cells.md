# Snapshot Div — Full HTML

Place this inside `#app`, after the closing `</div>` of the `v-else` wizard block, before `</div>` of `#app`.

```html
<!-- ── A4 Landscape Snapshot (off-screen, captured by html2canvas on submit) ── -->
<div id="form-snapshot" style="position:fixed;left:-9999px;top:0;width:1122px;height:795px;background:#fff;padding:14px;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr;gap:8px;height:100%;">

    <!-- 1 · Your Details -->
    <div style="border:1px solid #7dbdaf;border-radius:5px;padding:9px;overflow:hidden;background:#f9fcfb;">
      <div style="font-size:7px;font-weight:700;color:#3d7a6a;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #c6e3db;padding-bottom:3px;margin-bottom:7px;">1 · Your Details</div>
      <div style="font-size:8px;line-height:1.65;color:#374151;word-break:break-word;">
        <div><span style="color:#9ca3af;font-size:7px;">DATE </span>{{ displayDate }}</div>
        <div><span style="color:#9ca3af;font-size:7px;">OWNER </span>{{ form.owner_name }}</div>
        <div><span style="color:#9ca3af;font-size:7px;">ADDRESS </span>{{ form.address }}</div>
        <div><span style="color:#9ca3af;font-size:7px;">EMAIL </span>{{ form.owner_email }}</div>
        <div><span style="color:#9ca3af;font-size:7px;">PHONE </span>{{ (form.phone_country === 'OTHER' ? form.phone_dial_custom : (phoneCountries.find(c => c.code === form.phone_country)?.dial || '')) + ' ' + form.phone }}</div>
        <div v-if="form.referral"><span style="color:#9ca3af;font-size:7px;">REFERRAL </span>{{ form.referral }}</div>
      </div>
    </div>

    <!-- 2 · Your Animal -->
    <div style="border:1px solid #7dbdaf;border-radius:5px;padding:9px;overflow:hidden;background:#f9fcfb;">
      <div style="font-size:7px;font-weight:700;color:#3d7a6a;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #c6e3db;padding-bottom:3px;margin-bottom:7px;">2 · Your Animal</div>
      <div style="font-size:8px;line-height:1.65;color:#374151;word-break:break-word;">
        <div><span style="color:#9ca3af;font-size:7px;">NAME </span>{{ form.pet_name }}</div>
        <div><span style="color:#9ca3af;font-size:7px;">SPECIES </span>{{ form.species }}</div>
        <div><span style="color:#9ca3af;font-size:7px;">BREED </span>{{ form.breed }}</div>
        <div><span style="color:#9ca3af;font-size:7px;">AGE </span>{{ form.age }}</div>
        <div><span style="color:#9ca3af;font-size:7px;">SEX </span>{{ form.sex }}<span v-if="form.spayed_neutered"> · {{ form.spayed_neutered === 'Yes' ? 'Spayed/Neutered' : 'Intact' }}</span></div>
        <div v-if="form.lives"><span style="color:#9ca3af;font-size:7px;">LIVES </span>{{ form.lives }} · Sleeps {{ form.sleeps }}</div>
        <div v-if="form.since_baby"><span style="color:#9ca3af;font-size:7px;">SINCE BABY </span>{{ form.since_baby }}</div>
        <div v-if="form.time_with_owner"><span style="color:#9ca3af;font-size:7px;">TIME W/ OWNER </span>{{ form.time_with_owner }}</div>
        <div v-if="form.adoption_source && form.adoption_source !== 'N/A'"><span style="color:#9ca3af;font-size:7px;">ADOPTED FROM </span>{{ form.adoption_source }}</div>
        <div v-if="form.adoption_details"><span style="color:#9ca3af;font-size:7px;">ADOPTION NOTES </span>{{ form.adoption_details }}</div>
      </div>
    </div>

    <!-- 3 · Family & Group -->
    <div style="border:1px solid #7dbdaf;border-radius:5px;padding:9px;overflow:hidden;background:#f9fcfb;">
      <div style="font-size:7px;font-weight:700;color:#3d7a6a;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #c6e3db;padding-bottom:3px;margin-bottom:7px;">3 · Family & Group</div>
      <div style="font-size:8px;line-height:1.65;color:#374151;word-break:break-word;">
        <div v-if="form.household_people"><span style="color:#9ca3af;font-size:7px;">HOUSEHOLD </span>{{ form.household_people }}</div>
        <div v-if="form.frequent_contacts"><span style="color:#9ca3af;font-size:7px;">FREQ. CONTACTS </span>{{ form.frequent_contacts }}</div>
        <template v-if="form.other_animals.length">
          <div style="color:#9ca3af;font-size:7px;margin-top:5px;text-transform:uppercase;letter-spacing:.06em;">OTHER ANIMALS</div>
          <template v-for="(a,i) in form.other_animals" :key="i">
            <div style="padding-left:6px;border-left:2px solid #c6e3db;margin-top:3px;">
              <span style="font-weight:600;">{{ a.name }}</span>
              <span v-if="a.type"> · {{ a.type }}</span>
              <span v-if="a.age"> · {{ a.age }}</span>
              <span v-if="a.duration"> · {{ a.duration }}</span>
              <span v-if="a.relationship"> · {{ a.relationship }}/5</span>
            </div>
          </template>
        </template>
      </div>
    </div>

    <!-- 4 · Diet & Exercise -->
    <div style="border:1px solid #7dbdaf;border-radius:5px;padding:9px;overflow:hidden;background:#f9fcfb;">
      <div style="font-size:7px;font-weight:700;color:#3d7a6a;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #c6e3db;padding-bottom:3px;margin-bottom:7px;">4 · Diet & Exercise</div>
      <div style="font-size:8px;line-height:1.65;color:#374151;word-break:break-word;">
        <div v-if="form.food_type"><span style="color:#9ca3af;font-size:7px;">FOOD TYPE </span>{{ form.food_type }}</div>
        <div v-if="form.food_brand"><span style="color:#9ca3af;font-size:7px;">BRAND </span>{{ form.food_brand }}</div>
        <div v-if="form.exercise_program"><span style="color:#9ca3af;font-size:7px;">EXERCISE </span>{{ form.exercise_program }}</div>
      </div>
    </div>

    <!-- 5 · Veterinary Care -->
    <div style="border:1px solid #7dbdaf;border-radius:5px;padding:9px;overflow:hidden;background:#f9fcfb;">
      <div style="font-size:7px;font-weight:700;color:#3d7a6a;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #c6e3db;padding-bottom:3px;margin-bottom:7px;">5 · Veterinary Care</div>
      <div style="font-size:8px;line-height:1.65;color:#374151;word-break:break-word;">
        <div v-if="form.vet_name"><span style="color:#9ca3af;font-size:7px;">VET </span>{{ form.vet_name }}</div>
        <div v-if="form.last_vet_visit"><span style="color:#9ca3af;font-size:7px;">LAST VISIT </span>{{ form.last_vet_visit }}</div>
        <div v-if="form.vaccines"><span style="color:#9ca3af;font-size:7px;">VACCINES </span>{{ form.vaccines }}</div>
        <div v-if="form.vaccine_frequency"><span style="color:#9ca3af;font-size:7px;">FREQ. </span>{{ form.vaccine_frequency }}</div>
        <div v-if="form.last_vaccination"><span style="color:#9ca3af;font-size:7px;">LAST VACC. </span>{{ form.last_vaccination }}</div>
      </div>
    </div>

    <!-- 6 · Health History -->
    <div style="border:1px solid #7dbdaf;border-radius:5px;padding:9px;overflow:hidden;background:#f9fcfb;">
      <div style="font-size:7px;font-weight:700;color:#3d7a6a;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #c6e3db;padding-bottom:3px;margin-bottom:7px;">6 · Health History</div>
      <div style="font-size:8px;line-height:1.65;color:#374151;word-break:break-word;">
        <div v-if="form.health_history"><span style="color:#9ca3af;font-size:7px;">HISTORY </span>{{ form.health_history }}</div>
        <div v-if="form.medications"><span style="color:#9ca3af;font-size:7px;">MEDICATIONS </span>{{ form.medications }}</div>
        <template v-if="form.concerns.some(c => c.issue)">
          <div style="color:#9ca3af;font-size:7px;margin-top:5px;text-transform:uppercase;letter-spacing:.06em;">CONCERNS</div>
          <template v-for="(c,i) in form.concerns" :key="i">
            <div v-if="c.issue" style="padding-left:6px;border-left:2px solid #c6e3db;margin-top:3px;">
              {{ c.issue }} <span style="color:#9ca3af;">({{ c.severity }}/10)</span>
            </div>
          </template>
        </template>
        <div v-if="form.issues_duration"><span style="color:#9ca3af;font-size:7px;">DURATION </span>{{ form.issues_duration }}</div>
        <div v-if="form.unique_circumstances"><span style="color:#9ca3af;font-size:7px;">CIRCUMSTANCES </span>{{ form.unique_circumstances }}</div>
        <div v-if="form.other_attempts"><span style="color:#9ca3af;font-size:7px;">OTHER ATTEMPTS </span>{{ form.other_attempts }}</div>
      </div>
    </div>

    <!-- 7 · Observations -->
    <div style="border:1px solid #7dbdaf;border-radius:5px;padding:9px;overflow:hidden;background:#f9fcfb;">
      <div style="font-size:7px;font-weight:700;color:#3d7a6a;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #c6e3db;padding-bottom:3px;margin-bottom:7px;">7 · Observations</div>
      <div style="font-size:8px;line-height:1.65;color:#374151;word-break:break-word;">
        <div v-if="form.energy_level"><span style="color:#9ca3af;font-size:7px;">ENERGY </span>{{ form.energy_level }}</div>
        <div v-if="form.appetite"><span style="color:#9ca3af;font-size:7px;">APPETITE </span>{{ form.appetite }}</div>
        <div v-if="form.bowel_movements"><span style="color:#9ca3af;font-size:7px;">BOWELS </span>{{ form.bowel_movements }}</div>
        <div v-if="form.skin_coat"><span style="color:#9ca3af;font-size:7px;">SKIN/COAT </span>{{ form.skin_coat }}</div>
        <div v-if="form.anxiety_stress"><span style="color:#9ca3af;font-size:7px;">ANXIETY </span>{{ form.anxiety_stress }}</div>
        <div v-if="form.body_sensitivity"><span style="color:#9ca3af;font-size:7px;">BODY SENS. </span>{{ form.body_sensitivity }}</div>
        <div v-if="form.demeanour"><span style="color:#9ca3af;font-size:7px;">DEMEANOUR </span>{{ form.demeanour }}</div>
        <div v-if="form.with_strangers"><span style="color:#9ca3af;font-size:7px;">W/ STRANGERS </span>{{ form.with_strangers }}</div>
        <div v-if="form.with_other_animals"><span style="color:#9ca3af;font-size:7px;">W/ ANIMALS </span>{{ form.with_other_animals }}</div>
        <div v-if="form.additional_info"><span style="color:#9ca3af;font-size:7px;">NOTES </span>{{ form.additional_info }}</div>
      </div>
    </div>

    <!-- 8 · Consent & Signature -->
    <div style="border:1px solid #7dbdaf;border-radius:5px;padding:9px;overflow:hidden;background:#f9fcfb;">
      <div style="font-size:7px;font-weight:700;color:#3d7a6a;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #c6e3db;padding-bottom:3px;margin-bottom:7px;">8 · Consent</div>
      <div style="font-size:8px;line-height:1.65;color:#374151;word-break:break-word;">
        <div><span style="color:#9ca3af;font-size:7px;">NAME </span>{{ form.owner_name }}</div>
        <div><span style="color:#9ca3af;font-size:7px;">DATE </span>{{ displayDate }}</div>
        <div><span style="color:#9ca3af;font-size:7px;">CONSENT </span>Agreed ✓</div>
        <div style="margin-top:10px;color:#9ca3af;font-size:7px;text-transform:uppercase;letter-spacing:.06em;">SIGNATURE</div>
        <div style="margin-top:5px;border:1px solid #e5e7eb;border-radius:4px;background:#fff;padding:4px;">
          <img v-if="signatureData" :src="signatureData" style="max-width:100%;max-height:90px;display:block;">
          <div v-else style="height:60px;display:flex;align-items:center;justify-content:center;color:#d1d5db;font-size:7px;">No signature</div>
        </div>
      </div>
    </div>

  </div>
</div>
```
