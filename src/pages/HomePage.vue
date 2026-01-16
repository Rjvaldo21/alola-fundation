<template>
  <div>
    <!-- SLIDE (Hero) -->
    <HeroPage />

    <!-- SPOTLIGHT Under News -->
    <MemberSpotlight :member="member" />

    <!-- Section News -->
    <section class="container news-sec">
      <div class="header-row">
        <h2>Latest News</h2>
        <router-link to="/news" class="more">See all →</router-link>
      </div>

      <!-- optional loading kecil -->
      <div v-if="loading" style="padding:10px 0; color:#6b7280; font-size:14px;">
        Loading latest news...
      </div>

      <div class="grid cols-3">
        <NewsCard v-for="n in news" :key="n.id" :news="n" />
      </div>

      <!-- optional error info -->
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

/** ===============================
 *  DUMMY fallback (biar Vercel aman)
 * =============================== */
const DUMMY_NEWS = [
  {
    id: 1,
    title: 'Supporting Education for Girls in Rural Timor-Leste',
    date: '2024-08-12',
    excerpt:
      'Alola Foundation continues to support girls in remote areas with scholarships, school materials, and mentoring programs.',
    image:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=900&auto=format&fit=crop',
    link: '/news/supporting-education-girls-rural-tl',
  },
  {
    id: 2,
    title: 'Maternal Health Program Expands to New Districts',
    date: '2024-07-25',
    excerpt:
      'Our maternal health initiatives now reach more mothers with essential care, counseling, and safe delivery support.',
    image:
      'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=900&auto=format&fit=crop',
    link: '/news/maternal-health-program-expands',
  },
  {
    id: 3,
    title: 'Women’s Economic Empowerment Through Small Business',
    date: '2024-06-10',
    excerpt:
      'Women entrepreneurs receive training and small grants to grow their businesses and support their families.',
    image:
      'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=900&auto=format&fit=crop',
    link: '/news/womens-economic-empowerment',
  },
  {
    id: 4,
    title: 'Community Advocacy for Child Protection',
    date: '2024-05-03',
    excerpt:
      'Alola works with community leaders to protect children and raise awareness about their rights.',
    image:
      'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?q=80&w=900&auto=format&fit=crop',
    link: '/news/community-advocacy-child-protection',
  },
  {
    id: 5,
    title: 'Volunteer Stories: Making a Difference Together',
    date: '2024-04-18',
    excerpt:
      'Volunteers share their experiences supporting Alola’s programs across Timor-Leste.',
    image:
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=900&auto=format&fit=crop',
    link: '/news/volunteer-stories',
  },
  {
    id: 6,
    title: 'New Learning Centre Opens in Dili',
    date: '2024-03-27',
    excerpt:
      'A new learning centre provides safe space for women and children to learn, connect, and grow.',
    image:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=900&auto=format&fit=crop',
    link: '/news/new-learning-centre-dili',
  },
]

/** ===============================
 *  STATE
 * =============================== */
const news = ref([...DUMMY_NEWS]) // default dummy dulu, nanti dioverwrite kalau fetch sukses
const loading = ref(false)
const errorMsg = ref('')

/** ===============================
 *  SPOTLIGHT (dummy)
 * =============================== */
const member = {
  name: 'KIRSTY SWORD GUSMAO',
  role:
    'KIRSTY SWORD GUSMAO: EDUCATION IS VERY IMPORTANT TO SAVE LIVES, SO THE WORK THAT HALIKU DOES IS VERY IMPORTANT.',
  photo:
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=900&auto=format&fit=crop',
  bio: [
    'Thousands of people live in difficult situations because of cancer and this is a concern for all nations...',
  ],
  socials: { twitter: '#', facebook: '#', instagram: '#' },
}

/** ===============================
 *  HELPERS
 * =============================== */

// API kadang paginated: {results:[...]} atau array langsung
function asList(payload) {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.results)) return payload.results
  return []
}

// bikin URL image jadi absolut kalau backend kirim path relatif
function absUrl(u) {
  if (!u) return ''
  const s = String(u)
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  // kalau backend mengembalikan "/media/..."
  if (s.startsWith('/')) return `${API_BASE}${s}`
  return `${API_BASE}/${s}`
}

// map response news -> format NewsCard kamu
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
    // coba minta 6 item (kalau API support page_size)
    const url = new URL(NEWS_URL)
    url.searchParams.set('page_size', '6')

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const data = await res.json()
    const rows = asList(data).slice(0, 6).map(mapNews)

    // kalau hasilnya kosong, tetap pakai dummy
    if (rows.length) {
      news.value = rows
    } else {
      errorMsg.value = 'News API returned empty list. Showing default content.'
    }
  } catch (e) {
    console.warn('[HomePage] Failed to fetch latest news:', e)
    errorMsg.value = 'Cannot load latest news from server. Showing default content.'
    // news tetap dummy
  } finally {
    loading.value = false
  }
}

onMounted(fetchLatestNews)
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
</style>
