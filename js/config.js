/* =========================================================
   VEX DIGITAL MARKET — Konfigurasi Global
   Ubah nilai di file ini untuk menyesuaikan toko tanpa
   menyentuh kode HTML/CSS lainnya.
   ========================================================= */

const SITE_CONFIG = {
  siteName: 'VEX DIGITAL MARKET',
  shortName: 'VDM',
  tagline: 'Toko Akun Premium Terpercaya #1',

  // Nomor WhatsApp admin/CS (format internasional tanpa "+")
  whatsapp: '6281234567890',

  // Email support
  email: 'support@vexdigitalmarket.com',

  // Warna tema utama — ganti nilai ini untuk mengubah seluruh
  // aksen warna situs (termasuk efek kilatan pada logo),
  // karena semua elemen memakai CSS variable --primary/--accent.
  themeColors: {
    primary: '#f6c453',
    primary2: '#d68f1f',
    accent: '#ffd873',
  },

  // =======================================================
  // BACKEND (opsional, untuk Chatbot AI sungguhan + Admin Panel)
  // =======================================================
  // Kosongkan ('') selama backend belum di-deploy — situs akan
  // memakai data bawaan di js/data.js dan chatbot mode "local".
  //
  // Setelah kamu men-deploy folder /backend (lihat backend/README.md)
  // ke layanan seperti Render/Railway/VPS, isi URL-nya di sini,
  // contoh: 'https://vdm-backend.onrender.com' (TANPA slash di akhir).
  //
  // Begitu diisi, situs otomatis:
  //  1. Mengambil katalog produk dari server (bukan cuma dari file js/data.js),
  //     sehingga perubahan lewat Admin Panel langsung tampil ke SEMUA pengunjung.
  //  2. Bisa dipakai chatbot AI sungguhan kalau CHAT_CONFIG.mode diisi 'api'.
  apiBase: '',
};

/* =========================================================
   KONFIGURASI CHATBOT AI (24 JAM)
   =========================================================
   Model AI: kie.ai (https://kie.ai) — satu API key untuk banyak
   pilihan model (GPT, Claude, Gemini, Grok). Key kamu sudah
   disiapkan di backend/.env, TIDAK di file frontend ini demi
   keamanan (lihat backend/README.md untuk cara deploy).

   Chatbot "Vexy" akan selalu dibatasi lewat system prompt di
   backend agar HANYA menjawab berdasarkan data toko yang
   sebenarnya (produk, harga, kontak) — kalau tidak tahu, dia akan
   jujur bilang tidak tahu & mengarahkan ke WhatsApp admin,
   bukan mengarang jawaban.

   mode: 'local' -> Smart-FAQ bawaan (tanpa server, langsung jalan)
   mode: 'api'   -> pakai AI sungguhan lewat backend kie.ai kamu
   ========================================================= */
const CHAT_CONFIG = {
  mode: 'local',              // ganti ke 'api' SETELAH backend selesai di-deploy & SITE_CONFIG.apiBase diisi
  apiEndpoint: '',            // kosongkan saja — otomatis memakai `${SITE_CONFIG.apiBase}/api/chat`
  botName: 'Vexy',
  welcomeMessage: 'Halo! 👋 Aku Vexy, asisten virtual VEX DIGITAL MARKET. Siap bantu kamu 24 jam untuk pertanyaan produk, harga, cara order, sampai kendala akun. Mau tanya apa?',
};
