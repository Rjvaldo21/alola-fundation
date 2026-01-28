<template>
  <section class="spotlight member-spotlight">
    <div class="container wrap">
      <!-- Foto kiri -->
      <div class="photo-card" :class="{ 'is-loading': imgLoading }">
        <img
          :src="photoSrc"
          :alt="member?.name || 'Member photo'"
          loading="lazy"
          @load="imgLoading = false"
          @error="onImgError"
        />
      </div>

      <!-- Teks kanan -->
      <div class="content">
        <h2 class="name">{{ member?.name }}</h2>
        <div class="role" v-if="member?.role">{{ member.role }}</div>

        <p class="para" v-for="(p, i) in bioArray" :key="i">
          {{ p }}
        </p>

        <div class="socials" v-if="hasAnySocial">
          <a
            v-if="socials.twitter"
            :href="socials.twitter"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            class="sbtn"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                fill="#fff"
                d="M22.46 6c-.77.35-1.6.58-2.46.69a4.28 4.28 0 0 0 1.88-2.36 8.56 8.56 0 0 1-2.71 1.03A4.27 4.27 0 0 0 12 8.27a12.1 12.1 0 0 1-8.78-4.45 4.26 4.26 0 0 0 1.32 5.69 4.25 4.25 0 0 1-1.93-.53v.05c0 2.08 1.48 3.82 3.44 4.22-.36.1-.75.16-1.15.16-.28 0-.56-.03-.82-.08a4.28 4.28 0 0 0 3.99 2.96A8.57 8.57 0 0 1 2 18.58a12.08 12.08 0 0 0 6.54 1.92c7.85 0 12.15-6.51 12.15-12.15 0-.18 0-.36-.01-.54A8.67 8.67 0 0 0 22.46 6z"
              />
            </svg>
          </a>

          <a
            v-if="socials.facebook"
            :href="socials.facebook"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            class="sbtn"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                fill="#fff"
                d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5 3.66 9.15 8.44 9.94v-7.03H7.9V12.1h2.54V9.86c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.19 2.23.19v2.45h-1.26c-1.24 0-1.62.77-1.62 1.56v1.92h2.76l-.44 2.88h-2.32v7.03C18.34 21.22 22 17.07 22 12.07z"
              />
            </svg>
          </a>

          <a
            v-if="socials.instagram"
            :href="socials.instagram"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            class="sbtn"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                fill="#fff"
                d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zM18.2 6.8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  member: {
    type: Object,
    required: true,
    // { name, role, photo, bio: [p1,p2], socials: {twitter,facebook,instagram} }
  },
});

// ---- image fallback ----
const FALLBACK_PHOTO = "/placeholder-person.jpg";
const photoSrc = ref(props.member?.photo || FALLBACK_PHOTO);
const imgLoading = ref(true);

watch(
  () => props.member?.photo,
  (val) => {
    photoSrc.value = val || FALLBACK_PHOTO;
    imgLoading.value = true;
  }
);

function onImgError() {
  if (photoSrc.value !== FALLBACK_PHOTO) photoSrc.value = FALLBACK_PHOTO;
  imgLoading.value = false;
}

// ---- safe data ----
const socials = computed(() => props.member?.socials || {});
const bioArray = computed(() => {
  const b = props.member?.bio;
  if (Array.isArray(b)) return b.filter(Boolean);
  if (typeof b === "string" && b.trim()) return [b.trim()];
  return [];
});

const hasAnySocial = computed(() => {
  const s = socials.value;
  return Boolean(s.twitter || s.facebook || s.instagram);
});
</script>

<style scoped>
.spotlight {
  padding: 56px 0 32px;
  background: linear-gradient(180deg, rgba(17, 24, 39, 0.04), rgba(17, 24, 39, 0));
}

.wrap {
  display: grid;
  gap: 36px;
  align-items: center;
  grid-template-columns: 1fr;
}

@media (min-width: 980px) {
  .wrap {
    grid-template-columns: 480px 1fr;
  }
}

.photo-card {
  background: #eef1f4;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  position: relative;
}

.photo-card.is-loading::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.55) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: translateX(-100%);
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.photo-card img {
  width: 100%;
  height: auto;
  display: block;
}

.content {
  color: #374151;
}

.name {
  font-size: clamp(26px, 4.2vw, 44px);
  margin: 0;
  color: #5b6f81;
  font-weight: 800;
}

.role {
  margin-top: 6px;
  color: #6b7280;
}

.para {
  margin: 18px 0 0;
  color: #6b7280;
  line-height: 1.7;
}

.socials {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}

.sbtn {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background: #5c7183;
  display: grid;
  place-items: center;
  text-decoration: none;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transition: transform 0.15s ease, filter 0.15s ease, box-shadow 0.15s ease;
}

.sbtn:hover {
  filter: brightness(1.06);
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.14);
}

.sbtn:focus-visible {
  outline: 3px solid rgba(92, 113, 131, 0.35);
  outline-offset: 3px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
</style>
