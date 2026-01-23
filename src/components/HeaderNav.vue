<template>
  <header ref="headerEl" class="site-header" :class="{ transparent: isTransparent, scrolled }">
    <div class="inner">
      <RouterLink to="/" class="brand" @click="closeAll">
        <img v-if="siteLogo" class="logo" :src="siteLogo" :alt="brandTitle" />
        <svg v-else width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true" class="logo">
          <circle cx="24" cy="24" r="22" fill="#e6f0ff"/>
          <path d="M24 44S6 33 6 20c0-6.6 5.4-12 12-12 3.46 0 6.57 1.61 8.5 4 1.93-2.39 5.04-4 8.5-4 6.63 0 12 5.4 12 12 0 13-18 24-18 24h-5Z" fill="#9ab6ff"/>
        </svg>

        <div class="brand-text">
          <div class="brand-title">{{ brandTitle }}</div>
          <div class="brand-sub">{{ brandSub }}</div>
        </div>
      </RouterLink>

      <!-- ========= NAV DROPDOWN ========= -->
      <nav class="nav dropdown" aria-label="Main">
        <div
          v-for="item in menus"
          :key="item.name"
          class="menu-item"
          @mouseenter="openMenu(item.name)"
          @mouseleave="scheduleClose"
        >
          <RouterLink
            :to="item.to"
            class="toplink"
            :class="{ active: $route.name===item.name }"
            :aria-haspopup="item.children?.length ? 'true' : 'false'"
            :aria-expanded="hover===item.name ? 'true' : 'false'"
            @focus="openMenu(item.name)"
            @blur="scheduleClose"
            @click="handleTopClick"
          >
            {{ item.label }} <span class="caret" aria-hidden="true">▾</span>
          </RouterLink>

          <ul
              v-if="item.children?.length"
              class="submenu"
              :class="{ show: hover===item.name }"
              @mouseenter="openMenu(item.name)"
              @mouseleave="scheduleClose"
            >
            <li
              v-for="child in item.children"
              :key="child.to"
              class="submenu-item"
              :class="{ hasChildren: child.children?.length }"
            >
              <RouterLink :to="child.to" class="subLink" @click="closeAll">
                <span>{{ child.label }}</span>
                <span v-if="child.children?.length" class="chev">▸</span>
              </RouterLink>

              <!-- flyout (level-2) -->
              <ul v-if="child.children?.length" class="submenu flyout">
                <li v-for="g in child.children" :key="g.to">
                  <RouterLink :to="g.to" class="subLink" @click="closeAll">
                    {{ g.label }}
                  </RouterLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <RouterLink to="/donate" class="donate" @click="closeAll">Donate</RouterLink>
      </nav>

      <!-- ========= NAV LEGACY ========= -->
      <nav class="nav legacy">
        <RouterLink to="/" @click="closeAll">Home</RouterLink>
        <RouterLink to="/program" @click="closeAll">Program</RouterLink>
        <RouterLink to="/publication" @click="closeAll">Publication</RouterLink>
        <RouterLink to="/get-involved" @click="closeAll">Get involved</RouterLink>
        <RouterLink to="/contact" @click="closeAll">Contact</RouterLink>
        <RouterLink to="/donate" class="donate" @click="closeAll">Donate</RouterLink>
      </nav>

      <button class="hamburger" @click="mobileOpen = !mobileOpen" :aria-expanded="mobileOpen">☰</button>
    </div>

    <!-- ========= Mobile Sheet ========= -->
    <transition name="fade">
      <div v-if="mobileOpen" class="mobile" @click.self="mobileOpen=false">
        <div class="sheet">
          <RouterLink to="/" @click="closeAll">Home</RouterLink>
          <RouterLink to="/program" @click="closeAll">Program</RouterLink>
          <RouterLink to="/publication" @click="closeAll">Publication</RouterLink>
          <RouterLink to="/get-involved" @click="closeAll">Get involved</RouterLink>
          <RouterLink to="/contact" @click="closeAll">Contact</RouterLink>
          <RouterLink to="/donate" class="donate" @click="closeAll">Donate</RouterLink>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api, absUrl } from '@/api'

const route = useRoute()

// ====== State logo & brand dari API ======
const site = ref(null)
const brandTitle = computed(() => site.value?.site_name || 'ALOLA FUNDATION')
const brandSub = computed(() => site.value?.tagline || site.value?.hero_subtitle || 'Strong Women Strong Nation')
const siteLogo   = computed(() => site.value?.logo ? absUrl(site.value.logo) : '')

// ====== Ref & UI state header ======
const headerEl   = ref(null)
const scrolled   = ref(false)
const mobileOpen = ref(false)
const hover      = ref(null)
const closeTimer = ref(null)

// ====== Dropdown helpers ======
const openMenu = (name) => {
  if (closeTimer.value) { clearTimeout(closeTimer.value); closeTimer.value = null }
  hover.value = name
}
const scheduleClose = () => {
  if (closeTimer.value) clearTimeout(closeTimer.value)
  closeTimer.value = setTimeout(() => {
    hover.value = null
    closeTimer.value = null
  }, 180)
}
const closeAll = () => {
  if (closeTimer.value) { clearTimeout(closeTimer.value); closeTimer.value = null }
  hover.value = null
  mobileOpen.value = false
}
const handleTopClick = () => closeAll()

/* ===== DROPDOWN DATA (tetap) ===== */
const menus = [
  {
    label: 'Home',
    to: '/',
    name: 'home',
    children: [
    { label: 'Welcome – Bemvindo', to: '/page/welcome' },
    { label: 'Chairwomen’s Statement', to: '/page/chairwomens-statement' },
    { label: 'CEO’s Remarks', to: '/page/ceos-remarks' },
      { label: 'About Us',to: '/about',
        children: [
          { label: 'Founder', to: '/about/founder' },
          { label: 'History', to: '/about/history' },
          { label: 'Mission', to: '/about/mission' },
          { label: 'Staff', to: '/about/staff' },
          { label: 'Supporter', to: '/about/supporter' },
          { label: 'Children Care Center', to: '/about/children-care-center' },
          { label: 'Alola Esperansa (AE)', to: '/about/alola-esperansa-ae' },
          { label: 'Alola Australia', to: '/about/alola-australia' },
          { label: 'Current Jobs Available', to: '/about/jobs' },
        ],
      },
    ],
  },
  {
  label: 'Program',
  to: '/program',
  name: 'program',
  children: [
    { label: 'Overview', to: '/program#overview' },

    // MCH
    { label: 'Maternal and Child Health', to: '/program#mch', children: [
      { label: 'About MCH', to: '/program/mch/about' },
      { label: 'Facility Based Sub Program', to: '/program/mch/facility-based' },
      { label: 'Community Based – Sub Program', to: '/program/mch/community-based' },
      { label: "Women's Cancer Raising Awareness", to: '/program/mch/womens-cancer-awareness' },
      { label: 'MCH Success Story', to: '/program/mch/success-stories' },
    ]},

    // EDUCATION
    { label: 'Education', to: '/program#education', children: [
      { label: 'Scholarships Project', to: '/program/education/scholarships' },
      { label: 'Alola Mobile Library Project', to: '/program/education/mobile-library' },
      { label: 'Teacher Training Project', to: '/program/education/teacher-training' },
      { label: 'Alternative Preschool', to: '/program/education/alternative-preschool' },
    ]},

    // ECONOMIC EMPOWERMENT
    { label: 'Economic Empowerment', to: '/program#economic-empowerment', children: [
      { label: 'Handicraft Development Project', to: '/program/economic-empowerment/handicraft' },
      { label: 'Alola Craft Fair', to: '/program/economic-empowerment/craft-fair' },
      { label: 'Improving Economy for Rural Women', to: '/program/economic-empowerment/rural-women' },
      { label: '“Preserva Identidade Kultural Orijinal Timor-Leste”', to: '/program/economic-empowerment/preserva-identidade' },
      { label: 'Success Story', to: '/program/economic-empowerment/success-stories' },
    ]},

    // ADVOCACY
    { label: 'Advocacy', to: '/program#advocacy', children: [
      { label: 'WRC-Alola', to: '/program/advocacy/wrc-alola' },
      { label: 'District Support Project', to: '/program/advocacy/district-support' },
      { label: 'Success Story from Citizen Forum', to: '/program/advocacy/citizen-forum-success' },
    ]},

    { label: 'Integration Approach', to: '/program#integration-approach' },
  ],
},

{ 
  label: 'Publication', 
  to: '/publication', 
  name: 'publication', 
  children: [
    { label: 'Radio Program', to: '/publication/radio-program' },

    // ✅ Social Media + submenu
    { 
      label: 'Social Media', 
      to: '/publication#social-media',
      children: [
        { label: 'SERBISU HAMUTUK HODI MANAN LUTA BA TIMOR-LESTE SAUDÁVEL LIU-TAN', to: '/publication#servisu-hamutuk' },
        { label: 'EVENTU : “Tinan Internasional ba Lian Indíjenas”', to: '/publication#eventu' },
        { label: 'HHALIKU FUNDRAISING NIGHT 2025', to: '/publication#haliku' },
      ]
    },
  ]
},

  { label: 'Get Involved', to: '/get-involved', name: 'get-involved', children: [
    { label: 'Gift Certificates', to: '/gift-certificates' },
    { label: 'Make A Donation', to: '/donate' },
  ]},
  { label: 'Contact', to: '/contact', name: 'contact', children: [
    { label: 'Contact Us', to: '/contact' },
    { label: 'Find Us on Google Map', to: '/contact#map' },
  ]},
]

// ===== Transparent header logic =====
const onScroll = () => { scrolled.value = window.scrollY > 8 }
const onDocClick = (e) => {
  if (headerEl.value && !headerEl.value.contains(e.target)) closeAll()
}
const onKeydown = (e) => { if (e.key === 'Escape') closeAll() }

const wantsTransparent = computed(() => route.meta?.headerTransparent === true)
const isTransparent    = computed(() => wantsTransparent.value && !scrolled.value)

// ===== Mount & Cleanup (SATU KALI SAJA) =====
onMounted(async () => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onDocClick, true)
  window.addEventListener('keydown', onKeydown)

  // Fetch SiteSettings dari /api/home/
  try {
    const { data } = await api.get('home/')
    site.value = data?.site || null
  } catch (e) {
    console.warn('Failed to load home site settings:', e)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onDocClick, true)
  window.removeEventListener('keydown', onKeydown)
  if (closeTimer.value) clearTimeout(closeTimer.value)
})

// Tutup dropdown saat route berubah & re-evaluasi header
watch(() => route.fullPath, () => {
  closeAll()
  onScroll()
})
</script>


<style scoped>
/* ======== STYLES ======== */
.site-header{
  position:fixed; inset:0 0 auto 0; height:64px;
  border: 0 !important;
  background: rgba(255,255,255,.96);
  color:#111827;
  background-clip: padding-box;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  z-index:10000;
  transition: background .25s ease, color .25s ease, border-color .25s ease, box-shadow .25s ease;
}

.site-header.scrolled{
  background: rgba(255,255,255,.96);
  box-shadow: 0 8px 24px rgba(0,0,0,.06); 
  border: 0 !important;                 
}

.site-header.transparent{
  border: 0 !important;
  background: linear-gradient(180deg, rgba(0,0,0,.38), rgba(0,0,0,0));
  color:#fff;
  box-shadow: none;
}

.site-header.scrolled{
  background: rgba(255,255,255,.96);
  box-shadow: 0 8px 24px rgba(0,0,0,.06);
  border-bottom-color:#e5e7eb;
}
.inner{
  height:64px; max-width:1200px; margin:0 auto; padding:0 16px;
  display:grid; grid-template-columns: 1fr auto; align-items:center; gap:12px;
}
.brand{ display:flex; align-items:center; gap:10px; text-decoration:none; color:inherit; }
.brand-title{ font-size:22px; font-weight:700; }
.brand-sub{ font-size:12px; font-weight:400; letter-spacing:.02em; color:#6b7280; margin-top:2px; opacity:.95; }
.logo{ width:28px; height:28px; display:block; }
.brand-text{ font-weight:800; letter-spacing:.3px; }

.nav{ display:flex; align-items:center; gap:12px; }
.nav > a,
.nav > .menu-item > .toplink{
  text-decoration:none;
  padding:8px 10px;
  border-radius:8px;
  color:inherit;
  font-weight:500;
}
.nav a:hover{ background: rgba(17,24,39,.06); }
.nav .donate{ background:#111827; color:#fff; font-weight:700; padding:8px 14px; border-radius:10px; }
.hamburger{ display:none; background:transparent; border:0; font-size:22px; padding:8px; }

.site-header.transparent .nav a:hover{ background: rgba(255,255,255,.14); }
.site-header.transparent .donate{ background:#fff; color:#111827; }
.site-header.transparent .logo{ filter: drop-shadow(0 1px 2px rgba(0,0,0,.35)) brightness(0) invert(1); }

.site-header.transparent .logo-svg{
  filter: drop-shadow(0 1px 2px rgba(0,0,0,.35)) brightness(0) invert(1);
}
.site-header.transparent img.logo{ filter: none; }


.nav.legacy{ display:none; }

/* ======== DROPDOWN MENU ======== */
.menu-item{ position:relative; --gap: 12px; }
.menu-item::after{
  content:"";
  position:absolute; left:0; right:0; top:100%;
  padding-bottom: var(--gap); height: var(--gap);
}

.toplink{
  display:inline-flex; align-items:center; gap:6px;
  text-decoration:none; color:inherit; opacity:.9;
  font-size:15px; padding:8px 10px; border-radius:8px;
}
.toplink:hover,.toplink.active{ opacity:1; background: rgba(17,24,39,.06); }
.site-header.transparent .toplink:hover{ background: rgba(255,255,255,.14); }
.caret{ font-size:12px; line-height:1; transform: translateY(1px); }

.submenu{
  position:absolute; top:100%; left:0;
  min-width:220px; background:#fff;
  border:1px solid #e5e7eb; border-radius:12px;
  box-shadow:0 12px 28px rgba(0,0,0,.08);
  padding:8px; display:none; z-index:10001;
  pointer-events:auto;
}

.submenu.show { display:block; }

.submenu li{ list-style:none; }
.subLink{ display:block; padding:8px 10px; border-radius:8px; text-decoration:none; color:#111827; }
.subLink:hover{ background:#f3f4f6; }

/* ======== MOBILE RESPONSIVE ======== */
@media (max-width: 900px){
  .nav.dropdown{ display:none; }
  .nav.legacy{ display:none; }
  .hamburger{ display:inline-block; color:inherit; }

  .mobile{
    position:fixed; inset:64px 0 0 0; z-index:50;
    background: rgba(17,24,39,.35); backdrop-filter: blur(2px);
    display:flex; justify-content:flex-end;
  }
  .sheet{
    width:78vw; max-width:360px; height:100%;
    background:#fff; border-left:1px solid #e5e7eb; padding:12px;
    display:flex; flex-direction:column; gap:6px;
  }
  .sheet a{ color:#111827; text-decoration:none; padding:12px 10px; border-radius:8px; }
  .sheet a:hover{ background:#f3f4f6; }
  .sheet .donate{ background:#111827; color:#fff; }
}

.fade-enter-active,.fade-leave-active{ transition: opacity .18s ease; }
.fade-enter-from,.fade-leave-to{ opacity:0; }

.submenu-item { position: relative; }

.submenu-item.hasChildren > .subLink { display:flex; justify-content:space-between; align-items:center; gap:8px; }
.submenu-item .chev { font-size:12px; opacity:.7; }

.submenu.flyout{
  position:absolute;
  top:-8px;           
  left:100%;
  min-width: 240px;
  display:none;      
}

.submenu-item.hasChildren:hover > .submenu.flyout { display:block; }
.submenu,
.submenu.flyout { z-index: 10002; }

</style>