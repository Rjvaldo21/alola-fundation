<template>
    <article class="nc">
      <RouterLink :to="link" class="thumb" :aria-label="news.title">
        <img v-if="news.image" :src="news.image" :alt="news.title" loading="lazy" />
        <div v-else class="ph"></div>
      </RouterLink>
  
      <div class="body">
        <div class="meta">{{ formattedDate }}</div>
        <h3 class="title">
          <RouterLink :to="link">{{ news.title }}</RouterLink>
        </h3>
        <p class="excerpt">{{ news.excerpt }}</p>
        <RouterLink :to="link" class="read">Read More →</RouterLink>
      </div>
    </article>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  const props = defineProps({ news: { type: Object, required: true } })
  const formattedDate = computed(() =>
    props.news?.date ? new Date(props.news.date).toLocaleDateString() : ''
  )
  const link = computed(() => props.news?.link || '#')
  </script>
  
  <style scoped>

  .nc{
    background:#fff; border:1px solid #e5e7eb; border-radius:14px;
    overflow:hidden; display:flex; flex-direction:column;
    box-shadow:0 1px 2px rgba(0,0,0,.04);
  }
  
  .thumb{ display:block; background:#f3f4f6 }
  .thumb img{
    width:100%; height:100%;
    object-fit:cover;
    aspect-ratio:16/9;            
    display:block;
  }
  .ph{ aspect-ratio:16/9; background:linear-gradient(135deg,#f3f4f6,#e5e7eb) }
  
  .body{ padding:16px }
  .meta{ font-size:12px; color:#6b7280 }
  .title{ margin:6px 0 4px; font-size:16px; line-height:1.3 }
  .title a{ color:#111827; text-decoration:none }
  .title a:hover{ text-decoration:underline }
  .excerpt{ margin:6px 0 0; color:#6b7280; font-size:14px }
  
  .read{
    display:inline-block; margin-top:10px; padding:8px 12px;
    border-radius:10px; border:1px solid #e5e7eb; text-decoration:none; color:#111827
  }
  .read:hover{ background:#f9fafb }
  </style>
  