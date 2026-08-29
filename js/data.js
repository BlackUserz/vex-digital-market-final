/* =========================================================
   VEX DIGITAL MARKET — Product Data
   Semua harga dalam Rupiah (angka mentah, tanpa titik)
   ========================================================= */

let CATEGORIES = [
  { id: 'semua',        label: 'Semua' },
  { id: 'streaming',    label: 'Streaming' },
  { id: 'design',       label: 'Design' },
  { id: 'editing',      label: 'Editing' },
  { id: 'ai',           label: 'AI Tools' },
  { id: 'productivity', label: 'Productivity' },
];

// Warna tile ikon per produk (mengikuti palet tema situs)
const TILE = {
  violetBlue: 'linear-gradient(135deg,#8b5cf6,#4f8cff)',
  cyanBlue:   'linear-gradient(135deg,#22d3ee,#4f8cff)',
  pinkViolet: 'linear-gradient(135deg,#fb7185,#8b5cf6)',
  amberRed:   'linear-gradient(135deg,#fbbf24,#fb7185)',
  greenCyan:  'linear-gradient(135deg,#34d399,#22d3ee)',
  indigo:     'linear-gradient(135deg,#6366f1,#8b5cf6)',
};

let PRODUCTS = [
  // ---------------- STREAMING ----------------
  {
    id: 'viu', name: 'Viu Premium', category: 'streaming', short: 'VIU', tile: TILE.greenCyan, badge: null,
    variants: [
      { label: '1 Bulan Premium', price: 10000 },
      { label: '1 Tahun Premium', price: 65000 },
    ],
  },
  {
    id: 'youtube', name: 'YouTube Premium', category: 'streaming', short: 'YT', tile: TILE.amberRed, badge: 'Populer',
    variants: [
      { label: '1 Bulan Individual', price: 15000 },
      { label: '3 Bulan Individual', price: 35000 },
    ],
  },
  {
    id: 'primevideo', name: 'Prime Video', category: 'streaming', short: 'PV', tile: TILE.cyanBlue, badge: null,
    variants: [
      { label: '1 Bulan Sharing', price: 10000 },
      { label: '1 Bulan Private', price: 30000 },
    ],
  },
  {
    id: 'netflix', name: 'Netflix Premium', category: 'streaming', short: 'NF', tile: TILE.pinkViolet, badge: 'Populer',
    variants: [
      { label: '1 Bulan Sharing (1U)', price: 42000 },
      { label: '1 Bulan Sharing (2U)', price: 24000 },
      { label: '1 Bulan Semi Private', price: 47000 },
      { label: 'Full Private 1 Bulan', price: 190000 },
    ],
  },
  {
    id: 'vidio', name: 'Vidio Platinum', category: 'streaming', short: 'VD', tile: TILE.indigo, badge: null,
    variants: [
      { label: '1 Bulan Sharing', price: 27000 },
      { label: '1 Bulan Private', price: 55000 },
    ],
  },
  {
    id: 'loklok', name: 'Lok Lok Premium', category: 'streaming', short: 'LL', tile: TILE.violetBlue, badge: null,
    variants: [
      { label: '1 Bulan Sharing', price: 22000 },
      { label: '1 Bulan Private', price: 75000 },
    ],
  },
  {
    id: 'bstation', name: 'Bstation Premium', category: 'streaming', short: 'BS', tile: TILE.cyanBlue, badge: 'Termurah',
    variants: [
      { label: '1 Bulan Sharing', price: 8000 },
      { label: '1 Tahun Sharing', price: 15000 },
    ],
  },
  {
    id: 'hbo', name: 'HBO Premium', category: 'streaming', short: 'HBO', tile: TILE.pinkViolet, badge: null,
    variants: [
      { label: '1 Bulan Sharing', price: 27000 },
      { label: '1 Bulan Private', price: 94000 },
    ],
  },
  {
    id: 'iqiyi', name: 'Iqiyi Premium', category: 'streaming', short: 'IQ', tile: TILE.greenCyan, badge: null,
    variants: [
      { label: '1 Bulan Sharing (Standard)', price: 7000 },
      { label: '1 Tahun Sharing (Standard)', price: 17000 },
      { label: '1 Bulan Sharing (Premium)', price: 10000 },
      { label: '1 Tahun Sharing (Premium)', price: 20000 },
      { label: '1 Bulan Private (Standard)', price: 35000 },
      { label: '1 Bulan Private (Premium)', price: 40000 },
    ],
  },
  {
    id: 'wetv', name: 'WeTV Premium', category: 'streaming', short: 'WE', tile: TILE.amberRed, badge: null,
    variants: [
      { label: '1 Bulan Sharing (6U)', price: 10000 },
      { label: '1 Bulan Sharing (3U)', price: 18000 },
      { label: '1 Bulan Full Private', price: 40000 },
    ],
  },
  {
    id: 'disney', name: 'Disney+ Hotstar', category: 'streaming', short: 'D+', tile: TILE.indigo, badge: null,
    variants: [
      { label: '1 Bulan Sharing (3U - Basic)', price: 37000 },
      { label: '1 Bulan Sharing (6U - Premium)', price: 29000 },
    ],
  },

  // ---------------- DESIGN ----------------
  {
    id: 'canva', name: 'Canva Premium', category: 'design', short: 'CV', tile: TILE.cyanBlue, badge: 'Populer',
    variants: [
      { label: '1 Bulan (Team)', price: 5000 },
      { label: '1 Tahun - Garansi 6 Bulan (Team)', price: 18000 },
      { label: '1 Tahun - Full Garansi (Team)', price: 37000 },
    ],
  },

  // ---------------- EDITING ----------------
  {
    id: 'alight', name: 'Alight Motion Pro', category: 'editing', short: 'AM', tile: TILE.violetBlue, badge: null,
    variants: [
      { label: '1 Tahun Sharing', price: 15000 },
      { label: '1 Tahun Private', price: 30500 },
    ],
  },
  {
    id: 'capcut', name: 'CapCut Premium', category: 'editing', short: 'CC', tile: TILE.pinkViolet, badge: 'Populer',
    variants: [
      { label: '1 Bulan Sharing', price: 25000 },
      { label: '1 Bulan Private', price: 48000 },
    ],
  },
  {
    id: 'picsart', name: 'PicsArt Gold', category: 'editing', short: 'PA', tile: TILE.amberRed, badge: null,
    variants: [
      { label: '1 Bulan Sharing', price: 7000 },
      { label: '1 Bulan Private', price: 13000 },
    ],
  },
  {
    id: 'lightroom', name: 'Lightroom', category: 'editing', short: 'LR', tile: TILE.indigo, badge: null,
    variants: [
      { label: '1 Tahun Sharing (6B - Garansi)', price: 15000 },
      { label: '1 Tahun Sharing (Full Garansi)', price: 20000 },
    ],
  },

  // ---------------- AI TOOLS ----------------
  {
    id: 'chatgpt', name: 'ChatGPT Plus', category: 'ai', short: 'GPT', tile: TILE.greenCyan, badge: 'Baru',
    variants: [
      { label: '1 Minggu Sharing', price: 15000 },
      { label: '1 Bulan Sharing', price: 23000 },
    ],
  },

  // ---------------- PRODUCTIVITY ----------------
  {
    id: 'getcontact', name: 'Getcontact', category: 'productivity', short: 'GC', tile: TILE.cyanBlue, badge: null,
    variants: [
      { label: '1 Bulan Private', price: 15000 },
    ],
  },
  {
    id: 'wattpad', name: 'Wattpad Premium', category: 'productivity', short: 'WP', tile: TILE.violetBlue, badge: null,
    variants: [
      { label: '1 Tahun (6B - Garansi)', price: 15000 },
      { label: '1 Tahun (Full Garansi)', price: 20000 },
    ],
  },
];

function formatRupiah(n){
  return 'Rp' + n.toLocaleString('id-ID');
}

function lowestPrice(product){
  return Math.min(...product.variants.map(v => v.price));
}

function productImagePath(id){
  return `assets/products/${id}.png`;
}

function categoryLabel(id){
  const c = CATEGORIES.find(c => c.id === id);
  return c ? c.label : id;
}
