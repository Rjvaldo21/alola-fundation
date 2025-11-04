<template>
    <footer class="site-footer">
      <div class="container footer-top">
        <div class="col brand">
          <div class="logo">ALOLA FUNDATION</div>
          <p class="muted">
            Working to improve the quality of life for women and children in Timor-Leste.
          </p>
        </div>
  
        <div class="col">
          <div class="heading">Menu</div>
          <ul class="list">
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/program">Program</RouterLink></li>
            <li><RouterLink to="/publication">Publication</RouterLink></li>
            <li><RouterLink to="/get-involved">Get Involved</RouterLink></li>
            <li><RouterLink to="/contact">Contact</RouterLink></li>
          </ul>
        </div>
  
        <div class="col">
          <div class="heading">Contact</div>
          <ul class="list">
            <li>Email: info@alola.tl</li>
            <li>Tel: +670 0000 0000</li>
            <li>Dili, Timor-Leste</li>
          </ul>
        </div>
  
        <div class="col">
          <div class="heading">Newsletter</div>
          <form class="newsletter" @submit.prevent>
            <input type="email" placeholder="Enderesu Email" />
            <button class="btn-primary">Subscribe</button>
          </form>
        </div>
      </div>
  
      <div class="footer-bottom">
        <div class="container bottom-row">
          <div>
            © {{ year }} ALOLA FUNDATION. Designed and Developed by
            <a href="https://www.tic.gov.tl/en/" target="_blank" rel="noopener noreferrer" class="link-tic">
              TIC TIMOR, IP
            </a>.
          </div>
          <div class="links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  const year = new Date().getFullYear()
  </script>
  
  <style scoped>
  .site-footer{ margin-top:64px; border-top:1px solid #e5e7eb; background:#fff; color:#111827; }
  .container{ max-width:1200px; margin:0 auto; padding:0 16px; }
  
  .footer-top{ display:grid; gap:24px; padding:40px 0; grid-template-columns:1fr; }
  @media (min-width:900px){ .footer-top{ grid-template-columns:2fr 1fr 1fr 1.4fr; } }
  
  .logo{ font-size:18px; font-weight:600; margin-bottom:8px; color:#111827; }
  .muted{ color:#6b7280; font-size:14px; }
  
  .heading{ font-weight:600; margin-bottom:8px; }
  .list{ list-style:none; padding:0; margin:0; }
  .list li{ margin:8px 0; }
  .list a{ color:#374151; text-decoration:none; }
  .list a:hover{ text-decoration:underline; }
  
  .newsletter{ display:flex; gap:8px; }
  .newsletter input{ flex:1; padding:10px 12px; border:1px solid #d1d5db; border-radius:8px; }
  .btn-primary{ padding:10px 16px; border-radius:999px; border:none; background:linear-gradient(90deg,#1e5799,#7db9e8); color:#fff; cursor:pointer; }
  
  .footer-bottom{ border-top:1px solid #e5e7eb; }
  .bottom-row{ display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between; padding:12px 0 16px; }
  .bottom-row .links a{ margin-left:12px; color:#6b7280; }
  .bottom-row .links a:hover{ color:#374151; }

  .link-tic {
  color: #007bff;       
  text-decoration: none; 
  font-weight: 500;
  }
  .link-tic:hover {
    text-decoration: none; 
    opacity: 0.8;         
  }
  </style>
  