<template>
    <main class="progdetail" role="main">
      <section class="hero">
        <div class="container">
          <nav class="crumb">
            <RouterLink to="/program">Program</RouterLink>
            <span>/</span>
            <RouterLink :to="`/program#${category}`">{{ categoryTitle }}</RouterLink>
            <span>/</span>
            <span aria-current="page">{{ pageTitle }}</span>
          </nav>
          <h1>{{ pageTitle }}</h1>
          <p v-if="summary" class="lead">{{ summary }}</p>
        </div>
      </section>
  
      <section class="container">
        <div v-if="loading" class="skeleton">
          <div class="line" v-for="n in 12" :key="n"></div>
        </div>
  
        <article v-else class="content">
          <div v-if="html" v-html="html"></div>
          <template v-else>
            <p>
              Content for <strong>{{ pageTitle }}</strong> will appear here. 
              Please update this page content from the admin panel.
            </p>
          </template>
        </article>
      </section>
    </main>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import axios from 'axios'
  
  const props = defineProps({
    category: { type: String, required: true },   
    slug:     { type: String, required: true },   
    title:    { type: String, required: true },   
  })
  
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  
  const loading = ref(true)
  const html    = ref('')
  const summary = ref('')
  
  const categoryTitle = computed(() => {
    const map = {
      mch: 'Maternal and Child Health',
      education: 'Education',
      'economic-empowerment': 'Economic Empowerment',
      advocacy: 'Advocacy'
    }
    return map[props.category] || props.category
  })
  
  const pageTitle = computed(() => props.title)
  
  // Helper
  const tryFetch = async (url) => {
    try {
      const { data } = await axios.get(url)
      // adapt to various backend shapes
      html.value = data?.content_html || data?.body_html || data?.html || ''
      summary.value = data?.summary || data?.intro || ''
      return !!html.value
    } catch (e) {
      return false
    }
  }
  
  // Coba beberapa endpoint umum (silakan sesuaikan dengan backend kamu)
  async function fetchContent() {
    loading.value = true
    html.value = ''
    summary.value = ''
  
    const candidates = [
      // 1) page by canonical slug
      `${API_BASE}/api/public/pages/program/${props.category}/${props.slug}/`,
      // 2) program sections pattern
      `${API_BASE}/api/program-sections/${props.category}/${props.slug}/`,
      // 3) generic program item
      `${API_BASE}/api/program/${props.category}/${props.slug}/`,
    ]
  
    // jalan satu per satu sampai dapat
    for (const url of candidates) {
      const ok = await tryFetch(url)
      if (ok) break
    }
  
    loading.value = false
  }
  
  onMounted(fetchContent)
  watch(() => [props.category, props.slug], fetchContent)
  </script>
  
  <style scoped>
  .progdetail .hero{ background:#f8fafc; padding:96px 20px 28px; }
  .container{ max-width:1200px; margin:0 auto; padding:0 20px; }
  .crumb{ display:flex; align-items:center; gap:8px; color:#6b7280; font-size:14px; }
  .crumb a{ color:#6b7280; text-decoration:none; }
  .crumb a:hover{ text-decoration:underline; }
  h1{ margin:8px 0 8px; font-size:clamp(26px,4vw,36px); font-weight:900; }
  .lead{ color:#4b5563; max-width:800px }
  
  .skeleton .line{
    height: 12px; border-radius: 8px; margin: 10px 0;
    background: linear-gradient(90deg,#eaeef2,#f6f8fb,#eaeef2);
    background-size: 200% 100%; animation: shimmer 1.2s infinite;
  }
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  
  .content :deep(img){ max-width:100%; height:auto; }
  .content :deep(h2){ margin-top:24px; font-size:22px; font-weight:800; }
  .content :deep(p){ line-height:1.8; margin:0 0 14px; }
  </style>
  