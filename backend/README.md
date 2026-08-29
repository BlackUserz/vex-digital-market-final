# Backend VEX DIGITAL MARKET

Backend kecil (Node.js + Express) untuk dua fitur:
1. **Chatbot AI sungguhan** ("Vexy") — proxy aman ke [kie.ai](https://kie.ai), API key tidak pernah tampil di browser.
2. **Admin Panel** (`admin.html` di folder utama) — tambah/edit/hapus kategori & produk tanpa buka kode, tersimpan di server sehingga langsung tampil ke SEMUA pengunjung situs.

Kalau kamu belum butuh dua fitur ini, **boleh diabaikan** — situs utama (index.html, katalog.html, dst.) tetap 100% jalan tanpa backend, memakai data bawaan di `js/data.js` dan chatbot mode "Smart-FAQ".

---

## 1. Jalankan di komputer sendiri (uji coba lokal)

```bash
cd backend
npm install
npm start
```
Server jalan di `http://localhost:3000`. Cek dengan buka `http://localhost:3000/api/health` di browser — kalau muncul `{"ok":true,...}` berarti sudah jalan.

## 2. Isi kredensial di `.env`

File `backend/.env` **sudah diisi otomatis** dengan:
- `KIE_API_KEY` — API key kie.ai kamu (untuk chatbot AI)
- `ADMIN_TOKEN` — token acak untuk login ke Admin Panel
- `STORE_WHATSAPP`, `STORE_EMAIL`, `STORE_NAME` — dipakai chatbot saat menjawab

⚠️ **PENTING SOAL KEAMANAN**
- Jangan pernah upload/commit file `.env` ke repository publik (GitHub/GitLab). File `.gitignore` sudah disiapkan agar `.env` otomatis diabaikan git.
- Karena API key kie.ai ini sempat kamu ketik di chat, sebaiknya **generate ulang (regenerate) key tersebut** di dashboard kie.ai (https://kie.ai/api-key) setelah proyek ini jalan, lalu update `.env` dengan key yang baru — supaya key lama yang pernah "terlihat" tidak lagi aktif.
- Simpan `ADMIN_TOKEN` baik-baik. Siapa pun yang punya token ini bisa mengubah seluruh katalog produkmu lewat Admin Panel.

## 3. Deploy ke hosting (supaya online 24 jam)

Backend ini bisa di-deploy gratis/murah ke banyak tempat. Contoh dengan **Render.com** (gratis untuk trafik kecil):
1. Buat akun di https://render.com, pilih **New → Web Service**.
2. Upload/hubungkan folder `backend/` ini (via GitHub repo, atau upload manual).
3. Build Command: `npm install` — Start Command: `npm start`.
4. Di bagian **Environment Variables**, masukkan isi `.env` satu-satu (KIE_API_KEY, ADMIN_TOKEN, KIE_MODEL, STORE_NAME, STORE_WHATSAPP, STORE_EMAIL) — **jangan** upload file `.env` langsung ke repo publik, isi manual lewat dashboard Render.
5. Setelah deploy selesai, kamu akan dapat URL seperti `https://vdm-backend.onrender.com`.

Alternatif lain: Railway.app, Fly.io, atau VPS sendiri (pakai `pm2` agar server tetap jalan setelah restart).

## 4. Sambungkan frontend ke backend

Buka `js/config.js` di folder utama, isi:
```js
apiBase: 'https://vdm-backend.onrender.com',   // URL backend kamu, TANPA slash di akhir
```
Lalu di file yang sama, bagian `CHAT_CONFIG`, ubah:
```js
mode: 'api',   // dari 'local' jadi 'api'
```
Setelah itu:
- Chatbot "Vexy" otomatis menjawab pakai AI sungguhan (kie.ai), dengan jawaban dikunci hanya ke data produk asli tokomu (lihat bagian "Anti Ngarang" di bawah).
- Katalog produk (index, katalog.html) otomatis diambil dari backend, sehingga perubahan lewat Admin Panel langsung tampil ke semua pengunjung.

## 5. Pakai Admin Panel

1. Buka `admin.html` di browser (setelah `apiBase` di `js/config.js` diisi).
2. Masukkan **ADMIN_TOKEN** dari `.env` untuk login.
3. Tambah/edit/hapus kategori & produk lewat form yang tersedia, lalu klik **Simpan ke Server**.
4. Perubahan langsung tersimpan di `backend/data/catalog.json` dan langsung terlihat oleh semua pengunjung situs.

Catatan: kalau kamu menambah produk baru lewat Admin Panel, foto produknya akan otomatis pakai ikon huruf (fallback) karena tidak ada file gambar bawaan untuknya — kamu bisa menambahkan file `assets/products/<id-produk>.png` secara manual ke server/hosting untuk mengganti ikon huruf itu dengan gambar asli.

## 6. Fitur "Anti Ngarang" pada Chatbot

Setiap request ke chatbot, backend menyusun ulang instruksi (system prompt) yang **mengunci jawaban Vexy hanya ke data produk & harga yang benar-benar ada** di `backend/data/catalog.json` saat itu juga. Kalau ditanya sesuatu di luar data ini, Vexy diinstruksikan untuk jujur bilang tidak tahu dan mengarahkan ke WhatsApp admin — bukan mengarang jawaban.

Ini sangat mengurangi risiko halusinasi, tapi seperti semua AI, **tidak bisa dijamin 100% sempurna**. Untuk hal-hal krusial seperti komplain, pembayaran, atau kebijakan khusus, tetap arahkan pelanggan ke admin manusia via WhatsApp.

## 7. Mengganti model AI

Model default: `gpt-5-2`. Kie.ai menyediakan banyak pilihan model chat lain yang bisa dicoba (ganti nilai `KIE_MODEL` di `.env`), misalnya:
- `gpt-5-2`, `gpt-5-4`, `gpt-5-5` — seri GPT
- `claude-haiku-4-5`, `claude-sonnet-4-6` — seri Claude (Haiku biasanya lebih murah & cepat, cocok untuk chatbot CS)
- `gemini-3-flash`, `gemini-2-5-flash` — seri Gemini
- `grok-4-3`, `grok-4-5` — seri Grok

Cek daftar lengkap & harga di https://docs.kie.ai/market/quickstart sebelum memilih.

## 8. Endpoint yang tersedia

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/health` | Cek server hidup |
| GET | `/api/catalog` | Ambil data kategori & produk (publik) |
| POST | `/api/admin/login` | Verifikasi token admin |
| POST | `/api/admin/catalog` | Simpan seluruh katalog baru (header `x-admin-token` wajib) |
| POST | `/api/chat` | Kirim pesan ke chatbot, dapat balasan AI |
