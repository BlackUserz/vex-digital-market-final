/* =========================================================
   VEX DIGITAL MARKET — Catalog Loader
   =========================================================
   Kalau SITE_CONFIG.apiBase kosong -> pakai PRODUCTS/CATEGORIES
   bawaan dari js/data.js (situs tetap 100% berfungsi tanpa backend).

   Kalau SITE_CONFIG.apiBase diisi -> ambil katalog terbaru dari
   backend (yang bisa diubah lewat admin.html), supaya perubahan
   produk/kategori langsung tampil ke SEMUA pengunjung tanpa perlu
   edit kode sama sekali.
   ========================================================= */

let _catalogLoaded = false;

async function loadCatalog(){
  if(_catalogLoaded) return;      // hindari fetch berulang di halaman yang sama
  if(!SITE_CONFIG.apiBase){
    _catalogLoaded = true;
    return; // offline mode: tetap pakai data bawaan js/data.js
  }
  try{
    const res = await fetch(`${SITE_CONFIG.apiBase}/api/catalog`, { cache: 'no-store' });
    if(!res.ok) throw new Error('Gagal mengambil katalog dari backend (' + res.status + ')');
    const data = await res.json();
    if(Array.isArray(data.categories) && data.categories.length){
      CATEGORIES = data.categories;
    }
    if(Array.isArray(data.products) && data.products.length){
      PRODUCTS = data.products;
    }
  }catch(err){
    console.warn('[VDM] Tidak bisa memuat katalog dari backend, memakai data bawaan:', err.message);
  }
  _catalogLoaded = true;
}
