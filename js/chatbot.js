/* =========================================================
   VEX DIGITAL MARKET — Chatbot 24 Jam ("Vexy")
   =========================================================
   Dua mode (atur di js/config.js -> CHAT_CONFIG.mode):
     'local' -> Smart-FAQ: mencocokkan pertanyaan dengan basis
                pengetahuan toko (produk, harga, cara order,
                garansi, pembayaran) TANPA butuh API key.
     'api'   -> mengirim pertanyaan ke backend Anda sendiri
                (CHAT_CONFIG.apiEndpoint), yang meneruskannya
                ke model AI seperti OpenAI gpt-4o-mini.
   ========================================================= */

function buildChatWidget(){
  if(document.getElementById('chatFab')) return;

  const fab = document.createElement('button');
  fab.id = 'chatFab';
  fab.className = 'chat-fab';
  fab.setAttribute('aria-label','Chat dengan admin');
  fab.innerHTML = `<span class="dot"></span>
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v11H7l-3 3V4Z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><circle cx="9" cy="9.5" r="1" fill="#fff"/><circle cx="12" cy="9.5" r="1" fill="#fff"/><circle cx="15" cy="9.5" r="1" fill="#fff"/></svg>`;
  document.body.appendChild(fab);

  const panel = document.createElement('div');
  panel.id = 'chatPanel';
  panel.className = 'chat-panel';
  panel.innerHTML = `
    <div class="chat-head">
      <div class="avatar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2 3 7v6c0 5 4 8.5 9 9 5-.5 9-4 9-9V7l-9-5Z" stroke="#fff" stroke-width="1.6"/></svg></div>
      <div>
        <b>${CHAT_CONFIG.botName} · Asisten VDM</b>
        <span>Online 24 Jam</span>
      </div>
      <button class="chat-close" id="chatClose">✕</button>
    </div>
    <div class="chat-body" id="chatBody"></div>
    <div class="chat-quick" id="chatQuick"></div>
    <div class="chat-input">
      <input type="text" id="chatInput" placeholder="Tulis pertanyaanmu..." autocomplete="off">
      <button id="chatSend" aria-label="Kirim">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 20 21 12 4 4l2 8-2 8Z" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/></svg>
      </button>
    </div>`;
  document.body.appendChild(panel);

  fab.addEventListener('click', () => togglePanel(true));
  document.getElementById('chatClose').addEventListener('click', () => togglePanel(false));
  document.getElementById('chatSend').addEventListener('click', sendMessage);
  document.getElementById('chatInput').addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') sendMessage();
  });

  addBotMessage(CHAT_CONFIG.welcomeMessage);
  renderQuickChips([
    'Cara order gimana?',
    'Ada Netflix Premium?',
    'Metode pembayaran?',
    'Garansi berapa lama?',
  ]);

  // auto-open sekali untuk pengunjung baru (ramah, tidak agresif)
  if(!sessionStorage.getItem('vdm_chat_seen')){
    setTimeout(()=>{ togglePanel(true); sessionStorage.setItem('vdm_chat_seen','1'); }, 2200);
  }
}

function togglePanel(open){
  document.getElementById('chatPanel').classList.toggle('open', open);
  if(open) document.getElementById('chatInput').focus();
}

function addUserMessage(text){
  const body = document.getElementById('chatBody');
  const div = document.createElement('div');
  div.className = 'msg user';
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function addBotMessage(html){
  const body = document.getElementById('chatBody');
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = html;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function showTyping(){
  const body = document.getElementById('chatBody');
  const div = document.createElement('div');
  div.className = 'msg bot typing';
  div.id = 'typingIndicator';
  div.innerHTML = '<span></span><span></span><span></span>';
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}
function hideTyping(){
  const t = document.getElementById('typingIndicator');
  if(t) t.remove();
}

function renderQuickChips(list){
  const wrap = document.getElementById('chatQuick');
  wrap.innerHTML = list.map(q => `<button class="chip">${q}</button>`).join('');
  wrap.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      document.getElementById('chatInput').value = chip.textContent;
      sendMessage();
    });
  });
}

async function sendMessage(){
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if(!text) return;
  addUserMessage(text);
  input.value = '';
  showTyping();

  let reply;
  try{
    reply = CHAT_CONFIG.mode === 'api'
      ? await askAIBackend(text)
      : await smartFAQReply(text);
  }catch(err){
    reply = 'Maaf, sistem sedang sibuk. Silakan hubungi admin langsung via WhatsApp untuk respon cepat.';
  }

  hideTyping();
  addBotMessage(reply);
}

/* -------- Mode 'api': hubungkan ke backend AI (kie.ai) milikmu -------- */
async function askAIBackend(userText){
  const endpoint = CHAT_CONFIG.apiEndpoint || (SITE_CONFIG.apiBase ? `${SITE_CONFIG.apiBase}/api/chat` : '');
  if(!endpoint) throw new Error('Backend belum diatur (SITE_CONFIG.apiBase kosong)');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userText }),
  });
  if(!res.ok) throw new Error('API error');
  const data = await res.json();
  return data.reply || 'Maaf, aku belum bisa menjawab itu. Coba tanya admin langsung ya.';
}

/* -------- Mode 'local': Smart-FAQ (rule + pencarian produk) -------- */
async function smartFAQReply(raw){
  await new Promise(r => setTimeout(r, 500 + Math.random()*500)); // rasa "mengetik"
  const t = raw.toLowerCase();

  // 1) Coba cocokkan nama produk
  const found = PRODUCTS.find(p => t.includes(p.name.toLowerCase().split(' ')[0].toLowerCase()));
  if(found){
    const variantLines = found.variants.map(v => `• ${v.label} — <b>${formatRupiah(v.price)}</b>`).join('<br>');
    return `Untuk <b>${found.name}</b>, pilihan paket yang tersedia:<br>${variantLines}<br><br>Mau langsung pesan? Klik produknya di <a href="katalog.html" style="color:var(--accent)">halaman Produk</a>, lalu pilih paket dan lanjut via WhatsApp 🙌`;
  }

  // 2) Rule-based untuk pertanyaan umum
  const rules = [
    { k: ['order','pesan','cara beli','beli gimana'], a: `Cara order gampang banget:<br>1️⃣ Pilih produk & paket di halaman <a href="katalog.html" style="color:var(--accent)">Produk</a><br>2️⃣ Klik "Pesan Sekarang"<br>3️⃣ Lanjutkan chat ke admin WhatsApp yang sudah terisi otomatis<br>4️⃣ Transfer & akun langsung diproses ⚡` },
    { k: ['bayar','pembayaran','metode','transfer','qris','dana','gopay'], a: `Pembayaran bisa lewat Transfer Bank, QRIS, DANA, GoPay, dan OVO. Setelah bayar, kirim bukti transfer ke admin via WhatsApp untuk proses instan.` },
    { k: ['garansi','komplain','error','rusak','ganti'], a: `Semua produk kami bergaransi penuh sesuai masa aktif paket. Kalau ada kendala (logout, error, dll), tinggal chat admin via WhatsApp dengan bukti pembelian, langsung kami bantu gantikan unit baru tanpa ribet ✅` },
    { k: ['lama','proses','berapa jam','kapan aktif'], a: `Proses aktivasi otomatis dan biasanya selesai dalam hitungan menit setelah pembayaran dikonfirmasi.` },
    { k: ['harga','murah','list harga','pricelist'], a: `Kamu bisa lihat semua harga & paket lengkap di halaman <a href="katalog.html" style="color:var(--accent)">Produk</a>, mulai dari Rp5.000 aja lho!` },
    { k: ['halo','hai','hi','pagi','siang','malam'], a: `Halo juga! 👋 Ada yang bisa Vexy bantu? Tanya soal produk, harga, cara order, atau kendala akun ya.` },
    { k: ['admin','manusia','cs','operator'], a: `Siap, kamu bisa langsung terhubung ke admin kami di WhatsApp: <a href="https://wa.me/${SITE_CONFIG.whatsapp}" target="_blank" style="color:var(--accent)">Chat Admin</a> 🙋` },
  ];
  for(const r of rules){
    if(r.k.some(kw => t.includes(kw))) return r.a;
  }

  return `Hmm, Vexy belum yakin jawabannya 🤔 Coba tanya lebih spesifik (misalnya nama produk, harga, atau cara order), atau langsung hubungi <a href="https://wa.me/${SITE_CONFIG.whatsapp}" target="_blank" style="color:var(--accent)">admin di WhatsApp</a> untuk dibantu manual ya!`;
}

document.addEventListener('DOMContentLoaded', async () => {
  if(typeof loadCatalog === 'function') await loadCatalog();
  buildChatWidget();
});
