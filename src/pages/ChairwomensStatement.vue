<template>
  <main class="chair" role="main">
    <div class="bg">
      <div class="container">
        <!-- LEFT: Portrait + Socials -->
        <aside class="left">
          <div class="profile-card">
            <!-- wrap portrait + caption di dalam figure -->
            <figure class="portrait-figure">
              <img
                class="portrait"
                :src="portraitUrl"
                :alt="page.person || 'Chairwoman portrait'"
                loading="eager"
              />
              <figcaption class="caption">
                {{ page.person || 'Dr. Kirsty Sword Gusmão, AO' }}
              </figcaption>
            </figure>

            <div class="socials" role="list">
              <a
                v-for="(s,i) in socials"
                :key="i"
                class="social"
                :href="s.href"
                target="_blank" rel="noopener"
                :aria-label="s.label"
                role="listitem"
              >
                <svg v-if="s.icon==='facebook'" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.48h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.91h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94Z"/></svg>
                <svg v-else-if="s.icon==='instagram'" viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5Zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5Zm5.25-3a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 17.25 6.5Z"/></svg>
                <svg v-else-if="s.icon==='youtube'" viewBox="0 0 24 24"><path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.56 4.5 12 4.5 12 4.5s-7.56 0-9.4.6A3 3 0 0 0 .5 7.2 31.8 31.8 0 0 0 0 12a31.8 31.8 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.84.6 9.4.6 9.4.6s7.56 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.8 31.8 0 0 0 24 12a31.8 31.8 0 0 0-.5-4.8ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z"/></svg>
                <svg v-else-if="s.icon==='x'" viewBox="0 0 24 24"><path d="M13.3 10.7 20.8 2h-2.1l-6.2 7.2L7 2H2l7.9 11.3L2 22h2.1l6.7-7.8L17 22h5l-8.7-11.3Zm-2.4 2.8-.78-1.13L4.2 3.6H6l4.53 6.57.78 1.13 6.21 9h-1.8l-4.82-6.8Z"/></svg>
                <svg v-else-if="s.icon==='whatsapp'" viewBox="0 0 24 24"><path d="M20.5 3.5A10.5 10.5 0 0 0 3.1 18.6L2 22l3.5-1.1A10.5 10.5 0 1 0 20.5 3.5Zm-8.5 18a8.8 8.8 0 1 1 8.8-8.8 8.8 8.8 0 0 1-8.8 8.8Zm4.7-6.2c-.26-.13-1.53-.76-1.77-.85s-.41-.13-.58.13-.66.85-.82 1-.3.19-.56.06a7.19 7.19 0 0 1-2.11-1.3 7.89 7.89 0 0 1-1.46-1.81c-.15-.26 0-.4.11-.53s.26-.3.39-.46.17-.26.26-.43a.49.49 0 0 0 0-.46c-.06-.13-.56-1.34-.77-1.84s-.41-.43-.58-.44h-.5a1 1 0 0 0-.72.34 3 3 0 0 0-.95 2.22 5.27 5.27 0 0 0 1.11 2.81 12 12 0 0 0 4.57 3.95 15.58 15.58 0 0 0 1.5.55 3.63 3.63 0 0 0 1.66.1 2.72 2.72 0 0 0 1.78-1.23 2.24 2.24 0 0 0 .15-1.23c-.06-.11-.23-.17-.49-.3Z"/></svg>
                <svg v-else-if="s.icon==='email'" viewBox="0 0 24 24"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Zm2 0 8 5 8-5H4Zm16 12V9l-8 5L4 9v9h16Z"/></svg>
              </a>
            </div>
          </div>
        </aside>

        <!-- RIGHT: Content -->
        <section class="right" aria-labelledby="title">
          <h1 id="title">{{ page.title || 'CHAIRWOMEN STATEMENT' }}</h1>

          <article class="letter">
            <!-- Loading -->
            <div v-if="isLoading" class="skeleton">
              <div class="line" v-for="n in 12" :key="n"></div>
            </div>

            <!-- API HTML first -->
            <div v-else-if="page.bodyHtml" v-html="page.bodyHtml"></div>

            <!-- Fallback content -->
            <template v-else>
              <p><strong>Dear friends and supporters,</strong></p>
              <p>Dear friends and supporters,
              The past year has seen some key developments nationally, particularly in the areas of child rights and nutrition. Back as early as 2023, Alola Foundation’s Maternal and Child Health began working with government to draft a decree law to regulate the marketing of breastmilk substitutes. The idea was to protect breastfeeding and the importance of exclusive breastfeeding which is recommended globally by the World Health Organisation for the optimal health of mothers and babies. After years of lobbying by Alola and other international organisations like UNICEF, finally a decree law was passed by the Council of Ministers in January 2023. 

              Now begins the hard work of ensuring that the law is acted upon and abided by. Around the same time Timor-Leste’s first child protection law was passed. The law provides the broad framework under which children will be legally eligible for protection from any forms of violence, abuse, neglect, and exploitation.

              Other key developments for Alola over the past year have been the finalizing of a new Constitution for Fundasaun Alola, bringing the founding document in line with current laws regulating civil society organisations in Timor-Leste. The Alola Foundation is grateful to our board member, Barbara de Oliveira, and her awesome team at JU,S legal consulting services (https://www.jus.tl/) for their legal advice and many hours of hard work to conclude this work.

              We are also proud and pleased to announce that Alola has been granted government approval of its request to continue to lease our current office space in Mascarenhas for a further 20 years. This positive development gives us the security we require in order to be able to continue to deliver our vital services to the community. We see this as an endorsement by government of the impact Alola is having in the lives of women, girls and children.

              Thank you for the role that you have played in Alola’s own story to date.

              With sincere gratitude and good wishes,</p>
              <p>…(konten fallback singkat)…</p>
              <p class="sign">Dr. Kirsty Sword Gusmão, AO<br/>Chairwoman</p>
            </template>
          </article>

          <!-- Share bar -->
          <div class="share">
            <span>Share this:</span>
            <button class="sharebtn" @click="doShare('facebook')">Facebook</button>
            <button class="sharebtn" @click="doShare('x')">X</button>
            <button class="sharebtn" @click="doShare('whatsapp')">WhatsApp</button>
            <button class="sharebtn" @click="copyLink">Copy Link</button>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api, absUrl } from '@/services/api'   // <= ini

const SLUG = 'chairwomens-statement'

const isLoading = ref(true)
const page = ref({
  title: 'CHAIRWOMEN STATEMENT',
  bodyHtml: '',
  person: 'Dr. Kirsty Sword Gusmão, AO',
  portrait: '',
})

const socials = ref([
  { icon:'facebook', label:'Facebook', href:'#' },
  { icon:'instagram', label:'Instagram', href:'#' },
  { icon:'youtube', label:'YouTube', href:'#' },
  { icon:'x', label:'X', href:'#' },
  { icon:'whatsapp', label:'WhatsApp', href:'#' },
  { icon:'email', label:'Email', href:'mailto:info@example.com' },
])

const portraitUrl = computed(() =>
  page.value.portrait ? absUrl(page.value.portrait)
  : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop'
)

async function fetchPage() {
  try {
    isLoading.value = true
    const { data } = await api.get(`public/pages/${SLUG}/`) // <= disini
    page.value.title    = data.title || page.value.title
    page.value.person   = data.person || data.author || page.value.person
    page.value.portrait = data.portrait || data.image || ''
    page.value.bodyHtml = data.content_html || data.body_html || data.html || ''
    if (Array.isArray(data.socials) && data.socials.length) {
      socials.value = data.socials.map(s => ({
        icon: (s.icon || '').toLowerCase(),
        label: s.label || s.icon || 'Social',
        href: s.url || s.href || '#'
      }))
    }
  } catch (e) {
    console.warn('Fetch chairwoman statement failed:', e)
  } finally {
    isLoading.value = false
  }
}
onMounted(fetchPage)

// share helper tetap
</script>


<style scoped>
/* === THEME / BACKGROUND (ikut page lain) === */
.chair { --gap: 28px; --ink:#0b1f17; --ring:rgba(0,0,0,.08); }
.bg { background: var(--page-bg, #f8fafc); padding: 96px 20px 48px; }

.container {
  max-width: 1200px; margin: 0 auto;
  display: grid; gap: var(--gap);
  grid-template-columns: 340px 1fr;
  align-items: start;
}

/* LEFT */
.left { position: sticky; top: 88px; }
.profile-card {
  background: #fff; border: 1px solid var(--ring); border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.08); overflow: hidden;
}

.portrait-figure {
  margin: 0;
  display: block;
  background: #fff;
}

.portrait { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; }
.caption {
  padding: 8px 12px; font-size: 13px; text-align: center; background: #f3f4f6;
  border-top: 1px solid var(--ring);
}
.socials {
  display: grid; grid-template-columns: repeat(6,1fr); gap: 8px;
  padding: 12px; background: #fff;
}
.social {
  height: 38px; display:flex; align-items:center; justify-content:center;
  border: 1px solid var(--ring); border-radius: 999px; background:#fff;
  transition: transform .12s ease, box-shadow .12s ease;
}
.social:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,.12); }
.social svg { width: 18px; height: 18px; fill:#111; }

/* RIGHT */
.right h1 {
  margin: 0 0 10px;
  font-weight: 900; letter-spacing:.02em; text-transform: uppercase;
  font-size: clamp(26px, 3vw, 34px); color: var(--ink);
}
.letter { color: var(--ink); line-height: 1.75; font-size: 16px; }
.letter p { margin: 0 0 14px; }
.sign { margin-top: 18px; font-weight: 700; }

/* Share bar */
.share { display:flex; align-items:center; gap:10px; margin-top:18px; flex-wrap: wrap; }
.share span { font-weight: 600; }
.sharebtn {
  height: 36px; padding: 0 12px; border-radius: 999px; border:1px solid var(--ring);
  background:#fff; cursor:pointer; font-weight:600;
  transition: transform .12s ease, box-shadow .12s ease;
}
.sharebtn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,.12); }

/* Skeleton */
.skeleton .line{
  height: 12px; border-radius: 8px; margin: 10px 0;
  background: linear-gradient(90deg,#eaeef2,#f6f8fb,#eaeef2);
  background-size: 200% 100%; animation: shimmer 1.2s infinite;
}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

@media (max-width: 1024px){
  .container{ grid-template-columns: 1fr; }
  .left{ position: static; order: 2; }
  .right{ order: 1; }
}
</style>
