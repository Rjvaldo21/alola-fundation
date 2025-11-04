<template>
    <main class="facility" role="main">
      <section class="hero">
        <div class="container">
          <nav class="crumb">
            <RouterLink to="/program">Program</RouterLink>
            <span>/</span>
            <RouterLink to="/program#mch">Maternal and Child Health</RouterLink>
            <span>/</span>
            <span aria-current="page">Facility Based Sub Program</span>
          </nav>
          <h1>Facility Based Sub Program</h1>
        </div>
      </section>
  
      <section class="container grid">
        <!-- ===== MAIN CONTENT ===== -->
        <article class="content">
          <!-- Loading skeleton -->
          <div v-if="loading" class="skeleton">
            <div class="line" v-for="n in 12" :key="n"></div>
          </div>
  
          <!-- Body (from API) -->
          <div v-else v-html="bodyHtml || fallbackHtml"></div>
  
          <!-- Share -->
          <div class="share">
            <span>Share:</span>
            <button class="btn" @click="share('facebook')">Facebook</button>
            <button class="btn" @click="share('x')">X</button>
            <button class="btn" @click="share('whatsapp')">WhatsApp</button>
            <button class="btn" @click="copy">Copy Link</button>
          </div>
        </article>
  
        <!-- ===== SIDEBAR ===== -->
        <aside class="side">
          <!-- Beneficiaries (box hijau) -->
          <section v-if="beneficiaries.length" class="benefit">
            <header>Number of Beneficiaries</header>
            <ul>
              <li v-for="(b,i) in beneficiaries" :key="i">
                <span class="label">{{ b.label }}</span>
                <span class="value">{{ formatNumber(b.value) }}</span>
              </li>
            </ul>
          </section>
  
          <!-- Support Now -->
          <section class="support">
            <h3>SUPPORT NOW!</h3>
            <p>
              Your gift will support the maternal and child health program that includes
              breastfeeding information and counselling, infant and young child feeding training,
              maternity packs, and research on maternal mortality in Timor-Leste.
            </p>
            <RouterLink to="/donate" class="cta">Donate</RouterLink>
          </section>
  
          <!-- Quick links ke halaman MCH lain -->
          <section class="links">
            <h4>More on MCH</h4>
            <ul>
              <li v-for="l in rightLinks" :key="l.to"><RouterLink :to="l.to">{{ l.label }}</RouterLink></li>
            </ul>
          </section>
        </aside>
      </section>
    </main>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  
  const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000'
  
  const loading = ref(true)
  const bodyHtml = ref('')
  
  /** Sidebar beneficiaries */
  const beneficiaries = ref([
    // default kosong → akan diganti dari API bila ada
    // { label: 'Number of babies that received skin-to-skin contact support from HLO', value: 1358 },
    // { label: 'Number of mothers who received breastfeeding counselling', value: 15852 },
    // ...
  ])
  
  /** quick links (samakan dengan menu) */
  const rightLinks = [
    { label: 'About MCH', to: '/program/mch/about' },
    { label: 'Facility Based Sub Program', to: '/program/mch/facility-based' },
    { label: 'Community Based – Sub Program', to: '/program/mch/community-based' },
    { label: 'Women’s Cancer Raising Awareness', to: '/program/mch/womens-cancer-awareness' },
    { label: 'MCH Success Story', to: '/program/mch/success-stories' },
  ]
  
  /** fallback konten (kalau API belum ada) */
  const fallbackHtml = `
    <p>In 2023–2024, Alola Liaison Officers (HLOs) supported mothers and newborns at referral hospitals by
    initiating early breastfeeding, providing counselling, and assisting proper positioning to promote exclusive breastfeeding.
    The program also delivered education on complementary feeding, maternal nutrition, and WASH.</p>
  
    <h2>Supporting Newborn Care & Breastfeeding at Health Facilities</h2>
    <p>HLOs provide counselling for pregnant and lactating women who visit and are admitted to hospitals. Education on the
    importance of breastfeeding is provided to mothers during their stay, including skin-to-skin contact, exclusive
    breastfeeding, and correct positioning and attachment.</p>
  
    <h2>Playroom & Health Education</h2>
    <p>Playrooms in referral hospitals offer a safe space for children and families to de-stress while receiving
    educational activities that support emotional, physical, and social skills through play.</p>
  `
  
  /** Fetch dari backend kalau ada endpointnya */
  async function load() {
    loading.value = true
    try {
      // contoh beberapa pola endpoint – silakan sesuaikan
      const urls = [
        `${API_BASE}/api/program-sections/mch/facility-based/`,
        `${API_BASE}/api/public/pages/program/mch/facility-based/`,
        `${API_BASE}/api/program/mch/facility-based/`,
      ]
      for (const u of urls) {
        try {
          const { data } = await axios.get(u)
          bodyHtml.value = data.body_html || data.content_html || data.html || ''
          const ben = data.beneficiaries || data.stats || []
          if (Array.isArray(ben) && ben.length) {
            beneficiaries.value = ben.map((x) => ({
              label: x.label || x.name || '',
              value: Number(x.value ?? x.count ?? 0),
            }))
          }
          if (bodyHtml.value) break
        } catch {}
      }
    } finally {
      loading.value = false
    }
  }
  
  onMounted(load)
  
  const formatNumber = (n) =>
    isNaN(Number(n)) ? n : Number(n).toLocaleString()
    
  // share helpers
  const currentUrl = () => window.location.href
  function share(net){
    const url = encodeURIComponent(currentUrl())
    const text = encodeURIComponent('Facility Based Sub Program')
    const targets = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    }
    window.open(targets[net], '_blank', 'noopener')
  }
  async function copy(){
    try{ await navigator.clipboard.writeText(currentUrl()); alert('Link copied!') }
    catch{ alert(currentUrl()) }
  }
  </script>
  
  <style scoped>
  /* Header area */
  .hero{ background:#efeaf2; padding: 24px 0 10px; }
  .container{ max-width:1200px; margin:0 auto; padding:0 20px; }
  .crumb{ display:flex; gap:8px; color:#6b7280; font-size:14px; }
  .crumb a{ color:#6b7280; text-decoration:none; }
  .crumb a:hover{ text-decoration:underline; }
  h1{ margin:8px 0 0; font-size:clamp(22px,4vw,28px); font-weight:900; }
  
  /* layout */
  .grid{
    display:grid; grid-template-columns: 1fr 320px; gap:18px;
    align-items:start; padding: 14px 0 28px;
  }
  
  /* main content */
  .content :deep(h2){ margin: 18px 0 8px; font-size:20px; font-weight:800; }
  .content :deep(p){ line-height:1.8; margin:0 0 14px; color:#1f2937; }
  .share{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-top:10px; }
  .btn{ height:34px; padding:0 12px; border-radius:999px; border:1px solid #e5e7eb; background:#fff; font-weight:600; }
  
  /* sidebar */
  .side{ display:flex; flex-direction:column; gap:14px; }
  
  /* beneficiaries box (green) */
  .benefit{
    border-radius:8px; overflow:hidden; background:#0a8a3a; color:#fff;
    box-shadow:0 6px 16px rgba(0,0,0,.1);
  }
  .benefit header{
    font-weight:900; letter-spacing:.02em; padding:10px 12px; background:#06732f;
  }
  .benefit ul{ list-style:none; margin:0; padding:8px 0; }
  .benefit li{
    display:grid; grid-template-columns: 1fr auto; gap:12px;
    padding:10px 12px; border-top:1px solid rgba(255,255,255,.2);
  }
  .benefit li:first-child{ border-top:0; }
  .benefit .label{ font-size:14px; line-height:1.3; }
  .benefit .value{
    font-weight:900; font-size:22px; align-self:center; background:#15a04b;
    padding:4px 10px; border-radius:8px;
  }
  
  /* Support block */
  .support{
    border:1px solid #f59e0b; background:#fff7ed; border-radius:8px; padding:12px;
  }
  .support h3{ color:#b45309; margin:0 0 8px; font-weight:900; }
  .support p{ color:#7c2d12; margin:0 0 12px; }
  .support .cta{
    display:inline-block; text-decoration:none; color:#fff; background:#111827;
    padding:8px 14px; border-radius:999px; font-weight:700;
  }
  
  /* links */
  .links h4{ margin:0 0 8px; font-weight:800; }
  .links ul{ list-style:none; padding:0; margin:0; }
  .links li{ margin:6px 0; }
  .links a{ text-decoration:none; color:#0a3a34; }
  .links a:hover{ text-decoration:underline; }
  
  /* skeleton */
  .skeleton .line{
    height: 12px; border-radius: 8px; margin: 10px 0;
    background: linear-gradient(90deg,#eaeef2,#f6f8fb,#eaeef2);
    background-size: 200% 100%; animation: shimmer 1.2s infinite;
  }
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  
  @media (max-width: 980px){
    .grid{ grid-template-columns:1fr; }
  }
  </style>
  