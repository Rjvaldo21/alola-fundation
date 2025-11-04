<template>
  <section class="mch">
    <div class="mch-container">
      <div class="mch-grid">
        <!-- === SLIDER + TEXT === -->
        <div class="mch-col-main">
          <!-- SMALL SLIDER -->
          <div
            class="mch-hero"
            v-if="slides.length"
            tabindex="0"
            aria-roledescription="carousel"
            aria-label="Maternal & Child Health slider"
            @keydown.left.prevent="prev"
            @keydown.right.prevent="next"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
            @touchstart.passive="onTouchStart"
            @touchend.passive="onTouchEnd"
          >
            <!-- Slides -->
            <div
              v-for="(s, i) in slides"
              :key="s.id || i"
              class="mch-slide"
              :class="{ 'is-active': current === i }"
              :style="{ backgroundImage: `url('${s.image}')` }"
              role="group"
              :aria-roledescription="`slide ${i+1} of ${slides.length}`"
            >
              <div class="mch-overlay"></div>
            </div>

            <!-- Arrows -->
            <button class="mch-nav mch-nav--prev" @click="prev" aria-label="Previous slide">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            <button class="mch-nav mch-nav--next" @click="next" aria-label="Next slide">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
            </button>

            <!-- Dots -->
            <div class="mch-dots">
              <button
                v-for="(s, i) in slides"
                :key="'dot'+i"
                class="mch-dot"
                :class="{ 'is-active': current === i }"
                @click="goTo(i)"
                :aria-label="`Go to slide ${i+1}`"
              />
            </div>
          </div>

          <!-- TEXT UNDER SLIDER -->
          <article class="mch-article">
            <h1 class="mch-title">{{ page.title || 'Maternal and Child Health (MCH)' }}</h1>

            <p v-if="page.intro" class="mch-intro">{{ page.intro }}</p>

            <div class="mch-body" v-html="page.body_html || fallbackBodyHtml"></div>
          </article>
        </div>

        <!-- === GALERRY === -->
        <aside class="mch-aside">
          <div class="mch-galleryCard">
            <div class="mch-galleryHead">
              <h3>Gallery</h3>
              <RouterLink v-if="galleryLink" :to="galleryLink" class="mch-link">View all</RouterLink>
            </div>

            <div class="mch-gallery">
              <img
                v-for="(img, i) in gallery"
                :key="i"
                :src="img"
                loading="lazy"
                alt=""
                @error="onGalleryError(i)"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'

/* ===== Page Content ===== */
const page = ref({
  title: '',
  intro: '',
  body_html: ''
})
const fallbackBodyHtml = `<p>Fundasaun Alola continues to be praised for its contribution in improving maternal and child health.</p>`

/* ====== CONFIG: BASE API ====== */
const API_BASE = (import.meta?.env?.VITE_API_BASE || 'http://localhost:8000').replace(/\/+$/,'')
const API = {
  mchSection: `${API_BASE}/api/program-sections/mch/`,
  heroslide:  `${API_BASE}/api/heroslide/`,
}

/* ===== State ===== */
const slides = ref([
  { id: 'ph-1', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop' },
  { id: 'ph-2', image: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?q=80&w=1600&auto=format&fit=crop' }
])
const galleryLink = ref('')
const GALLERY_FALLBACK = [
  'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=600&auto=format&fit=crop'
]
const gallery = ref([...GALLERY_FALLBACK])

/* ===== Helpers ===== */
function absUrl(u) {
  const v = String(u || '').trim()
  if (!v) return ''
  if (/^https?:\/\//i.test(v)) return v
  if (/^\/\//.test(v)) return `${location.protocol}${v}`
  if (v.startsWith('/')) return `${API_BASE}${v}`
  if (/^media\//i.test(v)) return `${API_BASE}/${v}`
  return v
}
const pick = (obj, ...names) => {
  for (const n of names) {
    const v = obj?.[n]
    if (v !== undefined && v !== null && String(v).trim() !== '') return v
  }
  return ''
}
function mapSlides(raw = []) {
  return raw
    .map(s => ({
      id: s?.id ?? null,
      image: absUrl(pick(s, 'image', 'image_url', 'url'))
    }))
    .filter(s => !!s.image)
}
function mapGallery(raw = []) {
  return raw
    .map(it => typeof it === 'string'
      ? absUrl(it)
      : absUrl(pick(it, 'image', 'file', 'image_url', 'url'))
    )
    .filter(Boolean)
}

/* ===== API Fetches ===== */

async function fetchHeroSlidesPrimary() {
  const tries = [
    { params: { group: 'mch' } },
    { params: { page:  'mch' } },
    { params: { q:     'mch' } },
    {} 
  ]
  for (const opt of tries) {
    try {
      const { data } = await axios.get(API.heroslide, { ...opt, withCredentials:false })
      const rows = Array.isArray(data) ? data : (data?.results || [])
      const s = mapSlides(rows)
      if (s.length) { slides.value = s; return true }
    } catch (e) {
    }
  }
  return false
}

async function fetchProgramSectionMCH() {
  const { data } = await axios.get(API.mchSection, { withCredentials:false })

  page.value = {
    title: data?.title || 'Maternal and Child Health (MCH)',
    intro: data?.intro || '',
    body_html: data?.body_html || ''
  }

  const rawGal = Array.isArray(data?.gallery?.results) ? data.gallery.results : (data?.gallery || [])
  const g = mapGallery(rawGal)
  if (g.length) gallery.value = g

  if (!galleryLink.value) galleryLink.value = '/gallery/'
}
async function fetchHeroSlidesFallback() {
  try {
    const { data } = await axios.get(API.heroslide, { withCredentials:false })
    const rows = Array.isArray(data) ? data : (data?.results || [])
    const s = mapSlides(rows)
    if (s.length) slides.value = s
  } catch {}
}

/* ===== Slider Controls ===== */
const current = ref(0)
const isHovering = ref(false)
const intervalMs = 5000
let timer

function goTo(i){
  const n = slides.value.length || 1
  current.value = (i + n) % n
}
function next(){ goTo(current.value + 1) }
function prev(){ goTo(current.value - 1) }

function start(){ stop(); timer = setInterval(() => { if (!isHovering.value) next() }, intervalMs) }
function stop(){ if (timer) clearInterval(timer) }

/* ===== Lifecycle ===== */
onMounted(async () => {
  try {
    const gotHero = await fetchHeroSlidesPrimary()
    await fetchProgramSectionMCH()

    if (!gotHero && !slides.value.length) {
      await fetchHeroSlidesFallback()
    }
  } finally {
    if (!slides.value.length) {
      slides.value = [
        { id: 'ph-1', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop' },
        { id: 'ph-2', image: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?q=80&w=1600&auto=format&fit=crop' }
      ]
    }
    start()
  }
})

onBeforeUnmount(stop)
</script>

<style scoped>
/* ===== Tokens Netral ===== */
.mch{ background:#fff; color:#0f172a; }
.mch-container{ max-width:1200px; margin:0 auto; padding:24px 16px 48px; }

/* ===== GRID 2 Colom ===== */
.mch-grid{
  display:grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(280px, .9fr);
  gap:24px; align-items:start;
}
@media (max-width: 980px){
  .mch-grid{ grid-template-columns: 1fr; }
}

/* ===== Slider + Text ===== */
.mch-col-main{ min-width:0; }

/* ===== Small Slider) ===== */
.mch-hero{
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 420px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(2,6,23,.08);
  background: #000;
  outline: none;
}
@media (max-width: 520px){
  .mch-hero{ aspect-ratio: 4 / 3; max-height: 320px; }
}

/* Slides (Fade) */
.mch-slide{
  position:absolute; inset:0;
  background-size: cover; background-position: center;
  opacity: 0; transition: opacity .6s ease;
}
.mch-slide.is-active{ opacity: 1; z-index: 2; }
.mch-overlay{ position:absolute; inset:0; background: linear-gradient(to top, rgba(0,0,0,.35), rgba(0,0,0,.05)); }

/* Arrows */
.mch-nav{
  position:absolute; top:50%; transform:translateY(-50%);
  z-index:3;
  width:40px; height:40px; border-radius:9999px;
  display:grid; place-items:center;
  background: rgba(255,255,255,.8);
  border: 1px solid rgba(0,0,0,.05);
  box-shadow: 0 8px 24px rgba(0,0,0,.16);
  cursor:pointer;
}
.mch-nav:hover{ background:#fff; }
.mch-nav svg{ width:22px; height:22px; }
.mch-nav--prev{ left:10px; }
.mch-nav--next{ right:10px; }
@media (min-width: 640px){
  .mch-nav--prev{ left:16px; } .mch-nav--next{ right:16px; }
}

/* Dots */
.mch-dots{
  position:absolute; bottom:10px; left:0; right:0; z-index:3;
  display:flex; justify-content:center; gap:8px;
}
.mch-dot{
  width:10px; height:10px; border-radius:9999px; border:none;
  background: rgba(255,255,255,.65); cursor:pointer; transition: all .2s ease;
}
.mch-dot.is-active{ width:26px; background:#fff; }

/* ===== Text Under Slider ===== */
.mch-article{ margin-top:20px; }
.mch-title{
  margin:0 0 10px;
  font-size: clamp(22px, 3.3vw, 32px);
  font-weight: 800;
  letter-spacing: .2px;
}
.mch-body{
  font-size: clamp(15px, 2.2vw, 17px);
  line-height: 1.75;
  color:#374151;
}
.mch-body p{ margin: 0 0 12px; }

/* ===== Card Gallery ===== */
.mch-aside{ min-width:0; }
.mch-galleryCard{
  background:#fff; border:1px solid #f1f5f9; border-radius:16px;
  box-shadow: 0 8px 24px rgba(2,6,23,.06);
  overflow:hidden;
}
.mch-galleryHead{
  display:flex; align-items:center; justify-content:space-between;
  padding:12px 14px; border-bottom:1px solid #f1f5f9;
}
.mch-galleryHead h3{ margin:0; font-size:15px; font-weight:700; }
.mch-link{ font-size:13px; color:#0f172a; text-decoration:underline; }
.mch-link:hover{ background:#f9fafb; }

.mch-gallery{
  padding:12px;
  display:grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap:10px;
}
.mch-gallery img{
  width:100%; aspect-ratio: 1 / 1; object-fit: cover; display:block;
  border-radius:12px; background:#f3f4f6;
}

.mch-hero{ border-radius: 18px; }
.mch-galleryCard{ border-radius: 18px; }
</style>
