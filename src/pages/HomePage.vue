<template>
  <div>
    <!-- SLIDE (Hero) -->
    <HeroPage />

    <!-- SPOTLIGHT Under News -->
    <MemberSpotlight v-if="member" :member="member" />

    <!-- Section News -->
    <section class="container news-sec">
      <div class="header-row">
        <h2>Latest News</h2>
        <router-link to="/news" class="more">See all →</router-link>
      </div>

      <div v-if="loading" style="padding:10px 0; color:#6b7280; font-size:14px;">
        Loading latest news...
      </div>

      <div class="grid cols-3">
        <NewsCard v-for="n in news" :key="n.id" :news="n" />
      </div>

      <div v-if="errorMsg" style="margin-top:10px; color:#b91c1c; font-size:13px;">
        {{ errorMsg }}
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeroPage from '../components/HeroPage.vue'
import MemberSpotlight from '../components/MemberSpotlight.vue'
import NewsCard from '../components/NewsCard.vue'

/** ===============================
 *  CONFIG
 * =============================== */
const API_BASE = 'https://backend-alola.apps06.tic.gov.tl'
const NEWS_URL = `${API_BASE}/api/news/`
const SUPPORTERS_URL = `${API_BASE}/api/supporters/`

/** ===============================
 *  STATE
 * =============================== */
const news = ref([])
const loading = ref(false)
const errorMsg = ref('')

/** ===============================
 *  SPOTLIGHT (WITHOUT FALLBACK)
 * =============================== */
const member = ref(null)

/** ===============================
 *  HELPERS
 * =============================== */
function asList(payload) {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.results)) return payload.results
  return []
}

function absUrl(u) {
  if (!u) return ''
  const s = String(u)
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  if (s.startsWith('/')) return `${API_BASE}${s}`
  return `${API_BASE}/${s}`
}

function mapNews(n = {}) {
  const img = n.cover_image || n.image || n.thumbnail || n.cover || ''
  const slug = n.slug || n.code || ''
  return {
    id: n.id ?? n.pk ?? crypto.randomUUID(),
    title: n.title || n.name || '',
    date: n.published_at || n.created_at || n.updated_at || n.date || '',
    excerpt: n.excerpt || n.summary || n.short_description || '',
    image: absUrl(img),
    link: slug ? `/news/${slug}` : '/news',
  }
}

/** ===============================
 *  FETCH LATEST NEWS
 * =============================== */
async function fetchLatestNews() {
  loading.value = true
  errorMsg.value = ''
  try {
    const url = new URL(NEWS_URL)
    url.searchParams.set('page_size', '6')

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    const rows = asList(data).slice(0, 6).map(mapNews)

    if (rows.length) {
      news.value = rows
    } else {
      news.value = []
      errorMsg.value = 'News API returned empty list.'
    }
  } catch (e) {
    console.warn('[HomePage] Failed to fetch latest news:', e)
    news.value = []
    errorMsg.value = 'Cannot load latest news from server.'
  } finally {
    loading.value = false
  }
}

/** ===============================
 *  FETCH SUPPORTERS (Spotlight)
 * =============================== */
async function fetchSupporter() {
  try {
    const url = new URL(SUPPORTERS_URL)
    url.searchParams.set('ordering', 'order')

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    const rows = asList(data)
    if (!rows.length) return

    const top = rows[0]

    const bioText = (top.bio_html || '').trim()
    const bioParts = bioText
      ? bioText.split(/\r?\n\r?\n+/).map(s => s.trim()).filter(Boolean)
      : []

    member.value = {
      name: top.name,
      role: bioParts[0] || '',            
      bio: bioParts.slice(1),              
      photo: top.logo ? absUrl(top.logo) : '',
      socials: {
        facebook: top.link_url || '',
        twitter: '',
        instagram: '',
      },
    }
  } catch (e) {
    console.warn('[HomePage] Failed to fetch supporters:', e)
    member.value = null
  }
}

onMounted(() => {
  fetchLatestNews()
  fetchSupporter()
})
</script>

<style scoped>
.news-sec {
  padding: 40px 0 16px;
}
.header-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;
}
.header-row h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}
.more {
  font-size: 14px;
  text-decoration: none;
  color: #374151;
}
.more:hover {
  text-decoration: underline;
}

:deep(.member-spotlight img) {
  width: 520px !important;
  height: 620px !important;
  object-fit: cover !important;
  border-radius: 18px !important;
}

:deep(.member-spotlight h1),
:deep(.member-spotlight h2),
:deep(.member-spotlight .title),
:deep(.member-spotlight .role),
:deep(.member-spotlight .headline) {
  font-size: 14px !important;
  font-weight: 500 !important;
  line-height: 1.6 !important;
  color: #6b7280 !important;
  letter-spacing: .02em !important;
  text-transform: none !important;
  margin: 8px 0 16px !important;
}

:deep(.member-spotlight .name){
  font-size: 28px !important;     
  line-height: 1.15 !important;
  text-transform: none !important; 
  letter-spacing: 0 !important;
  margin: 0 0 10px !important;
}

:deep(.member-spotlight .para){
  font-size: 14px !important;
  line-height: 1.7 !important;
}

</style>
