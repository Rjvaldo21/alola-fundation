<template>
  <section class="ee-page">
    <div class="ee-topband"></div>

    <div class="ee-container">
      <header class="ee-card ee-header">
        <h1 class="ee-title">{{ page.title }}</h1>
        <p class="ee-subtitle">{{ page.subtitle }}</p>
      </header>

      <div class="ee-grid">
        <main class="ee-main">
          <figure class="ee-card ee-figure">
            <img :src="featuredUrl" alt="" @error="useFallback('featured')" />
          </figure>

          <article class="ee-card ee-article" v-html="page.body_html"></article>

          <!-- Video + Share -->
          <div class="ee-card ee-videoBlock">
            <div class="ee-video">
              <iframe
                v-if="embed"
                :key="embed"
                :src="embed"
                title="Program video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin"
                loading="lazy"
                style="width:100%;height:100%;display:block"
              ></iframe>
              <div v-else class="ee-video__placeholder"></div>
            </div>
            <p class="ee-debug" v-if="embed"><small>Video URL: {{ embed }}</small></p>

            <div class="ee-share">
              <button @click="printPage">Print</button>
              <button @click="shareWA">WhatsApp</button>
              <button @click="shareFB">Facebook</button>
              <button @click="shareTG">Telegram</button>
              <button @click="shareX">X</button>
            </div>
          </div>
        </main>

        <aside class="ee-sidebar">
          <div class="ee-card">
            <div class="ee-card-head">
              <h3>Gallery</h3>
              <RouterLink v-if="page.gallery_link" :to="page.gallery_link" class="ee-link">View all</RouterLink>
            </div>
            <div class="ee-gallery">
              <img
                v-for="(img, i) in galleryThumbs"
                :key="i"
                :src="img"
                alt=""
                @error="onThumbError(i)"
              />
            </div>
          </div>

          <div class="ee-card ee-accordion">
            <details v-for="(item, i) in accs" :key="i">
              <summary>{{ item.title }}</summary>
              <div v-html="item.body"></div>
            </details>
          </div>
        </aside>
      </div>
    </div>

    <transition name="ee-fade">
      <div v-if="isLoading" class="ee-loading">
        <div class="ee-spinner"></div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api, absUrl } from '@/api'

const isLoading = ref(true)

/* ===== Default ===== */
const page = ref({
  title: "Women’s Economic Empowerment",
  subtitle: "Women's economic empowerment through training, market access, and business mentoring.",
  featured_image: '',
  body_html: `<p>Alola’s Economic Empowerment Program ...</p>`,
  video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // fallback
  gallery_link: ''
})

const FALLBACKS = {
  featured: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop',
  thumbs: [
    'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=600&auto=format&fit=crop'
  ]
}

const featuredUrl   = ref(FALLBACKS.featured)
const galleryThumbs = ref([...FALLBACKS.thumbs])
const accs          = ref([])

/* === Embed URL IFRAME === */
const embed = ref('')

/* ===== Normalizers ===== */
function toPage(s){
  const rawGal = (Array.isArray(s?.gallery?.results) ? s.gallery.results : s?.gallery) || []
  const gallery = rawGal
    .map(it => typeof it === 'string'
      ? it
      : absUrl(it?.image || it?.file || it?.image_url || it?.url || '')
    )
    .filter(Boolean)

  const body = s?.body_html || s?.content_html || s?.body || ''
  return {
    title: s?.title || 'Women’s Economic Empowerment',
    subtitle: s?.intro || '',
    featured_image: absUrl(s?.hero_image || s?.image || s?.cover_image || ''),
    body_html: body,
    video_url: s?.video_url || firstYoutubeFromHtml(body) || '',
    gallery,
    gallery_link: page.value.gallery_link,
  }
}

function normalizeAcc(raw){
  const arr = Array.isArray(raw?.results) ? raw.results : (raw || [])
  return arr.map(a => ({
    title: a.title || '',
    body:  a.content_html || a.body_html || a.body || a.content || ''
  })).filter(x => x.title || x.body)
}

/* ===== API Slides ===== */
async function fetchWeeSlides() {
  const tries = [
    { params: { group: 'wee' } }, 
    { params: { page: 'wee' } },  
    { params: { q: 'wee' } },     
  ]

  for (const opt of tries) {
    try {
      const { data } = await api.get('heroslide/', opt)
      const rows = Array.isArray(data) ? data : (data?.results || [])
      if (rows.length) return rows
    } catch {}
  }

  try {
    const { data } = await api.get('heroslide/')
    return Array.isArray(data) ? data : (data?.results || [])
  } catch {
    return []
  }
}

/* ===== Fetch ===== */
const CANDIDATE_ENDPOINTS = [
  'program-sections/wee/',
  'programs/wee/',
  'programsection/wee/'
]

onMounted(async () => {
  try {
    // 1) ProgramSection (slug=wee)
    let data = null
    for (const ep of CANDIDATE_ENDPOINTS) {
      try {
        const { data: d } = await api.get(ep)
        data = d
        break
      } catch {}
    }
    if (data) {
      const p = toPage(data)
      page.value = { ...page.value, ...p }
      featuredUrl.value   = p.featured_image || FALLBACKS.featured
      galleryThumbs.value = (p.gallery?.length ? p.gallery : FALLBACKS.thumbs).slice(0, 9)

      const fromPage = toYouTubeEmbed(p.video_url)
      if (fromPage) embed.value = fromPage
    } else {
      featuredUrl.value   = FALLBACKS.featured
      galleryThumbs.value = FALLBACKS.thumbs.slice(0, 9)
    }

    try {
      const rows = await fetchWeeSlides()
      const y = rows.find(r => !!r.youtube_url)?.youtube_url
      if (!embed.value && y) {
        embed.value = toYouTubeEmbed(y)
      }

      const pickedWithImg = rows.find(r => !!r.image_url)
      if ((!page.value.featured_image || featuredUrl.value === FALLBACKS.featured) && pickedWithImg?.image_url) {
        featuredUrl.value = pickedWithImg.image_url
      }
    } catch (e) {
      console.warn('[ee] no WEE slide', e)
    }

    try {
      const { data: acc } = await api.get('accordion-items/', {
        params: { page: 'wee', group: 'wee', category: 'wee' }
      })
      accs.value = normalizeAcc(acc)
    } catch {}

    console.log('[WEE] final embed =', embed.value)

  } catch (e) {
    console.warn('[ee] fallback content used:', e)
  } finally {
    isLoading.value = false
  }
})

/* ===== Utils ===== */
function toYouTubeEmbed(urlOrId) {
  const v = String(urlOrId || '').trim()
  if (!v) return ''

  const base = (id) => `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`

  // 1) ID polos
  if (/^[A-Za-z0-9_-]{11}$/.test(v)) return base(v)

  // 2) URL
  try {
    const u = new URL(v)

    // youtu.be/ID
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace(/^\//,'').slice(0,11)
      return /^[A-Za-z0-9_-]{11}$/.test(id) ? base(id) : ''
    }

    // youtube.com / youtube-nocookie.com
    if (u.hostname.includes('youtube')) {
      const id = u.searchParams.get('v')
      if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return base(id)

      // /embed/ID
      const m = u.pathname.match(/\/embed\/([A-Za-z0-9_-]{11})/)
      if (m) return base(m[1])

      // /shorts/ID
      const s = u.pathname.match(/\/shorts\/([A-Za-z0-9_-]{11})/)
      if (s) return base(s[1])
    }

    return ''
  } catch {
    // 3) Fallback: cari ID di string
    const m = v.match(/([A-Za-z0-9_-]{11})/)
    return m ? base(m[1]) : ''
  }
}

function firstYoutubeFromHtml(html=''){
  const m = String(html).match(/https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/)
  return m ? `https://www.youtube.com/watch?v=${m[1]}` : ''
}
function useFallback(which){ if (which === 'featured') featuredUrl.value = FALLBACKS.featured }
function onThumbError(i){ galleryThumbs.value[i] = FALLBACKS.thumbs[i % FALLBACKS.thumbs.length] }

/* Share */
function currentUrl(){ return typeof window !== 'undefined' ? window.location.href : '/' }
function printPage(){ if (typeof window !== 'undefined') window.print() }
function shareWA(){ const u=encodeURIComponent(currentUrl()); const t=encodeURIComponent(page.value.title); window.open(`https://wa.me/?text=${t}%20${u}`,'_blank') }
function shareFB(){ const u=encodeURIComponent(currentUrl()); window.open(`https://www.facebook.com/sharer/sharer.php?u=${u}`,'_blank') }
function shareTG(){ const u=encodeURIComponent(currentUrl()); const t=encodeURIComponent(page.value.title); window.open(`https://t.me/share/url?url=${u}&text=${t}`,'_blank') }
function shareX(){ const u=encodeURIComponent(currentUrl()); const t=encodeURIComponent(page.value.title); window.open(`https://twitter.com/intent/tweet?url=${u}&text=${t}`,'_blank') }
</script>

<style scoped>
.ee-page{
  --ink:#0f172a; --muted:#6b7280; --line:#e5e7eb; --ghost:#f9fafb;
  background:#fff; color:var(--ink);
}
.ee-topband{ height:72px; background:#fff; border-bottom:1px solid var(--line); }
.ee-container{ max-width:1200px; margin:-36px auto 32px; padding:0 16px; }

/* Cards */
.ee-card{ background:#fff; border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,.06); border:1px solid #f3f4f6; }
.ee-header{ padding:24px; }
.ee-title{ margin:0 0 6px; font-weight:800; font-size:clamp(22px,3.2vw,34px); }
.ee-subtitle{ margin:0; color:var(--muted); }

/* Grid */
.ee-grid{ display:flex; gap:24px; align-items:flex-start; flex-wrap:wrap; margin-top:20px; }
.ee-main{ flex:1 1 0; min-width:280px; }
.ee-sidebar{ width:340px; flex:0 0 340px; display:flex; flex-direction:column; gap:24px; }
@media (max-width:960px){ .ee-sidebar{ width:100%; flex-basis:100%; } }

/* Featured */
.ee-figure{ overflow:hidden; }
.ee-figure img{ display:block; width:100%; height:auto; aspect-ratio:16/9; object-fit:cover; }

/* Article */
.ee-article{ padding:24px; line-height:1.7; color:#374151; }
.ee-article p{ margin:0 0 12px; }
.ee-article a{ color:var(--ink); text-decoration:underline; }
.ee-article a:hover{ background:var(--ghost); }

/* Video */
.ee-video{ position:relative; width:100%; background:#000; min-height:320px; }
@supports (aspect-ratio: 16 / 9) { .ee-video{ aspect-ratio:16/9; min-height:unset; } .ee-video iframe{ position:absolute; inset:0; } }
@supports not (aspect-ratio: 16 / 9) { .ee-video::before{ content:""; display:block; padding-top:56.25%; } .ee-video iframe{ position:absolute; top:0; left:0; width:100%; height:100%; border:0; } }
.ee-video__placeholder{ position:absolute; inset:0; background:
  radial-gradient(circle at 30% 30%, rgba(255,255,255,.08), transparent 40%),
  linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.2));
}
.ee-debug{ margin:8px 12px 0; color:#6b7280; }

/* Spacing */
.ee-videoBlock{ margin-top:clamp(32px, 6vw, 72px); }
@media (max-width:640px){ .ee-videoBlock{ margin-top:clamp(40px, 10vw, 96px); } }

/* Share */
.ee-share{ display:flex; flex-wrap:wrap; gap:8px; justify-content:center; border-top:1px solid var(--line); padding:12px; }
.ee-share button{ font-size:12px; padding:6px 10px; border-radius:9999px; background:#fff; border:1px solid #d1d5db; color:#111827; cursor:pointer; }
.ee-share button:hover{ background:var(--ghost); }

/* Sidebar blocks */
.ee-card-head{ display:flex; justify-content:space-between; align-items:center; padding:12px 12px 0; }
.ee-card-head h3{ margin:0; font-size:15px; }
.ee-link{ font-size:13px; color:#111827; text-decoration:underline; }
.ee-link:hover{ background:var(--ghost); }

.ee-gallery{ padding:12px; display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
.ee-gallery img{ width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:10px; display:block; }

/* Accordion */
.ee-accordion{ padding:8px 0; }
.ee-accordion details + details{ border-top:1px solid var(--line); }
.ee-accordion summary{ cursor:pointer; padding:12px 16px; font-weight:600; list-style:none; }
.ee-accordion summary::-webkit-details-marker{ display:none; }
.ee-accordion details > div{ padding:0 16px 12px; color:var(--muted); font-size:14px; }

/* Loader */
.ee-fade-enter-active,.ee-fade-leave-active{ transition:opacity .2s ease; }
.ee-fade-enter-from,.ee-fade-leave-to{ opacity:0; }
.ee-loading{ position:fixed; inset:0; display:grid; place-items:center; background:rgba(255,255,255,.55); backdrop-filter:blur(2px); z-index:60; }
.ee-spinner{ width:48px; height:48px; border:4px solid #9ca3af; border-top-color:transparent; border-radius:50%; animation:ee-spin 1s linear infinite; }
@keyframes ee-spin{ to{ transform:rotate(1turn); } }
</style>
