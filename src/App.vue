<template>
  <div class="app">
    <HeaderNav />
    <main :class="['pagewrap', { 'no-offset': isHome }]">
      <router-view />
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import HeaderNav from './components/HeaderNav.vue'
import SiteFooter from './components/SiteFooter.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isHome = computed(() => route.name === 'home')
</script>

<style>
:root { --brand:#1e5799; --brand-2:#7db9e8; }

*{ box-sizing:border-box }
html,body,#app{ height:100% }
body{
  margin:0;
  font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;
  background:#f9fafb;            
  color:#111827;                  
}

.app{ min-height:100%; display:flex; flex-direction:column }
.pagewrap{ flex:1 1 auto; padding-top:74px }  
.pagewrap.no-offset{ padding-top:0 }          

.container{ max-width:1200px; margin:0 auto; padding:0 16px }
.btn{ display:inline-flex; align-items:center; gap:8px; padding:10px 16px; border-radius:10px; border:1px solid #e5e7eb; background:#fff; cursor:pointer; text-decoration:none; color:#111827 }
.btn.primary{ background:linear-gradient(90deg,var(--brand),var(--brand-2)); color:#fff; border:none }
.btn.ghost{ background:transparent; border:1px solid #e5e7eb }
.grid{ display:grid; gap:16px }
.card{ background:#fff; border:1px solid #e5e7eb; border-radius:14px; overflow:hidden }
.shadow-sm{ box-shadow:0 1px 2px rgba(0,0,0,.04) }
.text-muted{ color:#6b7280 }

@media (min-width:768px){ .grid.cols-3{ grid-template-columns:repeat(3,1fr) } }
</style>
