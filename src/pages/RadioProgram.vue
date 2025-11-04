<template>
    <section id="radio-program" class="rp-wrap">
      <!-- Header MINI -->
      <div class="rp-container rp-head">
        <h1 class="rp-h1">Radio Program</h1>
        <p class="rp-sub">Behind the Scene • Stories that inspire change</p>
      </div>
  
      <main class="rp-container rp-grid">
        <!-- LEFT: HERO -->
        <section class="hero">
          <div v-if="isLoading" class="skeleton hero-ph"></div>
          <figure v-else class="hero-figure">
            <img :src="hero.imageUrl" :alt="hero.alt || hero.title" loading="lazy" decoding="async" />
            <figcaption v-if="hero.caption" class="caption" v-html="hero.caption"></figcaption>
          </figure>
  
          <!-- LEFT DESCRIPTION -->
          <div class="rp-text" :class="{loading:isLoading}">
            <div v-if="isLoading" class="skeleton sk-text"></div>
            <div v-else v-html="leftDesc"></div>
          </div>
        </section>
  
        <!-- RIGHT: GALLERY -->
        <aside class="side">
          <div v-if="isLoading" class="grid">
            <div v-for="n in 8" :key="'g'+n" class="skeleton cell"></div>
          </div>
  
          <div v-else class="grid">
            <button class="more" v-if="galleryCta.href" @click="openGallery">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6-4.35-9-8.5C1 9 3 6 6 6c2 0 3.54 1.54 4 3 .46-1.46 2-3 4-3 3 0 5 3 3 6.5C18 16.65 12 21 12 21Z" fill="currentColor"/></svg>
              <span>{{ galleryCta.text || 'More photos' }}</span>
            </button>
  
            <figure v-for="(g, i) in gallery" :key="i" class="cell">
              <img :src="g.url" :alt="g.alt || ('Gallery '+(i+1))" loading="lazy" decoding="async" @click="preview(g.url)" />
            </figure>
          </div>
  
          <!-- RIGHT DESCRIPTION -->
          <div class="rp-text right" :class="{loading:isLoading}">
            <div v-if="isLoading" class="skeleton sk-text"></div>
            <div v-else v-html="rightDesc"></div>
          </div>
        </aside>
      </main>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { api, absUrl } from '@/api'
  
  const props = defineProps({
    pageSlug: { type: String, default: 'radio-program' },
  })
  
  const isLoading  = ref(true)
  const error      = ref('')
  
  /* ==== HERO (dengan fallback aman) ==== */
  const HERO_FALLBACK =
    'https://images.unsplash.com/photo-1532635241-17e820acc59f?q=80&w=1630&auto=format&fit=crop'
  
  const hero = ref({
    title: 'Radio Program',
    imageUrl: HERO_FALLBACK,
    caption: '',
    alt: 'Radio talkshow in studio'
  })
  
  /* ==== GALERI DEFAULT (tampil duluan) ==== */
  const defaultGallery = [
    { url: 'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?q=80&w=2072&auto=format&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=900&auto=format&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1484353371297-d8cfd2895020?q=80&w=1779&auto=format&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1495837174058-628aafc7d610?q=80&w=2070&auto=format&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=900&auto=format&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=900&auto=format&fit=crop' }
  ]
  
  /* ⬅️ PENTING: set nilai awal galeri = default  */
  const gallery    = ref([...defaultGallery])
  const leftDesc   = ref('')
  const rightDesc  = ref('')
  const galleryCta = ref({ text: '', href: '' }) // kosongkan tombol dulu
  
  onMounted(async () => {
    isLoading.value = true
    try {
      // 1) Ambil Page radio-program
      const { data: page } = await api.get(`pages/${props.pageSlug}/`)
  
      hero.value = {
        title: page?.title || hero.value.title,
        imageUrl: page?.cover_image ? absUrl(page.cover_image) : HERO_FALLBACK,
        caption: page?.meta_description || '',
        alt: page?.title || 'Radio Program',
      }
  
      const body = page?.body_html || ''
      leftDesc.value = /<\w+/.test(body) ? body : (body ? `<p>${body}</p>` : '')
  
      // 2) (Optional) Kalau nanti kamu punya endpoint album, override di sini.
      //    Kalau gagal / kosong, BIARKAN nilai default tetap dipakai.
      // try {
      //   const { data: album } = await api.get('gallery/albums/radio-program/')
      //   const items = album?.items || []
      //   if (Array.isArray(items) && items.length) {
      //     gallery.value = items
      //       .filter(it => (String(it.type||'').toUpperCase() === 'IMAGE') && (it.image || it.url))
      //       .map(it => ({ url: absUrl(it.image || it.url), alt: it.caption || it.title || '' }))
      //     galleryCta.value = { text: 'More photos', href: '/gallery/radio-program' }
      //   }
      // } catch { /* abaikan, keep default */ }
  
    } catch (e) {
      console.warn('[RadioProgram] fetch error:', e)
      error.value = 'Gagal memuat konten Radio Program.'
      // Biarkan hero & gallery tetap pakai fallback
    } finally {
      isLoading.value = false
    }
  })
  
  /* Fallback jika cover image 404 di runtime (butuh 1 baris di template) */
  function onHeroError() {
    hero.value.imageUrl = HERO_FALLBACK
  }
  
  function openGallery(){ /* belum dipakai */ }
  function preview(url){ window.open(url, '_blank', 'noopener') }
  </script>
  

<style scoped>
  :root{
    --bg:#0fcaa3;
    --panel:#ffffff;
    --ink:#0b0b0b;
    --muted:#334155;
    --line:#e5e7eb;
    --radius:16px;
    --shadow:0 10px 28px rgba(2,24,43,.10);
    --accent:#ef4444;
  }
  .rp-wrap{ background: var(--bg); padding-bottom: 28px; }
  .rp-container{ width:min(1180px,100%); margin-inline:auto; padding-inline: clamp(12px,3vw,22px); }
  
  .rp-head{ padding-block: clamp(14px,2.2vw,22px); }
  .rp-h1{
    font-size: clamp(22px, 2.6vw, 30px);
    color: #2a2929; font-weight: 800; letter-spacing:.3px; margin:0;
    text-shadow: 0 1px 0 rgba(0,0,0,.1);
  }
  .rp-sub{ color:#2a2929; margin-top:6px; font-size: 14px; }
  
  /* GRID */
  .rp-grid{
  display:grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(380px, 1fr); 
  gap: 16px;
  align-items: start; 
}

/* === RIGHT GALERI === */
.rp-grid .side > .grid{
  display: grid;
  grid-template-columns: repeat(3, 1fr) !important; 
  gap: 6px !important;                               
  padding: 6px 4px !important;                      
}

.rp-grid .side > .grid .cell{
  margin: 0 !important;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eef2f7;
  box-shadow: 0 6px 16px rgba(2,24,43,.08);
  position: relative;
  aspect-ratio: 1 / 1; 
}

.rp-grid .side > .grid .cell img{
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; display: block;
}

.rp-grid .side > .grid .more{ right: 8px; bottom: -10px; }

@media (max-width: 980px){
  .rp-grid{ grid-template-columns: 1fr; }
  .rp-grid .side > .grid{
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 5px !important;
    padding: 6px 4px !important;
  }
}
  
  /* HERO */
  .hero-figure{
    background: var(--panel); border-radius: var(--radius);
    overflow:hidden; box-shadow: var(--shadow);
  }
  .hero-figure img{ width:100%; height:auto; display:block; }
  .caption{ font-size:12px; color:#0b0b0b; padding:10px 12px; background:#fdf2e9; border-top:1px solid #f5d7b8; }
  
  .rp-text{
    margin-top: 10px; background: #f0fff8;
    border: 1px solid #c7f5ea; border-radius: 12px; padding: 10px 12px;
    color:#063d39; line-height:1.6; font-size: 14px;
  }
  .rp-text.right{ background:#fff; border-color:#dfe7ef; color:#0f172a; }
  
  /* SIDE / GALLERY */
  .side .grid{
    position:relative;
    display:grid; gap:10px;
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 520px){ .side .grid{ grid-template-columns: repeat(2, 1fr); } }
  
  .cell{
    background:#fff; border-radius: 10px; overflow:hidden; border: 1px solid #eef2f7;
    box-shadow: 0 6px 16px rgba(2,24,43,.08);
    aspect-ratio: 1/1; position:relative; cursor:pointer;
  }
  .cell img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
  
  /* More photos button (overlay) */
  .more{
    position:absolute; right:8px; bottom:-12px; z-index:2;
    display:inline-flex; align-items:center; gap:8px;
    background:#0ea5a4; color:#fff; border:0; cursor:pointer;
    padding:10px 12px; border-radius: 999px; box-shadow: 0 8px 16px rgba(14,165,164,.35);
  }
  .more svg{ width:16px; height:16px; }
  
  /* SKELETONS */
  .skeleton{ position:relative; overflow:hidden; background:#e5e7eb; }
  .skeleton::after{ content:""; position:absolute; inset:0; transform:translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent);
    animation: shimmer 1.15s infinite; }
  .hero-ph{ height: 52vw; max-height: 520px; border-radius: var(--radius); }
  .sk-text{ height: 48px; border-radius: 10px; }
  .sk-avatar{ width:56px; height:56px; border-radius:50%; }
  .sk-name{ width:120px; height:16px; border-radius:6px; background:#d1d5db !important; }
  .sk-soc{ width:32px; height:32px; border-radius:8px; background:#d1d5db !important; }
  @keyframes shimmer{ 100% { transform: translateX(100%); } }
  </style>
  