<template>
    <section id="gift-certificates" class="gc-wrap">
      <!-- HERO -->
      <header class="gc-hero">
        <div class="gc-container">
          <p class="gc-crumb">Shop</p>
          <h1 class="gc-h1">GIFT CERTIFICATES</h1>
  
          <div class="gc-hero-panel">
            <p>
              Alola Australia in partnership with Fundasaun Alola, offer a range of Gift Certificates, including Christmas themed ones.
              Your gift will support the development programs of Fundasaun Alola in Timor-Leste, established in 2001 by Kirsty Sword Gusmão.
              Fundasaun Alola's programs improve child and maternal health, create employment opportunities, promote human rights,
              strengthen community participation in economic and social development and enhance the status of women in Timor-Leste.
            </p>
            <p>
              All certificates are available as an e-card via email. Download your certificates via your confirmation order email and print onto paper or card,
              or send as an email gift.
            </p>
            <p>
              Thank you for helping create a strong future for women and girls in Timor-Leste.
              <em>Your gift certificate will be emailed to you as a PDF after purchase</em>
            </p>
          </div>
        </div>
      </header>
  
      <!-- LIST -->
      <main class="gc-container gc-list">
        <template v-if="isLoading">
          <article v-for="n in 3" :key="'sk'+n" class="gift-card is-skeleton">
            <div class="card-media">
              <div class="media-grid">
                <div class="photo skeleton"></div>
                <div class="badge skeleton"></div>
              </div>
            </div>
            <div class="card-body">
              <div class="skeleton sk-title"></div>
              <div class="skeleton sk-price"></div>
              <div class="skeleton sk-text"></div>
              <div class="skeleton sk-text"></div>
              <div class="buy-row">
                <div class="skeleton sk-btn"></div>
              </div>
            </div>
          </article>
        </template>
  
        <template v-else>
          <article v-for="item in gifts" :key="item.id" class="gift-card">
            <!-- media -->
            <div class="card-media">
              <div class="media-grid" :class="{ 'no-badge': hasApiData }">
                <div class="photo">
                  <img :src="item.photoUrl" :alt="item.title" loading="lazy" decoding="async" />
                </div>
                <div class="badge" v-if="!hasApiData">
                  <div class="badge-inner">
                    <div class="badge-top">A GIFT</div>
                    <div class="badge-bottom">FOR GOOD</div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- body -->
            <div class="card-body">
              <a class="card-title" href="#" @click.prevent>{{ item.title }}</a>
              <div class="price-line">{{ formatMoney(item.price) }}</div>
              <p class="desc" v-html="item.description"></p>
  
              <div class="buy-row">
                <button class="buy-btn" @click="buyNow(item)">
                  <span>Buy Now</span>
                  <svg viewBox="0 0 24 24" class="cart" aria-hidden="true">
                    <path d="M3 6h2l3 12h10l3-8H8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="10.5" cy="20" r="1" fill="currentColor"/>
                    <circle cx="17.5" cy="20" r="1" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          </article>
          <p v-if="errorMsg" class="gc-error">{{ errorMsg }}</p>
        </template>
      </main>
    </section>
  </template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api, absUrl } from '@/api'   

const props = defineProps({
  apiUrl: { type: String, default: 'gifts/' }
})

const hasApiData = ref(false)
const router = useRouter()
const gifts = ref([])
const isLoading = ref(true)
const errorMsg = ref('')

const fallback = [
  {
    id: 1, slug: 'readers-certificate', title: '$10 Readers Certificate', price: 10,
    description:
      'For <strong>AU$10</strong>, your gift will enable a pack of 8 Tetum readers (‘learning to read’ books) to be given to a school in Timor-Leste. Thank you for helping create a strong future for women and girls in Timor-Leste. Your gift certificate will be emailed to you as a PDF after purchase. <strong>Thank you for supporting Fundasaun Alola’s Readers program</strong>',
    photoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 2, slug: 'economic-empowerment', title: '$100 Economic Empowerment Certificate', price: 100,
    description:
      'For <strong>AU$100</strong>, your gift will help give a Timorese woman the opportunity of economic independence...',
    photoUrl: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 3, slug: 'education-scholarship', title: '$100 Education Scholarship Certificate', price: 100,
    description:
      'For <strong>AU$100</strong>, your gift will support a year’s education for a young Timorese student...',
    photoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop'
  }
]

// Map objek GiftCertificate dari backend -> shape kartu FE
function mapGift(r, i) {
  return {
    id: r.id ?? i + 1,
    slug: r.slug || String(r.name || 'gift').toLowerCase().replace(/\s+/g, '-'),
    title: r.name ?? 'Gift',
    price: Number(r.price ?? 0),
    description: r.short_desc || '',
    photoUrl: r.image ? absUrl(r.image) : fallback[i % fallback.length].photoUrl,
  }
}

onMounted(async () => {
  isLoading.value = true
  try {
    const { data } = await api.get(props.apiUrl)
    const rows = Array.isArray(data) ? data : (data?.results || [])

    if (rows.length) {
      gifts.value = rows.map(mapGift)
      hasApiData.value = true       
    } else {
      gifts.value = fallback
      hasApiData.value = false
    }
  } catch (err) {
    console.warn('Failed to load gifts:', err)
    errorMsg.value = 'Unable to load gift data at this time. Showing examples.'
    gifts.value = fallback
    hasApiData.value = false
  } finally {
    isLoading.value = false
  }
})


function formatMoney(v) {
  try { return new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',minimumFractionDigits:0}).format(v) }
  catch { return `AU$${v}` }
}

function buyNow(item) {
  const q = { gift: item.slug, amount: item.price || 0, qty: 1 }
  router.push({ path: '/donate', query: q })
}
</script>
  
  <style scoped>
  /* ====== Theme ====== */
  :root{ --gc-bg:#f7faf9; --gc-ink:#0f172a; --gc-muted:#475569;
        --gc-primary:#0ea5a4; --gc-primary-600:#0c8f8e;
        --gc-accent:#ef4444; --gc-cream:#fdebd2; --gc-line:#e5e7eb; }
  .gc-wrap{ background: var(--gc-bg); }
  
  /* ====== Container ====== */
  .gc-container{ width:min(1120px, 100%); margin-inline:auto; padding-inline:clamp(12px, 3vw, 20px); }
  
  /* ====== Hero ====== */
  .gc-hero{
    background:
      radial-gradient(1200px 400px at 20% -50%, rgba(14,165,164,.25), transparent 60%),
      linear-gradient(180deg, #ffffff, #f5fdfa);
    padding-block: clamp(18px, 2.5vw, 28px);
    border-bottom: 1px solid var(--gc-line);
  }
  .gc-crumb{ font-weight:700; color: var(--gc-primary-600); margin: 2px 0 6px; }
  .gc-h1{
    font-size: clamp(24px, 2.8vw, 34px);
    color: var(--gc-accent);
    font-weight: 800;
    letter-spacing: .4px;
    margin: 0 0 12px 0;
  }
  .gc-hero-panel{
    background: #ffffff;
    border: 1px solid var(--gc-line);
    border-radius: 14px;
    box-shadow: 0 6px 20px rgba(2,24,43,.06);
    padding: clamp(14px, 2vw, 18px);
  }
  .gc-hero-panel p{
    color:#1f2937; font-size: clamp(14px, 1.5vw, 15px); line-height:1.55; margin: 10px 0;
  }
  .gc-hero-panel em{ font-style: italic; color:#111; }
  
  /* ====== Cards ====== */
  .gc-list{ padding-block: clamp(16px, 3vw, 26px); }
  
  .gift-card{
    display: grid;
    grid-template-columns: minmax(240px, 360px) 1fr;
    background: var(--gc-cream);
    border: 1px solid #0aa88922;
    border-radius: 14px;
    overflow: hidden;
    margin: clamp(14px, 2vw, 20px) 0;
    box-shadow: 0 8px 24px rgba(2,24,43,.06);
    transition: transform .18s ease, box-shadow .18s ease;
  }
  .gift-card:hover{ transform: translateY(-2px); box-shadow: 0 12px 28px rgba(2,24,43,.10); }
  @media (max-width: 820px){ .gift-card{ grid-template-columns: 1fr; } }
  
  /* media */
  .card-media{ position: relative; background:#ddd; }
  .media-grid{ display:grid; grid-template-columns: 1fr 1fr; min-height: 190px; height:100%; }
  .photo{ position: relative; }
  .photo::before{ content:""; display:block; padding-bottom: 66%; }
  .photo > img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }

  .media-grid.no-badge{
    grid-template-columns: 1fr;
  }
  
  /* badge */
  .badge{
    position:relative; display:flex; align-items:center; justify-content:center; color:#fff;
    background: linear-gradient(135deg, #fc8b36, #f97316);
    overflow:hidden;
  }
  .badge::after{
    content:""; position:absolute; inset:-20%; background:
      radial-gradient(circle at 30% 20%, rgba(255,255,255,.18), transparent 45%),
      radial-gradient(circle at 80% 80%, rgba(0,0,0,.08), transparent 40%);
  }
  .badge-inner{ position:relative; text-align:center; line-height:1; padding: 8px; }
  .badge-top,.badge-bottom{
    font-weight: 900; letter-spacing: .5px;
    font-size: clamp(20px, 3.4vw, 28px);
  }
  
  /* body */
  .card-body{ padding: clamp(14px, 2.2vw, 18px); }
  .card-title{
    display:inline-block; font-weight:800; color:#0b0b0b;
    text-decoration: underline; text-underline-offset: 2px;
    font-size: clamp(18px, 2.2vw, 22px); margin: 2px 0 6px;
  }
  .price-line{ font-weight: 700; color:#0b0b0b; margin: 4px 0 10px; }
  .desc{ color:#111827; font-size: clamp(14px,1.6vw,15px); line-height:1.55; }
  
  /* actions */
  .buy-row{ display:flex; justify-content:flex-end; margin-top: clamp(12px, 2vw, 16px); }
  .buy-btn{
    --btn-bg:#f25c54;
    display:inline-flex; align-items:center; gap:8px;
    background: var(--btn-bg); color:#fff; border:0; cursor:pointer;
    padding: 10px 18px; border-radius: 999px; font-weight:800;
    box-shadow: 0 6px 14px rgba(242,92,84,.25);
    transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
  }
  .buy-btn:hover{ transform: translateY(-1px); box-shadow: 0 10px 18px rgba(242,92,84,.28); }
  .buy-btn:active{ transform: translateY(0); box-shadow: 0 6px 14px rgba(242,92,84,.22); }
  .buy-btn .cart{ width:16px; height:16px; }
  
  /* error */
  .gc-error{ color:#b91c1c; font-size:14px; background:#fee2e2; border:1px solid #fecaca; padding:10px 12px; border-radius:10px; }
  
  /* ====== Skeleton ====== */
  .is-skeleton .skeleton{
    position: relative; overflow: hidden; background: #e5e7eb; border-radius: 8px;
  }
  .is-skeleton .skeleton::after{
    content:""; position:absolute; inset:0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent);
    transform: translateX(-100%); animation: shimmer 1.2s infinite;
  }
  .sk-title{ width: 60%; height: 20px; margin: 6px 0 8px; }
  .sk-price{ width: 100px; height: 14px; margin-bottom: 12px; }
  .sk-text{ width: 100%; height: 12px; margin: 8px 0; }
  .sk-btn{ width: 120px; height: 38px; border-radius: 999px; }
  @keyframes shimmer{ 100% { transform: translateX(100%); } }
  </style>
  