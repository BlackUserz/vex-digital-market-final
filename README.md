# VEX DIGITAL MARKET (VDM)

Website toko akun premium — frontend 100% HTML/CSS/JS murni (tanpa build step), fully responsive, lengkap dengan chatbot AI 24 jam dan Admin Panel untuk kelola produk tanpa buka kode.

## 📁 Struktur Folder
```
vex-digital-market/
├── index.html            → Beranda
├── katalog.html          → Semua produk + filter kategori + search
├── bantuan.html          → FAQ + kontak + chatbot
├── leaderboard.html      → Papan peringkat pelanggan
├── tentang.html          → Tentang kami
├── legal.html            → Privacy / Terms / Refund
├── admin.html            → 🔒 Admin Panel (kelola kategori & produk)
├── css/style.css         → Seluruh styling (tema warna via CSS variable)
├── assets/products/      → Foto/ikon tiap produk (lihat bagian di bawah)
├── js/
│   ├── config.js         → Nomor WA, email, warna tema, URL backend, konfigurasi chatbot
│   ├── data.js            → Data produk & kategori BAWAAN (dipakai kalau backend belum aktif)
│   ├── store.js           → Pengambil katalog dari backend (kalau sudah di-deploy)
│   ├── components.js     → Navbar, footer, logo VDM
│   ├── main.js            → Render produk, filter, modal order
│   ├── chatbot.js         → Widget chat "Vexy" (24 jam)
│   └── admin.js           → Logic Admin Panel (CRUD kategori/produk)
└── backend/               → Server Node.js kecil (opsional) untuk chatbot AI sungguhan + Admin Panel
    ├── server.js
    ├── package.json
    ├── .env               → API key kie.ai & token admin (RAHASIA, lihat backend/README.md)
    ├── data/catalog.json  → Sumber data katalog kalau backend dipakai
    └── README.md          → Panduan lengkap deploy backend
```

## 🚀 Cara Menjalankan (situs utama, tanpa backend)
Cukup buka `index.html` langsung di browser, atau jalankan local server (disarankan agar semua fitur normal):
```bash
# Python
python3 -m http.server 8080
# lalu buka http://localhost:8080
```
Setelah siap, upload seluruh folder ini ke hosting statis (Netlify, Vercel, GitHub Pages, cPanel, dsb). **Tanpa backend sama sekali, situs tetap 100% jalan** — chatbot pakai mode Smart-FAQ, dan katalog produk pakai data bawaan di `js/data.js`.

Kalau kamu mau chatbot AI sungguhan (kie.ai) dan/atau Admin Panel yang beneran menyimpan perubahan untuk semua pengunjung, ikuti **`backend/README.md`** untuk deploy backend-nya (butuh sedikit langkah teknis, tapi sudah dijelaskan lengkap step-by-step).

## ⚙️ Konfigurasi Cepat (`js/config.js`)
| Setting | Fungsi |
|---|---|
| `whatsapp` | Nomor WA admin (format `62xxxxxxxxxx`, tanpa tanda `+`) |
| `email` | Email support |
| `themeColors` | Warna utama situs (info saja — warna asli diatur di `css/style.css` var `--primary/--primary-2/--accent`, satu tempat, otomatis berubah di semua elemen termasuk efek kilatan logo) |
| `apiBase` | URL backend (kosongkan kalau belum deploy backend — lihat `backend/README.md`) |
| `CHAT_CONFIG.mode` | `'local'` (Smart-FAQ, tanpa API key) atau `'api'` (chatbot AI sungguhan via backend) |

## 🛍️ Mengubah Produk & Harga
**Cara mudah (tanpa kode):** deploy backend (lihat `backend/README.md`), lalu kelola semuanya lewat **`admin.html`** — tambah/edit/hapus kategori & produk dari form, klik simpan, langsung tayang ke semua pengunjung.

**Cara manual (edit kode):** edit langsung array `PRODUCTS` di `js/data.js` — ini juga jadi data "cadangan" yang dipakai kalau backend sedang mati. Setiap produk punya:
```js
{
  id: 'netflix', name: 'Netflix Premium', category: 'streaming', short: 'NF', tile: TILE.pinkViolet, badge: 'Populer',
  variants: [
    { label: '1 Bulan Sharing (1U)', price: 42000 },
  ],
}
```
`category` harus salah satu id yang ada di `CATEGORIES` (default: `streaming`, `design`, `editing`, `ai`, `productivity` — kategori "Semua" otomatis menampilkan gabungan semuanya).

## 🤖 Chatbot AI 24 Jam
Situs ini menyertakan chatbot **"Vexy"** dengan dua mode:

### Mode `local` (default, tanpa API key/backend)
Menjawab otomatis berdasarkan basis pengetahuan toko (nama produk, harga, cara order, metode pembayaran, garansi) — langsung berfungsi tanpa setup tambahan.

### Mode `api` (chatbot AI sungguhan via kie.ai — sudah disiapkan)
Backend di folder `backend/` sudah dikonfigurasi untuk memakai **kie.ai** sebagai penyedia model AI (API key kamu sudah ditaruh di `backend/.env`, BUKAN di file frontend, demi keamanan). Setelah backend di-deploy (panduan lengkap: `backend/README.md`) dan `SITE_CONFIG.apiBase` diisi di `js/config.js`, tinggal ubah:
```js
CHAT_CONFIG.mode = 'api';
```
Vexy langsung berubah jadi asisten AI sungguhan, tetap online 24/7.

**Anti-ngarang:** setiap request ke chatbot, backend menyisipkan instruksi ketat + daftar produk & harga ASLI dari `backend/data/catalog.json`, dan melarang Vexy menjawab di luar data itu — kalau tidak tahu, dia akan jujur bilang tidak tahu dan mengarahkan ke WhatsApp admin, bukan mengarang. Detail lengkap ada di `backend/README.md` bagian "Anti Ngarang".

## 🔐 Admin Panel (`admin.html`)
Halaman untuk **tambah, edit, hapus kategori & produk** tanpa perlu buka file kode:
- Login pakai `ADMIN_TOKEN` dari `backend/.env`.
- Butuh backend aktif (lihat `backend/README.md`) — tanpa backend, halaman ini akan menampilkan pesan bahwa backend belum terhubung.
- Perubahan yang disimpan langsung tersimpan di server (`backend/data/catalog.json`) dan langsung tampil ke SEMUA pengunjung situs, bukan cuma di browser admin.
- Link menuju halaman ini ada di footer paling bawah ("Admin") — kamu bisa hapus link itu di `js/components.js` kalau mau disembunyikan dari publik (tokennya tetap jadi satu-satunya pengaman kalau linknya ditemukan orang lain).


## 🖼️ Mengganti Foto/Ikon Produk
Setiap produk sudah punya file gambar sendiri di `assets/products/<id>.png` (contoh: `assets/products/netflix.png`) — saat ini berisi ikon placeholder bergradasi warna + kode singkatan, supaya kamu tinggal **timpa file-nya** dengan logo/screenshot asli aplikasi.

Cara ganti:
1. Siapkan gambar baru (disarankan persegi, minimal 300×300px, format `.png` atau `.jpg`).
2. Beri nama file **persis sama** dengan `id` produknya (lihat `js/data.js`), misalnya untuk Netflix → `netflix.png`.
3. Timpa (replace) file lama di folder `assets/products/` dengan file barumu.
4. Refresh browser — gambar otomatis muncul di kartu produk & popup pemesanan, tanpa perlu ubah kode apa pun.

Kalau file gambar suatu produk dihapus/hilang, tampilan otomatis kembali ke ikon huruf singkatan (fallback) sehingga tampilan tidak pernah rusak/kosong.

Daftar file yang perlu diganti (sesuai `id` di `js/data.js`):
`viu, youtube, primevideo, netflix, vidio, loklok, bstation, hbo, iqiyi, wetv, disney, canva, alight, capcut, picsart, lightroom, chatgpt, getcontact, wattpad`

## 🎨 Logo "VDM · VEX DIGITAL MARKET"
Logo dibuat sebagai SVG + CSS (bukan file gambar) di `js/components.js` fungsi `brandMarkSVG()` / `brandHTML()`:
- Ikon bernuansa **tas** dengan monogram **VDM** di dalamnya.
- Efek **kilatan cahaya** yang menyapu logo secara berkala (`.flash`, animasi `brandFlash`), warnanya otomatis mengikuti variabel warna utama situs (`var(--accent)` / `var(--primary)`).
- Animasi masuk (scale + fade) saat halaman pertama kali dimuat (`.brand-enter`).
- Teks **"VEX DIGITAL MARKET"** ditampilkan kecil di samping logogram, sesuai referensi.

Jika suatu saat ingin mengganti dengan file logo asli (PNG/SVG hasil desain final), tinggal ganti isi `brandMarkSVG()` dengan `<img src="assets/logo.svg">`.

## 📱 Responsive
Layout memakai CSS Grid + Flexbox dengan breakpoint di `1024px`, `900px`, `760px`, `640px`, `520px`, `460px` — teruji untuk mobile, tablet, dan desktop.

## ⚠️ Catatan Penting
1. **Referensi desain**: Struktur & alur halaman (navbar, hero, kategori, kartu fitur, footer) dibangun berdasarkan pola umum toko akun premium sejenis referensi yang diberikan — bukan hasil salin kode/aset asli situs lain, karena meniru kode & aset pihak lain 1:1 berpotensi melanggar hak cipta. Palet warna, ilustrasi, dan salinan teks pada situs ini original untuk brand **VEX DIGITAL MARKET**.
2. Ganti nomor WhatsApp, email, dan harga sesuai kondisi bisnismu sebelum go-live.
3. Pastikan kamu memiliki hak jual/lisensi resmi untuk setiap akun premium yang dijual, sesuai ketentuan masing-masing platform.
4. **Keamanan API key & token admin**: keduanya sudah ditaruh di `backend/.env`, bukan di file frontend, supaya tidak bisa dicuri lewat "View Page Source". Jangan pernah upload folder `backend/` ke hosting statis publik (Netlify/GitHub Pages) — folder itu harus dijalankan sebagai server terpisah (lihat `backend/README.md`). Sebaiknya regenerate API key kie.ai-mu setelah setup selesai, karena key itu sempat diketik di percakapan chat.
