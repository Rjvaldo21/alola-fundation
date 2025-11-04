<template>
  <section id="integration-approach" class="ia">
    <div class="container">
      <div class="grid">
        <!-- HERO + CONTEN -->
        <div class="main">
          <!-- HERO SLIDER & IMAGE -->
          <div
            class="hero"
            tabindex="0"
            aria-roledescription="carousel"
            aria-label="Integration Approach gallery"
            @keydown.left.prevent="prev"
            @keydown.right.prevent="next"
          >
            <div
              v-for="(s,i) in slides"
              :key="s.id || i"
              class="slide"
              :class="{ active: current === i }"
              :style="{ backgroundImage: `url('${s.image}')` }"
              role="group"
              :aria-roledescription="`slide ${i+1} of ${slides.length}`"
            >
              <div class="overlay"></div>
            </div>

            <button
              v-if="slides.length>1"
              class="nav nav--prev"
              @click="prev"
              aria-label="Previous slide"
            >
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            <button
              v-if="slides.length>1"
              class="nav nav--next"
              @click="next"
              aria-label="Next slide"
            >
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
            </button>

            <div v-if="slides.length>1" class="dots">
              <button
                v-for="(s,i) in slides"
                :key="'dot'+i"
                class="dot"
                :class="{ active: current===i }"
                @click="goTo(i)"
                :aria-label="`Go to slide ${i+1}`"
              />
            </div>
          </div>

          <!-- CONTEN -->
          <article class="content">
            <h1 class="title">{{ page.title }}</h1>
            <div class="body" v-html="page.bodyHtml"></div>
          </article>
        </div>

        <!-- GALLERY CARD -->
        <aside class="aside">
          <div class="card">
            <div class="card-head">
              <h3>Gallery</h3>
            </div>
            <div class="gallery">
              <figure
                v-for="(g,i) in gallery"
                :key="i"
                :class="['gcell', i===4 ? 'span-2' : '']"
              >
                <img :src="g" loading="lazy" alt="" />
              </figure>
            </div>
          </div>
        </aside>
      </div>

      <!-- ACCORDION -->
      <section class="acc">
        <div v-for="(s,idx) in sections" :key="s.id || idx" class="acc-item">
          <button class="acc-head" :class="{open:s.open}" @click="s.open=!s.open" :aria-expanded="s.open">
            <span>{{ s.title }}</span>
          </button>

          <!-- Style Inline -->
          <div class="acc-body" :class="{open:s.open}" role="region" :aria-hidden="!s.open">
            <div class="acc-inner">
              <article class="prose" v-html="s.content"></article>
            </div>
          </div>
        </div>
      </section>

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api, absUrl } from '@/api'

/* ======= Props ======= */
const props = defineProps({
  // Response ideal:
  // {
  //   "title":"Integration Approach",
  //   "body_html":"<p>...</p>",
  //   "slides":[{"image_url":"..."}, ...],
  //   "gallery":[{"image_url":"..."}, ...] | ["url1","url2",...],
  //   "sections":[{"id":1,"title":"...","content_html":"...","open":true}, ...]
  // }
  apiUrl: { type: String, default: 'integration-approach/' },

  // Endpoint
  pageUrl:     { type: String, default: '' }, 
  slidesUrl:   { type: String, default: '' }, 
  galleryUrl:  { type: String, default: '' }, 
  sectionsUrl: { type: String, default: '' },
})

/* ======= State ======= */
const isLoading = ref(true)
const errorMsg  = ref('')

/* Page Content (Defaults) */
const page = ref({
  title: 'Integration Approach',
  bodyHtml: `
    <p>The Alola Foundation’s Integration Approach brings together Maternal & Child Health, Education,
    Women’s Economic Empowerment, and Advocacy to deliver high-impact, community-driven outcomes.</p>
    <p>We coordinate actors across government, CSOs, and communities to remove barriers, share resources,
    and scale what works — ensuring women and children benefit from cohesive, continuous support.</p>
    <p>This page highlights how integrated activities are designed, launched, and continuously improved
    through consultation, focus group discussions, and evidence-based interventions.</p>
  `
})

/* HERO: Slides (Defaults) */
const slides = ref([
  { image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop' },
])
const current = ref(0)
const goTo = (i) => { current.value = (i + slides.value.length) % slides.value.length }
const next = () => goTo(current.value + 1)
const prev = () => goTo(current.value - 1)

/* Gallery (Defaults) */
const gallery = ref([
  'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=600&auto=format&fit=crop'
])

/* Accordion (Defaults) */
const sections = ref([
  { id:'consult', title:'Consultation & Socialization', open:true,  content:`<p>Community and stakeholder consultations shape the integrated design.</p>` },
  { id:'fgd',     title:'Focus Group Discussion (FGD)', open:false, content:`<p>FGDs identify barriers and co-develop interventions.</p>` },
  { id:'launch',  title:'Project Launch',                open:false, content:`<p>Programs are launched with partners, targets, and monitoring plans.</p>` },
  { id:'mch',     title:'MCH Interventions',             open:false, content:`<p>Coaching, referrals, and behavior change communication.</p>` },
])

/* ======= Helpers & Normalizers ======= */
const coalesce = (...vals) => {
  for (const v of vals) {
    if (v !== null && v !== undefined && String(v).trim() !== '') return v
  }
  return ''
}

const normSlide = (s = {}, i = 0) => {
  const img = absUrl(coalesce(s.image_url, s.image, s.cover, s.file, ''))
  return img ? { id: s.id ?? i, image: img } : null
}
const normSection = (s = {}, i = 0) => {
  const html = coalesce(s.content_html, s.body_html, s.html, s.content, s.body, '')
  return {
    id: s.id ?? i,
    title: coalesce(s.title, s.heading, `Section ${i+1}`),
    content: html,
    open: !!s.open
  }
}
const normGalleryArray = (arr = []) => {
  return arr.map(g => {
    const url = typeof g === 'string'
      ? g
      : absUrl(coalesce(g.image_url, g.image, g.file, g.url, ''))
    return url
  }).filter(Boolean)
}

async function fetchMaybe(url){
  if (!url) return null
  try { const { data } = await api.get(url); return data } catch { return null }
}

/* ======= Fetch On Mount ======= */
onMounted(async () => {
  try {
    let combined = null
    try { const { data } = await api.get(props.apiUrl); combined = data } catch {}

    const [p, sld, gal, secs] = await Promise.all([
      fetchMaybe(props.pageUrl),
      fetchMaybe(props.slidesUrl),
      fetchMaybe(props.galleryUrl),
      fetchMaybe(props.sectionsUrl),
    ])

    // PAGE
    const titleFrom = coalesce(
      p?.title, combined?.title, page.value.title
    )
    const bodyFrom = coalesce(
      p?.body_html, p?.content_html, combined?.body_html, combined?.content_html, page.value.bodyHtml
    )
    page.value = { title: titleFrom, bodyHtml: bodyFrom }

    // SLIDES
    const rawSlides =
      (Array.isArray(sld?.results) ? sld.results : sld) ||
      (Array.isArray(combined?.slides?.results) ? combined.slides.results : combined?.slides) ||
      []
    const normSlides = rawSlides.map(normSlide).filter(Boolean)
    if (normSlides.length) slides.value = normSlides
    current.value = 0

    // GALLERY
    const rawGallery =
      (Array.isArray(gal?.results) ? gal.results : gal) ||
      (Array.isArray(combined?.gallery?.results) ? combined.gallery.results : combined?.gallery) ||
      []
    const normGal = normGalleryArray(rawGallery)
    if (normGal.length) gallery.value = normGal

    // SECTIONS
    const rawSections =
      (Array.isArray(secs?.results) ? secs.results : secs) ||
      (Array.isArray(combined?.sections?.results) ? combined.sections.results : combined?.sections) ||
      []
    if (Array.isArray(rawSections) && rawSections.length){
      sections.value = rawSections.map(normSection)
      if (!sections.value.some(s => s.open)) sections.value[0].open = true
    }
  } catch (e) {
    console.warn('[integration-approach] error:', e)
    errorMsg.value = 'Gagal memuat data dari server. Menampilkan konten contoh.'
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* ===== Page Background ===== */
.ia{ background: var(--page-bg, #f8fafc); color:#0f172a; }
.container{ width:min(1120px, 100%); margin-inline:auto; padding:96px 16px 40px; }

/* ===== Two-Column Grid ===== */
.grid{
  display:grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(320px, 1fr);
  gap:24px;
  align-items:start;
}
@media (max-width: 980px){ .grid{ grid-template-columns: 1fr; } }

/* ===== HERO ===== */
.hero{
  position:relative; width:100%;
  aspect-ratio: 16 / 9; max-height: 460px;
  border-radius: 18px; overflow:hidden;
  box-shadow: 0 14px 36px rgba(2,6,23,.12);
  background:#000;
}
.slide{ position:absolute; inset:0; background-size:cover; background-position:center; opacity:0; transition: opacity .6s ease; }
.slide.active{ opacity:1; z-index:2; }
.overlay{ position:absolute; inset:0; background: linear-gradient(to top, rgba(0,0,0,.35), rgba(0,0,0,.05)); }

.nav{
  position:absolute; top:50%; transform:translateY(-50%);
  width:40px; height:40px; border-radius:999px;
  display:grid; place-items:center;
  background: rgba(255,255,255,.9); border:1px solid rgba(0,0,0,.06);
  box-shadow: 0 10px 28px rgba(0,0,0,.18); cursor:pointer; z-index:3;
}
.nav--prev{ left:14px; } .nav--next{ right:14px; }
.nav svg{ width:22px; height:22px; }

.dots{
  position:absolute; bottom:12px; left:0; right:0; display:flex; justify-content:center; gap:8px; z-index:3;
}
.dot{ width:10px; height:10px; border-radius:999px; border:none; background: rgba(255,255,255,.7); }
.dot.active{ width:26px; background:#fff; }

/* ===== CONTENT ===== */
.content{ margin-top:18px; }
.title{ margin:0 0 8px; font-size: clamp(24px, 3.2vw, 34px); font-weight: 900; letter-spacing:.2px; }
.body{ color:#374151; line-height:1.75; font-size:16px; }
.body p{ margin:0 0 12px; }

/* ===== ASIDE: Gallery Card ===== */
.grid{
  grid-template-columns: minmax(0, 1.58fr) minmax(360px, 1fr);
}
.aside .card{
  background:#fff; border:1px solid #eef2f7; border-radius:18px;
  box-shadow:0 10px 28px rgba(2,6,23,.08); overflow:hidden;
}
.card-head{ padding:10px 12px; border-bottom:1px solid #eef2f7; }
.card-head h3{ margin:0; font-size:13px; font-weight:800; color:#111; }

.gallery{
  padding:8px !important;
  display:grid;
  grid-template-columns: repeat(2, 1fr);
  gap:6px !important;
}
.gcell{ margin:0 !important; border-radius:12px; overflow:hidden; background:#f3f4f6; }
.gcell img{ display:block; width:100%; height:100%; object-fit:cover; aspect-ratio:1/1; }
.gcell.span-2{ grid-column: span 2; }
.gcell.span-2 img{ aspect-ratio: 16 / 9; }

@media (max-width: 980px){
  .gallery{ grid-template-columns: repeat(3, 1fr); gap:5px !important; padding:6px !important; }
  .gcell.span-2{ grid-column: span 3; }
}

/* ===== ACCORDION ===== */
.acc{ margin-top: 28px; }
.acc-item{
  background:#ffffff; border:1px solid #e5e7eb; border-radius:12px;
  overflow:hidden; box-shadow:0 4px 16px rgba(2,6,23,.06); margin-bottom:10px;
}

/* Header */
.acc-head{
  width:100%; text-align:left; background:#f8fafc; border:0; cursor:pointer;
  padding:12px 44px; font-weight:800; color:#0b0b0b; position:relative;
}
.acc-head::after{
  content:""; position:absolute; right:16px; top:50%;
  width:12px; height:12px; border-right:2px solid #0b0b0b; border-bottom:2px solid #0b0b0b;
  transform: translateY(-50%) rotate(45deg); transition: transform .15s ease;
}
.acc-head.open::after{ transform: translateY(-50%) rotate(-135deg); }


.acc-body{
  display:grid;
  grid-template-rows: 0fr;         
  overflow: hidden;                 
  transition: grid-template-rows .24s ease;
  pointer-events: none;             
}
.acc-body.open{
  grid-template-rows: 1fr;         
  pointer-events: auto;
}

.acc-inner{
  min-height:0;                     
  overflow:hidden;
  padding: 0 14px;                  
  background: transparent;
  border-top: 0;
  contain: layout paint;            
}
.acc-body.open .acc-inner{
  padding: 10px 14px 12px;          
  background:#f9fbff;
  border-top:1px dashed #e5e7eb;
}

.prose{ line-height:1.7; color:#374151; font-size:15px; }
.acc-inner .prose > :first-child{ margin-top:0; }
.acc-inner .prose > :last-child{ margin-bottom:0; }


/* Error */
.error{ color:#b91c1c; background:#fee2e2; border:1px solid #fecaca; border-radius:10px; padding:10px 12px; margin-top:10px; }
</style>