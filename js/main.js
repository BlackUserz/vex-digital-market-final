/* =========================================================
   VEX DIGITAL MARKET — Main App Logic
   ========================================================= */

function productCardHTML(p){
  const low = lowestPrice(p);
  return `
  <div class="pcard reveal" data-id="${p.id}" data-cat="${p.category}" data-name="${p.name.toLowerCase()}">
    ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
    <div class="icon-wrap" style="--tile:${p.tile}">
      <img src="${productImagePath(p.id)}" alt="${p.name}" loading="lazy"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <span class="icon-fallback">${p.short}</span>
    </div>
    <div>
      <span class="cat-tag">${categoryLabel(p.category)}</span>
      <h3>${p.name}</h3>
    </div>
    <div class="variants-count">${p.variants.length} pilihan paket</div>
    <div class="price-row">
      <span class="from">Mulai dari</span>
      <span class="price">${formatRupiah(low)}</span>
    </div>
    <button class="btn btn-primary btn-block btn-sm" onclick="openOrderModal('${p.id}')">Pesan Sekarang</button>
  </div>`;
}

function renderGrid(targetId, list){
  const el = document.getElementById(targetId);
  if(!el) return;
  if(list.length === 0){
    el.innerHTML = `<div class="empty-state" style="grid-column:1/-1">Produk tidak ditemukan. Coba kata kunci lain.</div>`;
    return;
  }
  el.innerHTML = list.map(productCardHTML).join('');
  initReveal();
}

/* ---------------- Order Modal ---------------- */
let currentProduct = null;
let selectedVariantIdx = 0;

function ensureModal(){
  if(document.getElementById('orderModal')) return;
  const div = document.createElement('div');
  div.className = 'modal-overlay';
  div.id = 'orderModal';
  div.innerHTML = `
    <div class="modal">
      <div class="modal-head">
        <div class="icon-wrap" id="modalIcon">
          <img id="modalIconImg" src="" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <span class="icon-fallback" id="modalIconFallback">--</span>
        </div>
        <div>
          <h3 id="modalTitle" style="font-size:17px;">Produk</h3>
          <span class="cat-tag" id="modalCat">Kategori</span>
        </div>
        <button class="modal-close" onclick="closeOrderModal()">✕</button>
      </div>
      <div class="variant-list" id="modalVariants"></div>
      <p class="modal-note">Klik "Pesan via WhatsApp" untuk melanjutkan ke admin kami. Chat akan terisi otomatis dengan detail pesananmu — kamu tinggal kirim. Proses instan setelah pembayaran dikonfirmasi.</p>
      <button class="btn btn-wa btn-block" id="modalOrderBtn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Z" opacity=".001"/></svg>
        Pesan via WhatsApp
      </button>
    </div>`;
  document.body.appendChild(div);
  div.addEventListener('click', (e)=>{ if(e.target === div) closeOrderModal(); });
}

function openOrderModal(id){
  ensureModal();
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;
  currentProduct = p;
  selectedVariantIdx = 0;

  document.getElementById('modalIcon').style.setProperty('--tile', p.tile);
  const modalImg = document.getElementById('modalIconImg');
  const modalFallback = document.getElementById('modalIconFallback');
  modalImg.style.display = '';
  modalFallback.style.display = 'none';
  modalImg.src = productImagePath(p.id);
  modalImg.alt = p.name;
  modalFallback.textContent = p.short;
  document.getElementById('modalTitle').textContent = p.name;
  document.getElementById('modalCat').textContent = categoryLabel(p.category);

  const list = document.getElementById('modalVariants');
  list.innerHTML = p.variants.map((v,i)=>`
    <div class="variant ${i===0?'selected':''}" data-idx="${i}">
      <label>
        <input type="radio" name="variant" ${i===0?'checked':''} onchange="selectVariant(${i})">
        ${v.label}
      </label>
      <span class="v-price">${formatRupiah(v.price)}</span>
    </div>
  `).join('');

  updateOrderLink();
  document.getElementById('orderModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function selectVariant(i){
  selectedVariantIdx = i;
  document.querySelectorAll('#modalVariants .variant').forEach((el,idx)=>{
    el.classList.toggle('selected', idx===i);
  });
  updateOrderLink();
}

function updateOrderLink(){
  const btn = document.getElementById('modalOrderBtn');
  if(!currentProduct) return;
  const v = currentProduct.variants[selectedVariantIdx];
  const text = `Halo Admin ${SITE_CONFIG.siteName}, saya mau pesan:%0A%0A🛍️ Produk: ${currentProduct.name}%0A📦 Paket: ${v.label}%0A💰 Harga: ${formatRupiah(v.price)}%0A%0AMohon info langkah pembayarannya. Terima kasih!`;
  btn.onclick = () => window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${text}`, '_blank');
}

function closeOrderModal(){
  const m = document.getElementById('orderModal');
  if(m) m.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeOrderModal(); });

/* ---------------- Katalog page: filter + search ---------------- */
function initKatalogPage(){
  const grid = document.getElementById('katalogGrid');
  if(!grid) return;

  const params = new URLSearchParams(location.search);
  let activeCat = params.get('cat') || 'semua';
  let query = params.get('q') || '';
  const searchInputEl = document.getElementById('searchInput');
  if(searchInputEl && query) searchInputEl.value = query;

  const pillsWrap = document.getElementById('catPills');
  pillsWrap.innerHTML = CATEGORIES.map(c =>
    `<button class="cat-pill ${c.id===activeCat?'active':''}" data-cat="${c.id}">${c.label}</button>`
  ).join('');

  function apply(){
    let list = PRODUCTS;
    if(activeCat !== 'semua') list = list.filter(p => p.category === activeCat);
    if(query.trim()) list = list.filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase()));
    document.getElementById('resultCount').textContent = list.length;
    renderGrid('katalogGrid', list);
  }

  pillsWrap.addEventListener('click', (e)=>{
    const btn = e.target.closest('.cat-pill');
    if(!btn) return;
    activeCat = btn.dataset.cat;
    pillsWrap.querySelectorAll('.cat-pill').forEach(p=>p.classList.toggle('active', p===btn));
    apply();
  });

  const search = document.getElementById('searchInput');
  if(search){
    search.addEventListener('input', (e)=>{ query = e.target.value; apply(); });
  }

  apply();
}

/* ---------------- Home page: populer & terbaru ---------------- */
function initHomePage(){
  const popularEl = document.getElementById('popularGrid');
  const newEl = document.getElementById('newGrid');
  if(popularEl){
    const popular = PRODUCTS.filter(p => p.badge === 'Populer').concat(
      PRODUCTS.filter(p => p.badge !== 'Populer')
    ).slice(0, 8);
    renderGrid('popularGrid', popular);
  }
  if(newEl){
    const fresh = PRODUCTS.filter(p => p.badge === 'Baru').concat(
      [...PRODUCTS].reverse().filter(p => p.badge !== 'Baru')
    ).slice(0, 4);
    renderGrid('newGrid', fresh);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadCatalog();
  initHomePage();
  initKatalogPage();
  initReveal();
});
