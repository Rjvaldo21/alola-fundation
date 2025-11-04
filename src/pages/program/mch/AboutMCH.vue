<template>
    <main class="aboutmch" role="main">
      <!-- ===== HERO ===== -->
      <section class="hero">
        <div class="container">
          <div class="cols">
            <figure class="media">
              <img :src="heroUrl" :alt="page.title || 'About MCH'" loading="eager" />
            </figure>
  
            <!-- Sidebar kanan: quick links (bisa dari API) -->
            <aside class="side">
              <h3 class="side-title">More on MCH</h3>
              <ul class="side-links">
                <li v-for="(l,i) in rightLinks" :key="i">
                  <RouterLink :to="l.to">{{ l.label }}</RouterLink>
                </li>
              </ul>
  
              <!-- Galeri kecil -->
              <div class="thumbs">
                <img
                  v-for="(g,i) in galleryThumbs"
                  :key="i"
                  :src="absUrl(g)"
                  alt=""
                  loading="lazy"
                />
              </div>
            </aside>
          </div>
  
          <h1 class="title">
            {{ page.title || 'MCH Goals: Contribute to the Reduction of Maternal and Child Mortality in Timor-Leste' }}
          </h1>
  
          <!-- ===== BODY ===== -->
          <article class="body content">
            <div v-if="loading" class="skeleton">
              <div class="line" v-for="n in 12" :key="n"></div>
            </div>
  
            <div v-else v-html="page.body_html || page.bodyHtml || fallbackHtml"></div>
          </article>
  
          <!-- ===== STATS BAR (background hijau) ===== -->
          <section v-if="statsHtml" class="stats content" v-html="statsHtml"></section>
  
          <!-- ===== VIDEO ===== -->
          <section v-if="youtubeId" class="video">
            <div class="ratio">
              <iframe
                :src="`https://www.youtube.com/embed/${youtubeId}`"
                title="MCH Video"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
          </section>
  
          <!-- ===== SHARE ===== -->
          <div class="share">
            <span>Share:</span>
            <button class="btn" @click="share('facebook')">Facebook</button>
            <button class="btn" @click="share('x')">X</button>
            <button class="btn" @click="share('whatsapp')">WhatsApp</button>
            <button class="btn" @click="copy">Copy Link</button>
          </div>
        </div>
      </section>
    </main>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  
  // Data utama
  const loading = ref(true)
  const page = ref({
    title: '',
    hero_image: '',
    body_html: '',
    stats_html: '',        // blok hijau
    youtube_url: '',
    gallery: [],           // array path gambar
    right_links: [],       // [{label,to}]
  })
  
  // Fallback links sidebar (sesuai menu baru)
  const rightLinks = computed(() => {
    if (page.value.right_links?.length) return page.value.right_links
    return [
      { label: 'About MCH', to: '/program/mch/about' },
      { label: 'Facility Based Sub Program', to: '/program/mch/facility-based' },
      { label: 'Community Based – Sub Program', to: '/program/mch/community-based' },
      { label: "Women’s Cancer Raising Awareness", to: '/program/mch/womens-cancer-awareness' },
      { label: 'MCH Success Story', to: '/program/mch/success-stories' },
    ]
  })
  
  const absUrl = (p) => (!p ? '' : p.startsWith('http') ? p : `${API_BASE}${p}`)
  const heroUrl = computed(() =>
    absUrl(page.value.hero_image) ||
    'https://images.unsplash.com/photo-1542736667-069246bdbc74?q=80&w=1600&auto=format&fit=crop'
  )
  const statsHtml = computed(() => page.value.stats_html || page.value.statsHtml || '')
  const galleryThumbs = computed(() => page.value.gallery?.slice(0, 8) || [])
  
  // Ambil YouTube ID dari url (short/long)
  const youtubeId = computed(() => {
    const url = page.value.youtube_url || page.value.youtube || ''
    if (!url) return ''
    try {
      const u = new URL(url)
      if (u.hostname.includes('youtu.be')) return u.pathname.substring(1)
      if (u.searchParams.get('v')) return u.searchParams.get('v')
      // /embed/ID
      const m = u.pathname.match(/\/embed\/([^/]+)/)
      return m ? m[1] : ''
    } catch { return '' }
  })
  
  const fallbackHtml = `
    <p>To contribute to SDG targets and the National Strategic Development Plan, Alola’s MCH program continues to strengthen promotion, education, and support on infant and young child feeding, women’s cancer awareness, referral and treatment, maternal and newborn care, nutrition, and WASH programs.</p>
  `
  
  // Fetch konten dari backend (silakan sesuaikan endpoint)
  async function load() {
    loading.value = true
    try {
      // Kandidat endpoint:
      const urls = [
        `${API_BASE}/api/program-sections/mch/about/`,
        `${API_BASE}/api/public/pages/program/mch/about/`,
        `${API_BASE}/api/program/mch/about/`,
      ]
      for (const u of urls) {
        try {
          const { data } = await axios.get(u)
          page.value = {
            title: data.title || 'About MCH',
            hero_image: data.hero_image || data.image || data.cover || '',
            body_html: data.body_html || data.content_html || data.html || '',
            stats_html: data.stats_html || '',
            youtube_url: data.youtube_url || data.youtube || '',
            gallery: Array.isArray(data.gallery) ? data.gallery : (data.gallery_images || []),
            right_links: Array.isArray(data.right_links) ? data.right_links : [],
          }
          break
        } catch {}
      }
    } finally {
      loading.value = false
    }
  }
  onMounted(load)
  
  // Share
  const currentUrl = () => window.location.href
  function share(net){
    const url = encodeURIComponent(currentUrl())
    const text = encodeURIComponent(page.value.title || 'About MCH')
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
  .aboutmch .hero{ background:#efeaf2; padding: 24px 0 40px; }
  .container{ max-width: 1200px; margin:0 auto; padding:0 20px; }
  
  .cols{ display:grid; grid-template-columns: 1fr 320px; gap:16px; align-items:start; }
  .media img{ width:100%; height:auto; display:block; border-radius:6px; }
  
  .side-title{ margin:0 0 8px; font-weight:800; font-size:16px; }
  .side-links{ list-style:none; margin:0 0 12px; padding:0; }
  .side-links li{ margin:6px 0; }
  .side-links a{ text-decoration:none; color:#0a3a34; }
  .side-links a:hover{ text-decoration:underline; }
  
  .thumbs{ display:grid; grid-template-columns: repeat(2,1fr); gap:8px; }
  .thumbs img{ width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:6px; }
  
  .title{ margin:14px 0; font-weight:900; font-size:clamp(20px,3vw,24px); color:#8a3f16; }
  
  .content :deep(p){ line-height:1.8; margin:0 0 14px; color:#1f2937; }
  .content :deep(a){ color:#0a3a34; }
  
  .stats{
    margin:18px 0; padding:14px; border-radius:6px;
    background:#0a8a3a; color:#fff;
  }
  .stats :deep(p), .stats :deep(li), .stats :deep(td){ color:#fff; }
  
  .video .ratio{
    position:relative; width:100%; padding-bottom:56.25%;
    background:#000; border-radius:6px; overflow:hidden;
  }
  .video iframe{ position:absolute; inset:0; width:100%; height:100%; }
  
  .share{ display:flex; align-items:center; gap:10px; margin-top:14px; flex-wrap:wrap; }
  .btn{
    height:34px; padding:0 12px; border-radius:999px; border:1px solid #e5e7eb;
    background:#fff; cursor:pointer; font-weight:600;
  }
  .skeleton .line{
    height: 12px; border-radius: 8px; margin: 10px 0;
    background: linear-gradient(90deg,#eaeef2,#f6f8fb,#eaeef2);
    background-size: 200% 100%; animation: shimmer 1.2s infinite;
  }
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  
  @media (max-width: 980px){
    .cols{ grid-template-columns: 1fr; }
  }
  </style>
  