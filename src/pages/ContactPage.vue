<template>
    <section id="contact" class="ct-wrap">
      <div class="ct-container">
        <!-- Header -->
        <header class="ct-head">
          <h1 class="ct-h1">Contact</h1>
          <p class="ct-sub">Have questions, suggestions, or would you like to collaborate? Send us a message—we'd love to hear from you.</p>
        </header>
  
        <div class="ct-grid">
          <!-- FORM -->
          <form class="card form" @submit.prevent="submitForm" novalidate>
            <div class="row">
              <div class="field">
                <label>Name <span class="req">*</span></label>
                <input v-model.trim="form.name" type="text" autocomplete="name" :class="{'invalid': errors.name}" placeholder="Full name" />
                <p v-if="errors.name" class="err">{{ errors.name }}</p>
              </div>
  
              <div class="field">
                <label>Email <span class="req">*</span></label>
                <input v-model.trim="form.email" type="email" autocomplete="email" :class="{'invalid': errors.email}" placeholder="email@example.com" />
                <p v-if="errors.email" class="err">{{ errors.email }}</p>
              </div>
            </div>
  
            <div class="row">
              <div class="field">
                <label>Mobile Phone</label>
                <input v-model.trim="form.phone" type="tel" autocomplete="tel" placeholder="+670 77827283" />
              </div>
  
              <div class="field">
                <label>Subject</label>
                <input v-model.trim="form.subject" type="text" placeholder="Message title" />
              </div>
            </div>
  
            <div class="field">
              <label>Message <span class="req">*</span></label>
              <textarea v-model.trim="form.message" :class="{'invalid': errors.message}" rows="6" placeholder="Write your message here..."></textarea>
              <div class="muted small">
                <span>{{ form.message.length }}/{{ MAX_LEN }}</span>
                <span v-if="errors.message" class="err ml">{{ errors.message }}</span>
              </div>
            </div>
  
            <!-- Honeypot -->
            <input v-model="form.company" type="text" autocomplete="organization" class="honeypot" tabindex="-1" aria-hidden="true" />
  
            <!-- Consent -->
            <label class="check">
              <input type="checkbox" v-model="form.consent" />
              <span>I agree to this data being used to follow up on my messages.</span>
            </label>
  
            <!-- Alerts -->
            <p v-if="status.type==='error'" class="alert error">{{ status.message }}</p>
            <p v-if="status.type==='success'" class="alert success">{{ status.message }}</p>
  
            <div class="actions">
              <button class="btn" type="submit" :disabled="isSubmitting">
                <span v-if="!isSubmitting">Send message</span>
                <span v-else class="spinner"></span>
              </button>
              <button class="btn ghost" type="button" @click="resetForm" :disabled="isSubmitting">Reset</button>
            </div>
          </form>
  
          <!-- INFO PANEL -->
          <aside class="card info">
            <h3 class="info-title">Contact Us</h3>
  
            <div class="info-item">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5a2.5 2.5 0 0 1 0 5Z"/></svg>
              <div>
                <div class="label">Address</div>
                <div class="value">{{ address }}</div>
                <div class="links"><a :href="mapsUrl" target="_blank" rel="noopener">View map →</a></div>
              </div>
            </div>
  
            <div class="info-item">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3c1 .3 2 .5 3 .5c.7 0 1.2.5 1.2 1.2V20c0 .7-.5 1.2-1.2 1.2C10.7 21.2 2.8 13.3 2.8 3.2C2.8 2.5 3.3 2 4 2h3.4c.7 0 1.2.5 1.2 1.2c0 1 .2 2 .5 3c.1.4 0 .9-.3 1.2l-2.2 2.2Z"/></svg>
              <div>
                <div class="label">Telephone</div>
                <div class="value"><a :href="`tel:${phone}`">{{ phone }}</a></div>
              </div>
            </div>
  
            <div class="info-item">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 13L2 6h20l-10 7Zm-10 5V8l10 7l10-7v10H2Z"/></svg>
              <div>
                <div class="label">Email</div>
                <div class="value"><a :href="`mailto:${emailTo}`">{{ emailTo }}</a></div>
              </div>
            </div>
  
            <div v-if="mapEmbedUrl" class="map">
              <iframe :src="mapEmbedUrl" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
            </div>
  
            <div class="socials">
              <a v-for="s in socials" :key="s.id" :href="s.href" target="_blank" rel="noopener" aria-label="s.label">
                <svg v-if="s.id==='fb'" viewBox="0 0 24 24"><path fill="currentColor" d="M13 22v-8h3l1-4h-4V8a1 1 0 0 1 1-1h3V3h-3a5 5 0 0 0-5 5v2H6v4h3v8h4z"/></svg>
                <svg v-else-if="s.id==='ig'" viewBox="0 0 24 24"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 3a5 5 0 1 1 0 10a5 5 0 0 1 0-10Zm5.5-.75a1.25 1.25 0 1 1 0 2.5a1.25 1.25 0 0 1 0-2.5Z"/></svg>
                <svg v-else-if="s.id==='yt'" viewBox="0 0 24 24"><path fill="currentColor" d="M23 12c0-2.2-.2-3.7-.4-4.5c-.2-.8-.8-1.4-1.6-1.6C19.9 5.6 12 5.6 12 5.6s-7.9 0-9 .3c-.8.2-1.4.8-1.6 1.6C1.2 8.3 1 9.8 1 12s.2 3.7.4 4.5c.2.8.8 1.4 1.6 1.6c1.1.3 9 .3 9 .3s7.9 0 9-.3c.8-.2 1.4-.8 1.6-1.6c.2-.8.4-2.3.4-4.5ZM10 15.5v-7l6 3.5l-6 3.5Z"/></svg>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { reactive, ref, computed } from 'vue'
  
  /* ===== Config props (change according to backend) ===== */
  const props = defineProps({
    apiUrl: { type: String, default: '/api/public/contact/' },
    address: { type: String, default: '123 Example Street, Dili, Timor-Leste' },
    phone: { type: String, default: '+670 7777 0000' },
    emailTo: { type: String, default: 'hello@alola.org' },
    mapEmbedUrl: { type: String, default: '' }, // e.g. Google Maps embed URL
  })
  
  /* ===== State ===== */
  const MAX_LEN = 1000
  const form = reactive({
    name: '', email: '', phone: '', subject: '', message: '',
    consent: true,
    company: '' // honeypot
  })
  const errors = reactive({ name:'', email:'', message:'' })
  const isSubmitting = ref(false)
  const status = reactive({ type:'', message:'' })
  
  const address = computed(() => props.address)
  const phone = computed(() => props.phone)
  const emailTo = computed(() => props.emailTo)
  const mapsUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.address)}`)
  
  const socials = [
    { id:'fb', label:'Facebook', href:'#' },
    { id:'ig', label:'Instagram', href:'#' },
    { id:'yt', label:'YouTube', href:'#' },
  ]
  
  /* ===== Methods ===== */
  function validate() {
    errors.name = form.name.length >= 2 ? '' : 'Name must be at least 2 characters.'
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    errors.email = emailOk ? '' : 'Invalid email format.'
    errors.message = form.message.length >= 10 ? '' : 'Minimum message 10 characters.'
    if (form.message.length > MAX_LEN) errors.message = `Maximum message ${MAX_LEN} character.`
    return !errors.name && !errors.email && !errors.message
  }
  
  function resetForm() {
    form.name=''; form.email=''; form.phone=''; form.subject=''; form.message='';
    status.type=''; status.message='';
    Object.keys(errors).forEach(k=>errors[k]='')
  }
  
  async function submitForm(){
    status.type=''; status.message=''
  
    if (form.company) { // honeypot terisi -> possible bot
      status.type='error'; status.message='An error occurred. Please try again..'
      return
    }
    if (!validate()) {
      status.type='error'; status.message='Double check the required fields.'
      return
    }
  
    isSubmitting.value = true
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
        consent: !!form.consent,
        meta: {
          path: location.pathname,
          ua: navigator.userAgent
        }
      }
  
      const res = await fetch(props.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept':'application/json' },
        body: JSON.stringify(payload)
      })
  
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      // if backend returns msg
      let data = {}
      try { data = await res.json() } catch {}
      status.type='success'
      status.message = data?.message || 'Thank you! Your message has been sent.'
      resetForm()
    } catch (e) {
      status.type='error'
      status.message='Failed to send message. Please try again later.'
    } finally {
      isSubmitting.value = false
    }
  }
  </script>
  
  <style scoped>
  :root{
    --ink:#0f172a; --muted:#475569; --line:#e5e7eb;
    --primary:#0ea5a4; --primary-600:#0c8f8e;
    --accent:#ef4444;
    --bg:#f8fafc; --card:#ffffff; --shadow:0 10px 28px rgba(2,24,43,.08);
    --radius:16px;
  }
  .ct-wrap{ background: var(--bg); }
  .ct-container{ width:min(1120px,100%); margin-inline:auto; padding-inline:clamp(12px,3vw,20px); padding-block: clamp(18px,3vw,28px); }
  
  /* Header */
  .ct-head{ margin-bottom: clamp(14px,2.5vw,22px); }
  .ct-h1{ font-size: clamp(24px,2.6vw,34px); font-weight:800; color: var(--accent); margin:0 0 6px; }
  .ct-sub{ color:#1f2937; font-size: clamp(14px,1.6vw,15px); }
  
  /* Grid */
  .ct-grid{ display:grid; gap: clamp(14px,3vw,22px); grid-template-columns: minmax(300px, 1fr) minmax(260px, .7fr); }
  @media (max-width: 900px){ .ct-grid{ grid-template-columns: 1fr; } }
  
  .card{
    background: var(--card); border: 1px solid var(--line);
    border-radius: var(--radius); box-shadow: var(--shadow);
    padding: clamp(14px,2.2vw,18px);
  }
  
  /* Form */
  .form .row{ display:grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 640px){ .form .row{ grid-template-columns: 1fr; } }
  
  .field{ display:flex; flex-direction:column; gap:6px; margin-bottom: 10px; }
  .field label{ font-weight:700; color:#0b0b0b; font-size: 14px; }
  .req{ color:#ef4444; }
  
  input, textarea{
    border:1px solid var(--line); border-radius:12px; padding:12px 12px;
    font-size:14px; outline:none; background:#fff;
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  input:focus, textarea:focus{
    border-color: #9be5e0; box-shadow: 0 0 0 4px #def7f5;
  }
  .invalid{ border-color:#fca5a5 !important; box-shadow: 0 0 0 4px #fee2e2 !important; }
  .muted{ color:#6b7280; }
  .small{ font-size: 12px; }
  .ml{ margin-left: 8px; }
  .err{ color:#b91c1c; font-size:12px; }
  
  .check{ display:flex; align-items:center; gap:10px; margin-top: 6px; font-size: 14px; color:#111827; }
  .check input{ accent-color: var(--primary); width:18px; height:18px; }
  
  .honeypot{ position:absolute; left:-10000px; top:auto; width:1px; height:1px; overflow:hidden; }
  
  /* Buttons */
  .actions{ display:flex; gap:10px; margin-top: 12px; }
  .btn{
    --btn:#f25c54;
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    height:44px; padding:0 20px; border-radius:999px; border:0; cursor:pointer;
    background: var(--btn); color:#fff; font-weight:800;
    box-shadow: 0 8px 16px rgba(242,92,84,.25); transition: transform .15s ease, box-shadow .15s ease;
  }
  .btn:hover{ transform: translateY(-1px); box-shadow: 0 12px 20px rgba(242,92,84,.28); }
  .btn:disabled{ opacity:.7; cursor:not-allowed; }
  .btn.ghost{ background:#fff; color:#111; border:1px solid var(--line); box-shadow:none; }
  
  .spinner{
    width:18px; height:18px; border:3px solid #fff; border-right-color: transparent; border-radius:50%;
    animation: spin .6s linear infinite;
  }
  @keyframes spin{ to { transform: rotate(360deg); } }
  
  /* Alerts */
  .alert{ margin-top: 8px; padding:10px 12px; border-radius:10px; font-size:14px; }
  .alert.success{ background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; }
  .alert.error{ background:#fee2e2; color:#991b1b; border:1px solid #fecaca; }
  
  /* Info panel */
  .info-title{ font-size:16px; font-weight:800; color:#111827; margin:0 0 8px; }
  .info-item{ display:flex; gap:10px; align-items:flex-start; margin:10px 0; }
  .info-item svg{ width:22px; height:22px; color:#0ea5a4; flex:0 0 22px; }
  .label{ font-weight:700; color:#0b0b0b; }
  .value{ color:#111827; }
  .links a{ color: var(--primary-600); text-decoration: underline; text-underline-offset: 2px; font-weight:700; }
  
  .map{ margin-top: 10px; border-radius:12px; overflow:hidden; border:1px solid var(--line); }
  .map iframe{ width:100%; height:220px; display:block; }
  
  .socials{ display:flex; gap:10px; margin-top: 12px; }
  .socials a{
    width:36px; height:36px; border-radius:10px; background:#f8fafc; border:1px solid var(--line);
    display:inline-flex; align-items:center; justify-content:center; color:#0b0b0b;
    box-shadow: var(--shadow); transition: transform .12s ease;
  }
  .socials a:hover{ transform: translateY(-1px); }
  .socials svg{ width:18px; height:18px; }
  </style>
  