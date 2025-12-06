// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
const NewsList   = () => import('@/pages/news/NewsList.vue')
const NewsDetail = () => import('@/pages/news/NewsDetail.vue')
const AboutMCH = () => import('@/pages/program/mch/AboutMCH.vue')
const FacilityBased = () => import('@/pages/program/mch/FacilityBased.vue')

// Halaman utama
import HomePage from '@/pages/HomePage.vue'
import PublicationPage from '@/pages/PublicationPage.vue'
import GetInvolvedPage from '@/pages/GetInvolvedPage.vue'
import GiftCertificates from '@/pages/GiftCertificates.vue'
import ContactPage from '@/pages/ContactPage.vue'
import RadioProgram from '@/pages/RadioProgram.vue'
import MakeDonation from '@/pages/MakeDonation.vue'

// Home submenu (lazy)
const Welcome = () => import('@/pages/Welcome.vue')
const ChairwomensStatement = () => import('@/pages/ChairwomensStatement.vue')
const CEOsRemarks = () => import('@/pages/CEOsRemarks.vue')

// Programs (lazy)
const ProgramsIndex = () => import('@/pages/program/ProgramsIndex.vue')
const ProgramMCH    = () => import('@/pages/program/MCHPage.vue')
const ProgramEdu    = () => import('@/pages/program/EducationPage.vue')
const ProgramWEE    = () => import('@/pages/program/WEEPage.vue')
const ProgramAdv    = () => import('@/pages/program/AdvocacyPage.vue')
const ProgramIntegration = () => import('@/pages/program/IntegrationApproachPage.vue')

// About (lazy)
const About = () => import('@/pages/About.vue')
const AboutFounder = () => import('@/pages/about/Founder.vue')
const AboutHistory = () => import('@/pages/about/History.vue')
const AboutMission = () => import('@/pages/about/Mission.vue')
const AboutStaff = () => import('@/pages/about/Staff.vue')
const AboutSupporter = () => import('@/pages/about/Supporter.vue')
const AboutChildrenCareCenter = () => import('@/pages/about/ChildrenCareCenter.vue')
const AboutAlolaEsperansaAE = () => import('@/pages/about/AlolaEsperansaAE.vue')
const AboutAlolaAustralia = () => import('@/pages/about/AlolaAustralia.vue')
const AboutJobs = () => import('@/pages/about/Jobs.vue')

const routes = [
  { path: '/', name: 'home', component: HomePage, meta: { headerTransparent: true } },

  // ================= Programs (halaman statis lama) =================
  { path: '/program', name: 'programs', component: ProgramsIndex },
  { path: '/program/mch', name: 'program-mch', component: ProgramMCH },
  { path: '/program/mch/about', name: 'program-mch-about', component: AboutMCH, meta: { title: 'About MCH' } },
  { path: '/program/mch/facility-based', name: 'program-mch-facility', component: FacilityBased, meta: { title: 'Facility Based Sub Program' } },
  { path: '/program/education', name: 'program-edu', component: ProgramEdu },
  { path: '/program/wee', name: 'program-wee', component: ProgramWEE },
  { path: '/program/advocacy', name: 'program-adv', component: ProgramAdv },
  { path: '/program/integration-approach', name: 'program-integration', component: ProgramIntegration },

  // ================= Programs (RUTE DINAMIS BARU) =================
  // List dinamis per section (untuk path seperti /program/economic-empowerment)
  {
    path: '/program/:section',
    name: 'program-section',
    // Redirect pintar: petakan alias ke rute statis yang sudah ada
    beforeEnter: (to, _from, next) => {
      const sec = (to.params.section || '').toString().toLowerCase()
      const map = {
        'mch':                    { name: 'program-mch' },
        'education':              { name: 'program-edu' },
        'economic-empowerment':   { name: 'program-wee' },  // alias -> wee
        'wee':                    { name: 'program-wee' },
        'advocacy':               { name: 'program-adv' },
        'integration-approach':   { name: 'program-integration' },
      }
      const target = map[sec]
      if (target) return next({ ...target, replace: true })
      return next({ name: 'not-found', replace: true })
    }
  },
  // Detail dinamis per section + slug (untuk path seperti /program/economic-empowerment/craft-fair)
  {
    path: '/program/:section/:slug',
    name: 'program-detail',
    props: true,
    component: () => import('@/pages/program/ProgramDetail.vue'), // buat 1 komponen generic
    // Jika mau, validasi section di sini:
    beforeEnter: (to, _from, next) => {
      const valid = new Set(['mch','education','wee','economic-empowerment','advocacy','integration-approach'])
      if (!valid.has((to.params.section || '').toString().toLowerCase())) {
        return next({ name: 'not-found', replace: true })
      }
      next()
    }
  },

  // ================= News =================
  { path: '/news', name: 'news-list', component: NewsList },
  { path: '/news/:slug', name: 'news-detail', component: NewsDetail, props: true },

  // ================= Publication & Get Involved =================
  { path: '/publication', name: 'publication', component: PublicationPage },
  { path: '/publication/radio-program', name: 'radio-program', component: RadioProgram },
  { path: '/get-involved', name: 'get-involved', component: GetInvolvedPage },
  { path: '/donate', name: 'donate', component: MakeDonation },
  { path: '/gift-certificates', name: 'gift-certificates', component: GiftCertificates },

  // ================= Contact =================
  { path: '/contact', name: 'contact', component: ContactPage },

  // ================= Home submenu =================
  { path: '/welcome', name: 'welcome', component: Welcome },
  { path: '/chairwomens-statement', name: 'chairwomens-statement', component: ChairwomensStatement },
  { path: '/ceos-remarks', name: 'ceos-remarks', component: CEOsRemarks },

  // ================= About =================
  { path: '/about', name: 'about', component: About },
  { path: '/about/founder', name: 'about-founder', component: AboutFounder },
  { path: '/about/history', name: 'about-history', component: AboutHistory },
  { path: '/about/mission', name: 'about-mission', component: AboutMission },
  { path: '/about/staff', name: 'about-staff', component: AboutStaff },
  { path: '/about/supporter', name: 'about-supporter', component: AboutSupporter },
  { path: '/about/children-care-center', name: 'about-children-care-center', component: AboutChildrenCareCenter },
  { path: '/about/alola-esperansa-ae', name: 'about-alola-esperansa-ae', component: AboutAlolaEsperansaAE },
  { path: '/about/alola-australia', name: 'about-alola-australia', component: AboutAlolaAustralia },
  { path: '/about/jobs', name: 'about-jobs', component: AboutJobs },

  // ================= 404 =================
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFound.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 80, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  if (to.path === '/program' && to.hash) {
    const h = to.hash.toLowerCase()
    const map = {
      '#overview':               { name: 'programs' },          
      '#mch':                    { name: 'program-mch' },
      '#education':              { name: 'program-edu' },
      '#economic-empowerment':   { name: 'program-wee' },
      '#advocacy':               { name: 'program-adv' },
      '#integration-approach':   { name: 'program-integration' },
    }

    const target = map[h]
    if (target) return next({ ...target, replace: true })
  }

  next()
})


export default router
