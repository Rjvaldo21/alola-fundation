<template>
    <section class="page-wrap">
      <div class="container">
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
  
        <article v-else class="page">
          <header class="head">
            <h1 class="title">{{ page.title }}</h1>
          </header>
  
          <div class="grid">
            <!-- LEFT -->
            <aside class="side" v-if="page.cover_image">
              <div class="cover">
                <img :src="page.cover_image" :alt="page.title" />
              </div>
            </aside>
  
            <!-- RIGHT -->
            <main class="content">
              <div class="body" v-html="page.body_html"></div>
            </main>
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
  const error = ref("");
  const page = ref({
    title: "",
    cover_image: "",
    body_html: "",
  });
  
  function absUrl(u) {
    if (!u) return "";
    const s = String(u);
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    if (s.startsWith("/")) return `${API_BASE}${s}`;
    return `${API_BASE}/${s}`;
  }
  
  async function fetchPage(slug) {
    loading.value = true;
    error.value = "";
    try {
      const res = await fetch(`${API_BASE}/api/pages/${slug}/`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
  
      page.value = {
        title: data?.title || "",
        cover_image: absUrl(data?.cover_image || ""),
        body_html: data?.body_html || "",
      };
    } catch (e) {
      console.warn("[PageSlug] fetch error:", e);
      error.value = "Page not found / failed to load.";
    } finally {
      loading.value = false;
    }
  }
  
  onMounted(() => {
    fetchPage(route.params.slug);
  });
  
  watch(
    () => route.params.slug,
    (slug) => fetchPage(slug)
  );
  </script>
  
  <style scoped>
  .page-wrap {
    padding: 28px 0 60px;
    background: #fff;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }
  .loading {
    color: #6b7280;
    font-size: 14px;
  }
  .error {
    color: #b91c1c;
    font-size: 14px;
  }
  .head {
    margin-bottom: 18px;
  }
  .title {
    margin: 0;
    font-size: 34px;
    font-weight: 800;
    color: #111827;
  }
  .grid {
    display: grid;
    gap: 22px;
    grid-template-columns: 360px 1fr;
    align-items: start;
  }
  @media (max-width: 980px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
  .cover {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.12);
    background: #f3f4f6;
  }
  .cover img {
    width: 100%;
    height: auto;
    display: block;
  }
  .content {
    color: #111827;
  }
  .body :deep(p) {
    margin: 0 0 14px;
    line-height: 1.8;
    color: #111827;
    font-size: 14px;
  }
  </style>
  