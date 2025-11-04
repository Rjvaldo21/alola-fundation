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

/* ===== Slides & News From API ===== */
const slides = ref([])
const news   = ref([])

function mapSlide(s) {
  return {
    title: s.title || '',
    subtitle: s.subtitle || '',
    image: absUrl(s.image || ''),   
  }
}

function mapNews(n) {
  return {
    id: n.id,
    title: n.title,
    date: n.published_at,                 
    excerpt: n.excerpt,
    image: absUrl(n.cover_image || ''),
    link: `/news/${n.slug}`,              
  }
}

onMounted(async () => {
  try {
    const [{ data: home }, { data: newsResp }] = await Promise.all([
      api.get('home/'),
      api.get('news/') 
    ])
    slides.value = (home?.slides || []).map(mapSlide)
    news.value   = (newsResp?.results || []).slice(0, 6).map(mapNews)
  } catch (e) {
    console.warn('Failed to load homepage data:', e)
  }
})

/* ===== Spotlight ===== */
const member = {
  name: 'KIRSTY SWORD GUSMAO',
  role: 'KIRSTY SWORD GUSMAO: EDUCATION IS VERYIMPORTANT TO SAVE LIVES, SO THE WORK THAT HALIKU DOES IS VERY IMPORTANT.',
  photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=900&auto=format&fit=crop',
  bio: [
    'Thousands of people live in difficult situations because of cancer and this is a concern for all nations. According to the world data, cancer has killed more than 8 million people and of these, about 4 million people die between the ages of 30 and 69 years.The World Cancer Day. The 4th of February is an recognition of the strength of society in all countries for their efforts and collaboration to create a cancer-free world, including taking real action to close gaps in care for people who are diagnosed with cancer.',
    'Every year, this celebration involves a range of activities and events around the world to increase community consent to prevent early childhood from contributing to cancer. In Timor-Leste, the Alola Foundation, through the HALIKU Sub-program (I chose To Curate) and in collaboration with the National Commission for breast cancer in Timor-Leste (KNKSTL), regularly organised activities to celebrate the World Day."The continuation of HALIKU work is very important. We continue to see women who are presenting breast cancer in an advanced phase because they are more connected to traditional medicines, "reinforcing Ms. Kirsty Sword Gusmao, a founder of Alola and HALIKU.The former First Lady of Timor-Leste  also explained that until now the HALIKU sub-program is a component of the intervention of mothers and children from the Alola Foundation which has provided a reference to hundreds of women, health services to receive diagnosis and treatment. The founder of Alola also asked that fellow women not be ashamed when they experience symptoms of cancer because this factor of shame is an obstacle to being treated properly.'
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
