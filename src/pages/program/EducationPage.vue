<template>
  <section
    class="edu-slider"
    :style="{ minHeight: `calc(100vh - ${HEADER_H}px)` }"
    tabindex="0"
    @keydown.left.prevent="prev"
    @keydown.right.prevent="next"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
    aria-roledescription="carousel"
    aria-label="Education full-screen slider"
  >
    <!-- Slides -->
    <div
      v-for="(s, i) in slides"
      :key="s.id || i"
      class="edu-slide"
      :class="{ 'is-active': current === i }"
      :style="{ backgroundImage: `url('${s.image}')` }"
      role="group"
      :aria-roledescription="`slide ${i+1} of ${slides.length}`"
    >
      <div class="edu-overlay"></div>

      <div class="edu-caption">
        <h1 class="edu-title">{{ s.title }}</h1>
        <p v-if="s.text" class="edu-text">{{ s.text }}</p>

        <!-- CTA Internal (Router) -->
        <RouterLink
          v-if="s.ctaText && !isExternal(s.ctaLink)"
          :to="s.ctaLink || '#'"
          class="edu-cta"
        >
          {{ s.ctaText }}
          <svg viewBox="0 0 24 24" class="edu-cta-ico"><path d="M13.5 4a1 1 0 1 0 0 2h3.586L8.293 14.793a1 1 0 0 0 1.414 1.414L18.5 7.414V11a1 1 0 1 0 2 0V5a1 1 0 0 0-1-1h-6z" fill="currentColor"/></svg>
        </RouterLink>

        <!-- CTA -->
        <a
          v-else-if="s.ctaText && isExternal(s.ctaLink)"
          :href="s.ctaLink"
          target="_blank"
          rel="noopener"
          class="edu-cta"
        >
          {{ s.ctaText }}
          <svg viewBox="0 0 24 24" class="edu-cta-ico"><path d="M13.5 4a1 1 0 1 0 0 2h3.586L8.293 14.793a1 1 0 0 0 1.414 1.414L18.5 7.414V11a1 1 0 1 0 2 0V5a1 1 0 0 0-1-1h-6z" fill="currentColor"/></svg>
        </a>
      </div>
    </div>

    <!-- Arrows -->
    <button class="edu-nav edu-nav--prev" @click="prev" aria-label="Previous slide">
      <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
    </button>
    <button class="edu-nav edu-nav--next" @click="next" aria-label="Next slide">
      <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
    </button>

    <!-- Dots -->
    <div class="edu-dots" v-if="slides.length > 1">
      <button
        v-for="(s, i) in slides"
        :key="'dot'+i"
        class="edu-dot"
        :class="{ 'is-active': current === i }"
        @click="goTo(i)"
        :aria-label="`Go to slide ${i+1}`"
      />
    </div>

    <p v-if="errorMsg" style="position:absolute;left:12px;bottom:56px;background:rgba(0,0,0,.5);padding:6px 10px;border-radius:8px">
      {{ errorMsg }}
    </p>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { api, absUrl } from '@/api'

const HEADER_H = 64

// ===== STATE =====
const isLoading = ref(true)
const errorMsg  = ref('')

// Default Slides 
const slides = ref([
  {
    id: 1,
    title: 'Education Program',
    text: 'Improving access & quality of education through scholarships, teacher training, mobile libraries, and community preschools.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1600&auto=format&fit=crop',
    ctaText: 'Read more',
    ctaLink: '/publication'
  },
  {
    id: 2,
    title: 'Literacy for All',
    text: 'Working with communities and partners to build foundational skills for children in Timor-Leste.',
    image: 'https://images.unsplash.com/photo-1520975922203-b44b57f5b245?q=80&w=1600&auto=format&fit=crop',
    ctaText: 'Our impact',
    ctaLink: '/publication'
  }
])

// Autoplay & Controls
const current = ref(0)
const isHovering = ref(false)
const intervalMs = 6000
let timer

function goTo(i) {
  const len = slides.value.length || 1
  current.value = (i + len) % len
}
function next(){ goTo(current.value + 1) }
function prev(){ goTo(current.value - 1) }

function start(){
  stop()
  if (slides.value.length > 1) {
    timer = setInterval(() => { if (!isHovering.value) next() }, intervalMs)
  }
}
function stop(){ if (timer) clearInterval(timer) }

// Swipe (Mobile)
const startX = ref(null)
function onTouchStart(e){ startX.value = e.touches?.[0]?.clientX ?? null }
function onTouchEnd(e){
  if (startX.value == null) return
  const dx = (e.changedTouches?.[0]?.clientX ?? 0) - startX.value
  if (Math.abs(dx) > 60) (dx > 0 ? prev() : next())
  startX.value = null
}

// ===== API INTEGRATION =====
const props = defineProps({
  apiUrl: { type: String, default: 'heroslide/' }
})

function coalesce(...vals){
  for (const v of vals){
    if (v !== null && v !== undefined && String(v).trim() !== '') return v
  }
  return ''
}

function isExternal(url){ return /^https?:\/\//i.test(String(url || '')) }

function mapApiSlide(r, i){
  const image = absUrl(coalesce(r.image, r.image_url, r.cover, r.hero_image, ''))
  const title = coalesce(r.title, r.heading, r.name, '')
  const text  = coalesce(r.text, r.subtitle, r.body, r.summary, r.description, '')
  const ctaText = coalesce(r.ctaText, r.cta_text, r.button_text, r.cta, '')
  const ctaLink = coalesce(r.ctaLink, r.cta_url, r.link, r.route, '')
  const enabled = (r.enabled ?? r.is_active ?? true) ? true : false
  const order = Number(coalesce(r.order, r.position, r.sort, i))
  const id = coalesce(r.id, r.slug, `${i}`)
  return { id, title, text, image, ctaText, ctaLink, enabled, order }
}

async function fetchSlides(){
  try{
    const { data } = await api.get(props.apiUrl)

    const raw =
      Array.isArray(data?.results) ? data.results
      : Array.isArray(data?.slides) ? data.slides
      : Array.isArray(data) ? data
      : []

    const noVideo = raw.filter(r =>
      !String(r.youtube_url || '').trim() &&
      !String(r.video_url || '').trim()
    )

    const mapped = noVideo.map(mapApiSlide)
      .filter(s => s.enabled && s.title && s.image)
      .sort((a,b) => (a.order ?? 0) - (b.order ?? 0))

    if (mapped.length){
      slides.value = mapped
      current.value = 0
    } else {
      errorMsg.value = 'Data slider tidak ada gambar (atau semua berisi video). Menampilkan konten default.'
    }
  }catch(e){
    console.warn('[education/heroslide] error:', e)
    errorMsg.value = 'Tidak dapat memuat slider dari API. Menampilkan konten default.'
  }finally{
    isLoading.value = false
    start()
  }
}

onMounted(() => { fetchSlides() })
onBeforeUnmount(stop)
</script>

<style scoped>
/* ===== Layout Base ===== */
.edu-slider{
  position: relative;
  isolation: isolate;
  width: 100%;
  background: #000;
  color: #fff;
  overflow: hidden;
}
.edu-slider { touch-action: pan-y; }
.edu-slider:focus { outline: none; }

/* ===== Slide ===== */
.edu-slide{
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity .6s ease;
  will-change: opacity;
}
.edu-slide.is-active{ opacity: 1; z-index: 2; }

/* ===== Overlay ===== */
.edu-overlay{
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(15,23,42,.62), rgba(15,23,42,.25) 45%, rgba(0,0,0,0) 80%);
}

/* ===== Caption ===== */
.edu-caption{
  position: relative;
  z-index: 3;
  max-width: 1200px;
  margin: 0 auto;
  padding: 28vh 24px 14vh;
}
@media (min-width: 640px){ .edu-caption{ padding: 30vh 32px 14vh; } }
@media (min-width:1024px){ .edu-caption{ padding: 32vh 48px 16vh; } }

.edu-title{
  margin: 0;
  line-height: .95;
  font-weight: 800;
  text-transform: uppercase;
  text-shadow: 0 6px 18px rgba(0,0,0,.45);
  font-size: clamp(40px, 8vw, 84px);
}
.edu-text{
  margin-top: 12px;
  max-width: 56ch;
  font-size: clamp(16px, 2.2vw, 20px);
  opacity: .95;
}

/* CTA */
.edu-cta{
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: 18px;
  padding: 10px 18px;
  border-radius: 9999px;
  background: #fff; color: #1f2937; font-weight: 600;
  text-decoration: none;
  transition: background .2s ease, transform .08s ease;
}
.edu-cta:hover{ background: #f0f7ff; }
.edu-cta:active{ transform: scale(.99); }
.edu-cta-ico{ width: 16px; height: 16px; }

/* ===== Arrows ===== */
.edu-nav{
  position: absolute; top: 50%; transform: translateY(-50%);
  z-index: 5;
  width: 42px; height: 42px; border-radius: 9999px;
  display: grid; place-items: center;
  background: rgba(255,255,255,.72);
  box-shadow: 0 8px 24px rgba(0,0,0,.25);
  border: none; cursor: pointer;
  transition: background .2s ease;
}
.edu-nav:hover{ background: #fff; }
.edu-nav svg{ width: 22px; height: 22px; }
.edu-nav--prev{ left: 12px; }
.edu-nav--next{ right: 12px; }
@media (min-width: 640px){
  .edu-nav--prev{ left: 20px; }
  .edu-nav--next{ right: 20px; }
}

/* ===== Dots ===== */
.edu-dots{
  position: absolute; bottom: 14px; left: 0; right: 0; z-index: 5;
  display: flex; justify-content: center; gap: 8px;
}
.edu-dot{
  width: 10px; height: 10px; border-radius: 9999px;
  background: rgba(255,255,255,.6);
  border: none; cursor: pointer; transition: all .2s ease;
}
.edu-dot.is-active{ width: 28px; background: #fff; }
</style>
