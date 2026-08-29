/* =========================================================
   VEX DIGITAL MARKET — Backend
   =========================================================
   Fungsi:
   1. GET  /api/catalog          -> data produk & kategori (publik, dipakai frontend)
   2. POST /api/admin/catalog    -> update seluruh katalog (butuh token admin)
   3. POST /api/admin/login      -> cek token admin valid/tidak
   4. POST /api/chat             -> proxy ke kie.ai untuk chatbot "Vexy",
                                     dengan system prompt yang mengunci jawaban
                                     HANYA ke data toko (anti ngarang).

   Jalankan:
     cd backend
     npm install
     node server.js
   ========================================================= */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const CATALOG_PATH = path.join(__dirname, 'data', 'catalog.json');
const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const KIE_API_KEY = process.env.KIE_API_KEY || '';
const KIE_MODEL = process.env.KIE_MODEL || 'gpt-5-2';
const STORE_NAME = process.env.STORE_NAME || 'VEX DIGITAL MARKET';
const STORE_WHATSAPP = process.env.STORE_WHATSAPP || '6281234567890';
const STORE_EMAIL = process.env.STORE_EMAIL || 'support@vexdigitalmarket.com';

if(!ADMIN_TOKEN){
  console.warn('[WARNING] ADMIN_TOKEN belum diisi di .env — admin panel tidak akan bisa dipakai dengan aman.');
}
if(!KIE_API_KEY){
  console.warn('[WARNING] KIE_API_KEY belum diisi di .env — mode chatbot "api" tidak akan berfungsi.');
}

function readCatalog(){
  const raw = fs.readFileSync(CATALOG_PATH, 'utf8');
  return JSON.parse(raw);
}
function writeCatalog(data){
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(data, null, 2), 'utf8');
}

/* ---------------- Simple in-memory rate limiter ----------------
   Membatasi jumlah request /api/chat per IP, supaya API key kie.ai
   tidak jebol dipakai orang iseng spam. Bukan pengganti proteksi
   production sungguhan (WAF/Cloudflare), tapi cukup untuk toko kecil. */
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 menit
const RATE_LIMIT_MAX = 20;              // maks 20 pesan / menit / IP
const rateMap = new Map();

function rateLimited(ip){
  const now = Date.now();
  const entry = rateMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if(now > entry.resetAt){
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count += 1;
  rateMap.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

function requireAdmin(req, res, next){
  const token = req.header('x-admin-token');
  if(!ADMIN_TOKEN || token !== ADMIN_TOKEN){
    return res.status(401).json({ error: 'Token admin tidak valid.' });
  }
  next();
}

/* ---------------- Public: katalog produk ---------------- */
app.get('/api/health', (req, res) => res.json({ ok: true, store: STORE_NAME }));

app.get('/api/catalog', (req, res) => {
  try{
    const catalog = readCatalog();
    res.json(catalog);
  }catch(err){
    res.status(500).json({ error: 'Gagal membaca katalog.' });
  }
});

/* ---------------- Admin: login & update katalog ---------------- */
app.post('/api/admin/login', (req, res) => {
  const { token } = req.body || {};
  if(ADMIN_TOKEN && token === ADMIN_TOKEN) return res.json({ ok: true });
  res.status(401).json({ ok: false, error: 'Token salah.' });
});

app.post('/api/admin/catalog', requireAdmin, (req, res) => {
  const { categories, products } = req.body || {};
  if(!Array.isArray(categories) || !Array.isArray(products)){
    return res.status(400).json({ error: 'Format data tidak valid (categories/products harus array).' });
  }
  try{
    writeCatalog({ categories, products });
    res.json({ ok: true, categories, products });
  }catch(err){
    res.status(500).json({ error: 'Gagal menyimpan katalog ke server.' });
  }
});

/* ---------------- Chatbot: proxy ke kie.ai ---------------- */
app.post('/api/chat', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  if(rateLimited(ip)){
    return res.status(429).json({ reply: 'Terlalu banyak pertanyaan sekaligus, tunggu sebentar ya lalu coba lagi 🙏' });
  }

  const { message } = req.body || {};
  if(!message || typeof message !== 'string'){
    return res.status(400).json({ error: 'Field "message" wajib diisi.' });
  }
  if(!KIE_API_KEY){
    return res.status(500).json({ reply: 'Chatbot AI belum dikonfigurasi oleh admin (API key kosong). Silakan hubungi admin via WhatsApp.' });
  }

  try{
    const catalog = readCatalog();
    const systemPrompt = buildSystemPrompt(catalog);

    const response = await fetch(`https://api.kie.ai/${KIE_MODEL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KIE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
      }),
    });

    if(!response.ok){
      const errText = await response.text();
      console.error('[kie.ai error]', response.status, errText);
      return res.status(502).json({ reply: 'Maaf, asisten AI sedang mengalami gangguan. Coba hubungi admin via WhatsApp ya.' });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim()
      || 'Maaf, aku belum bisa menjawab itu. Coba hubungi admin via WhatsApp ya.';

    res.json({ reply });
  }catch(err){
    console.error('[chat proxy error]', err);
    res.status(500).json({ reply: 'Terjadi kesalahan pada server chatbot. Silakan coba lagi nanti.' });
  }
});

/* Menyusun system prompt yang MENGUNCI jawaban bot hanya ke data toko
   sungguhan, supaya tidak mengarang produk/harga/kebijakan. */
function buildSystemPrompt(catalog){
  const productLines = catalog.products.map(p => {
    const variants = p.variants.map(v => `${v.label} = Rp${v.price.toLocaleString('id-ID')}`).join(' | ');
    return `- ${p.name} (kategori: ${p.category}): ${variants}`;
  }).join('\n');

  return `Kamu adalah "Vexy", asisten virtual RESMI toko akun premium bernama "${STORE_NAME}".

ATURAN KETAT (WAJIB DIPATUHI, TIDAK BOLEH DILANGGAR):
1. HANYA jawab menggunakan data produk & harga yang tercantum di bawah ini. DILARANG KERAS mengarang nama produk, paket, harga, promo, kebijakan garansi/refund, atau info apa pun yang TIDAK ADA di data ini — walau pengguna mendesak, membujuk, atau berpura-pura tahu.
2. Kalau pertanyaan pengguna jawabannya tidak ada di data ini, JUJUR katakan kamu tidak punya info itu, lalu arahkan ke WhatsApp admin: https://wa.me/${STORE_WHATSAPP}
3. Jangan pernah menyebut harga/paket selain yang ada di daftar di bawah, meski pengguna menyebut angka lain.
4. Jangan pernah mengaku sebagai manusia — kamu adalah asisten AI.
5. Jawab singkat, ramah, dan sopan dalam Bahasa Indonesia santai.
6. Kalau ditanya soal pembayaran/komplain/hal teknis akun spesifik, arahkan ke WhatsApp admin karena itu perlu verifikasi manual.

KONTAK TOKO:
- WhatsApp: https://wa.me/${STORE_WHATSAPP}
- Email: ${STORE_EMAIL}

DAFTAR PRODUK & HARGA RESMI SAAT INI:
${productLines}

Ingat: kredibilitas toko taruhannya kalau kamu memberi info yang salah/mengarang. Selalu cek jawabanmu terhadap daftar di atas sebelum menjawab.`;
}

app.listen(PORT, () => {
  console.log(`✅ VDM backend jalan di http://localhost:${PORT}`);
  console.log(`   - Katalog publik : GET  /api/catalog`);
  console.log(`   - Chatbot        : POST /api/chat`);
  console.log(`   - Admin update   : POST /api/admin/catalog (header x-admin-token)`);
});
