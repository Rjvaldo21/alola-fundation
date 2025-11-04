<template>
    <main class="program" role="main">
      <section class="hero">
        <div class="container">
          <h1>Our Programs</h1>
          <p class="lead">
            We work across Maternal & Child Health, Education, Economic Empowerment, and Advocacy.
          </p>
        </div>
      </section>
  
      <section id="overview" class="container grid">
        <RouterLink class="card" to="/program#mch">
          <h3>MCH</h3>
          <p>Maternal and Child Health initiatives and stories.</p>
        </RouterLink>
  
        <RouterLink class="card" to="/program#education">
          <h3>Education</h3>
          <p>Scholarships, mobile libraries, and teacher training.</p>
        </RouterLink>
  
        <RouterLink class="card" to="/program#economic-empowerment">
          <h3>Economic Empowerment</h3>
          <p>Handicraft, fairs, and rural women’s economy.</p>
        </RouterLink>
  
        <RouterLink class="card" to="/program#advocacy">
          <h3>Advocacy</h3>
          <p>WRC-Alola, district support, and citizen forum success.</p>
        </RouterLink>
      </section>
  
      <!-- Anchor blocks (opsional, meniru halaman /program lama) -->
      <section id="mch" class="container block">
        <h2>Maternal and Child Health</h2>
        <ul class="links">
          <li><RouterLink to="/program/mch/about">About MCH</RouterLink></li>
          <li><RouterLink to="/program/mch/facility-based">Facility Based Sub Program</RouterLink></li>
          <li><RouterLink to="/program/mch/community-based">Community Based – Sub Program</RouterLink></li>
          <li><RouterLink to="/program/mch/womens-cancer-awareness">Women’s Cancer Raising Awareness</RouterLink></li>
          <li><RouterLink to="/program/mch/success-stories">MCH Success Story</RouterLink></li>
        </ul>
      </section>
  
      <section id="education" class="container block">
        <h2>Education</h2>
        <ul class="links">
          <li><RouterLink to="/program/education/scholarships">Scholarships Project</RouterLink></li>
          <li><RouterLink to="/program/education/mobile-library">Alola Mobile Library Project</RouterLink></li>
          <li><RouterLink to="/program/education/teacher-training">Teacher Training Project</RouterLink></li>
          <li><RouterLink to="/program/education/alternative-preschool">Alternative Preschool</RouterLink></li>
        </ul>
      </section>
  
      <section id="economic-empowerment" class="container block">
        <h2>Economic Empowerment</h2>
        <ul class="links">
          <li><RouterLink to="/program/economic-empowerment/handicraft">Handicraft Development Project</RouterLink></li>
          <li><RouterLink to="/program/economic-empowerment/craft-fair">Alola Craft Fair</RouterLink></li>
          <li><RouterLink to="/program/economic-empowerment/rural-women">Improving Economy for Rural Women</RouterLink></li>
          <li><RouterLink to="/program/economic-empowerment/preserva-identidade">Preserva Identidade Kultural Orijinal TL</RouterLink></li>
          <li><RouterLink to="/program/economic-empowerment/success-stories">Success Story</RouterLink></li>
        </ul>
      </section>
  
      <section id="advocacy" class="container block">
        <h2>Advocacy</h2>
        <ul class="links">
          <li><RouterLink to="/program/advocacy/wrc-alola">WRC-Alola</RouterLink></li>
          <li><RouterLink to="/program/advocacy/district-support">District Support Project</RouterLink></li>
          <li><RouterLink to="/program/advocacy/citizen-forum-success">Success Story from Citizen Forum</RouterLink></li>
        </ul>
      </section>
    </main>
  </template>
  
  <script setup>
  // (opsional) bisa fetch ringkasan via API kalau ada endpoint overview
  </script>
  
  <style scoped>
  .program .hero{ background:#f8fafc; padding:96px 20px 32px; }
  .container{ max-width:1200px; margin:0 auto; padding:0 20px; }
  .hero h1{ margin:0 0 8px; font-size:clamp(28px,4vw,40px); font-weight:900; }
  .lead{ color:#4b5563; max-width:800px }
  
  .grid{
    display:grid; grid-template-columns: repeat(4, 1fr); gap:16px;
    margin: 24px auto 32px;
  }
  .card{
    display:block; text-decoration:none; color:inherit;
    border:1px solid #e5e7eb; border-radius:16px; padding:18px;
    background:#fff; transition: transform .12s ease, box-shadow .12s ease;
  }
  .card:hover{ transform: translateY(-2px); box-shadow:0 12px 28px rgba(0,0,0,.08); }
  
  .block{ padding: 24px 0; }
  .block h2{ margin: 8px 0 10px; font-size: 22px; font-weight: 800; }
  .links{ padding-left: 18px; }
  .links li{ margin: 4px 0; }
  @media (max-width: 900px){
    .grid{ grid-template-columns:1fr 1fr }
  }
  @media (max-width: 640px){
    .grid{ grid-template-columns:1fr }
  }
  </style>
  