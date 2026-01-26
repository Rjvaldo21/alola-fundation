<template>
  <section class="wrap">
    <div class="container">
      <RouterLink to="/" class="back">← Back to Home</RouterLink>

      <div v-if="loading" class="state">Loading…</div>
      <div v-else-if="errorMsg" class="state err">{{ errorMsg }}</div>

      <article v-else class="article">
        <header class="head">
          <div class="date" v-if="article.date">{{ formatDate(article.date) }}</div>
          <h1 class="title">{{ article.title }}</h1>
        </header>

        <div v-if="article.image" class="cover">
          <img :src="article.image" :alt="article.title" loading="lazy" />
        </div>

        <div v-if="article.body_html" class="body" v-html="article.body_html"></div>

        <div v-else class="body">
          <p v-if="article.content">{{ article.content }}</p>
          <p v-else class="muted">No content.</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const API_BASE = "https://backend-alola.apps06.tic.gov.tl";
const route = useRoute();

const loading = ref(true);
const errorMsg = ref("");
const article = ref({
  title: "",
  date: "",
  image: "",
  body_html: "",
  content: "",
});

function absUrl(u) {
  if (!u) return "";
  const s = String(u);
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return `${API_BASE}${s}`;
  return `${API_BASE}/${s}`;
}

function pickDate(n = {}) {
  return n.published_at || n.created_at || n.updated_at || n.date || "";
}

function formatDate(v) {
  try {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toLocaleDateString();
  } catch (_) {}
  return String(v);
}

async function fetchNewsDetail(slug) {
  if (!slug) return;

  loading.value = true;
  errorMsg.value = "";

  try {
    const res = await fetch(`${API_BASE}/api/news/${slug}/`, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const n = await res.json();

    const img = n.cover_image || n.image || n.thumbnail || n.cover || "";
    article.value = {
      title: n.title || n.name || "Untitled",
      date: pickDate(n),
      image: absUrl(img),
      body_html: n.body_html || n.content_html || "",
      content: n.content || n.body || n.excerpt || n.summary || "",
    };
  } catch (e) {
    console.warn("[NewsDetail] Failed to fetch:", e);
    errorMsg.value = "News detail not found / failed to load.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchNewsDetail(route.params.slug);
});

watch(
  () => route.params.slug,
  (slug) => fetchNewsDetail(slug)
);
</script>

<style scoped>
.wrap {
  padding: 24px 0 60px;
  background: #fff;
}
.container {
  max-width: 980px;
  margin: 0 auto;
  padding: 0 16px;
}
.back {
  display: inline-block;
  margin-bottom: 14px;
  text-decoration: none;
  color: #2563eb;
  font-weight: 600;
}
.back:hover {
  text-decoration: underline;
}
.state {
  color: #6b7280;
  font-size: 14px;
  padding: 14px 0;
}
.state.err {
  color: #b91c1c;
}
.article {
  background: #fff;
}
.head {
  margin-bottom: 14px;
}
.date {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
}
.title {
  margin: 0;
  font-size: clamp(24px, 3.2vw, 36px);
  font-weight: 800;
  color: #111827;
}
.cover {
  margin: 16px 0 18px;
  border-radius: 16px;
  overflow: hidden;
  background: #f3f4f6;
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.08);
}
.cover img {
  width: 100%;
  height: auto;
  display: block;
}
.body {
  color: #111827;
  line-height: 1.85;
  font-size: 15px;
}
.body :deep(p) {
  margin: 0 0 14px;
}
.body :deep(a) {
  color: #2563eb;
}
.muted {
  color: #6b7280;
}
</style>
