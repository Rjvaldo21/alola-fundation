<template>
  <div>
    <!-- SLIDE -->
    <HeroPage :slides="slides" />

    <!-- SPOTLIGHT Under News -->
    <MemberSpotlight :member="member" />

    <!-- Section News -->
    <section class="container news-sec">
      <div class="header-row">
        <h2>Latest News</h2>
        <router-link to="/news" class="more">See all →</router-link>
      </div>

      <div class="grid cols-3">
        <NewsCard v-for="n in news" :key="n.id" :news="n" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api, absUrl } from '@/api'
import HeroPage from '../components/HeroPage.vue'
import MemberSpotlight from '../components/MemberSpotlight.vue'
import NewsCard from '../components/NewsCard.vue'

/* ===== State ===== */
const slides = ref([])
const news   = ref([])
const loading = ref(true)
const err = ref(null)

/* ===== Utils ===== */
function asList(payload) {
  // Terima: {results:[...]} ATAU [...]
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.results)) return payload.results
  return []
}

function mapSlide(s = {}) {
  // dukung beberapa kemungkinan nama field
  const img = s.image || s.cover_image || s.hero_image || s.bg_image || ''
  return {
    id: s.id ?? s.pk ?? String(Math.random()).slice(2),
    title: s.title || '',
    subtitle: s.subtitle || s.caption || '',
    image: absUrl(img),
    link: s.link || s.cta_url || null,
  }
}

function mapNews(n = {}) {
  const img = n.cover_image || n.image || n.thumbnail || ''
  return {
    id: n.id ?? n.pk,
    title: n.title ?? '',
    date: n.published_at || n.created_at || n.updated_at || '',
    excerpt: n.excerpt || n.summary || '',
    image: absUrl(img),
    link: n.slug ? `/news/${n.slug}` : (n.url || '#'),
  }
}

/* ===== Fetch ===== */
onMounted(async () => {
  loading.value = true
  err.value = null
  try {
    // 1) home (harusnya sudah mengandung slides)
    const [{ data: home }] = await Promise.all([
      api.get('home/'),
    ])

    const homeSlides = asList(home?.slides).map(mapSlide)
    slides.value = homeSlides

    // 2) kalau slides dari home kosong → fallback ke endpoint khusus
    if (slides.value.length === 0) {
      const { data: hs } = await api.get('heroslide/') // alias 'hero-slides/' juga disiapkan
      slides.value = asList(hs).map(mapSlide)
    }

    // 3) news (ambil 6 teratas, dukung paginated/non)
    const { data: newsResp } = await api.get('news/')
    news.value = asList(newsResp).slice(0, 6).map(mapNews)

  } catch (e) {
    console.warn('Failed to load homepage data:', e)
    err.value = e
  } finally {
    loading.value = false
  }
})

/* ===== Spotlight ===== */
const member = {
  name: 'KIRSTY SWORD GUSMAO',
  role: 'KIRSTY SWORD GUSMAO: EDUCATION IS VERY IMPORTANT TO SAVE LIVES, SO THE WORK THAT HALIKU DOES IS VERY IMPORTANT.',
  photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=900&auto=format&fit=crop',
  bio: [
    'Thousands of people live in difficult situations because of cancer and this is a concern for all nations...',
  ],
  socials: { twitter: '#', facebook: '#', instagram: '#' }
}
</script>

<style scoped>
.news-sec{ padding:40px 0 16px; }
.header-row{ display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:16px; }
.header-row h2{ margin:0; font-size:22px; font-weight:600; }
.more{ font-size:14px; text-decoration:none; color:#374151; }
.more:hover{ text-decoration:underline; }
</style>
