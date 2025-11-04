<template>
  <section id="make-donation" class="md-wrap">
    <!-- HERO / INTRO -->
    <header class="md-hero">
      <div class="md-container">
        <h1 class="md-h1">Make a Donation</h1>
        <div class="md-hero-panel">
          <p v-html="introTop"></p>
          <p v-html="introMid"></p>
          <p v-html="introBottom"></p>
        </div>
      </div>
    </header>

    <!-- METHODS -->
    <main class="md-container md-main">
      <!-- Skeleton -->
      <div v-if="isLoading" class="method-grid">
        <div v-for="n in 4" :key="'sk'+n" class="method-card is-skeleton">
          <div class="skeleton sk-icon"></div>
          <div class="skeleton sk-title"></div>
          <div class="skeleton sk-text"></div>
          <div class="skeleton sk-text"></div>
          <div class="skeleton sk-cta"></div>
        </div>
      </div>

      <!-- Real content -->
      <div v-else class="method-grid">
        <!-- PayPal / Card -->
        <article class="method-card" v-if="isEnabled('paypal')">
          <div class="icon" :class="paypalIconClass">
            <img v-if="paypalLogoUrl" :src="paypalLogoUrl" alt="PayPal" />
            <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H3V6Zm0 4h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8Zm3 5h6v2H6v-2Z"/></svg>
          </div>
          <h3 class="card-title">{{ byId('paypal').title }}</h3>
          <p class="card-text" v-html="byId('paypal').summary"></p>
          <div class="cta-row">
            <a :href="byId('paypal').cta_url" target="_blank" rel="noopener" class="btn btn-primary">
              {{ byId('paypal').cta_text || 'Donate' }}
            </a>
          </div>
        </article>

        <!-- QRIS -->
        <article class="method-card" v-if="isEnabled('qris')">
          <div class="icon qris">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 3h8v8H3V3Zm2 2v4h4V5H5Zm8-2h8v8h-8V3Zm2 2v4h4V5h-4ZM3 13h8v8H3v-8Zm2 2v4h4v-4H5Zm10 0h2v2h-2v-2Zm0 4h2v2h-2v-2Zm4-4h2v2h-2v-2Zm0 4h2v2h-2v-2Z"/></svg>
          </div>
          <h3 class="card-title">{{ byId('qris').title || 'By QRIS' }}</h3>
          <p class="card-text" v-if="byId('qris').summary" v-html="byId('qris').summary"></p>

          <div class="bank-box" v-if="byId('qris').qr_image">
            <a class="bank-qr" :href="byId('qris').qr_image" target="_blank" rel="noopener">
              <img :src="byId('qris').qr_image" alt="QRIS" />
              <small>Scan to pay</small>
            </a>
          </div>

          <div class="cta-row" v-if="byId('qris').cta_url">
            <a :href="byId('qris').cta_url" target="_blank" rel="noopener" class="btn btn-primary">Open</a>
          </div>
        </article>

        <!-- Bank Transfer -->
        <article class="method-card" v-if="isEnabled('bank')">
          <div class="icon bank">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3 2 8v2h20V8L12 3Zm-9 9v8h2v-8H3Zm4 0v8h2v-8H7Zm4 0v8h2v-8h-2Zm4 0v8h2v-8h-2Zm4 0v8h2v-8h-2Z"/></svg>
          </div>
          <h3 class="card-title">{{ byId('bank').title }}</h3>
          <div class="bank-box">
            <div class="bank-line" v-if="bank.bank_name"><strong>{{ bank.bank_name }}</strong></div>
            <div class="bank-line" v-if="bank.bsb">
              {{ bank.bsb_label }}: <span class="mono">{{ bank.bsb }}</span>
              <button class="copy" @click="copy(bank.bsb)" title="Copy">Copy</button>
            </div>
            <div class="bank-line" v-if="bank.account_number">
              {{ bank.account_label }}: <span class="mono">{{ bank.account_number }}</span>
              <button class="copy" @click="copy(bank.account_number)" title="Copy">Copy</button>
            </div>
            <div class="bank-line" v-if="bank.swift_bic">
              {{ bank.swift_bic_label }}: <span class="mono">{{ bank.swift_bic }}</span>
              <button class="copy" @click="copy(bank.swift_bic)" title="Copy">Copy</button>
            </div>
            <div class="bank-line" v-if="bank.reference_hint">
              {{ bank.reference_label }}: <em>{{ bank.reference_hint }}</em>
            </div>

            <!-- QR image (opsional) -->
            <a v-if="bank.qr_image" class="bank-qr" :href="bank.qr_image" target="_blank" rel="noopener">
              <img :src="bank.qr_image" alt="Donation QR" />
              <small>Click to open</small>
            </a>
          </div>

          <!-- Fallback tampilkan details mentah bila tidak terparse -->
          <p class="card-text" v-if="byId('bank').details && !bank.bsb && !bank.account_number" v-html="byId('bank').details"></p>

          <p class="card-text small" v-if="bank.receipt_note" v-html="bank.receipt_note"></p>
          <div v-if="bank.email" class="card-text small">Email: <a :href="`mailto:${bank.email}`">{{ bank.email }}</a></div>
        </article>

        <!-- GiveNow -->
        <article class="method-card" v-if="isEnabled('givenow')">
          <div class="icon give">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21s-6-4.35-9-8.5C1 9 3 6 6 6c2 0 3.54 1.54 4 3 .46-1.46 2-3 4-3 3 0 5 3 3 6.5C18 16.65 12 21 12 21Z"/></svg>
          </div>
          <h3 class="card-title">{{ byId('givenow').title }}</h3>
          <p class="card-text" v-html="byId('givenow').summary"></p>
          <div class="cta-row">
            <a :href="byId('givenow').cta_url" target="_blank" rel="noopener" class="btn btn-primary outline">GiveNow</a>
          </div>
        </article>

        <!-- Cheque -->
        <article class="method-card" v-if="isEnabled('cheque')">
          <div class="icon cheque">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 5h18v14H3V5Zm2 2v10h14V7H5Zm2 2h6v2H7V9Zm0 4h6v2H7v-2Zm8-2h2v4h-2v-4Z"/></svg>
          </div>
          <h3 class="card-title">{{ byId('cheque').title }}</h3>
          <p class="card-text" v-html="byId('cheque').summary"></p>
        </article>
      </div>

      <!-- Separator / Gift Certificates -->
      <div class="gift-sep">
        <span>Or buy a Gift Certificate!</span>
        <RouterLink class="gift-link" to="/get-involved#gift-certificates">Browse Gift Certificates →</RouterLink>
      </div>

      <!-- Impact Chart -->
      <section class="impact">
        <div class="impact-card">
          <h4 class="impact-title">Every donation helps build a stronger future for women and girls in Timor-Leste.</h4>
          <p class="impact-sub">See how you can make a difference</p>

          <div class="bar-chart">
            <div v-for="(val,i) in levels" :key="i" class="bar" :style="barStyle(val)">
              <svg class="heart" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21s-6-4.35-9-8.5C1 9 3 6 6 6c2 0 3.54 1.54 4 3 .46-1.46 2-3 4-3 3 0 5 3 3 6.5C18 16.65 12 21 12 21Z"/></svg>
              <div class="cap"><span>{{ formatMoney(val) }}</span></div>
            </div>
          </div>
        </div>
      </section>

      <p v-if="errorMsg" class="md-error">{{ errorMsg }}</p>
    </main>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api, absUrl } from '@/api'

const props = defineProps({
  apiUrl: { type: String, default: 'donation/config/' }
})

const isLoading = ref(true)
const errorMsg  = ref('')

// ==== Helpers ====
// ambil nilai pertama yang bukan null/undefined dan bukan string kosong
function coalesce(...vals){
  for (const v of vals){
    if (v !== null && v !== undefined && !(typeof v === 'string' && v.trim() === '')) return v
  }
  return ''
}

// parse field "details" → values + labels (dukungan multi-bahasa & judul multi-baris)
function parseBankDetails(text = '') {
  const values = {}
  const labels = {}
  const lines = String(text).split(/\r?\n/).map(s => s.trim()).filter(Boolean)

  const keyValueRE = /^([A-Za-zÀ-ÿ\/ ._-]+?)\s*[:：\-]\s*(.+)$/
  let hitKV = false

  for (const line of lines) {
    const m = line.match(keyValueRE)
    if (!m) {
      // sebelum ketemu "key: value", anggap sebagai bagian nama bank (gabungkan bila multi-baris)
      if (!hitKV) values.bank_name = values.bank_name ? `${values.bank_name} ${line}` : line
      continue
    }
    hitKV = true
    const rawKey = m[1].trim()
    const rawVal = m[2].trim()
    const k = rawKey.toLowerCase()

    if (/\b(bsb|bnctl|bank code)\b/.test(k)) {
      values.bsb = rawVal.replace(/[^\dA-Z]/gi, '')
      labels.bsb_label = rawKey
      continue
    }
    if (/\b(account|acc|no\b|no\.|konta|conta|rekening|account number)\b/.test(k)) {
      values.account_number = rawVal.replace(/[^\dA-Z]/gi, '')
      labels.account_label = rawKey
      continue
    }
    if (/\b(swift|bic)\b/.test(k)) {
      values.swift_bic = rawVal.replace(/[^\dA-Z]/gi, '')
      labels.swift_bic_label = 'SWIFT/BIC'
      continue
    }
    if (/\b(reference|referensia|ref)\b/.test(k)) {
      values.reference_hint = rawVal // biarkan tanda kurung tetap ada
      labels.reference_label = rawKey || 'Reference'
      continue
    }
  }

  if (values.bank_name) values.bank_name = values.bank_name.replace(/\s+/g, ' ').trim()
  return { values, labels }
}

// -- BANK default
const bank = ref({
  bank_name:'Bank Australia',
  bsb:'313140',
  account_number:'12184403',
  swift_bic:'',
  reference_hint:'(your surname)',
  receipt_note:'It is a requirement ...',
  email:'',
  qr_image:'',
  bsb_label:'BSB',
  account_label:'Account',
  reference_label:'Reference',
  swift_bic_label:'SWIFT/BIC'
})

// defaults
const methods = ref([
  { id:'paypal', title:'By Credit/Debit Card via PayPal',
    summary:'Make a one-off donation or set up a regular donation using your credit or debit card via PayPal. You do not need a PayPal account—choose “Donate by Debit or Credit card”.',
    cta_text:'Donate', cta_url:'#' },
  { id:'bank', title:'By Direct Deposit', summary:'Alola Australia Ltd. bank account' },
  { id:'givenow', title:'By GiveNow',
    summary:'GiveNow is an online giving platform. Make a once-off donation, set up a regular donation or create a peer-to-peer fundraising event for Alola Australia through a CrowdRaiser.',
    cta_text:'GiveNow', cta_url:'#' },
  { id:'cheque', title:'By Cheque',
    summary:'From 28 March 2024 Bank Australia are no longer accepting cheques or money orders.' }
])

const enabledIds = ref(new Set())
const isEnabled = (id) => enabledIds.value.size ? enabledIds.value.has(id) : true

// intro & impact
const introTop    = ref('So that we are better able to support our Alola friends and partners in Timor-Leste, we have deductible-gift recipient (DGR) status, which means any donation above $2 is tax-deductible.')
const introMid    = ref('If you would like to contribute to the ongoing sustainability of Fundasaun Alola, you can become a Regular Giver. You can sign up to make a monthly donation via PayPal or GiveNow or set up through your bank. Regular donations provide reliable funds for Fundasaun Alola, helping the team plan and deliver their programs.')
const introBottom = ref('')

const levels = ref([100, 250, 500, 1000, 2000])
const byId = (id) => methods.value.find(m => m.id === id) || { title:'', summary:'', cta_text:'', cta_url:'#' }

async function fetchDonationConfig () {
  try {
    const { data } = await api.get(props.apiUrl)

    // intro
    if (data?.intro_top    != null) introTop.value    = data.intro_top
    if (data?.intro_mid    != null) introMid.value    = data.intro_mid
    if (data?.intro_bottom != null) introBottom.value = data.intro_bottom

    // merge methods (default + API)
    const base = Object.fromEntries(methods.value.map(m => [m.id, { ...m }]))
    for (const r of (data?.methods || [])) {
      if (!r?.id) continue
      base[r.id] = { ...(base[r.id] || {}), ...r }
    }
    methods.value = Object.values(base)

    // enabled
    enabledIds.value = new Set((data?.methods || []).map(m => m.id).filter(Boolean))

    // bank: dukung field terstruktur & details + label custom
    const mb       = methods.value.find(m => m.id === 'bank') || {}
    const parsed   = parseBankDetails(mb.details || mb.detail || mb.summary || '')
    const prev     = { ...bank.value }
    const v        = parsed.values
    const L        = parsed.labels

    bank.value = {
      bank_name:       coalesce(mb.bank_name,       v.bank_name,       prev.bank_name),
      bsb:             coalesce(mb.bsb,             v.bsb,             prev.bsb),
      account_number:  coalesce(mb.account_number,  v.account_number,  prev.account_number),
      swift_bic:       coalesce(mb.swift_bic,       v.swift_bic,       prev.swift_bic),
      reference_hint:  coalesce(mb.reference_hint,  v.reference_hint,  prev.reference_hint),
      receipt_note:    coalesce(mb.receipt_note,    prev.receipt_note),
      email:           coalesce(mb.email,           prev.email),
      qr_image:        absUrl(coalesce(mb.qr_image, prev.qr_image)),
      bsb_label:       coalesce(mb.bsb_label,       L.bsb_label,       prev.bsb_label,       'BSB'),
      account_label:   coalesce(mb.account_label,   L.account_label,   prev.account_label,   'Account'),
      reference_label: coalesce(mb.reference_label, L.reference_label, prev.reference_label, 'Reference'),
      swift_bic_label: coalesce(mb.swift_bic_label, L.swift_bic_label, prev.swift_bic_label, 'SWIFT/BIC'),
    }

    // impact levels
    const lv = data.impact_levels || data.levels
    if (Array.isArray(lv) && lv.length) {
      levels.value = lv.map(Number).filter(n => !Number.isNaN(n))
    }

    // DEBUG
    console.log('[donation/config] data:', data)
    console.log('[bank raw]', mb)
    console.log('[bank parsed]', parsed)
    console.log('[bank merged]', bank.value)

  } catch (e) {
    console.warn('[donation/config] error:', e)
    errorMsg.value = 'Tidak dapat memuat konfigurasi donasi dari API. Menampilkan konten default.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchDonationConfig)

// PayPal icon
const paypalLogoUrl = computed(() => {
  const m = byId('paypal')
  return absUrl(m.logo || m.icon || m.icon_url || '')
})
const paypalIconClass = computed(() => paypalLogoUrl.value ? 'pp' : 'cc')

function formatMoney(v){
  try{
    return new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',minimumFractionDigits:0}).format(v)
  }catch{
    return `AU$${v}`
  }
}
function barStyle(v){
  const min = Math.min(...levels.value), max = Math.max(...levels.value)
  const h = max === min ? 60 : 30 + ((v - min) / (max - min)) * 65
  return { '--h': `${h}%` }
}
async function copy(text){
  try{ await navigator.clipboard.writeText(String(text)); alert('Copied: ' + text) }
  catch{ alert('Copy failed') }
}
</script>

<style scoped>
:root{
  --ink:#0f172a; --muted:#475569; --line:#e5e7eb;
  --primary:#0ea5a4; --primary-600:#0c8f8e;
  --accent:#ef4444; --cream:#fdebd2;
  --card:#f7fdfb; --shadow: 0 8px 24px rgba(2,24,43,.06);
  --radius:14px;
}
.md-wrap{ background:#ffffff; }
.md-container{ width:min(1120px,100%); margin-inline:auto; padding-inline:clamp(12px,3vw,20px); }

/* HERO */
.md-hero{
  padding-block: clamp(16px,2vw,26px);
  background:
    radial-gradient(1200px 400px at 10% -50%, rgba(14,165,164,.18), transparent 60%),
    linear-gradient(180deg, #ffffff, #f5fdfa);
  border-bottom:1px solid var(--line);
}
.md-h1{
  font-size: clamp(24px,2.6vw,34px);
  color: var(--accent); letter-spacing:.2px; font-weight:800; margin:0 0 10px;
}
.md-hero-panel{
  background:#fff; border:1px solid var(--line); border-radius:var(--radius);
  padding: clamp(14px,2vw,18px); box-shadow: var(--shadow);
}
.md-hero-panel p{ color:#1f2937; line-height:1.55; font-size:clamp(14px,1.5vw,15px); margin:10px 0; }
.md-hero-panel em{ font-style:italic; color:#111; }

/* METHODS GRID */
.md-main{ padding-block: clamp(16px,3vw,26px); }
.method-grid{
  display:grid; gap:clamp(12px,2vw,18px);
  grid-template-columns: repeat(4, minmax(230px,1fr));
}
@media (max-width:1024px){ .method-grid{ grid-template-columns: repeat(2,1fr); } }
@media (max-width:620px){ .method-grid{ grid-template-columns: 1fr; } }

.method-card{
  border-radius: var(--radius);
  background: linear-gradient(180deg, #ffffff, #f6fbfa);
  border: 1px solid var(--line);
  padding: clamp(14px,2vw,16px);
  box-shadow: var(--shadow);
  display:flex; flex-direction:column; gap:10px;
  transition: transform .15s ease, box-shadow .15s ease;
}
.method-card:hover{ transform: translateY(-2px); box-shadow: 0 12px 28px rgba(2,24,43,.10); }

.icon{
  width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center;
  color:#fff;
}
.icon svg{ width:22px; height:22px; }
/* warna ikon */
.icon.cc{ background:#2563eb; }
.icon.pp{ background:#2563eb; }
.icon.bank{ background:#059669; }
.icon.give{ background:#f59e0b; }
.icon.cheque{ background:#6b7280; }
.icon.qris{ background:#0ea5a4; }

/* jika pakai logo gambar di dalam .icon */
.icon img{ width:22px; height:22px; display:block; object-fit:contain; }

.card-title{ font-weight:800; color:#111827; font-size:16.5px; margin-top:2px; }
.card-text{ color:#1f2937; font-size:14px; line-height:1.55; }
.card-text.small{ font-size:13px; color:#374151; }

.bank-box{
  background:#ecfdf5; border:1px dashed #93e5dc; border-radius:12px; padding:10px 12px; font-size:14px;
}
.bank-line{ margin:6px 0; color:#0b3b37; }
.mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
.copy{
  margin-left:8px; border:1px solid #93e5dc; border-radius:999px; height:24px; padding:0 10px; font-size:12px;
  background:#fff; color:#0b3b37; cursor:pointer;
}
.copy:hover{ background:#f0fdfa; }

/* QR preview */
.bank-qr{
  display:inline-flex; flex-direction:column; align-items:center; gap:4px;
  margin-top:8px; text-decoration:none; color:#0b3b37;
}
.bank-qr img{
  width:110px; height:auto; border-radius:10px; border:1px solid #93e5dc;
  box-shadow: 0 4px 10px rgba(2,24,43,.08);
}
.bank-qr small{ font-size:11px; opacity:.8 }

.cta-row{ margin-top:auto; }
.btn{
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  height:42px; padding:0 18px; border-radius:999px; cursor:pointer; font-weight:800; text-decoration:none;
}
.btn-primary{ background:#f25c54; color:#fff; border:0; box-shadow:0 6px 14px rgba(242,92,84,.25); }
.btn-primary:hover{ transform: translateY(-1px); box-shadow:0 10px 18px rgba(242,92,84,.28); }
.btn-primary.outline{ background:#fff; color:#f25c54; border:1px solid #f25c54; }

/* Separator Gift */
.gift-sep{
  margin: clamp(10px,2.2vw,16px) 0 clamp(18px,3vw,26px);
  background: #0ea5a4; color:#fff; border-radius: 999px;
  padding: 10px 14px; display:flex; align-items:center; justify-content:space-between; gap:10px;
  box-shadow: 0 6px 14px rgba(14,165,164,.25);
}
.gift-link{ color:#fff; text-decoration: underline; text-underline-offset:2px; font-weight:700; }

/* Impact chart */
.impact-card{
  background:#fff; border:1px solid var(--line); border-radius: var(--radius);
  box-shadow: var(--shadow); padding: clamp(14px,2vw,18px);
}
.impact-title{ font-weight:800; color:#111827; font-size:16px; }
.impact-sub{ color:#475569; font-size:13px; margin-bottom:8px; }
.bar-chart{
  display:flex; align-items:flex-end; gap: clamp(10px,2vw,18px);
  padding: clamp(12px,2vw,18px) clamp(6px,2vw,10px) clamp(2px,1.2vw,6px);
  background:#fff0ff; border-radius: 12px; border: 1px dashed #f0c2ff;
  overflow-x:auto;
}
.bar{
  --h:60%;
  width: clamp(60px, 12vw, 120px);
  height: 220px; position:relative;
  display:flex; align-items:flex-end; justify-content:center;
}
.bar::before{
  content:""; position:absolute; bottom:0; width:100%; height:var(--h);
  background: linear-gradient(180deg, #f472b6, #d946ef);
  border-radius: 10px 10px 6px 6px;
  box-shadow: inset 0 -12px 20px rgba(255,255,255,.25);
}
.bar .cap{
  position:absolute; bottom: calc(var(--h) + 6px);
  background:#8b5cf6; color:#fff; font-weight:800;
  border-radius: 8px; padding:4px 8px; font-size:12px; white-space:nowrap;
}
.heart{
  position:absolute; bottom: calc(var(--h) + 28px); width:18px; height:18px; color:#f472b6;
}

/* Error */
.md-error{ color:#b91c1c; background:#fee2e2; border:1px solid #fecaca; border-radius:10px; padding:10px 12px; }

/* Skeleton */
.is-skeleton .skeleton{ position:relative; overflow:hidden; background:#e5e7eb; border-radius:10px; }
.is-skeleton .skeleton::after{ content:""; position:absolute; inset:0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent);
  transform:translateX(-100%); animation: shimmer 1.2s infinite; }
.sk-icon{ width:44px; height:44px; border-radius:12px; margin-bottom:8px; }
.sk-title{ width:70%; height:18px; margin:6px 0; }
.sk-text{ width:100%; height:12px; margin:6px 0; }
.sk-cta{ width:110px; height:38px; border-radius:999px; margin-top:8px; }
@keyframes shimmer{ 100%{ transform:translateX(100%); } }
</style>
