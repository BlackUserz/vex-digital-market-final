/* =========================================================
   VEX DIGITAL MARKET — Admin Panel Logic
   ========================================================= */

let adminCategories = [];
let adminProducts = [];
let adminToken = null;
let editingProductId = null;

function slugify(str){
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function apiUrl(path){
  return `${SITE_CONFIG.apiBase}${path}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const loginBox = document.getElementById('loginBox');

  if(!SITE_CONFIG.apiBase){
    loginBox.innerHTML = `
      <span class="eyebrow">⚠️ Backend Belum Terhubung</span>
      <h1 style="font-size:22px;margin:14px 0 6px">Admin Panel Butuh Backend</h1>
      <p style="font-size:13.5px">Isi <code>SITE_CONFIG.apiBase</code> di <code>js/config.js</code> dengan URL backend yang sudah di-deploy (lihat panduan di <code>backend/README.md</code>), lalu buka halaman ini lagi.</p>`;
    return;
  }

  // auto-login kalau token tersimpan di sesi ini
  const savedToken = sessionStorage.getItem('vdm_admin_token');
  if(savedToken){
    tryLogin(savedToken);
  }

  document.getElementById('loginBtn').addEventListener('click', () => {
    const val = document.getElementById('tokenInput').value.trim();
    if(val) tryLogin(val);
  });
  document.getElementById('tokenInput').addEventListener('keydown', (e) => {
    if(e.key === 'Enter') document.getElementById('loginBtn').click();
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('vdm_admin_token');
    location.reload();
  });

  document.getElementById('addCatBtn').addEventListener('click', addCategory);
  document.getElementById('addProdBtn').addEventListener('click', () => openProductModal(null));
  document.getElementById('prodModalClose').addEventListener('click', closeProductModal);
  document.getElementById('addVariantBtn').addEventListener('click', () => addVariantRow({ label: '', price: 0 }));
  document.getElementById('saveProdBtn').addEventListener('click', saveProductFromForm);
  document.getElementById('saveBtn').addEventListener('click', saveCatalogToServer);
  document.getElementById('reloadBtn').addEventListener('click', () => {
    if(confirm('Muat ulang dari server? Perubahan yang belum disimpan akan hilang.')) fetchCatalog();
  });
  document.getElementById('prodModal').addEventListener('click', (e) => {
    if(e.target.id === 'prodModal') closeProductModal();
  });
});

async function tryLogin(token){
  try{
    const res = await fetch(apiUrl('/api/admin/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if(!res.ok) throw new Error('unauthorized');
    adminToken = token;
    sessionStorage.setItem('vdm_admin_token', token);
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('adminContent').style.display = 'block';
    fetchCatalog();
  }catch(err){
    document.getElementById('loginError').style.display = 'block';
    sessionStorage.removeItem('vdm_admin_token');
  }
}

async function fetchCatalog(){
  try{
    const res = await fetch(apiUrl('/api/catalog'), { cache: 'no-store' });
    const data = await res.json();
    adminCategories = data.categories || [];
    adminProducts = data.products || [];
    renderCategoryChips();
    renderProductTable();
  }catch(err){
    toast('Gagal memuat katalog dari server.');
  }
}

/* ---------------- Kategori ---------------- */
function renderCategoryChips(){
  const wrap = document.getElementById('catChipRow');
  wrap.innerHTML = adminCategories.map(c => `
    <span class="cat-chip">
      ${c.label} <span style="color:var(--text-faint);font-size:11px">(${c.id})</span>
      ${c.id !== 'semua' ? `<button onclick="deleteCategory('${c.id}')" title="Hapus kategori">✕</button>` : ''}
    </span>
  `).join('');
}

function addCategory(){
  const input = document.getElementById('newCatLabel');
  const label = input.value.trim();
  if(!label) return;
  const id = slugify(label);
  if(!id || adminCategories.some(c => c.id === id)){
    toast('Kategori dengan nama/ID itu sudah ada.');
    return;
  }
  adminCategories.push({ id, label });
  input.value = '';
  renderCategoryChips();
  refreshCategorySelect();
}

function deleteCategory(id){
  if(!confirm('Hapus kategori ini? Produk yang memakainya tidak akan terhapus, tapi tidak akan muncul di tab kategori ini lagi.')) return;
  adminCategories = adminCategories.filter(c => c.id !== id);
  renderCategoryChips();
  refreshCategorySelect();
}

/* ---------------- Produk: tabel ---------------- */
function renderProductTable(){
  const body = document.getElementById('prodTableBody');
  document.getElementById('prodCount').textContent = `${adminProducts.length} produk`;
  if(adminProducts.length === 0){
    body.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-faint);padding:24px">Belum ada produk.</td></tr>`;
    return;
  }
  body.innerHTML = adminProducts.map(p => {
    const low = Math.min(...p.variants.map(v => v.price));
    const catLabel = (adminCategories.find(c => c.id === p.category) || {}).label || p.category;
    return `
    <tr>
      <td><b>${p.name}</b><br><span style="color:var(--text-faint);font-size:11.5px">${p.id}</span></td>
      <td>${catLabel}</td>
      <td>${p.badge ? p.badge : '-'}</td>
      <td>${p.variants.length} paket</td>
      <td>Rp${low.toLocaleString('id-ID')}</td>
      <td>
        <div class="row-actions">
          <button onclick="openProductModal('${p.id}')" title="Edit">✎</button>
          <button class="del" onclick="deleteProduct('${p.id}')" title="Hapus">🗑</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function deleteProduct(id){
  if(!confirm('Hapus produk ini dari katalog?')) return;
  adminProducts = adminProducts.filter(p => p.id !== id);
  renderProductTable();
}

/* ---------------- Produk: modal tambah/edit ---------------- */
function refreshCategorySelect(){
  const sel = document.getElementById('f_category');
  const current = sel.value;
  sel.innerHTML = adminCategories.filter(c => c.id !== 'semua').map(c => `<option value="${c.id}">${c.label}</option>`).join('');
  if(current) sel.value = current;
}

function openProductModal(id){
  editingProductId = id;
  refreshCategorySelect();
  const modal = document.getElementById('prodModal');
  const idField = document.getElementById('f_id');

  if(id){
    const p = adminProducts.find(x => x.id === id);
    document.getElementById('prodModalTitle').textContent = 'Edit Produk';
    document.getElementById('f_name').value = p.name;
    idField.value = p.id;
    idField.disabled = true;
    document.getElementById('f_category').value = p.category;
    document.getElementById('f_short').value = p.short;
    document.getElementById('f_tile').value = p.tile;
    document.getElementById('f_badge').value = p.badge || '';
    renderVariantEditor(p.variants);
  }else{
    document.getElementById('prodModalTitle').textContent = 'Tambah Produk';
    document.getElementById('f_name').value = '';
    idField.value = '';
    idField.disabled = false;
    document.getElementById('f_short').value = '';
    document.getElementById('f_badge').value = '';
    renderVariantEditor([{ label: '', price: 0 }]);
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal(){
  document.getElementById('prodModal').classList.remove('open');
  document.body.style.overflow = '';
}

function renderVariantEditor(variants){
  const wrap = document.getElementById('variantEditor');
  wrap.innerHTML = '';
  variants.forEach(v => addVariantRow(v));
}

function addVariantRow(variant){
  const wrap = document.getElementById('variantEditor');
  const row = document.createElement('div');
  row.className = 'variant-editor-row';
  row.innerHTML = `
    <input type="text" class="v-label" placeholder="Contoh: 1 Bulan Sharing" value="${variant.label || ''}">
    <input type="number" class="v-price" placeholder="Harga (angka)" min="0" step="500" value="${variant.price || ''}">
    <button type="button" title="Hapus paket">✕</button>`;
  row.querySelector('button').addEventListener('click', () => row.remove());
  wrap.appendChild(row);
}

function saveProductFromForm(){
  const name = document.getElementById('f_name').value.trim();
  let id = document.getElementById('f_id').value.trim();
  const category = document.getElementById('f_category').value;
  const short = document.getElementById('f_short').value.trim().toUpperCase();
  const tile = document.getElementById('f_tile').value;
  const badge = document.getElementById('f_badge').value.trim() || null;

  if(!name || !category || !short){
    toast('Nama, kategori, dan kode singkat wajib diisi.');
    return;
  }
  if(!editingProductId){
    id = slugify(id || name);
    if(!id){ toast('ID produk tidak valid.'); return; }
    if(adminProducts.some(p => p.id === id)){
      toast('ID produk ini sudah dipakai, pakai ID lain.');
      return;
    }
  }else{
    id = editingProductId;
  }

  const variants = Array.from(document.querySelectorAll('#variantEditor .variant-editor-row')).map(row => ({
    label: row.querySelector('.v-label').value.trim(),
    price: parseInt(row.querySelector('.v-price').value, 10) || 0,
  })).filter(v => v.label && v.price > 0);

  if(variants.length === 0){
    toast('Tambahkan minimal 1 paket dengan label & harga yang valid.');
    return;
  }

  const productObj = { id, name, category, short, tile, badge, variants };

  if(editingProductId){
    const idx = adminProducts.findIndex(p => p.id === editingProductId);
    adminProducts[idx] = productObj;
  }else{
    adminProducts.push(productObj);
  }

  closeProductModal();
  renderProductTable();
  toast(editingProductId ? 'Produk diperbarui (belum tersimpan ke server).' : 'Produk ditambahkan (belum tersimpan ke server).');
}

/* ---------------- Simpan ke server ---------------- */
async function saveCatalogToServer(){
  try{
    const res = await fetch(apiUrl('/api/admin/catalog'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken,
      },
      body: JSON.stringify({ categories: adminCategories, products: adminProducts }),
    });
    if(res.status === 401){
      toast('Token admin tidak valid, silakan login ulang.');
      sessionStorage.removeItem('vdm_admin_token');
      setTimeout(() => location.reload(), 1200);
      return;
    }
    if(!res.ok) throw new Error('save failed');
    toast('✅ Tersimpan! Perubahan sudah tayang untuk semua pengunjung.');
  }catch(err){
    toast('Gagal menyimpan ke server. Cek koneksi backend.');
  }
}
