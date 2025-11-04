<!-- src/pages/Advocacy.vue -->
<template>
  <section id="advocacy" class="adv-wrap">
    <!-- HEADER -->
    <header class="adv-head">
      <div class="container">
        <h1 class="title">Advocacy</h1>
        <p class="lead">Policy advocacy and awareness campaigns to support women’s & children’s rights.</p>
      </div>
    </header>

    <div class="container">
      <!-- HERO (Program Profile) -->
      <section class="hero">
        <div class="hero-grid">
          <div class="hero-text">
            <div v-if="isLoading" class="skeleton sk-lines"></div>
            <article v-else class="prose" v-html="profileHtml"></article>
          </div>
          <figure class="hero-media">
            <div v-if="isLoading" class="skeleton sk-media"></div>
            <img v-else :src="hero.imageUrl" :alt="hero.alt || 'Advocacy Program'" />
            <figcaption v-if="hero.caption" v-html="hero.caption"></figcaption>
          </figure>
        </div>
      </section>

    <!-- ACCORDION -->
      <section class="acc">
        <div
            v-for="(s, idx) in sections"
            :key="s.id || idx"
            :class="['acc-item', { 'is-open': s.open }]"
          >
          <button
            class="acc-head"
            :class="{ open: s.open }"
            @click="s.open = !s.open"
            @keydown.enter.prevent="s.open = !s.open"
            @keydown.space.prevent="s.open = !s.open"
            :aria-expanded="s.open ? 'true' : 'false'"
            :aria-controls="`acc-panel-${s.id || idx}`"
          >
            <span>{{ s.title }}</span>
          </button>

          <div
            class="acc-body"
            :id="`acc-panel-${s.id || idx}`"
            :style="{ gridTemplateRows: s.open ? '1fr' : '0fr' }"
            role="region"
            :aria-label="s.title"
          >
            <div class="acc-inner">
              <div v-if="isLoading" class="skeleton sk-lines"></div>
              <!-- langsung pakai content_html dari API -->
              <article v-else class="prose" v-html="s.content_html || s.content"></article>
            </div>
          </div>
        </div>
      </section>

      <!-- PROGRAM CARDS -->
      <section class="cards">
        <div v-if="isLoading" class="cards-grid">
          <article v-for="n in 4" :key="'sk'+n" class="card skeleton"></article>
        </div>
        <div v-else class="cards-grid">
          <article v-for="p in programs" :key="p.id" class="card">
            <figure class="thumb">
              <img :src="p.imageUrl" :alt="p.title" loading="lazy" decoding="async" />
              <div class="shade"></div>
              <h3 class="card-title">{{ p.title }}</h3>
            </figure>
            <p class="excerpt" v-html="p.excerpt"></p>
            <div class="actions">
              <component
                :is="internalLink(p.url) ? 'RouterLink' : 'a'"
                :to="internalLink(p.url) ? p.url : undefined"
                :href="!internalLink(p.url) ? p.url : undefined"
                class="btn"
                target="_blank"
                rel="noopener"
                v-bind="internalLink(p.url) ? {} : { target: '_blank', rel: 'noopener' }"
              >
                Read more
              </component>
            </div>
          </article>
        </div>
      </section>

      <!-- HIGHLIGHT NEWS -->
      <section class="news" v-if="highlight.title">
        <h2 class="news-title">{{ highlight.title }}</h2>
        <div class="news-grid">
          <figure class="news-media">
            <div v-if="isLoading" class="skeleton sk-media"></div>
            <img v-else :src="highlight.imageUrl" :alt="highlight.title" />
          </figure>
          <article class="news-body">
            <div v-if="isLoading" class="skeleton sk-lines"></div>
            <div v-else class="prose" v-html="highlight.body"></div>

            <div class="gallery" v-if="!isLoading && (highlight.gallery?.length)">
              <figure v-for="(g, i) in highlight.gallery" :key="i">
                <img :src="g.imageUrl" :alt="g.alt || ('Gallery '+(i+1))" loading="lazy" />
              </figure>
            </div>
          </article>
        </div>
      </section>

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api, absUrl } from '@/api'

const props = defineProps({
  // Endpoint gabungan (disarankan). Dengan baseURL '/api/', maka ini memanggil GET /api/advocacy/
  apiUrl: { type: String, default: 'advocacy/' },

  // Endpoint terpisah (opsional; isi hanya kalau backend dipisah)
  profileUrl:   { type: String, default: '' },   // e.g. 'advocacy/profile/'
  heroUrl:      { type: String, default: '' },   // (ditambahkan) e.g. 'advocacy/hero/'
  sectionsUrl:  { type: String, default: '' },   // e.g. 'advocacy/sections/'
  programsUrl:  { type: String, default: '' },   // e.g. 'advocacy/programs/'
  highlightUrl: { type: String, default: '' },   // e.g. 'advocacy/highlight/'
})

const isLoading = ref(true)
const errorMsg  = ref('')

/* HERO / PROFILE (defaults) */
const hero = ref({
  imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1400&auto=format&fit=crop',
  caption: '',
  alt: 'Program profile'
})
const profileHtml = ref(`<p>The advocacy program run by the Alola Foundation aims to promote women’s rights and strengthen women’s leadership in Timor-Leste. It supports implementation of national action plans and international conventions on women and children’s rights, and collaborates with all programs under Fundasaun Alola.</p>`)

/* ACCORDION SECTIONS (defaults) */
const sections = ref([
  { id:'school',   title:'Prevention of Gender-Based Violence at School Level', open:false, content:'<p>Spotlight project on GBV at school level…</p>' },
  { id:'community',title:'Gender-Based Violence Prevention at Community Level', open:false, content:'<p>With support from UNFPA through ZONTA…</p>' },
  { id:'youth',    title:'Promote Gender Equality & Strengthening Women and Youth Capacity', open:false, content:'<p>Project to implement the National Action Plan on GBV 2022–2032 focusing on prevention…</p>' },
  { id:'profile',  title:'Program Profile (Overview)', open:true, content:'<p>Key achievements during 2023–2024 include…</p>' },
])

/* PROGRAM GRID (defaults) */
const programs = ref([
  { id:1, title:`Women's Resource Cent.`, excerpt:'Program that provides information and support services for women.', imageUrl:'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1400&auto=format&fit=crop', url:'/programs/wrc' },
  { id:2, title:'Municipal Support Project', excerpt:'Strengthening municipal capacity to deliver gender-transformative programs.', imageUrl:'https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?q=80&w=1200&auto=format&fit=crop', url:'/programs/municipal-support' },
  { id:3, title:'Integrated Program', excerpt:'Collaborative actions across education, maternal & child health, economic empowerment, and advocacy.', imageUrl:'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1400&auto=format&fit=crop', url:'/programs/integrated' },
  { id:4, title:'GBV Referral & Network', excerpt:'Assistance & referral network for GBV survivors in liaison with hospitals and local leaders.', imageUrl:'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1200&auto=format&fit=crop', url:'/programs/gbv-referral' },
])

/* NEWS HIGHLIGHT (defaults) */
const highlight = ref({
  title: 'ALOLA RECEIVED A VISIT FROM MCC DELEGATION TO CHANGE SOCIAL BEHAVIOR AND GENDER SOCIAL INCLUSION.',
  imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1400&auto=format&fit=crop',
  body: `<p>...</p>`,
  gallery: [
    { imageUrl:'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=600&auto=format&fit=crop' },
    { imageUrl:'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop' },
    { imageUrl:'https://images.unsplash.com/photo-1522543558187-768b6df7c25c?q=80&w=600&auto=format&fit=crop' }
  ]
})

/* HELPERS */
const internalLink = (u) => u && !/^https?:\/\//i.test(u)
const coalesce = (...vals) => {
  for (const v of vals) {
    if (v !== null && v !== undefined && String(v).trim() !== '') return v
  }
  return ''
}

// --- Normalizers (tahan skema API yang beda-beda) ---
function normalizeHero(h = {}, prev = hero.value){
  return {
    imageUrl: absUrl(coalesce(h.image_url, h.image, h.cover, prev.imageUrl)),
    caption:  coalesce(h.caption, h.credit, ''),
    alt:      coalesce(h.alt, h.title, 'Program profile')
  }
}
function normalizeSection(s = {}, i = 0){
  // simpan dua nama kunci agar template lama/baru sama-sama jalan
  const content_html = coalesce(s.content_html, s.body_html, s.html, s.content, s.body, '')
  return {
    id: s.id ?? `sec-${i}`,
    title: coalesce(s.title, s.heading, `Section ${i+1}`),
    content_html,
    content: content_html,
    open: !!s.open
  }
}
function normalizeProgram(p = {}, i = 0){
  return {
    id: p.id ?? i,
    title: coalesce(p.title, p.name, `Program ${i+1}`),
    excerpt: coalesce(p.excerpt, p.summary, p.subtitle, ''),
    imageUrl: absUrl(coalesce(p.image_url, p.image, p.cover, '')),
    url: coalesce(p.url, p.link, p.route, '#')
  }
}
function normalizeHighlight(h = {}){
  return {
    title: coalesce(h.title, ''),
    imageUrl: absUrl(coalesce(h.image_url, h.image, h.cover, '')),
    body: coalesce(h.body_html, h.html, h.body, ''),
    gallery: (Array.isArray(h.gallery?.results) ? h.gallery.results : (h.gallery || []))
      .map(g => ({ imageUrl: absUrl(coalesce(g.image_url, g.image, '')), alt: g.alt || '' }))
      .filter(g => g.imageUrl)
  }
}

// --- Fetchers ---
async function fetchCombined(url){
  const { data } = await api.get(url)
  return data
}
async function fetchMaybe(url){
  if (!url) return null
  try { const { data } = await api.get(url); return data } catch { return null }
}

onMounted(async () => {
  try {
    let data = null
    try {
      data = await fetchCombined(props.apiUrl)
    } catch (_) {
    }

    const [prof, heroData, secs, progs, high] = await Promise.all([
      fetchMaybe(props.profileUrl),
      fetchMaybe(props.heroUrl),
      fetchMaybe(props.sectionsUrl),
      fetchMaybe(props.programsUrl),
      fetchMaybe(props.highlightUrl),
    ])

    // ===== PROFILE =====
    const profileFromCombined = data?.profile_html ?? data?.profile ?? data?.about_html ?? ''
    profileHtml.value = coalesce(prof?.profile_html, prof?.html, profileFromCombined, profileHtml.value)

    // ===== HERO =====
    const heroFromCombined = data?.hero || {}
    const heroMerged = normalizeHero(heroData || heroFromCombined, hero.value)
    if (heroMerged.imageUrl) hero.value = heroMerged

    // ===== SECTIONS =====
    const rawSections =
      (Array.isArray(secs?.results) ? secs.results : secs) ||
      (Array.isArray(data?.sections?.results) ? data.sections.results : data?.sections) ||
      []
    if (Array.isArray(rawSections) && rawSections.length){
      sections.value = rawSections.map(normalizeSection)
      if (!sections.value.some(x => x.open)) sections.value[0].open = true
    }

    // ===== PROGRAMS =====
    const rawPrograms =
      (Array.isArray(progs?.results) ? progs.results : progs) ||
      (Array.isArray(data?.programs?.results) ? data.programs.results : data?.programs) ||
      []
    if (Array.isArray(rawPrograms) && rawPrograms.length){
      programs.value = rawPrograms.map(normalizeProgram).filter(p => p.imageUrl)
    }

    // ===== HIGHLIGHT =====
    const highlightFrom = high || data?.highlight || null
    if (highlightFrom){
      const h = normalizeHighlight(highlightFrom)
      if (h.title || h.imageUrl || h.body) highlight.value = h
    }

  } catch (e) {
    console.warn('[advocacy] error:', e)
    errorMsg.value = 'Gagal memuat data dari server. Menampilkan konten contoh.'
  } finally {
    isLoading.value = false
  }
})
</script>


<style scoped>
:root{
  --bg:#0fcaa3;
  --panel:#ffffff;
  --line:#e5e7eb;
  --ink:#0b0b0b;
  --muted:#334155;
  --accent:#ef4444;
  --cream:#f9f7ef;
  --shadow:0 10px 28px rgba(2,24,43,.10);
  --radius:16px;
}
.adv-wrap{ background:var(--bg); }
.container{ width:min(1120px,100%); margin-inline:auto; padding-inline:clamp(12px,3vw,22px); }

/* Header */
.adv-head{ padding-block: clamp(16px,3vw,26px); }
.title{
  margin:0; font-size: clamp(24px,2.6vw,34px); font-weight:800; color:#212121;
  text-shadow: 0 1px 0 rgba(0,0,0,.1);
}
.lead{ color:#212121; margin-top:6px; font-size:14px; }

/* Hero */
.hero{ margin-block: clamp(10px,3vw,20px); }
.hero-grid{ display:grid; gap: clamp(12px,2.2vw,18px); grid-template-columns: 1.1fr .9fr; }
@media (max-width: 980px){ .hero-grid{ grid-template-columns: 1fr; } }

.hero-text{
  background: #edfff9; border:1px solid #c9f3ea; border-radius: var(--radius);
  padding: clamp(12px,2vw,16px);
}
.hero-media{
  background: var(--panel); border-radius: var(--radius); overflow:hidden; box-shadow: var(--shadow);
  border:1px solid var(--line);
}
.hero-media img{ width:100%; display:block; }
.hero-media figcaption{ font-size:12px; padding:10px 12px; background:#fdf2e9; border-top:1px solid #f5d7b8; }

/* Prose */
.prose{ color:#0f172a; line-height:1.6; font-size:15px; }
.prose p{ margin: 10px 0; }

/* Accordion */
.acc{ margin-block: clamp(8px,2.6vw,16px); }
.acc-item{
  background:#eafff9;
  border:1px solid #b9ebe3;
  border-radius:12px;
  overflow:hidden;
  margin-bottom:10px;
}

/* Button Header */
.acc-head{
  position:relative;
  width:100%;
  text-align:left;
  background:#d9f7f1;
  border:0;
  cursor:pointer;
  padding:12px 44px;               
  font-weight:800;
  color:#0b0b0b;
  line-height:1.2;
  -webkit-tap-highlight-color:transparent;
  outline:none;                     
}
.acc-head:hover{ background:#d3f4ed; }
.acc-head:focus,
.acc-head:focus-visible{ outline:none; box-shadow:none; } 

.acc-head::before,
.acc-head::after{
  content:"";
  position:absolute;
  top:50%;
  width:12px; height:12px;
  border-right:2px solid #0b3b37;
  border-bottom:2px solid #0b3b37;
  transform:translateY(-50%) rotate(-45deg);
  transition:transform .18s ease, opacity .18s ease;
  opacity:.9;
}
.acc-head::before{ left:16px; }                         
.acc-head::after{ right:16px; transform:translateY(-50%) rotate(135deg);} 
.acc-head.open::before{ transform:translateY(-50%) rotate(45deg); }       
.acc-head.open::after{  transform:translateY(-50%) rotate(-135deg);}      

.acc-body{
  display:grid;
  grid-template-rows:0fr;             
  transition:grid-template-rows .24s ease;
  overflow:hidden;                      
}

.acc-inner{
  min-height:0;
  overflow:hidden;
  padding:0 14px;                       
  border-top:0;
  background:#f4fffb;
}

.acc-item.is-open .acc-body{
  grid-template-rows:1fr;
}
.acc-item.is-open .acc-inner{
  padding:10px 14px;                    
  border-top:1px dashed #b9ebe3;
}

.acc-inner .prose{ margin:0; }
.acc-inner .prose > *:first-child{ margin-top:0; }
.acc-inner .prose > *:last-child{  margin-bottom:0; }

.acc-head[aria-expanded="false"] + .acc-body .acc-inner{
  padding:0 14px; border-top:0;
}
.acc-head[aria-expanded="true"] + .acc-body .acc-inner{
  padding:10px 14px; border-top:1px dashed #b9ebe3;
}

/* Cards */
.cards{ margin-block: clamp(12px,3vw,22px); }
.cards-grid{
  display:grid; gap: clamp(12px,2vw,18px);
  grid-template-columns: repeat(4, minmax(220px,1fr));
}
@media (max-width: 1024px){ .cards-grid{ grid-template-columns: repeat(2,1fr); } }
@media (max-width: 560px){ .cards-grid{ grid-template-columns: 1fr; } }
.card{
  background: var(--panel); border:1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow);
  display:flex; flex-direction:column; overflow:hidden;
}
.thumb{ position:relative; height: 180px; overflow:hidden; }
.thumb img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.thumb .shade{ position:absolute; inset:0; background: linear-gradient(180deg, transparent, rgba(0,0,0,.55)); }
.card-title{
  position:absolute; left:12px; bottom:10px; color:#fff; font-weight:800; text-shadow:0 1px 0 rgba(0,0,0,.3);
}
.excerpt{ padding: 10px 12px; color:#0f172a; font-size:14px; line-height:1.5; min-height: 72px;}
.actions{ padding: 0 12px 12px; }
.btn{
  display:inline-block; height:38px; padding:0 14px; border-radius:999px; background:#0ea5a4; color:#fff; font-weight:800; line-height:38px;
  text-decoration:none; box-shadow:0 8px 16px rgba(14,165,164,.28);
}

/* News */
.news{ margin-block: clamp(12px,3vw,22px); background:#f7fff8; border:1px solid #d9fbe0; border-radius: var(--radius); box-shadow: var(--shadow); padding: clamp(12px,2vw,16px); }
.news-title{ margin:0 0 8px; font-weight:800; color:#0b0b0b; font-size:18px; }
.news-grid{ display:grid; gap: clamp(12px,2vw,16px); grid-template-columns: .9fr 1.1fr; }
@media (max-width: 900px){ .news-grid{ grid-template-columns: 1fr; } }
.news-media{ background:#fff; border:1px solid var(--line); border-radius: 12px; overflow:hidden; }
.news-media img{ width:100%; display:block; }
.news-body .prose{ font-size:14.5px; }
.gallery{ display:grid; grid-template-columns: repeat(3,1fr); gap:8px; margin-top:8px; }
.gallery figure{ border-radius:10px; overflow:hidden; border:1px solid #eef2f7; }
.gallery img{ width:100%; height:100%; object-fit:cover; display:block; }

/* Error */
.error{ color:#b91c1c; background:#fee2e2; border:1px solid #fecaca; border-radius:10px; padding:10px 12px; margin-top:10px; }

/* Skeleton */
.skeleton{ position:relative; overflow:hidden; background:#e5e7eb; border-radius:12px; }
.skeleton::after{
  content:""; position:absolute; inset:0; transform:translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent);
  animation: shimmer 1.1s infinite;
}
.sk-lines{ height: 180px; }
.sk-media{ height: 280px; }
.card.skeleton{ height: 280px; }
@keyframes shimmer{ 100% { transform: translateX(100%); } }
</style>