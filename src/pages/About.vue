<template>
    <main class="page">
      <header class="hero">
        <h1>About Us</h1>
        <p class="lead">Profil singkat dan tautan ke sub-halaman.</p>
      </header>
  
      <section class="grid">
        <RouterLink to="/about/founder" class="card">Founder</RouterLink>
        <RouterLink to="/about/history" class="card">History</RouterLink>
        <RouterLink to="/about/mission" class="card">Mission</RouterLink>
        <RouterLink to="/about/staff" class="card">Staff</RouterLink>
        <RouterLink to="/about/supporter" class="card">Supporter</RouterLink>
        <RouterLink to="/about/children-care-center" class="card">Children Care Center</RouterLink>
        <RouterLink to="/about/alola-esperansa-ae" class="card">Alola Esperansa (AE)</RouterLink>
        <RouterLink to="/about/alola-australia" class="card">Alola Australia</RouterLink>
        <RouterLink to="/about/jobs" class="card">Current Jobs Available</RouterLink>
      </section>
    </main>
  </template>
  <script setup></script>
  <style scoped>
  .page{padding:96px 16px 40px;max-width:1100px;margin:0 auto}
  .hero h1{font-size:32px;font-weight:800;margin:0 0 8px}.lead{color:#6b7280}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-top:16px}
  .card{display:block;padding:14px;border:1px solid #e5e7eb;border-radius:12px;text-decoration:none;color:#111827}
  .card:hover{background:#f9fafb}
  </style>