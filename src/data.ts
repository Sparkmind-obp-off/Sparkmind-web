// ════════════════════════════════════════════════════════════════
// SparkMind Sovereign Agent Foundry — Canonical Data Layer
// SSOT distilled from:
//   - MASTER-CONSOLIDATED-DOCTRINE-LOCK-v11.0
//   - MASTER-ARCHITECT-PROMPT-v6.0
//   - SPRINT-EXECUTE-v1.0 (D0-D14)
//   - APPENDIX-D Foundry Narrative Playbook
// Owner: Reza Estes / Haidar — Sovereign AI Dev · Doctrine date 2026-05-31
// Public-safe: no PII, no secrets, no API keys.
// ════════════════════════════════════════════════════════════════

export const META = {
  name: 'SparkMind Sovereign Agent Foundry',
  category: "Indonesia's First Sovereign Agent Foundry",
  taglineEN: 'Forge sovereign agents. Own your edge.',
  taglineID: 'Tempa agen sendiri. Kuasai edge lo sendiri.',
  owner: 'Haidar Faras Muhadidzib',
  doctrineDate: '2026-05-31',
  doctrineVersion: 'v11.0',
  architectVersion: 'v6.0',
  sprintVersion: 'v1.0',
  status: 'CANONICAL · EXECUTE-READY · BRUTAL-VERIFIED · HARDENED · AUTO-PUBLISH',
  repo: 'github.com/ganihypha/Sparkmind-Sovereign',
  duitku: 'D22457',
  sprintStart: '2026-05-31', // D0
  sprintEnd: '2026-06-14',   // D14
  revenueD30Target: 1_000_000
}

export const PUBLIC_META = {
  name: 'SparkMind',
  tagline: 'Bangun bisnis digitalmu di atas fondasi sendiri.',
  positioning: 'SparkMind adalah rumah produk AI yang benar-benar jalan untuk UMKM Indonesia, sekaligus tempat belajar cara membangun brand dan bisnis digital secara sistematis — bukan asal ikut tren.',
  instagram: 'https://instagram.com/sparkmind.id',
  instagramHandle: '@sparkmind.id'
}

// Sovereignty pillars — Doctrine v11.0 Part 1 (The Forge)
export const PILLARS = [
  { title: 'Data Residency', desc: '100% data stays in ID. Powered by Cloudflare D1/R2 Edge Network.', icon: 'fa-shield-halved' },
  { title: 'Language', desc: 'Bahasa Indonesia-native parsing, Llama 3.3 / Claude fallback.', icon: 'fa-language' },
  { title: 'Payment', desc: 'QRIS/VA Native Rupiah via Duitku (Merchant D22457).', icon: 'fa-money-bill-wave' },
  { title: 'Regulation', desc: 'UU PDP Compliance by-design, PSE Komdigi pipeline ready.', icon: 'fa-scale-balanced' }
]

// ──────────────────────────────────────────────────────────────
// 7 ACTIVE SUB-BRANDS — Doctrine v11.0 Part 4 (The Mold, NO PARKING)
// ──────────────────────────────────────────────────────────────
export type Brand = {
  key: string
  name: string
  subdomain: string
  tagline: string
  focus: string
  pricing: string
  status: 'DNS-FIX' | 'LIVE' | 'PARTIAL' | 'REVIVING' | 'NEW'
  icon: string
  accent: string
}

export const BRANDS: Brand[] = [
  {
    key: 'mother', name: 'SparkMind (Mother)', subdomain: 'sparkmind.web.id',
    tagline: 'The Sovereign Agent Foundry — category anchor & trust layer.',
    focus: 'Category Anchor · Doctrine Hub', pricing: 'Anchor',
    status: 'DNS-FIX', icon: 'fa-industry', accent: '#d4af37'
  },
  {
    key: 'clarity', name: 'Clarity Coach', subdomain: 'clarity.sparkmind.web.id',
    tagline: 'Pain-killer agent untuk clarity, recovery & personal growth.',
    focus: 'Revenue Engine #1 · Productivity', pricing: 'Rp 99K–700K',
    status: 'LIVE', icon: 'fa-compass', accent: '#10b981'
  },
  {
    key: 'kuratorkas', name: 'KuratorKas', subdomain: 'kuratorkas.sparkmind.web.id',
    tagline: 'AI Curator untuk UMKM Fashion Indonesia — 5 agen dalam 1.',
    focus: 'Revenue Engine #2 · Fashion AI', pricing: 'Rp 50K–299K',
    status: 'PARTIAL', icon: 'fa-shirt', accent: '#f59e0b'
  },
  {
    key: 'barberkas', name: 'BarberKas', subdomain: 'barberkas.sparkmind.web.id',
    tagline: 'Kasir + booking + AI Staff untuk barbershop — dibuat oleh capster, untuk capster.',
    focus: 'Capster Commit · Owner Dogfood', pricing: 'Rp 49K–499K/bln',
    status: 'LIVE', icon: 'fa-scissors', accent: '#3b82f6'
  },
  {
    key: 'pacelokal', name: 'PACE Lokal', subdomain: 'pacelokal.sparkmind.web.id',
    tagline: 'Platform lari lokal — manajemen klub & event untuk komunitas ID.',
    focus: 'Community Moat · Running', pricing: 'Rp 49K/klub',
    status: 'LIVE', icon: 'fa-person-running', accent: '#22d3ee'
  },
  {
    key: 'nurani', name: 'Nurani OS', subdomain: 'nurani.sparkmind.web.id',
    tagline: 'Spiritual sovereignty OS — tadarus, jadwal sholat & waqf, halal-by-design.',
    focus: 'Spiritual Layer · Waqf', pricing: 'Waqf/Donasi',
    status: 'LIVE', icon: 'fa-dove', accent: '#a78bfa'
  },
  {
    key: 'eventpwt', name: 'Event Tracker PWT', subdomain: 'pwt.sparkmind.web.id',
    tagline: 'Event & community tracking untuk Purwokerto — internal tool, dogfood first.',
    focus: 'NEW Sprint 2 · Internal Tool', pricing: 'Rp 199K/event',
    status: 'NEW', icon: 'fa-calendar-check', accent: '#ef4444'
  }
]

// ──────────────────────────────────────────────────────────────
// SPRINT D0-D14 — SPRINT-EXECUTE-v1.0 §5 Daily Execution Plan
// ──────────────────────────────────────────────────────────────
export type SprintDay = {
  d: number
  date: string
  weekday: string
  theme: string
  tasks: { who: string; what: string }[]
  criteria: string
  gate?: boolean
}

export const SPRINT: SprintDay[] = [
  { d: 0, date: '2026-05-31', weekday: 'Sat', theme: 'Sprint Kickoff & Infra Bootstrap',
    tasks: [{ who: 'Hilman', what: 'Lock v11.0 & Architect v6.0 docs' }, { who: 'AI Dev', what: 'Init GitHub Monorepo + pnpm' }, { who: 'Adik', what: 'Configure Cloudflare zones & DNS' }],
    criteria: 'Monorepo pushed, DNS resolving.' },
  { d: 1, date: '2026-06-01', weekday: 'Sun', theme: 'Mother Brand Foundation',
    tasks: [{ who: 'AI Dev', what: 'Scaffold Mother landing page' }, { who: 'Hilman', what: 'Inject Doctrine v11.0 into HTML' }, { who: 'Adik', what: 'First test deploy to Pages' }],
    criteria: 'sparkmind.web.id loads hello world.' },
  { d: 2, date: '2026-06-02', weekday: 'Mon', theme: 'Revenue Engines Started',
    tasks: [{ who: 'Hilman', what: 'Clarity Coach outreach to 10 prospects' }, { who: 'Adik', what: 'KuratorKas landing scaffolded' }],
    criteria: '10 DMs sent, KuratorKas repo created.' },
  { d: 3, date: '2026-06-03', weekday: 'Tue', theme: 'Sales & Intake',
    tasks: [{ who: 'Hilman', what: 'Execute Clarity sales calls' }, { who: 'Adik', what: 'Build KuratorKas beta signup form + D1' }],
    criteria: '1 LOI verbal agreement.' },
  { d: 4, date: '2026-06-04', weekday: 'Wed', theme: 'Intern Handover & Internal Tools',
    tasks: [{ who: 'Hilman', what: 'Adik full context onboarding' }, { who: 'Adik', what: 'Deploy Event Tracker (PWT) staging' }],
    criteria: 'Event Tracker accessible via CF Access.' },
  { d: 5, date: '2026-06-05', weekday: 'Thu', theme: 'Legacy Reactivation',
    tasks: [{ who: 'Adik', what: 'BarberKas: Call 5 dormant accounts' }, { who: 'Hilman', what: 'Scope PaceLokal Jakarta event venue' }],
    criteria: '2 BarberKas verbal yes for reactivation.' },
  { d: 6, date: '2026-06-06', weekday: 'Fri', theme: 'Mid-Sprint Review #1',
    tasks: [{ who: 'Hilman', what: 'Draft Clarity first contract' }, { who: 'All', what: 'Sync blocker review (17:00 WIB)' }],
    criteria: 'Contract drafted, risks mitigated.' },
  { d: 7, date: '2026-06-07', weekday: 'Sat', theme: 'Public Soft Launch',
    tasks: [{ who: 'AI Dev', what: 'Mother brand LIVE on HTTPS' }, { who: 'Hilman', what: 'Sign 1 Clarity LOI (Brutal-Verify)' }],
    criteria: 'Gate 1 passed.', gate: true },
  { d: 8, date: '2026-06-08', weekday: 'Sun', theme: 'Spiritual OS Integration',
    tasks: [{ who: 'Hilman', what: 'Nurani.OS closed beta list (10 users)' }, { who: 'Hilman', what: 'Inject spiritual layer copy to Mother' }],
    criteria: '10 emails acquired for Nurani.OS.' },
  { d: 9, date: '2026-06-09', weekday: 'Mon', theme: 'Payment Rails Live',
    tasks: [{ who: 'AI Dev', what: 'Midtrans config + webhook deployed' }, { who: 'Hilman', what: 'Issue first Clarity invoice' }],
    criteria: 'Webhook returns 200 OK on test trigger.' },
  { d: 10, date: '2026-06-10', weekday: 'Tue', theme: 'KuratorKas Live',
    tasks: [{ who: 'Adik', what: 'Open KuratorKas beta (signup → trial)' }, { who: 'Adik', what: 'Send 20 beta invitations' }],
    criteria: '3 users successfully sign up.' },
  { d: 11, date: '2026-06-11', weekday: 'Wed', theme: 'Community Moat',
    tasks: [{ who: 'AI Dev', what: 'PaceLokal RSVP page live' }, { who: 'Hilman', what: 'Lock 1st event partner' }],
    criteria: 'RSVP form accepts submissions.' },
  { d: 12, date: '2026-06-12', weekday: 'Thu', theme: 'Cash Collection & Ledger',
    tasks: [{ who: 'Adik', what: 'BarberKas cash collection/status check' }, { who: 'All', what: 'Update Proof-of-Work Ledger' }],
    criteria: 'Ledger accurate to within Rp 1.' },
  { d: 13, date: '2026-06-13', weekday: 'Fri', theme: 'Polish & Review #2',
    tasks: [{ who: 'Hilman', what: 'Copy QA across all domains' }, { who: 'Hilman+Adik', what: 'Pre-demo day dry run' }],
    criteria: '0 404 links, typos fixed.' },
  { d: 14, date: '2026-06-14', weekday: 'Sat', theme: 'SPRINT CLOSE',
    tasks: [{ who: 'All', what: 'Execute Sprint Close Ritual' }, { who: 'Hilman', what: 'Publish public Proof of Work post' }],
    criteria: '≥ Rp 350K committed + 3 brands shipped.', gate: true }
]

// ──────────────────────────────────────────────────────────────
// REVENUE TRACKER — SPRINT-EXECUTE-v1.0 §7 (Rp 1M D30 Path)
// ──────────────────────────────────────────────────────────────
export type RevenueChannel = {
  channel: string
  targetIdr: number
  conversion: string
  d14Indicator: string
  brandKey: string
}

export const REVENUE: RevenueChannel[] = [
  { channel: 'Clarity Coach', targetIdr: 700_000, conversion: '1 / 10 leads (10%)', d14Indicator: '1 LOI signed', brandKey: 'clarity' },
  { channel: 'KuratorKas', targetIdr: 150_000, conversion: '3 / 20 signups (15%)', d14Indicator: '3 paid trials', brandKey: 'kuratorkas' },
  { channel: 'BarberKas', targetIdr: 100_000, conversion: '2 / 5 dormant (40%)', d14Indicator: '2 verbal yes', brandKey: 'barberkas' },
  { channel: 'PaceLokal', targetIdr: 50_000, conversion: '1 ticket pilot', d14Indicator: '1 RSVP confirm', brandKey: 'pacelokal' }
]

// D90 Revenue Mix — Doctrine v11.0 Part 5 (The Temper)
export const D90_MIX = [
  { brand: 'KuratorKas', pct: 64, detail: '60 UMKM × Rp 250K = Rp 15M' },
  { brand: 'Clarity Coach', pct: 21, detail: '30 Cust × Rp 167K = Rp 5M' },
  { brand: 'Event Tracker PWT', pct: 8, detail: '10 Event × Rp 199K = Rp 2M' },
  { brand: 'PACE Lokal', pct: 5, detail: '25 Klub × Rp 49K = Rp 1.2M' },
  { brand: 'Nurani OS', pct: 2, detail: 'Waqf = Rp 500K' }
]

export const TARGETS = [
  { day: 'D7', label: '1st Invoice Sent' },
  { day: 'D14', label: 'Rp 500K Confirmed' },
  { day: 'D30', label: 'Rp 1M MRR' },
  { day: 'D90', label: 'Rp 15-25M MRR' }
]

// ──────────────────────────────────────────────────────────────
// DECISION LEDGER — Doctrine v11.0 Part 8 (8 NEW Strategic Decisions)
// ──────────────────────────────────────────────────────────────
export const DECISIONS = [
  { id: 'D-v11.1', text: 'SPRINT-EXECUTE: Doctrine diaktifkan dalam 2-week cadence.' },
  { id: 'D-v11.2', text: 'ADIK PROMOTED: Dari paid intern menjadi Co-Executor.' },
  { id: 'D-v11.3', text: 'AUTO-PUBLISH: No clarify gate. High trust. Auto-deliver.' },
  { id: 'D-v11.4', text: 'FULL 7-BRAND: No parking. Semua ditarik ke arena D0-D14.' },
  { id: 'D-v11.5', text: 'BARBERKAS REVIVED: Keluar dari status graveyard.' },
  { id: 'D-v11.6', text: 'EVENT TRACKER: Brand baru (PWT) resmi ditambahkan.' },
  { id: 'D-v11.7', text: 'TRIPLE PARALLEL: Doctrine + Architect + Sprint dalam 1 bundle.' },
  { id: 'D-v11.8', text: '100% CLOUDFLARE: Hardlock. No K8s, no AWS. Serverless edge only.' }
]

// GAP MATRIX — Doctrine v11.0 Part 2 (The Anvil)
export const GAPS = [
  { id: 'G1', prio: 'P0', gap: 'DNS Dead (sparkmind.web.id)', action: 'D0 Sprint priority. Cloudflare nameserver override.', status: 'open' },
  { id: 'G2', prio: 'P0', gap: 'Zero Confirmed Revenue', action: 'Target Rp 500K by D14 via Clarity Coach.', status: 'open' },
  { id: 'G4', prio: 'P0', gap: '49 Repo Graveyard (Scope Creep)', action: 'Adik assigned to archive 40+ repos by D7.', status: 'open' },
  { id: 'G5', prio: 'P0', gap: 'BarberKas Content Dead', action: 'Revive in Sprint D4-D6.', status: 'open' },
  { id: 'G15', prio: 'P1', gap: 'Adik Onboarding Incomplete', action: 'Promoted to Co-Executor.', status: 'closed' },
  { id: 'G22', prio: 'P2', gap: 'No Framework Decision', action: 'Hybrid Cloudflare + LangGraph locked.', status: 'closed' }
]

export const GAP_STATS = { total: 32, p0: 8, p1: 12, closed: 6 }

// MARKET INTEL — Doctrine v11.0 Part 3 (The Hammer)
export const MARKET = [
  { label: 'Global TAM 2026', value: 'USD 9.14B' },
  { label: 'Global TAM 2034', value: 'USD 139.19B' },
  { label: 'Indonesia Addressable', value: 'USD 245-350M' },
  { label: 'UMKM Base', value: '65 Juta UMKM' }
]

// ──────────────────────────────────────────────────────────────
// LEGAL ENTITY LOCK — PT WASKITA CAKRAWARTI DIGITAL
// Sumber: Sertifikat Pendaftaran Pendirian Perseroan Perorangan
//         Kementerian Hukum RI — Ditjen AHU
//         Nomor: AHU-066746.AH.01.30.Tahun 2025 (1 Desember 2025)
// Public-safe: hanya data yang tercantum pada sertifikat/akta publik.
// ──────────────────────────────────────────────────────────────
export const LEGAL = {
  companyName: 'PT WASKITA CAKRAWARTI DIGITAL',
  companyType: 'Perseroan Perorangan (untuk Usaha Mikro dan Kecil)',
  registrationNo: 'AHU-066746.AH.01.30.Tahun 2025',
  registrationBody: 'Kementerian Hukum Republik Indonesia — Direktorat Jenderal Administrasi Hukum Umum (Ditjen AHU)',
  registrationDate: '1 Desember 2025',
  domicile: 'Kabupaten Banyumas, Jawa Tengah, Indonesia',
  ownerFullName: 'Haidar Faras Muhadidzib',
  ownerRole: 'Pendiri Tunggal · Direktur · Pemilik Manfaat 100% (Sole Beneficial Owner)',
  ownerAlias: 'Reza Estes (nama pena/alias kreatif — bukan entitas hukum terpisah)',
  contactEmail: 'farasmuhadzib@gmail.com',
  mainDomain: 'sparkmind.web.id',
  domainRegistry: 'PANDI (.web.id — terverifikasi KTP atas nama pemilik)',
  paymentPartner: 'Duitku (Merchant D22457) — PJP berizin Bank Indonesia',
  lawBasis: [
    'UU No. 40 Tahun 2007 tentang Perseroan Terbatas jo. UU No. 6 Tahun 2023 (Cipta Kerja) — dasar Perseroan Perorangan',
    'UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)',
    'UU No. 11 Tahun 2008 jo. UU No. 19 Tahun 2016 tentang Informasi dan Transaksi Elektronik (UU ITE)',
    'PP No. 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik (PSTE)',
    'Permenkominfo No. 5 Tahun 2020 tentang PSE Lingkup Privat'
  ],
  effectiveDate: '1 Desember 2025',
  lastUpdated: '3 Juli 2026'
}

// ──────────────────────────────────────────────────────────────
// BARBERKAS — Capster Commit Sub-Brand Hub
// SSOT: docs/BARBERKAS-CAPSTER-COMMIT-SSOT.md v1.0 (2026-07-03)
// Owner-as-Capster monetization lock · dual-domain live
// ──────────────────────────────────────────────────────────────
export const BARBERKAS = {
  name: 'BarberKas',
  parent: 'sparkmind.web.id',
  ssot: 'BARBERKAS-CAPSTER-COMMIT-SSOT v1.0',
  doctrineDate: '2026-07-03',
  commitment: 'Owner (Haidar Faras Muhadidzib) berkomitmen aktif sebagai CAPSTER — BarberKas dipakai sendiri setiap hari kerja sebelum dijual ke capster lain.',
  oneLiner: 'BarberKas bukan software yang dijual KE barbershop, tapi sistem yang LAHIR DARI barbershop milik capster-nya sendiri.',
  domains: [
    { url: 'barberkas.sparkmind.web.id', role: 'Brand home kanonik — identitas, legal, tenant apps', status: 'LIVE' },
    { url: 'barberkas-foundry.biz.id', role: 'Outcome SKU landing — tangga harga & intake WhatsApp', status: 'LIVE' },
    { url: 'alfacut.barberkas.sparkmind.web.id', role: 'Tenant demo — transaksi pertama tercatat (Truth-Lock proof)', status: 'LIVE' }
  ],
  advantages: [
    { title: 'Zero riset pasar', desc: 'Owner ADALAH target market — tahu persis pain capster.', icon: 'fa-bullseye' },
    { title: 'Demo hidup tiap hari', desc: 'Kursi barber = showroom BarberKas berjalan.', icon: 'fa-chair' },
    { title: 'Trust ganda', desc: '"Dibuat oleh capster, untuk capster" — bukan founder tech asing.', icon: 'fa-handshake' },
    { title: 'Feedback loop 0 hari', desc: 'Bug ketemu pagi → fix sore → dipakai besok.', icon: 'fa-rotate' },
    { title: 'Distribusi gratis', desc: 'Customer potong rambut = prospek melihat sistem bekerja.', icon: 'fa-people-arrows' },
    { title: 'Konten tak habis', desc: 'Aktivitas harian capster = konten build-in-public organik.', icon: 'fa-camera' }
  ],
  ladder: [
    { tier: 'Edukasi', price: 'Gratis', desc: 'Demo dashboard + lihat AI Staff bekerja, tanpa kartu.', status: 'LIVE' },
    { tier: 'Setup (Land)', price: 'Rp 49–99K/bln', desc: 'Kasir + booking LIVE + struk WhatsApp.', status: 'LIVE' },
    { tier: 'AI Staff (Retain)', price: 'Rp 149–499K/bln', desc: 'Resepsionis + Marketing + Insight Stylist.', status: 'LIVE' },
    { tier: 'Chain (Expand)', price: 'High-ticket', desc: 'Multi-outlet ops + cross-shop benchmark.', status: 'ROADMAP' },
    { tier: 'Flagship one-time', price: 'Rp 199K', desc: 'kasir-booking done-for-you — "Booking manual? Otomatis dalam 3 hari."', status: 'LOCKED' }
  ],
  aiStaff: [
    { name: 'Resepsionis', desc: 'Balas WA customer → booking otomatis masuk.', icon: 'fa-calendar-check', status: 'LIVE' },
    { name: 'Marketing', desc: 'Caption IG/TikTok + hashtag siap posting.', icon: 'fa-camera-retro', status: 'LIVE' },
    { name: 'Insight Stylist', desc: 'Rekomendasi cut dari history customer.', icon: 'fa-scissors', status: 'LIVE' },
    { name: 'CRM', desc: 'Loyalty + re-engage customer.', icon: 'fa-heart', status: 'ROADMAP' },
    { name: 'Admin/Ops', desc: 'Pricing, inventory, analitik capster.', icon: 'fa-chart-line', status: 'ROADMAP' },
    { name: 'Cross-shop Ops', desc: 'Benchmark multi-outlet (chain).', icon: 'fa-building', status: 'HIGH-TICKET' }
  ],
  flywheel: [
    'Potong rambut (cash harian)',
    'Pakai BarberKas sendiri (proof)',
    'Posting build-in-public (reach)',
    'Capster lain tanya (leads)',
    'Closing Setup Rp 49–99K/bln (MRR)',
    'Naik tier AI Staff (expand) → ulang'
  ],
  phases: [
    { phase: 'PROOF', days: '1–21', target: 'Owner aktif capster + BarberKas dipakai harian + 10 konten before/after' },
    { phase: 'TRACTION', days: '22–60', target: '10 capster/barbershop lain onboard tier Setup' },
    { phase: 'SCALE', days: '61–90', target: '100 pembeli ekosistem + 1 partner reseller + pilot Chain' }
  ]
}

export const PUBLIC_PRODUCTS = BRANDS.filter((brand) =>
  ['clarity', 'kuratorkas', 'barberkas', 'pacelokal', 'nurani'].includes(brand.key)
)

export type Article = {
  slug: string
  title: string
  category: 'Branding' | 'AI & Automation' | 'Content & Growth' | 'Studi Kasus'
  summary: string
  publishedAt: string
  readTime: string
  content: { heading?: string; paragraphs: string[] }[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'kenapa-kami-pakai-produk-sendiri-sebelum-menjualnya',
    title: 'Kenapa kami pakai produk kami sendiri dulu sebelum menjualnya',
    category: 'Studi Kasus',
    summary: 'Pelajaran dari BarberKas tentang menguji masalah, alur kerja, dan nilai produk sebelum meminta orang lain membayar.',
    publishedAt: '17 Juli 2026', readTime: '5 menit',
    content: [
      { paragraphs: [
        'Banyak produk untuk bisnis kecil lahir dari asumsi yang terlihat masuk akal di layar presentasi. Masalahnya, pekerjaan sehari-hari jarang serapi diagram. Pelanggan datang bersamaan, koneksi tidak selalu stabil, pencatatan tertunda, dan operator tidak punya waktu mempelajari sistem yang rumit. Karena itu, sebelum menawarkan BarberKas kepada barbershop lain, kami memilih memakainya sendiri dalam pekerjaan nyata.',
        'Founder SparkMind juga bekerja sebagai capster. BarberKas tidak diuji sebagai demo, tetapi sebagai alat kerja untuk mencatat transaksi, mengelola booking, dan melihat apakah informasi yang disajikan benar-benar membantu ketika kursi sedang penuh. Penggunaan langsung mengubah prioritas. Fitur yang tampak menarik tetapi tidak mengurangi pekerjaan ditunda. Gesekan kecil yang berulang setiap hari justru masuk daftar utama.'
      ]},
      { heading: 'Dogfooding bukan sekadar mencoba', paragraphs: [
        'Memakai produk sendiri sering disebut dogfooding. Nilainya bukan pada tindakan membuka aplikasi milik sendiri, melainkan ketika pembuat produk menerima konsekuensi dari keputusan desainnya. Jika alur booking membingungkan, kami sendiri yang kehilangan waktu. Jika pencatatan kas tidak jelas, kami sendiri yang memperbaiki data pada akhir hari. Hubungan langsung antara keputusan dan akibat ini memperpendek siklus belajar.',
        'Kami membedakan tiga jenis bukti. Pertama, bukti masalah: apakah kesulitan itu benar-benar terjadi dan cukup sering untuk diperbaiki. Kedua, bukti penggunaan: apakah solusi tetap dipakai setelah rasa penasaran awal hilang. Ketiga, bukti nilai: apakah alat menghemat waktu, mengurangi kesalahan, atau membuat keputusan lebih mudah. Tiga bukti ini lebih berguna daripada jumlah fitur.'
      ]},
      { heading: 'Apa artinya bagi pembeli', paragraphs: [
        'Dogfooding tidak otomatis membuat produk sempurna dan tidak boleh dipakai sebagai klaim berlebihan. Satu barbershop juga tidak mewakili seluruh pasar. Pengalaman internal harus dilanjutkan dengan percakapan dan pengujian bersama operator lain. Bedanya, pembicaraan dimulai dari sistem yang sudah menghadapi kondisi nyata, bukan dari ide kosong.',
        'Bagi bisnis kecil yang memilih software, tanyakan bagaimana produk itu diuji. Apakah tim pembuat memahami alur kerja Anda? Masalah apa yang sudah mereka temui? Perubahan apa yang dibuat setelah penggunaan nyata? Jawaban spesifik biasanya lebih bermakna daripada daftar fitur panjang.',
        'Prinsip kami sederhana: sebelum meminta orang lain menaruh data, waktu, dan uang pada sebuah produk, kami harus bersedia menaruh pekerjaan kami sendiri di sana. BarberKas menjadi bukti awal prinsip tersebut. Bukan bukti bahwa semua pekerjaan selesai, melainkan bahwa proses belajar dimulai dari kenyataan. Catatan penggunaan kemudian menjadi bahan evaluasi berkala: apa yang benar-benar dipakai, bagian mana yang masih manual, dan keputusan apa yang perlu diuji bersama pengguna berikutnya. Dengan begitu, pengembangan tidak bergerak berdasarkan tebakan paling keras, tetapi berdasarkan pola masalah yang terus terlihat.'
      ]}
    ]
  },
  {
    slug: 'kedaulatan-data-bukan-jargon',
    title: 'Kedaulatan data itu bukan jargon — ini yang harus dicek UMKM sebelum pakai software AI',
    category: 'Branding',
    summary: 'Empat pemeriksaan praktis—data, bahasa, pembayaran, dan regulasi—sebelum bisnis kecil mempercayakan operasinya pada AI.',
    publishedAt: '15 Juli 2026', readTime: '5 menit',
    content: [
      { paragraphs: [
        'Ketika software AI menjanjikan pekerjaan lebih cepat, pertanyaan pertama biasanya tentang fitur. Bisa membuat konten, membalas pelanggan, atau membaca laporan? Pertanyaan itu penting, tetapi belum cukup. Bisnis juga perlu memahami siapa yang mengendalikan data, bagaimana layanan bekerja dalam konteks Indonesia, dan apa yang terjadi jika suatu hari ingin berhenti.',
        'Kedaulatan data terdengar seperti istilah besar. Dalam praktik UMKM, maknanya sederhana: bisnis tetap punya kendali dan pilihan. Kami memakai empat pilar sebagai alat pemeriksaan awal—Data Residency, Language, Payment, dan Regulation. Empat pilar ini bukan sertifikat otomatis bahwa layanan aman. Fungsinya membantu pemilik usaha mengajukan pertanyaan yang lebih tepat.'
      ]},
      { heading: '1. Data Residency: tahu data berada dan bergerak ke mana', paragraphs: [
        'Tanyakan data apa yang dikumpulkan, tempat penyimpanannya, pihak yang dapat mengakses, serta cara menghapus atau mengekspornya. Lokasi server bukan satu-satunya ukuran keamanan, tetapi alur data yang tidak jelas adalah risiko. Periksa apakah percakapan pelanggan atau dokumen bisnis dipakai untuk melatih model lain. Jawaban seharusnya tersedia dalam kebijakan privasi yang dapat dibaca, bukan hanya janji singkat.'
      ]},
      { heading: '2. Language: paham konteks, bukan sekadar menerjemahkan', paragraphs: [
        'Software untuk Indonesia perlu menangani Bahasa Indonesia, istilah lokal, format alamat, serta cara pelanggan berkomunikasi. Model yang fasih belum tentu memahami konteks operasional. Uji dengan contoh nyata dari bisnis Anda, termasuk bahasa informal dan kasus ambigu. Jika keluaran AI menyangkut keputusan penting, tetap sediakan pemeriksaan manusia.'
      ]},
      { heading: '3. Payment: biaya dan jalur transaksi harus jelas', paragraphs: [
        'Periksa apakah harga ditampilkan dalam Rupiah, komponen biaya mudah dipahami, dan pembayaran diproses penyedia yang sah. Pastikan ada bukti transaksi, aturan pembatalan, serta jalur bantuan ketika pembayaran bermasalah. Sistem yang murah di awal tetapi sulit dihentikan dapat menjadi biaya lebih besar kemudian.'
      ]},
      { heading: '4. Regulation: hak pengguna harus bisa dijalankan', paragraphs: [
        'UU Pelindungan Data Pribadi memberi dasar penting tentang pemrosesan data. Bagi pengguna, hal paling praktis adalah memastikan tersedia kontak resmi dan prosedur untuk meminta akses, perbaikan, atau penghapusan data. Logo kepatuhan tidak cukup jika tidak ada proses yang bisa digunakan.',
        'Sebelum membeli, buat inventaris sederhana: data pelanggan apa yang akan masuk, dampak jika bocor, dan siapa yang bertanggung jawab. Mulailah dengan data berisiko rendah, batasi akses, dan evaluasi hasilnya. Simpan daftar layanan yang digunakan beserta pemilik aksesnya agar bisnis tidak kehilangan jejak ketika anggota tim berganti. Tinjau daftar itu secara berkala, terutama setelah perubahan fitur atau kebijakan penyedia. AI seharusnya menambah kemampuan bisnis tanpa mengambil kendali bisnis. Itulah inti kedaulatan: bukan menolak teknologi asing atau baru, melainkan menggunakan teknologi dengan posisi tawar yang sadar.'
      ]}
    ]
  },
  {
    slug: 'cara-memilih-produk-ai-pertama',
    title: 'Cara memilih 1 produk AI pertama untuk bisnis kecil, tanpa buang-buang uang',
    category: 'AI & Automation',
    summary: 'Mulai dari pekerjaan yang berulang dan hasil yang bisa diukur, bukan dari teknologi yang sedang ramai.',
    publishedAt: '12 Juli 2026', readTime: '5 menit',
    content: [
      { paragraphs: [
        'Produk AI datang dengan banyak janji: membuat konten, melayani pelanggan, merangkum laporan, sampai mengotomatisasi penjualan. Untuk bisnis kecil, terlalu banyak pilihan sering menghasilkan dua kondisi. Pemilik membeli beberapa alat sekaligus tetapi tidak ada yang menjadi kebiasaan, atau menunda semuanya karena takut salah. Jalan keluarnya bukan mencari AI paling canggih. Carilah satu pekerjaan yang paling layak dibantu lebih dulu.',
        'Mulai dengan mencatat pekerjaan berulang selama satu minggu. Jangan menulis “marketing” atau “administrasi” karena terlalu luas. Tulis kegiatan konkret: membalas pertanyaan harga yang sama, memindahkan booking dari WhatsApp ke kalender, membuat rekap transaksi, atau menyusun tiga variasi caption. Catat frekuensi, waktu yang dipakai, tingkat kesalahan, dan dampaknya pada pelanggan.'
      ]},
      { heading: 'Pilih masalah dengan empat saringan', paragraphs: [
        'Pertama, pekerjaan harus cukup sering terjadi. Otomatisasi yang dipakai satu kali sebulan mungkin tidak memberi pengembalian berarti. Kedua, hasilnya harus mudah diperiksa manusia. Draft pesan lebih aman untuk percobaan awal daripada keputusan keuangan otomatis. Ketiga, data yang dibutuhkan harus tersedia dan pantas diproses. Jangan memasukkan data sensitif hanya demi mencoba. Keempat, manfaatnya harus dapat diukur.',
        'Ukuran tidak selalu berupa pendapatan. Waktu respons, jumlah langkah manual, kesalahan pencatatan, atau konsistensi output juga bisa dipakai. Tentukan kondisi awal sebelum berlangganan. Misalnya, membalas sepuluh pertanyaan rutin membutuhkan 35 menit per hari. Target percobaan bisa berupa pengurangan menjadi 15 menit dengan kualitas jawaban tetap terjaga.'
      ]},
      { heading: 'Uji alur kerja, bukan demo', paragraphs: [
        'Demo biasanya menunjukkan kondisi terbaik. Percobaan bisnis perlu memakai contoh nyata, perangkat yang biasa digunakan, dan orang yang benar-benar menjalankan proses. Batasi uji coba selama dua sampai empat minggu. Catat berapa kali alat dipakai, kapan gagal, berapa banyak koreksi manual, dan apakah tim ingin terus memakainya tanpa disuruh.',
        'Hitung total biaya, bukan hanya harga langganan. Masukkan waktu belajar, biaya integrasi, kebutuhan memindahkan data, dan risiko ketergantungan. Produk Rp50 ribu yang menghabiskan banyak jam untuk diperbaiki bisa lebih mahal daripada produk dengan harga lebih tinggi tetapi alurnya jelas. Periksa pula cara mengekspor data dan menghentikan layanan.'
      ]},
      { heading: 'Keputusan setelah percobaan', paragraphs: [
        'Pada akhir uji, pilih satu dari tiga keputusan: lanjut, ubah cara pakai, atau berhenti. Berhenti bukan kegagalan jika percobaan memberi bukti bahwa masalahnya tidak cukup penting. Yang merugikan adalah mempertahankan alat hanya karena sudah membayar.',
        'Produk AI pertama yang baik bukan yang membuat bisnis terlihat paling modern. Ia menyelesaikan satu pekerjaan nyata, dipahami operatornya, dan menghasilkan perubahan yang dapat dilihat. Dokumentasikan cara pakai yang berhasil agar hasilnya tidak bergantung pada satu orang. Setelah satu alur stabil, barulah pertimbangkan alur berikutnya. Kemajuan sistematis hampir selalu lebih murah daripada menumpuk alat berdasarkan tren.'
      ]}
    ]
  },
  {
    slug: 'sistem-bukan-template-sekali-beli',
    title: 'Sistem itu bukan template yang dibeli sekali — ini yang membedakan brand yang bertahan dan yang hilang setelah tren berganti',
    category: 'Content & Growth',
    summary: 'Template membantu memulai, tetapi sistem membuat keputusan dapat diulang, diukur, dan diperbaiki ketika keadaan berubah.',
    publishedAt: '9 Juli 2026', readTime: '5 menit',
    content: [
      { paragraphs: [
        'Template memberi rasa lega karena halaman kosong langsung terisi. Kalender konten tersedia, format caption sudah disiapkan, dan warna terlihat konsisten. Semua itu berguna. Namun template hanya menyimpan bentuk dari keputusan masa lalu. Ia tidak menjelaskan mengapa keputusan itu dibuat, kapan harus diubah, dan siapa yang bertanggung jawab memperbaikinya.',
        'Sistem bekerja pada tingkat berbeda. Sistem menghubungkan tujuan, masukan, proses, keluaran, ukuran, dan ritme evaluasi. Untuk konten, misalnya, tujuan bukan “posting tiga kali seminggu”, tetapi membantu audiens memahami masalah tertentu dan bergerak ke tindakan yang relevan. Frekuensi hanyalah salah satu bagian proses.'
      ]},
      { heading: 'Lima bagian sistem yang sederhana', paragraphs: [
        'Pertama, tetapkan tujuan yang bisa diuji. Kedua, tentukan sumber masukan: pertanyaan pelanggan, data pencarian, percakapan penjualan, atau pengalaman operasional. Ketiga, buat alur produksi yang jelas dari riset sampai publikasi. Keempat, tentukan ukuran yang berhubungan dengan tujuan. Kelima, jadwalkan evaluasi dan perubahan.',
        'Tanpa masukan yang terus diperbarui, konten menjadi pengulangan ide umum. Tanpa ukuran, tim mudah menganggap jangkauan tinggi sebagai keberhasilan walaupun tidak menghasilkan percakapan berkualitas. Tanpa ritme evaluasi, aturan lama berubah menjadi beban. Sistem yang baik justru memudahkan orang mengatakan: bagian ini tidak lagi bekerja, mari kita perbaiki.'
      ]},
      { heading: 'Mengapa tren menguji fondasi', paragraphs: [
        'Ketika format baru muncul, brand berbasis template sering mengganti seluruh tampilannya. Brand berbasis sistem bertanya lebih dulu: apakah format ini membantu tujuan kami, cocok dengan cara audiens belajar, dan bisa diproduksi secara konsisten? Jika jawabannya ya, format baru dimasukkan sebagai eksperimen. Jika tidak, brand tidak perlu ikut hanya karena ramai.',
        'Sikap ini bukan berarti anti-tren. Tren dapat menjadi saluran distribusi yang berguna. Bedanya, keputusan tidak diserahkan kepada algoritma. Identitas, sudut pandang, dan hubungan dengan audiens tetap menjadi aset brand. Format boleh berubah; alasan keberadaan dan cara menilai hasil tidak ikut berubah setiap minggu.'
      ]},
      { heading: 'Mulai dari satu putaran kerja', paragraphs: [
        'Bisnis kecil tidak membutuhkan dokumen puluhan halaman untuk mulai. Pilih satu aktivitas penting, misalnya produksi artikel. Tuliskan siapa yang mengumpulkan pertanyaan pelanggan, bagaimana memilih topik, standar kualitas, tempat menyimpan draft, jadwal terbit, dan metrik yang ditinjau. Jalankan empat minggu, lalu catat bagian yang macet.',
        'Template terbaik kemudian lahir dari sistem tersebut. Ia menjadi alat bantu yang mencerminkan proses nyata, bukan paket asing yang memaksa bisnis menyesuaikan diri. Catatan perubahan juga penting: tim perlu tahu alasan sebuah aturan dibuat dan bukti yang membuatnya diubah. Inilah perbedaan mendasar: template membantu melakukan satu tugas; sistem membantu organisasi belajar. Brand yang bertahan bukan brand yang tidak pernah berubah, melainkan brand yang tahu bagian mana yang harus tetap dan bagian mana yang perlu diperbarui.'
      ]}
    ]
  },
  {
    slug: 'funnel-sederhana-jangan-menyewa-audiens',
    title: "Funnel sederhana: kenapa 'jangan menyewa audiens' itu prinsip, bukan slogan",
    category: 'Content & Growth',
    summary: 'Platform membantu ditemukan, tetapi hubungan jangka panjang perlu berpindah ke kanal yang dapat dikendalikan bisnis.',
    publishedAt: '6 Juli 2026', readTime: '5 menit',
    content: [
      { paragraphs: [
        'Media sosial memberi bisnis kecil akses distribusi yang sebelumnya mahal. Satu video dapat ditemukan banyak orang tanpa membeli slot iklan. Namun jangkauan itu bukan kepemilikan. Platform menentukan siapa yang melihat, format apa yang didorong, dan kapan aturan berubah. Akun dapat tumbuh, tetapi akses kepada audiens tetap bergantung pada keputusan pihak lain.',
        'Kalimat “jangan menyewa audiens” bukan ajakan meninggalkan Instagram atau platform lain. Menyewa tempat sering masuk akal—toko juga dapat berkembang di pusat perbelanjaan. Prinsipnya adalah jangan menjadikan tempat sewaan sebagai satu-satunya fondasi. Gunakan platform untuk ditemukan, lalu bangun jalur agar orang yang tertarik dapat memilih hubungan yang lebih langsung.'
      ]},
      { heading: 'Funnel sebagai alur kepercayaan', paragraphs: [
        'Funnel sederhana tidak harus penuh teknik rumit. Tahap pertama adalah ditemukan: konten menjawab masalah yang dirasakan audiens. Tahap kedua adalah dipahami: website atau halaman produk menjelaskan sudut pandang, bukti, batasan, dan penawaran secara utuh. Tahap ketiga adalah diizinkan menghubungi: pengunjung secara sadar memberikan email, mengikuti newsletter, atau memulai percakapan. Tahap terakhir adalah dilayani melalui produk relevan.',
        'Setiap tahap memiliki fungsi berbeda. Konten pendek bagus untuk membuka perhatian, tetapi lemah untuk menjelaskan keputusan kompleks. Website memberi ruang untuk konteks dan menjadi alamat yang dapat dikendalikan. Email atau kontak langsung memungkinkan komunikasi tanpa berharap algoritma menampilkan pesan. Produk membuktikan apakah perhatian tadi berhubungan dengan masalah yang cukup penting untuk diselesaikan.'
      ]},
      { heading: 'Aset yang benar-benar dibangun', paragraphs: [
        'Tujuan funnel bukan mengumpulkan alamat sebanyak mungkin. Daftar kecil yang memberi izin dan memiliki kebutuhan jelas lebih bernilai daripada pengikut besar yang tidak memahami penawaran. Karena itu, tawaran berlangganan harus jujur: jelaskan jenis informasi, frekuensi, dan cara berhenti. Kepercayaan adalah aset; alamat email hanya wadahnya.',
        'Ukur perpindahan yang bermakna. Berapa orang dari konten membaca penjelasan lengkap? Berapa yang kembali? Pertanyaan apa yang mereka ajukan? Berapa pelanggan yang datang dari hubungan berulang, bukan satu posting kebetulan? Angka ini membantu bisnis melihat kualitas jalur, bukan sekadar ukuran keramaian di pintu masuk.'
      ]},
      { heading: 'Mulai tanpa sistem mahal', paragraphs: [
        'Mulailah dengan satu halaman yang menjelaskan siapa yang dibantu, masalah yang diselesaikan, dan tindakan berikutnya. Tambahkan satu cara kontak atau langganan yang dapat dikelola. Publikasikan konten di satu platform utama dan arahkan orang ke halaman tersebut ketika relevan. Simpan persetujuan dan data secara bertanggung jawab.',
        'Platform tetap menjadi mitra distribusi penting, tetapi bukan pusat identitas bisnis. Ketika hubungan berpindah dari jangkauan pinjaman menuju kanal yang dipilih audiens, bisnis memperoleh ruang untuk belajar, melayani, dan bertumbuh dengan aturan yang lebih stabil. Itulah mengapa “jangan menyewa audiens” adalah prinsip desain sistem, bukan slogan anti-media sosial.'
      ]}
    ]
  }
]

export const findArticle = (slug: string) => ARTICLES.find((article) => article.slug === slug)

// Helper: current sprint day index relative to today (clamped 0..14)
export function currentSprintDay(now = new Date()): number {
  const start = new Date(META.sprintStart + 'T00:00:00+07:00').getTime()
  const diffDays = Math.floor((now.getTime() - start) / 86_400_000)
  return Math.max(0, Math.min(14, diffDays))
}

export function rupiah(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID')
}
