<template>
    <section class="wrap">
      <h1 class="title">Programs</h1>
      <p class="lead">Select a program to view details.</p>
      <div class="grid">
        <RouterLink class="card" :to="{ name: 'program-mch' }">
          <h3>Maternal &amp; Child Health (MCH)</h3>
          <p>Maternal & child health: ANC/PNC, nutrition, immunization, education.</p>
        </RouterLink>
        <RouterLink class="card" :to="{ name: 'program-edu' }">
          <h3>Education &amp; Literacy</h3>
          <p>Education, literacy, school support & training.</p>
        </RouterLink>
        <RouterLink class="card" :to="{ name: 'program-wee' }">
          <h3>Women’s Economic Empowerment</h3>
          <p>Women's economic empowerment, business access & training.</p>
        </RouterLink>
        <RouterLink class="card" :to="{ name: 'program-adv' }">
          <h3>Advocacy</h3>
          <p>Policy advocacy & awareness campaigns.</p>
        </RouterLink>
      </div>
    </section>
  </template>
  <script setup></script>
  <style scoped>
  .wrap{max-width:1000px;margin:0 auto;padding:24px}
  .title{font-size:28px;font-weight:800;margin-bottom:6px}
  .lead{color:#6b7280;margin-bottom:16px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
  .card{display:block;border:1px solid #e5e7eb;border-radius:14px;padding:14px;background:#fff;text-decoration:none;color:inherit}
  .card h3{font-weight:800;margin-bottom:6px}
  .card:hover{box-shadow:0 6px 16px rgba(0,0,0,.06)}
  </style>
  