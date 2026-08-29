/* =========================================================
   VEX DIGITAL MARKET — Shared Components (navbar, footer, logo)
   ========================================================= */

// Ikon tas premium bernuansa "kecepatan" (garis kilat di belakang tas),
// dengan gantungan tag berlogo "V" — mengikuti referensi logo VDM.
// Semua warna memakai CSS variable, jadi otomatis mengikuti tema situs.
function brandMarkSVG(){
  return `
  <svg viewBox="0 0 84 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="vdmGrad" x1="0" y1="0" x2="84" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#ffe28a"/>
        <stop offset="50%" stop-color="var(--primary)"/>
        <stop offset="100%" stop-color="var(--primary-2)"/>
      </linearGradient>
      <linearGradient id="vdmFade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="var(--primary)" stop-opacity="0"/>
        <stop offset="100%" stop-color="var(--primary)" stop-opacity=".85"/>
      </linearGradient>
    </defs>
    <!-- garis kecepatan di belakang tas -->
    <rect x="0" y="18" width="34" height="3.2" rx="1.6" fill="url(#vdmFade)"/>
    <rect x="6" y="30" width="26" height="3.2" rx="1.6" fill="url(#vdmFade)" opacity=".8"/>
    <rect x="10" y="42" width="20" height="3.2" rx="1.6" fill="url(#vdmFade)" opacity=".6"/>
    <!-- pegangan tas -->
    <path d="M40 26V21a10 10 0 0 1 20 0v5" stroke="url(#vdmGrad)" stroke-width="4" stroke-linecap="round" fill="none"/>
    <!-- badan tas -->
    <rect x="30" y="24" width="40" height="36" rx="7" fill="url(#vdmGrad)"/>
    <rect x="30" y="24" width="40" height="36" rx="7" fill="#000" opacity=".08"/>
    <!-- lipatan tengah tas -->
    <line x1="30" y1="34" x2="70" y2="34" stroke="#000" stroke-opacity=".22" stroke-width="2"/>
    <!-- tag gantungan -->
    <rect x="45.5" y="34" width="9" height="11" rx="2.4" fill="#0c0c0c" stroke="url(#vdmGrad)" stroke-width="1.4"/>
    <text x="50" y="42.4" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="800" font-size="6.5" fill="var(--primary)">V</text>
  </svg>`;
}

function brandWordmarkHTML(){
  return `
    <span class="vdm-word">VDM</span>
    <span class="brand-divider"></span>
    <span class="brand-sub">
      <span class="sub-main">Vex Digital</span>
      <span class="sub-market"><i></i>Market<i></i></span>
    </span>`;
}

function brandHTML(withEnter, big){
  return `
  <a href="index.html" class="brand ${withEnter ? 'brand-enter' : ''} ${big ? 'brand-lg' : ''}">
    <span class="brand-mark">
      <span class="flash"></span>
      ${brandMarkSVG()}
    </span>
    ${brandWordmarkHTML()}
  </a>`;
}

const NAV_LINKS = [
  { href: 'index.html', label: 'Beranda' },
  { href: 'katalog.html', label: 'Produk' },
  { href: 'leaderboard.html', label: 'Leaderboard' },
  { href: 'bantuan.html', label: 'Bantuan' },
];

function renderNavbar(activePage){
  const el = document.getElementById('navbar-root');
  if(!el) return;
  const links = NAV_LINKS.map(l =>
    `<a href="${l.href}" class="${activePage===l.href?'active':''}">${l.label}</a>`
  ).join('');

  el.innerHTML = `
  <div class="navbar-wrap">
  <header class="navbar">
    <div class="container">
      ${brandHTML(true)}
      <nav class="nav-links" id="navLinks">${links}</nav>
      <div class="nav-actions">
        <div class="nav-search">
          <button class="nav-icon-btn" id="searchToggle" aria-label="Cari produk">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
          <div class="nav-search-box" id="navSearchBox">
            <input type="text" id="navSearchInput" placeholder="Cari aplikasi premium...">
            <button id="navSearchGo" aria-label="Cari">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>
        <a class="btn btn-ghost btn-sm btn-ghost-desktop" href="https://wa.me/${SITE_CONFIG.whatsapp}" target="_blank" rel="noopener">
          Hubungi CS
        </a>
        <a class="btn btn-primary btn-sm" href="katalog.html">Lihat Produk</a>
        <button class="nav-burger" id="navBurger" aria-label="Menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
  </header>
  </div>`;

  const burger = document.getElementById('navBurger');
  const links2 = document.getElementById('navLinks');
  if(burger){
    burger.addEventListener('click', () => links2.classList.toggle('open'));
  }

  // quick search di navbar -> arahkan ke katalog dengan query
  const searchToggle = document.getElementById('searchToggle');
  const searchBox = document.getElementById('navSearchBox');
  const searchInput = document.getElementById('navSearchInput');
  const goToSearch = () => {
    const q = searchInput.value.trim();
    window.location.href = q ? `katalog.html?q=${encodeURIComponent(q)}` : 'katalog.html';
  };
  searchToggle.addEventListener('click', (e)=>{
    e.stopPropagation();
    searchBox.classList.toggle('open');
    if(searchBox.classList.contains('open')) searchInput.focus();
  });
  document.getElementById('navSearchGo').addEventListener('click', goToSearch);
  searchInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') goToSearch(); });
  document.addEventListener('click', (e)=>{
    if(!searchBox.contains(e.target) && e.target !== searchToggle) searchBox.classList.remove('open');
  });
}

function renderFooter(){
  const el = document.getElementById('footer-root');
  if(!el) return;
  el.innerHTML = `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-about">
          ${brandHTML(false, true)}
          <p>Partner terpercaya untuk kebutuhan akses akun premium aplikasi favoritmu. Proses instan, harga bersahabat, dan garansi penuh di setiap transaksi.</p>
          <div class="footer-social">
            <a href="https://wa.me/${SITE_CONFIG.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 20 12a8 8 0 0 1-8 8Zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1s-.6.8-.7.9-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.4 0-.5s-.5-1.3-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.6 1.1 2.8c.1.2 1.8 2.8 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z"/></svg>
            </a>
            <a href="mailto:${SITE_CONFIG.email}" aria-label="Email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18v12H3V6Zm0 0 9 7 9-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
            <a href="bantuan.html" aria-label="Bantuan">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" stroke-width="1.8"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7v.3M12 17h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h5>Navigasi</h5>
          <ul>
            <li><a href="index.html">Beranda</a></li>
            <li><a href="katalog.html">Produk</a></li>
            <li><a href="bantuan.html">Bantuan</a></li>
            <li><a href="tentang.html">Tentang Kami</a></li>
          </ul>
        </div>
        <div>
          <h5>Kategori Populer</h5>
          <ul>
            <li><a href="katalog.html?cat=streaming">Streaming Apps</a></li>
            <li><a href="katalog.html?cat=design">Design Tools</a></li>
            <li><a href="katalog.html?cat=editing">Video Editors</a></li>
            <li><a href="katalog.html?cat=ai">AI Tools</a></li>
            <li><a href="katalog.html?cat=productivity">Productivity</a></li>
          </ul>
        </div>
        <div>
          <h5>Bantuan &amp; Kontak</h5>
          <ul class="footer-contact">
            <li>💬 WhatsApp<br>+${SITE_CONFIG.whatsapp.replace(/(\d{2})(\d{3,4})(\d{4})(\d+)/,'$1 $2-$3-$4')}</li>
            <li>✉️ Pusat Bantuan<br>${SITE_CONFIG.email}</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${SITE_CONFIG.siteName}. All Rights Reserved.</span>
        <div class="legal">
          <a href="legal.html">Privacy Policy</a>
          <a href="legal.html">Terms of Service</a>
          <a href="legal.html">Refund Policy</a>
          <a href="admin.html">Admin</a>
        </div>
      </div>
    </div>
  </footer>`;
}

// Reveal-on-scroll sederhana
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){ items.forEach(i=>i.classList.add('in')); return; }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  items.forEach(i=>io.observe(i));
}

function toast(msg){
  let t = document.getElementById('toastEl');
  if(!t){
    t = document.createElement('div');
    t.id = 'toastEl';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>t.classList.remove('show'), 2600);
}
