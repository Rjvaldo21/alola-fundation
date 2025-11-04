<template>
  <main class="remarks" role="main">
    <div class="bg">
      <div class="container">
        <!-- LEFT: LETTER -->
        <section class="left" aria-labelledby="title">
          <h1 id="title">{{ page.title || 'CEO’s REMARKS' }}</h1>

          <!-- ornament -->
          <div class="ornament" aria-hidden="true">
            <span v-for="n in 16" :key="n">◆</span>
          </div>

          <article class="letter">
            <!-- LOADING SKELETON -->
            <div v-if="isLoading" class="skeleton">
              <div class="line" v-for="n in 10" :key="n"></div>
            </div>

            <!-- API HTML (prioritas) -->
            <div v-else-if="page.bodyHtml" v-html="page.bodyHtml"></div>

            <!-- Fallback text -->
            <template v-else>
              <p><strong>Dear Donor, Partners and Friends,</strong></p>
              <p>
                To achieve our missions to promote women’s rights and ensure equal access to health care,
                quality education, promote an independent economy and leadership in political life, Alola
                Foundation in 2024 continues to exercise its function to carry out various activities at
                national, municipal to grassroots levels to strengthen communities and target groups.
              </p>
              <p>
                As an organization that is always learning to improve its service mechanisms to ensure
                compliance with the objectives of the Foundation, in 2024 the Alola Foundation organized
                the second meeting of the Advisory Board inviting representatives of beneficiaries, partners
                and stakeholders. The objective of the meeting is to gain inputs and recommendations to the
                revision of the organization’s strategic and action plan which focuses on the review of programs
                and their implementations so as to cover all targets. On the other hand, we also conducted
                strategic plan 2020–2024 mid-term review to track the project performances, its outputs and
                short-term outcomes as well as current and potential obstacles hindering its progress.
              </p>
              <p>
                In addition to the progress mentioned above, I am pleased to present the Annual Report including
                the narrative and financial year 2023 of the Alola Foundation, which will show our progress and
                successes achieved through implementation programs in the areas of Maternal and Child Health,
                Education, Women’s Economic Empowerment and Advocacy.
              </p>
              <p>
                We know that the progress we have made in 2024 would not be possible without the support of our
                donors, partners and stakeholders including the Alola Australia’s team and everyone who continues
                to support our work this year. I would also like to express my gratitude to all the members of the
                Board of the Alola Foundation, especially to Ms. Kirsty Sword Gusmão who continues to deposit her
                trust and full support in me to lead this organization.
              </p>
              <p>
                In addition, I would like to express my gratitude to all the program managers and the entire
                Alola Foundation staff team for their support and dedication during this year who worked as a solid
                team to support each other to achieve our goals and objectives of this Foundation.
              </p>
              <p class="quote">“Together we are strong.” <span>Strong Women, Strong Nation</span></p>

              <div class="signature">
                <div class="line" aria-hidden="true"></div>
                <div class="name">Ms. Maria Guterres</div>
                <div class="role">CEO of Alola Foundation</div>
              </div>
            </template>
          </article>
        </section>

        <!-- RIGHT: PHOTO + GALLERY + LINKS -->
        <aside class="right">
          <figure
            class="hero-photo"
            :style="{ backgroundImage: `url('${activeImage}')` }"
            role="img"
            :aria-label="activeAlt"
          ></figure>

          <div class="thumbs" role="list">
            <button
              v-for="(img, i) in images"
              :key="i"
              class="thumb"
              :class="{ active: i === active }"
              @click="setActive(i)"
              :aria-label="`Show photo: ${img.alt || 'Photo'}`"
              role="listitem"
            >
              <img :src="img.url" :alt="img.alt || 'Thumbnail'" loading="lazy" />
            </button>
          </div>

          <nav class="quick-links" aria-label="Quick links">
            <RouterLink class="pill" to="/about">About</RouterLink>
            <RouterLink class="pill" to="/speech">Speech</RouterLink>
            <RouterLink class="pill" to="/media/photos">Photo Stocks</RouterLink>
            <RouterLink class="pill" to="/media">Media Release</RouterLink>
            <RouterLink class="pill" to="/agenda">Agenda</RouterLink>
          </nav>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
// import axios from 'axios'

// ===== API BASE & SLUG =====
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const SLUG = 'ceos-remarks' // sesuaikan kalau pakai slug berbeda

// ===== STATE =====
const isLoading = ref(true)
const page = ref({
  title: 'CEO’s REMARKS',
  bodyHtml: '', // prioritas jika tersedia dari API (HTML sudah dirender dari backend)
})

// ===== GALLERY =====
const images = ref([
  // fallback thumbnails
  { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1600&auto=format&fit=crop', alt: 'CEO addressing audience' },
  { url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=900&auto=format&fit=crop', alt: 'Community engagement' },
  { url: 'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=900&auto=format&fit=crop', alt: 'Women’s empowerment program' },
  { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=900&auto=format&fit=crop', alt: 'Health awareness session' },
  { url: 'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=900&auto=format&fit=crop', alt: 'Education support activity' },
  { url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=900&auto=format&fit=crop', alt: 'Team and partners' },
])

const active = ref(0)
const activeImage = computed(() => images.value[active.value]?.url || '')
const activeAlt = computed(() => images.value[active.value]?.alt || '')

function setActive(i) { active.value = i }

// ===== HELPERS =====
const absUrl = (path) => {
  if (!path) return ''
  return path.startsWith('http') ? path : `${API_BASE}${path}`
}

// ===== FETCH PAGE =====
async function fetchPage() {
  try {
    isLoading.value = true
    // Contoh endpoint: /api/public/pages/<slug>/
    const { data } = await axios.get(`${API_BASE}/api/public/pages/${SLUG}/`)
    // Dukungan berbagai skema field:
    // - title
    // - content_html / body_html / html
    // - content (plain) -> backend disarankan kirim content_html untuk styling konsisten
    // - gallery: [{image, caption}] atau [{url, alt}]
    page.value.title = data.title || page.value.title
    page.value.bodyHtml =
      data.content_html || data.body_html || data.html || (data.content ? `<p>${data.content}</p>` : '')

    // Map gallery jika ada
    const g = data.gallery || data.images || []
    if (Array.isArray(g) && g.length) {
      images.value = g.map((it) => ({
        url: absUrl(it.image || it.url),
        alt: it.caption || it.alt || page.value.title,
      })).filter(x => !!x.url)
      active.value = 0
    }
  } catch (err) {
    // diamkan; fallback akan tampil
    console.warn('Failed to fetch CEO remarks:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchPage)

// Jika suatu saat gallery dari API berubah (hot reload), pastikan index aman
watch(images, () => { if (active.value >= images.value.length) active.value = 0 })
</script>

<style scoped>
/* ===== THEME (ikut page lain via CSS variable) =====
   Gunakan var(--page-bg) global di layout anda.
   Jika tidak ada, fallback ke #f8fafc. */
.remarks {
  --page-gap: 28px;
  --ink: #0b1f17;
  --ink-soft: #173a2d;
  --ring: rgba(0, 0, 0, 0.08);
  --radius: 18px;
  --shadow: 0 10px 24px rgba(0,0,0,.12);
}

.bg {
  background: var(--page-bg, #f8fafc);
  padding: 96px 20px 48px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: var(--page-gap);
  align-items: start;
}

/* LEFT */
.left h1 {
  color: var(--ink);
  font-weight: 900;
  letter-spacing: 0.02em;
  font-size: clamp(28px, 3.2vw, 38px);
  margin: 0 0 8px;
  text-transform: uppercase;
}

.ornament {
  display: flex;
  gap: 8px;
  font-size: 14px;
  line-height: 1;
  color: #0b0b0b;
  margin-bottom: 18px;
}

.letter {
  color: var(--ink);
  font-size: 16px;
  line-height: 1.7;
}
.letter p { margin: 0 0 14px; }

.quote { font-weight: 700; margin-top: 18px; }
.quote span { font-weight: 800; }

.signature { margin-top: 24px; }
.signature .line { height: 1px; background: var(--ink); opacity: .25; margin-bottom: 10px; }
.signature .name { font-weight: 800; }
.signature .role { color: var(--ink-soft); }

/* RIGHT */
.right { position: sticky; top: 88px; }
.hero-photo {
  width: 100%;
  aspect-ratio: 4 / 3;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  outline: 1px solid var(--ring);
}

.thumbs {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-top: 12px;
}
.thumb {
  border: 0; padding: 0; background: transparent; cursor: pointer;
  border-radius: 10px; outline: 1px solid var(--ring);
  transition: transform .12s ease, outline-color .2s ease;
}
.thumb img {
  display: block; width: 100%; height: 70px; object-fit: cover; border-radius: 10px;
}
.thumb:hover { transform: translateY(-1px); }
.thumb.active { outline-color: #111; }

.quick-links {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}
.pill {
  display: inline-flex; align-items: center; justify-content: center;
  height: 40px; border-radius: 999px; padding: 0 14px;
  background: rgba(255,255,255,.9); color: #0b0b0b;
  font-weight: 700; text-decoration: none;
  border: 1px solid rgba(0,0,0,.06);
  transition: transform .12s ease, box-shadow .12s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
}
.pill:hover, .pill:focus-visible { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,.12); }

/* Skeleton */
.skeleton .line {
  height: 12px; border-radius: 8px; margin: 10px 0;
  background: linear-gradient(90deg, #eaeef2, #f6f8fb, #eaeef2);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}
@keyframes shimmer { 0%{background-position: 200% 0} 100%{background-position: -200% 0} }

/* Responsive */
@media (max-width: 1060px) {
  .container { grid-template-columns: 1fr; }
  .right { position: static; }
  .thumbs { grid-template-columns: repeat(4, 1fr); }
  .quick-links { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 560px) {
  .bg { padding: 84px 14px 40px; }
  .thumbs { grid-template-columns: repeat(3, 1fr); }
  .quick-links { grid-template-columns: repeat(2, 1fr); }
  .pill { height: 38px; }
}
</style>
