<template>
  <section class="hero">
    <!-- === CLUSTER DEKOR PERSIS MOCK === -->
    <div class="about-cluster">
      <span class="soft d1"></span>

      <span class="soft d2"></span>

      <span class="dotgrid"></span>
    </div>

    <div class="soft-square a"></div>
    <div class="soft-square b"></div>

    <div class="container hero-inner">
      <div class="copy">
        <h1 class="h1">
          {{ heroTitle || current.title || 'Message from Our Founder & CEO' }}
        </h1>
        <p class="lead">
          {{
            heroSubtitle ||
              current.subtitle ||
              'We work with international startups, help entrepreneurs launch for the long term.'
          }}
        </p>

        <!-- Accordion -->
        <div class="cta-accordion cards" ref="accGroup">
          <details
            v-for="(it, idx) in accordion"
            :key="it.id ?? idx"
            class="toggle card"
          >
            <summary class="chev">{{ it.title }}</summary>
            <div class="panel prose" v-html="it.body_html || it.body || ''"></div>
          </details>
        </div>
      </div>
    </div>

    <!-- === Media Diamond === -->
    <div class="diamond-wrap">
      <div class="border">
        <span class="glow tl"></span>
        <span class="glow tr"></span>
      </div>

      <div class="diamond">
        <!-- YouTube (otomatis dari URL) -->
        <iframe
          v-if="heroYtId"
          class="yt"
          :key="heroYtId"
          :src="embedUrl(heroYtId)"
          title="Hero video"
          frameborder="0"
          allow="autoplay; encrypted-media; picture-in-picture; clipboard-write; accelerometer; gyroscope"
          allowfullscreen
        ></iframe>

        <!-- fallback kalau mau gambar/video lokal -->
        <template v-else-if="current.video">
          <video :src="current.video" autoplay loop muted playsinline></video>
        </template>

        <template v-else-if="current.image">
          <img :src="current.image" alt="" />
        </template>

        <template v-else>
          <div
            style="width:100%;height:100%;display:grid;place-items:center;background:#eef3ff"
          >
            <small>No media</small>
          </div>
        </template>
      </div>

      <div class="shadow"></div>
    </div>
  </section>
</template>

<script setup>
  import {
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    nextTick,
    watch,
  } from 'vue'
  import axios from 'axios'
  
  /* ===============================
     HERO STATIC / DUMMY (AMAN)
  ================================ */
  const heroTitle = ref('Message from Our Founder & CEO')
  const heroSubtitle = ref(
    'A reflection on Alola Foundation’s vision, mission, and long-term commitment to empowering women and strengthening communities in Timor-Leste.'
  )
  
  // Slides (tetap dummy)
  const slides = ref([
    {
      id: 1,
      title: 'Empowering Women & Children',
      subtitle:
        'Alola Foundation works to improve the lives of women and children in Timor-Leste.',
      image: '',
      video: '',
      youtube: 'https://youtu.be/csaObXq0Fhc?si=CsaCA8p4M6N08sLw',
    },
  ])
  
  const current = computed(() => slides.value[0] || {})
  
  /* ===============================
     ACCORDION (API + FALLBACK)
  ================================ */
  
  // Dummy fallback (JANGAN dihapus)
  const dummyAccordion = [
    {
      id: 1,
      title: 'MENSAGEM KIRSTY SWORD GUSMÃO...',
      body_html: `
        <p>Email: <a href="mailto:info@alola.tl">info@alola.tl</a></p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Alola Foundation supports education, maternal and child health, 
          economic empowerment and advocacy programs across Timor-Leste.
        </p>
      `,
    },
    {
      id: 2,
      title: 'A MESSAGE FROM CEO ALOLA',
      body_html: `
        <p>
          Welcome to the Alola Foundation. Our mission is to improve the lives of 
          women and children through education, advocacy and community programs.
        </p>
        <p>
          Together we can build a stronger future for Timor-Leste.
        </p>
      `,
    },
  ]
  
  // State accordion (dipakai template)
  const accordion = ref([...dummyAccordion])
  
  /* ===============================
     FETCH ACCORDION API
  ================================ */
  async function loadAccordion() {
    try {
      const res = await axios.get(
        'https://backend-alola.apps06.tic.gov.tl/api/accordion-items/'
      )
  
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results || []
  
      if (data.length) {
        accordion.value = data.map((it) => ({
          id: it.id,
          title: it.title,
          body_html: it.body_html || it.body || '',
        }))
      }
    } catch (err) {
      console.warn(
        '⚠️ Accordion API failed, using fallback dummy data',
        err
      )
      accordion.value = [...dummyAccordion]
    }
  }
  
  /* ===============================
     YOUTUBE UTILS (TIDAK DIUBAH)
  ================================ */
  const extractId = (urlOrId) => {
    if (!urlOrId) return ''
    let v = String(urlOrId).trim()
    if (/^[A-Za-z0-9_-]{11}$/.test(v)) return v
    const rules = [
      /youtu\.be\/([A-Za-z0-9_-]{11})/,
      /[?&]v=([A-Za-z0-9_-]{11})/,
      /\/embed\/([A-Za-z0-9_-]{11})/,
      /\/shorts\/([A-Za-z0-9_-]{11})/,
    ]
    for (const r of rules) {
      const m = v.match(r)
      if (m && m[1]) return m[1]
    }
    const any = v.match(/([A-Za-z0-9_-]{11})/)
    return any ? any[1] : ''
  }
  
  const heroYtId = computed(() => extractId(current.value.youtube))
  
  const embedUrl = (id) => {
    const v = extractId(id)
    if (!v) return ''
    const qs = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      controls: '0',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
      loop: '1',
      playlist: v,
    })
    return `https://www.youtube-nocookie.com/embed/${v}?${qs.toString()}`
  }
  
  /* ===============================
    ACCORDION UI TOGGLE
  ================================ */
  const accGroup = ref(null)
  let detach = () => {}
  
  async function bindAccordionToggles() {
    await nextTick()
    const root = accGroup.value
    if (!root) return
  
    const items = Array.from(root.querySelectorAll('details.toggle'))
    const onToggle = (ev) => {
      const t = ev.currentTarget
      if (!t.open) return
      items.forEach((d) => {
        if (d !== t) d.open = false
      })
    }
    items.forEach((d) => d.addEventListener('toggle', onToggle))
    detach = () =>
      items.forEach((d) => d.removeEventListener('toggle', onToggle))
  }
  
  watch(accordion, () => bindAccordionToggles())
  
  onMounted(async () => {
    await loadAccordion()
    await bindAccordionToggles()
  })
  
  onBeforeUnmount(() => detach())
</script>  

<style scoped>
/* === General Style === */
.hero{
  position:relative; overflow:hidden; width:100%;
  min-height: clamp(560px, 78vh, 820px);
  background: linear-gradient(180deg,#fff 0%, #f8fbff 100%);
  padding-top: 92px;

  --edge: 20px;
  --diamond-top: clamp(-420px, -38vw, -540px);
  --diamond-right: max(28px, 5vw);
  --diamond-size: clamp(600px, 50vw, 960px);
  --safe-right: clamp(360px, 38vw, 600px);
}
.container.hero-inner{
  position: relative;
  margin-top: 175px;
  z-index: 2;
  padding-right: var(--safe-right);
  max-width: 1200px;
}
.copy .h1{ margin:0 0 6px; font-size: clamp(28px, 4.6vw, 40px); font-weight: 800; color:#111827 }
.copy .lead{ margin: 0 0 12px; color:#374151; font-size: clamp(15px, 2.1vw, 18px) }

/* === Cluster Mock === */
.about-cluster{
  position:absolute; inset:0;
  z-index:0;           
  pointer-events:none;
  transform: translateZ(0);
}

.about-cluster .soft{
  position:absolute; aspect-ratio:1/1;
  transform: rotate(45deg);
  border-radius: 28px;
  background: #eefdff;    
  filter: saturate(105%);
}
.about-cluster .soft.d1{
  width: clamp(140px, 18vw, 220px);
  left: max(-40px, -4vw);
  top:  max(40px, 3vh);
  margin-top: 130px;
  background: #e9fbff;
  opacity:.9;
}
.about-cluster .soft.d2{
  width: clamp(260px, 38vw, 320px);
  left: clamp(-40px, -2vw, 20px);
  top:  clamp(140px, 18vh, 220px);
  margin-top: 130px;
  margin-left: 150px;
  background: #eef7ff;
  border-radius: 36px;
  opacity:.95;
}

.about-cluster .dotgrid{
  position:absolute;
  left: clamp(10px, 3vw, 40px);
  bottom: clamp(14px, 6vh, 80px);
  width: clamp(260px, 28vw, 420px);
  height: clamp(180px, 20vw, 320px);
  --dot: radial-gradient(circle at center, rgba(0,0,0,.12) 1.2px, transparent 1.3px);
  background-image: var(--dot);
  background-size: 18px 18px;
  opacity:.25;
}

/* === Diamond Media === */
.diamond-wrap{
  position:absolute; z-index: 1;
  top: var(--diamond-top); right: var(--diamond-right);
  width: var(--diamond-size); aspect-ratio:1/1;

  --ring: clamp(16px, 1.6vw, 26px);
  --r-outer: 48px;                 
  --r-inner: calc(var(--r-outer) - var(--ring));
}

.border{
  position:absolute; inset:0;
  transform:rotate(45deg);
  border-radius: var(--r-outer);
  background: transparent;       
}
.border::before{
  content:"";
  position:absolute; inset:0;
  border-radius: var(--r-outer);
  background: linear-gradient(180deg, #1aa0ff 0%, #0e6bff 100%);
  box-shadow:
    0 20px 48px rgba(29,161,242,.35),
    0 0 0 10px rgba(29,161,242,.10);
}
.border::after{
  content:"";
  position:absolute;
  inset: var(--ring);
  border-radius: var(--r-inner);
  background: #ffffff;           
}

.diamond{
  position:absolute; inset: var(--edge);
  transform:rotate(45deg);
  overflow:hidden; border-radius:40px; background:#000;
}

.diamond iframe.yt{
  position:absolute;
  top: 75%;
  left: 70%;
  width: 150%;
  height: 150%;
  transform: translate(-50%, -50%) rotate(-45deg);
  transform-origin: 50% 50%;
  display:block;
}

iframe.yt{ pointer-events:auto; }

.glow{ position:absolute; width:36%; height:36%; background: radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,.95), rgba(255,255,255,0)); filter: blur(6px); opacity:.85; pointer-events:none; }
.glow.tl{ top:-6%; left:-6%; border-top-left-radius:48px }
.glow.tr{ top:-6%; right:-6%; border-top-right-radius:48px }
.shadow{ position:absolute; inset:30px; transform:rotate(45deg); background: radial-gradient(45% 45% at 50% 70%, rgba(30,160,255,0.18), rgba(255,255,255,0)); border-radius:42px; filter: blur(10px); }

.cta-accordion.cards{ display:flex; flex-direction:column; gap:12px; margin-top: 16px; }
.toggle.card{ border:1px solid #e5e7eb; border-radius:14px; background:rgba(255,255,255,.92); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); box-shadow: 0 6px 24px rgba(0,0,0,.06); overflow: clip; transition: border-color .2s ease, box-shadow .2s ease, background .2s ease; }
.toggle.card[open]{ border-color:#1da1f2; box-shadow: 0 10px 34px rgba(29,161,242,.18); background:#f9fcff; }
.toggle.card > summary::-webkit-details-marker{ display:none; }
.toggle.card > summary{ list-style:none; }
.chev{ position:relative; display:flex; align-items:center; gap:10px; padding:12px 16px; font-weight:700; color:#0d6efd; cursor:pointer; user-select:none; }
.chev::before{ content:""; width:.55em; height:.55em; border-right:2px solid currentColor; border-bottom:2px solid currentColor; transform: rotate(-45deg); opacity:.28; margin-right:2px; }
.chev::after{ content:""; margin-left:auto; width:.6em; height:.6em; border-right:2px solid currentColor; border-bottom:2px solid currentColor; transform: rotate(-45deg); transition: transform .2s ease; }
.toggle.card[open] .chev::after{ transform: rotate(45deg); }
.panel{ padding: 0 16px 14px 16px; color:#374151; line-height:1.7; text-wrap: pretty; hyphens:auto; max-height: clamp(180px, 28vh, 360px); overflow:auto; -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 12px, black calc(100% - 12px), transparent 100%); mask-image: linear-gradient(to bottom, transparent 0, black 12px, black calc(100% - 12px), transparent 100%); }
.prose p{ margin: 10px 0; }
.panel::-webkit-scrollbar{ width:8px }
.panel::-webkit-scrollbar-thumb{ background:#cfe8ff; border-radius:8px }
.panel::-webkit-scrollbar-thumb:hover{ background:#a8d4ff }

@media (max-width: 1280px){
  .hero{
    --diamond-size: clamp(560px, 48vw, 860px);
    --diamond-top: clamp(-240px, -22vw, -320px);
    --safe-right: clamp(320px, 36vw, 560px);
    --diamond-right: max(24px, 4.5vw);
  }
}
@media (max-width: 1100px){
  .hero{
    --diamond-size: clamp(520px, 46vw, 780px);
    --diamond-top: clamp(-180px, -18vw, -260px);
    --safe-right: clamp(280px, 34vw, 520px);
  }
}
@media (max-width: 980px){
  .container.hero-inner{ padding-right: 0; }
  .cta-accordion.cards{ gap:10px }
  .chev{ padding:11px 14px }
  .panel{ max-height: 40vh }

  .diamond-wrap{
    position:relative; right:auto; top:auto; margin:18px auto 0;
    width:min(92%, 620px); aspect-ratio:16/9; z-index: 0;
  }
  .border, .diamond, .shadow{ transform:none; border-radius:24px }
  .diamond{ inset:12px }
  .diamond :is(video, img, iframe.yt){
    top:0; left:0; width:100%; height:100%;
    transform:none; object-fit:cover;
  }

  .about-cluster .soft.d1{ width: 26vw; }
  .about-cluster .soft.d2{ width: 48vw; }
  .about-cluster .dotgrid{ width: 60vw; height: 34vw; }
}
</style>
