# VEX Digital Market — UI/UX Prototype

Versi ini adalah frontend prototype yang menggabungkan blueprint yang disepakati: toko publik, dashboard customer, sidebar, preference, product cards, carousel, checkout gate, pesanan, pengaturan, pusat bantuan, dan artwork produk lokal.

## Deploy GitHub → Netlify
- Upload seluruh isi folder ini ke root repository GitHub.
- Import repository tersebut di Netlify.
- Build command: kosong.
- Publish directory: `.`.

## Catatan
Authentication Google, email delivery Resend, payment gateway, database, inventory credential, webhook, dan digital delivery belum terhubung ke layanan production. Tombol Google/login/payment pada prototype menggunakan simulasi browser agar alur UI dapat diuji tanpa credential nyata.

Data demo tersimpan di localStorage browser.

## Admin Panel
Prototype Admin Panel tersedia di `admin.html` dan mencakup Dashboard, Pesanan/status, Produk (tambah/edit/hapus), Inventory/Stok, Voucher & Promo, Customer, Tampilan Toko, dan Pengaturan. Data prototype menggunakan localStorage browser. Untuk production, admin wajib dipindahkan ke backend dengan authentication + role-based access control, database, audit log, dan server-side validation.
