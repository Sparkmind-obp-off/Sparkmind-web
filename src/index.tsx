import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { Layout } from './renderer'
import { Nav, Footer, statusBadge } from './components'
import legal from './legal'
import { runGateway } from './ai/gateway'
import { GatewayError, type GatewayFailure } from './ai/types'
import {
  authenticateOwner, clearOwnerSession, hasValidOwnerSession, LoginPanel,
  requireOwner, safeDashboardPath, type OwnerBindings
} from './auth'
import { DashboardHome } from './dashboard'
import {
  META, PILLARS, BRANDS, SPRINT, REVENUE, D90_MIX, TARGETS,
  DECISIONS, GAPS, GAP_STATS, MARKET, LEGAL, BARBERKAS, PUBLIC_META,
  PUBLIC_PRODUCTS, ARTICLES, findArticle, currentSprintDay, rupiah
} from './data'

type Bindings = OwnerBindings & {
  GEMINI_API_KEY?: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/dashboard', requireOwner())
app.use('/dashboard/*', requireOwner())

// Inline official SparkMind symbol for favicon responses.
const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" rx="52" fill="#090A0B"/><path fill="#D4AF37" d="M38 48h82l43 43-25 25-31-31H78l28 28-25 25-43-43 25-25h76l-22-22H38z"/><path fill="#F4EFE4" d="M218 208h-82l-43-43 25-25 31 31h29l-28-28 25-25 43 43-25 25h-76l22 22h79z"/><path fill="#090A0B" d="m128 116 12 12-12 12-12-12z"/></svg>`
const notFoundResponse = () => new Response(
  `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>404 — SparkMind</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"><link href="/static/style.css" rel="stylesheet"></head><body><main class="page center-page"><span class="section-number">Halaman tidak ditemukan</span><h1 class="display">404</h1><p class="muted">Alamat ini tidak tersedia. Kembali ke <a class="text-link" href="/">beranda SparkMind</a>.</p></main></body></html>`,
  { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
)
app.get('/favicon.ico', (c) => c.body(FAVICON, 200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' }))
app.get('/favicon.svg', (c) => c.body(FAVICON, 200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' }))

// ════════════════════════════════════════════════════════════════
// OWNER LOGIN — intentionally single-owner, not multi-user
// ════════════════════════════════════════════════════════════════
app.get('/login', async (c) => {
  const nextPath = safeDashboardPath(c.req.query('next'))
  c.header('Cache-Control', 'no-store')

  if (await hasValidOwnerSession(c)) return c.redirect(nextPath)

  return c.html(
    <Layout title="Masuk — Dashboard SparkMind" description="Akses pemilik ke dashboard SparkMind." noIndex>
      <LoginPanel nextPath={nextPath} />
    </Layout>
  )
})

app.post('/login', async (c) => {
  const nextPath = safeDashboardPath(c.req.query('next'))
  const body = await c.req.parseBody()
  const password = typeof body.password === 'string' ? body.password : ''
  c.header('Cache-Control', 'no-store')

  if (await authenticateOwner(c, password)) return c.redirect(nextPath)

  return c.html(
    <Layout title="Masuk — Dashboard SparkMind" description="Akses pemilik ke dashboard SparkMind." noIndex>
      <LoginPanel error="Password salah." nextPath={nextPath} />
    </Layout>,
    401
  )
})

app.get('/logout', (c) => {
  clearOwnerSession(c)
  c.header('Cache-Control', 'no-store')
  return c.redirect('/login')
})

// ════════════════════════════════════════════════════════════════
// OWNER DASHBOARD — all routes protected by requireOwner()
// ════════════════════════════════════════════════════════════════
app.get('/dashboard', (c) => {
  c.header('Cache-Control', 'no-store')
  const gatewayConfigured = Boolean(c.env.GEMINI_API_KEY?.trim())

  return c.html(
    <Layout title="Dashboard — SparkMind" description="Ruang kerja internal pemilik SparkMind." noIndex>
      <DashboardHome gatewayConfigured={gatewayConfigured} />
    </Layout>
  )
})

// ════════════════════════════════════════════════════════════════
// JSON API — Sprint / Revenue / Doctrine state (public-safe)
// ════════════════════════════════════════════════════════════════
app.get('/api/health', (c) => c.json({ ok: true, doctrine: META.doctrineVersion, ts: Date.now() }))

app.post('/api/ai/generate', async (c) => {
  let body: unknown

  try {
    body = await c.req.json()
  } catch {
    return c.json<GatewayFailure>({ ok: false, error: 'Body permintaan harus berupa JSON yang valid.' }, 400)
  }

  if (!body || typeof body !== 'object' || !('prompt' in body) || typeof body.prompt !== 'string') {
    return c.json<GatewayFailure>({ ok: false, error: 'Field prompt wajib berupa teks.' }, 400)
  }

  try {
    return c.json(await runGateway(
      { prompt: body.prompt, type: 'text' },
      { geminiApiKey: c.env.GEMINI_API_KEY }
    ))
  } catch (error) {
    if (error instanceof GatewayError) {
      return c.json<GatewayFailure>({ ok: false, error: error.message }, error.status)
    }

    return c.json<GatewayFailure>({ ok: false, error: 'Terjadi gangguan internal saat memproses permintaan AI.' }, 500)
  }
})

app.get('/api/state', (c) => {
  const day = currentSprintDay()
  return c.json({
    meta: META,
    sprintDay: day,
    sprint: SPRINT,
    revenue: REVENUE,
    revenueTargetIdr: META.revenueD30Target,
    revenueTotalChannelsIdr: REVENUE.reduce((s, r) => s + r.targetIdr, 0),
    brands: BRANDS,
    decisions: DECISIONS,
    gaps: GAPS,
    gapStats: GAP_STATS,
    market: MARKET
  })
})

app.get('/api/brands', (c) => c.json(BRANDS))
app.get('/api/barberkas', (c) => c.json(BARBERKAS))
app.get('/api/sprint', (c) => c.json({ today: currentSprintDay(), days: SPRINT }))
app.get('/api/revenue', (c) => c.json({ targetIdr: META.revenueD30Target, channels: REVENUE, mix: D90_MIX, targets: TARGETS }))

// ════════════════════════════════════════════════════════════════
// LEGAL routes — PT WASKITA CAKRAWARTI DIGITAL (see src/legal.tsx)
// ════════════════════════════════════════════════════════════════
app.route('/legal', legal)

app.get('/api/legal', (c) => c.json({
  entity: LEGAL.companyName,
  type: LEGAL.companyType,
  registration: LEGAL.registrationNo,
  registeredAt: LEGAL.registrationBody,
  registrationDate: LEGAL.registrationDate,
  domicile: LEGAL.domicile,
  owner: LEGAL.ownerFullName,
  mainDomain: LEGAL.mainDomain,
  pages: ['/legal', '/legal/ownership', '/legal/terms', '/legal/privacy', '/legal/refund', '/legal/disclaimer']
}))

// ════════════════════════════════════════════════════════════════
// PUBLIC HOME — SparkMind digital brand company
// ════════════════════════════════════════════════════════════════
app.get('/', (c) => c.html(
  <Layout title="SparkMind — Produk AI & Sistem Brand Digital untuk UMKM Indonesia" description={PUBLIC_META.positioning}>
    <Nav active="home" />
    <main>
      <section id="hero-section" class="hero home-hero">
        <div class="hero-inner">
          <span class="eyebrow">Digital Brand Company · Indonesia</span>
          <h1 class="display">Bangun bisnis digitalmu<br /><em>di atas fondasi sendiri.</em></h1>
          <p class="hero-desc">{PUBLIC_META.positioning}</p>
          <div class="hero-cta">
            <a href="/produk" class="btn btn-gold">Lihat Produk <i class="fas fa-arrow-right"></i></a>
            <a href="/belajar" class="btn btn-ghost">Mulai Belajar</a>
          </div>
          <p class="proof-note"><span></span> Dibangun dari pekerjaan nyata, bukan sekadar tren.</p>
        </div>
      </section>

      <section id="masalah" class="section split-section">
        <div class="section-intro">
          <span class="section-number">01 · Masalah</span>
          <h2>Ramai di digital belum tentu membangun bisnis.</h2>
        </div>
        <div class="issue-list">
          {[
            ['Bingung harus mulai dari mana', 'Pilihan kanal dan alat terus bertambah, tetapi arah bisnis tetap kabur.'],
            ['Tergantung pada satu platform', 'Audiens tumbuh di ruang yang aturan dan jangkauannya tidak kita kendalikan.'],
            ['Konten banyak, hasil bisnis minim', 'Aktivitas berjalan tanpa sistem yang menghubungkan perhatian dengan penawaran.'],
            ['AI justru menambah kebingungan', 'Alat dibeli karena tren, bukan karena menyelesaikan pekerjaan yang jelas.']
          ].map((item, index) => (
            <article class="issue-item"><span>0{index + 1}</span><div><h3>{item[0]}</h3><p>{item[1]}</p></div></article>
          ))}
        </div>
      </section>

      <section id="solusi" class="section solution-section">
        <div class="section-head centered">
          <span class="section-number">02 · Cara kami bekerja</span>
          <h2>Tiga lapis fondasi. Urutannya penting.</h2>
          <p class="muted">Teknologi bekerja lebih baik ketika keputusan bisnisnya sudah jelas.</p>
        </div>
        <div class="principle-grid">
          {[
            ['01', 'Strategi', 'Menentukan masalah yang layak diselesaikan dan arah yang masuk akal untuk bisnis Anda.'],
            ['02', 'Sistem', 'Mengubah keputusan menjadi proses yang bisa dijalankan, diukur, dan diperbaiki.'],
            ['03', 'AI', 'Mempercepat bagian yang tepat. AI adalah alat di dalam sistem, bukan tujuan akhirnya.']
          ].map((item) => (
            <article class="principle-card"><span>{item[0]}</span><i class="fas fa-arrow-down"></i><h3>{item[1]}</h3><p>{item[2]}</p></article>
          ))}
        </div>
      </section>

      <section id="audiens" class="section">
        <div class="section-head">
          <span class="section-number">03 · Dua pintu masuk</span>
          <h2>Datang untuk memakai. Atau datang untuk memahami.</h2>
        </div>
        <div class="audience-grid">
          <article class="audience-card operator-card">
            <span class="card-label">Jalankan lebih rapi</span>
            <div class="audience-icon"><i class="fas fa-store"></i></div>
            <h3>Untuk Operator UMKM</h3>
            <p>Produk AI siap pakai untuk pekerjaan nyata—dengan fungsi, harga, dan batasan yang jelas.</p>
            <a href="/produk">Temukan produk yang tepat <i class="fas fa-arrow-right"></i></a>
          </article>
          <article class="audience-card learner-card">
            <span class="card-label">Bangun lebih sadar</span>
            <div class="audience-icon"><i class="fas fa-book-open"></i></div>
            <h3>Untuk Pembelajar</h3>
            <p>Framework dan studi kasus untuk freelancer, solopreneur, creator, dan agensi kecil.</p>
            <a href="/belajar">Buka perpustakaan <i class="fas fa-arrow-right"></i></a>
          </article>
        </div>
      </section>

      <section id="produk" class="section">
        <div class="section-head section-head-row">
          <div><span class="section-number">04 · Produk</span><h2>AI yang punya pekerjaan jelas.</h2></div>
          <a class="text-link" href="/produk">Lihat semua produk <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="product-grid featured-products">
          {PUBLIC_PRODUCTS.slice(0, 4).map((product) => (
            <a class="product-card" style={`--accent:${product.accent}`} href={`https://${product.subdomain}`} target="_blank" rel="noopener">
              <div class="product-icon"><i class={`fas ${product.icon}`}></i></div>
              <span class="product-type">Produk SparkMind</span>
              <h3>{product.name}</h3>
              <p>{product.tagline}</p>
              <footer><strong>{product.pricing}</strong><i class="fas fa-arrow-up-right-from-square"></i></footer>
            </a>
          ))}
        </div>
      </section>

      <section id="bukti" class="section proof-section">
        <div class="proof-visual" aria-hidden="true"><span class="scissor-ring"><i class="fas fa-scissors"></i></span><small>BARBERKAS · DOGFOODING</small></div>
        <div class="proof-copy">
          <span class="section-number">05 · Bukti nyata</span>
          <h2>Kami memakai produk kami sendiri sebelum menjualnya.</h2>
          <p>BarberKas dipakai langsung oleh founder SparkMind dalam pekerjaannya sebagai capster. Booking, transaksi, dan gesekan operasionalnya ditemui di tempat kerja sungguhan—bukan hanya di ruang demo.</p>
          <p class="muted">Itu tidak membuat produknya otomatis sempurna. Tetapi setiap keputusan dimulai dari masalah yang benar-benar dialami.</p>
          <a class="text-link" href="/belajar/kenapa-kami-pakai-produk-sendiri-sebelum-menjualnya">Baca studi kasus <i class="fas fa-arrow-right"></i></a>
        </div>
      </section>

      <section id="artikel" class="section">
        <div class="section-head section-head-row">
          <div><span class="section-number">06 · Belajar</span><h2>Catatan untuk membangun dengan kepala dingin.</h2></div>
          <a class="text-link" href="/belajar">Lihat semua artikel <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="article-grid">
          {ARTICLES.slice(0, 3).map((article) => (
            <a class="article-card" href={`/belajar/${article.slug}`}>
              <div class="article-meta"><span>{article.category}</span><time>{article.publishedAt}</time></div>
              <h3>{article.title}</h3><p>{article.summary}</p>
              <strong>Baca artikel <i class="fas fa-arrow-right"></i></strong>
            </a>
          ))}
        </div>
      </section>

      <section id="ikuti" class="section connect-section">
        <span class="section-number">07 · Terhubung</span>
        <h2>Ikuti prosesnya, bukan hanya hasil akhirnya.</h2>
        <p>Kami membagikan catatan, pembelajaran, dan perkembangan produk secara jujur melalui Instagram.</p>
        <div class="hero-cta">
          <a class="btn btn-gold" href={PUBLIC_META.instagram} target="_blank" rel="noopener"><i class="fab fa-instagram"></i> Ikuti {PUBLIC_META.instagramHandle}</a>
          <a class="btn btn-ghost" href={`mailto:${LEGAL.contactEmail}?subject=Berlangganan%20kabar%20SparkMind`}>Berlangganan via email</a>
        </div>
      </section>
    </main>
    <Footer />
  </Layout>
))

// ════════════════════════════════════════════════════════════════
// PUBLIC PAGES
// ════════════════════════════════════════════════════════════════
app.get('/produk', (c) => c.html(
  <Layout title="Produk SparkMind — AI Siap Pakai untuk Bisnis Kecil" description="Lima produk AI SparkMind untuk operator UMKM Indonesia, dari barbershop dan fashion hingga komunitas lokal.">
    <Nav active="products" />
    <main class="public-page">
      <header class="public-page-head">
        <div><span class="section-number">Produk</span><h1>Alat yang lahir dari pekerjaan nyata.</h1></div>
        <p>Setiap produk punya pekerjaan yang jelas, harga yang terbuka, dan situsnya sendiri. Pilih berdasarkan masalah yang ingin diselesaikan—bukan berdasarkan tren AI terbaru.</p>
      </header>
      <section aria-labelledby="product-list-title">
        <h2 id="product-list-title" class="sr-only">Daftar produk SparkMind</h2>
        <div class="product-grid">
          {PUBLIC_PRODUCTS.map((product) => (
            <a class="product-card" style={`--accent:${product.accent}`} href={`https://${product.subdomain}`} target="_blank" rel="noopener">
              <div class="product-icon"><i class={`fas ${product.icon}`}></i></div>
              <span class="product-type">Produk SparkMind</span>
              <h3>{product.name}</h3>
              <p>{product.tagline}</p>
              <footer><strong>{product.pricing}</strong><span>Kunjungi situs <i class="fas fa-arrow-up-right-from-square"></i></span></footer>
            </a>
          ))}
        </div>
      </section>
      <section class="entity-strip product-note">
        <div><strong>Belum tahu harus memilih yang mana?</strong><p>Ceritakan alur kerja yang ingin Anda rapikan. Kami akan menjawab dengan jujur, termasuk jika produk kami belum tepat.</p></div>
        <a class="btn btn-ghost" href="/kontak">Bicarakan kebutuhan</a>
      </section>
    </main>
    <Footer />
  </Layout>
))

app.get('/belajar', (c) => c.html(
  <Layout title="Belajar — Perpustakaan SparkMind" description="Framework, studi kasus, dan cara berpikir untuk membangun brand serta bisnis digital secara sistematis.">
    <Nav active="learn" />
    <main class="public-page">
      <header class="public-page-head">
        <div><span class="section-number">Learn Hub</span><h1>Perpustakaan untuk membangun dengan sadar.</h1></div>
        <p>Bukan kumpulan trik viral. Di sini kami membedah cara berpikir, sistem, dan pengalaman operasional yang membantu bisnis kecil membuat keputusan lebih baik.</p>
      </header>
      <nav class="filter-bar" aria-label="Filter kategori artikel">
        {['Semua', 'Branding', 'AI & Automation', 'Content & Growth', 'Studi Kasus'].map((category, index) => (
          <button type="button" class={`filter-button ${index === 0 ? 'active' : ''}`} data-category={category}>{category}</button>
        ))}
      </nav>
      <section class="article-list" aria-label="Daftar artikel">
        {ARTICLES.map((article) => (
          <a class="article-row" href={`/belajar/${article.slug}`} data-article-category={article.category}>
            <div class="article-row-meta"><span>{article.category}</span><time>{article.publishedAt}</time><small>{article.readTime}</small></div>
            <div><h2>{article.title}</h2><p>{article.summary}</p></div>
            <i class="fas fa-arrow-right"></i>
          </a>
        ))}
      </section>
    </main>
    <Footer />
  </Layout>
))

app.get('/belajar/:slug', (c) => {
  const article = findArticle(c.req.param('slug'))
  if (!article) return notFoundResponse()
  return c.html(
    <Layout title={`${article.title} — SparkMind`} description={article.summary}>
      <Nav active="learn" />
      <main class="public-page article-detail">
        <a class="article-back" href="/belajar"><i class="fas fa-arrow-left"></i> Kembali ke Learn Hub</a>
        <article>
          <header class="article-header">
            <span class="section-number">{article.category}</span>
            <h1>{article.title}</h1>
            <div class="article-meta"><time>{article.publishedAt}</time><span>{article.readTime} baca</span></div>
          </header>
          <div class="article-body">
            {article.content.map((section) => (
              <section>
                {section.heading ? <h2>{section.heading}</h2> : null}
                {section.paragraphs.map((paragraph) => <p>{paragraph}</p>)}
              </section>
            ))}
          </div>
        </article>
        <section class="entity-strip">
          <div><strong>Lanjutkan cara berpikirnya.</strong><p>Temukan produk untuk praktik langsung atau baca catatan lain di perpustakaan.</p></div>
          <div class="inline-actions"><a class="btn btn-ghost" href="/produk">Lihat Produk</a><a class="btn btn-gold" href="/belajar">Artikel Lain</a></div>
        </section>
      </main>
      <Footer />
    </Layout>
  )
})

app.get('/tentang', (c) => c.html(
  <Layout title="Tentang SparkMind — Fondasi Digital untuk Bisnis Indonesia" description="Cerita, nilai, dan badan hukum di balik SparkMind.">
    <Nav active="about" />
    <main class="public-page">
      <header class="public-page-head">
        <div><span class="section-number">Tentang Kami</span><h1>Teknologi boleh berubah. Fondasi tidak boleh rapuh.</h1></div>
        <p>SparkMind ada agar lebih banyak UMKM dan pelaku bisnis kecil memahami cara membangun brand digital yang benar—bukan sekadar rajin posting.</p>
      </header>
      <section class="story-layout">
        <div><span class="section-number">Kenapa kami ada</span><h2>Dari alat yang dipakai sendiri, menuju sistem yang bisa dipelajari bersama.</h2></div>
        <div class="story-copy">
          <p>Bisnis kecil sering diberi dua pilihan yang sama-sama melelahkan: mengikuti setiap tren digital, atau tertinggal. Kami percaya ada jalan yang lebih masuk akal. Mulai dari masalah nyata, bangun sistem yang dapat diulang, lalu gunakan teknologi untuk memperkuatnya.</p>
          <p>Karena itu SparkMind bekerja dalam dua lapis. Kami membuat produk AI siap pakai untuk operator UMKM, sekaligus membagikan framework dan studi kasus bagi orang yang ingin membangun brand serta bisnis digitalnya sendiri.</p>
          <p>Kami masih berada dalam proses membangun. Kami tidak mengklaim telah melayani angka yang belum dapat dibuktikan. Ukuran kami adalah kegunaan: apakah produk dipakai, apakah sistem mempermudah keputusan, dan apakah pembelajaran dapat diterapkan di dunia nyata.</p>
        </div>
      </section>
      <section aria-labelledby="values-title">
        <div class="section-head"><span class="section-number">Nilai brand</span><h2 id="values-title">Empat pegangan dalam setiap keputusan.</h2></div>
        <div class="values-grid">
          {[
            ['01', 'Kedaulatan', 'Bisnis harus tetap punya kendali atas data, kanal, dan keputusan pentingnya sendiri.'],
            ['02', 'Kejelasan', 'Kami memilih penjelasan yang dapat dipahami daripada istilah yang terdengar canggih.'],
            ['03', 'Bukti nyata', 'Klaim harus bertumpu pada penggunaan, hasil, atau proses yang memang dapat ditunjukkan.'],
            ['04', 'Sistematis', 'Pekerjaan yang baik perlu bisa diulang, diukur, dan diperbaiki—bukan bergantung pada momentum.']
          ].map((value) => (
            <article class="value-card"><span>{value[0]}</span><h2>{value[1]}</h2><p>{value[2]}</p></article>
          ))}
        </div>
      </section>
      <section class="entity-strip">
        <div><strong>{LEGAL.companyName}</strong><p>SparkMind dioperasikan oleh badan hukum Indonesia. Founder: {LEGAL.ownerFullName}, {LEGAL.ownerRole}.</p></div>
        <a class="btn btn-ghost" href="/legal/ownership">Lihat pernyataan kepemilikan</a>
      </section>
    </main>
    <Footer />
  </Layout>
))

app.get('/kontak', (c) => c.html(
  <Layout title="Kontak SparkMind" description="Hubungi SparkMind untuk pertanyaan produk, kolaborasi, atau percakapan tentang kebutuhan digital bisnis Anda.">
    <Nav active="contact" />
    <main class="public-page">
      <header class="public-page-head">
        <div><span class="section-number">Kontak</span><h1>Mari mulai dari masalah yang nyata.</h1></div>
        <p>Ceritakan konteks bisnis dan bagian yang ingin Anda rapikan. Tidak perlu menulis brief yang sempurna—kami akan membantu memperjelasnya.</p>
      </header>
      <section class="contact-layout">
        <div>
          <span class="section-number">Hubungi langsung</span>
          <h2 class="contact-title">Pilih kanal yang paling nyaman.</h2>
          <div class="contact-options">
            <div class="contact-option"><span>Email resmi</span><a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a></div>
            <div class="contact-option"><span>Instagram</span><a href={PUBLIC_META.instagram} target="_blank" rel="noopener">{PUBLIC_META.instagramHandle}</a></div>
            <div class="contact-option"><span>Domisili</span><p>{LEGAL.domicile}</p></div>
          </div>
        </div>
        <form id="contact-form" class="contact-form" data-recipient={LEGAL.contactEmail}>
          <div class="form-field"><label for="contact-name">Nama</label><input id="contact-name" name="name" type="text" autocomplete="name" required /></div>
          <div class="form-field"><label for="contact-email">Email</label><input id="contact-email" name="email" type="email" autocomplete="email" required /></div>
          <div class="form-field"><label for="contact-message">Pesan</label><textarea id="contact-message" name="message" required placeholder="Ceritakan bisnis, masalah, dan hasil yang Anda harapkan."></textarea></div>
          <button class="btn btn-gold" type="submit">Siapkan email <i class="fas fa-arrow-right"></i></button>
          <p class="form-note">Form ini akan membuka aplikasi email Anda. Data tidak disimpan di server SparkMind.</p>
        </form>
      </section>
    </main>
    <Footer />
  </Layout>
))

// ════════════════════════════════════════════════════════════════
// DOCTRINE viewer
// ════════════════════════════════════════════════════════════════
app.get('/internal/doctrine', (c) => {
  return c.html(
    <Layout title={`Doctrine ${META.doctrineVersion} — ${META.name}`} noIndex>
      <Nav active="doctrine" />
      <main class="page">
        <section class="page-head">
          <span class="kicker"><i class="fas fa-scroll"></i> MASTER CONSOLIDATED DOCTRINE LOCK {META.doctrineVersion}</span>
          <h1>The Forge Doctrine</h1>
          <p class="muted">Supersedes v10.0 · {META.doctrineDate} · {META.owner}</p>
          <p class="muted small">Triple parallel track: Doctrine {META.doctrineVersion} + Architect {META.architectVersion} + Sprint {META.sprintVersion}</p>
        </section>

        <section class="card">
          <h2><i class="fas fa-hammer"></i> Part 1 — The Forge (Category Lock)</h2>
          <p>Positioning tetap solid: <b>{META.category}</b>. Kita bukan dev studio, kita pabrik agen AI untuk UMKM.</p>
          <div class="pillar-table">
            {PILLARS.map((p) => (<div class="row"><b>{p.title}</b><span>{p.desc}</span></div>))}
          </div>
        </section>

        <section class="card">
          <h2><i class="fas fa-anvil"></i> Part 2 — The Anvil (Reality Check)</h2>
          <div class="stat-row">
            <div class="stat"><b>{GAP_STATS.total}</b><span>Total Gaps</span></div>
            <div class="stat red"><b>{GAP_STATS.p0}</b><span>P0 Critical</span></div>
            <div class="stat amber"><b>{GAP_STATS.p1}</b><span>P1 High</span></div>
            <div class="stat green"><b>{GAP_STATS.closed}</b><span>Closed</span></div>
          </div>
          <table class="data-table">
            <thead><tr><th>ID</th><th>Prio</th><th>Gap / Issue</th><th>v11.0 Action</th><th>Status</th></tr></thead>
            <tbody>
              {GAPS.map((g) => (
                <tr>
                  <td><code>{g.id}</code></td>
                  <td><span class={`badge ${g.prio === 'P0' ? 'b-red' : g.prio === 'P1' ? 'b-amber' : 'b-blue'}`}>{g.prio}</span></td>
                  <td>{g.gap}</td><td>{g.action}</td>
                  <td><span class={`badge ${g.status === 'closed' ? 'b-green' : 'b-red'}`}>{g.status.toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section class="card">
          <h2><i class="fas fa-list-check"></i> Part 8 — The Ledger (Decision Lock)</h2>
          <div class="decision-list">
            {DECISIONS.map((d) => (<div class="decision"><code>{d.id}</code><span>{d.text}</span></div>))}
          </div>
        </section>

        <section class="card">
          <h2><i class="fas fa-shield-halved"></i> Part 6 — The Quench (Compliance)</h2>
          <ul class="bullets">
            <li><b>UU PDP (Law 27/2022):</b> Data terenkripsi di D1 Cloudflare. DPIA template loaded.</li>
            <li><b>PSE Komdigi:</b> Pendaftaran setelah tembus Rp 10M MRR (Lingkup Privat).</li>
            <li><b>Trademark:</b> Sub-brand marks prep. File to DGIP in D180.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </Layout>
  )
})

// ════════════════════════════════════════════════════════════════
// SPRINT tracker (D0-D14)
// ════════════════════════════════════════════════════════════════
app.get('/internal/sprint', (c) => {
  const today = currentSprintDay()
  return c.html(
    <Layout title={`Sprint Tracker — ${META.name}`} noIndex>
      <Nav active="sprint" />
      <main class="page">
        <section class="page-head">
          <span class="kicker"><i class="fas fa-fire"></i> SPRINT-EXECUTE {META.sprintVersion} · LIVE</span>
          <h1>Sprint 2 — D0 → D14</h1>
          <p class="muted">{META.sprintStart} → {META.sprintEnd} · North Star: {rupiah(META.revenueD30Target)} by D30</p>
        </section>

        <section class="progress-wrap card">
          <div class="progress-head">
            <span>Sprint progress</span>
            <b id="sprint-day-label">D{today} / D14</b>
          </div>
          <div class="progress-bar"><div class="progress-fill" style={`width:${(today / 14) * 100}%`}></div></div>
          <div class="gate-marks">
            <span class={today >= 7 ? 'hit' : ''}>D7 Gate · Soft Launch</span>
            <span class={today >= 14 ? 'hit' : ''}>D14 Gate · Sprint Close</span>
          </div>
        </section>

        <section class="timeline">
          {SPRINT.map((s) => (
            <article class={`day-card ${s.gate ? 'gate' : ''} ${s.d < today ? 'done' : s.d === today ? 'current' : ''}`}>
              <div class="day-badge">
                <b>D{s.d}</b>
                <span>{s.weekday} {s.date.slice(5)}</span>
              </div>
              <div class="day-body">
                <h3>{s.theme} {s.gate ? <span class="badge b-red">GATE</span> : null}</h3>
                <ul>
                  {s.tasks.map((t) => (<li><span class="who">{t.who}</span> {t.what}</li>))}
                </ul>
                <p class="criteria"><i class="fas fa-flag-checkered"></i> {s.criteria}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </Layout>
  )
})

// ════════════════════════════════════════════════════════════════
// REVENUE ledger (Rp 1M D30 path)
// ════════════════════════════════════════════════════════════════
app.get('/internal/revenue', (c) => {
  const totalChannels = REVENUE.reduce((s, r) => s + r.targetIdr, 0)
  return c.html(
    <Layout title={`Revenue Ledger — ${META.name}`} noIndex>
      <Nav active="revenue" />
      <main class="page">
        <section class="page-head">
          <span class="kicker"><i class="fas fa-money-bill-trend-up"></i> REVENUE SCORECARD · Duitku {META.duitku}</span>
          <h1>Revenue Ledger — Rp 1M D30 Path</h1>
          <p class="muted">The Temper · Sprint Monetization</p>
        </section>

        <section class="target-grid">
          {TARGETS.map((t) => (<div class="target-card"><b>{t.day}</b><span>{t.label}</span></div>))}
        </section>

        <section class="card">
          <h2><i class="fas fa-route"></i> Channel Targets (D30)</h2>
          <table class="data-table">
            <thead><tr><th>Channel</th><th>Target</th><th>Conversion</th><th>D14 Leading Indicator</th></tr></thead>
            <tbody>
              {REVENUE.map((r) => (
                <tr><td><b>{r.channel}</b></td><td class="num">{rupiah(r.targetIdr)}</td><td>{r.conversion}</td><td>{r.d14Indicator}</td></tr>
              ))}
              <tr class="total-row"><td><b>TOTAL D30</b></td><td class="num"><b>{rupiah(META.revenueD30Target)}</b></td><td colspan={2}>≥ Rp 350K committed by D14</td></tr>
            </tbody>
          </table>
          <p class="muted small">Channel sum (sprint): {rupiah(totalChannels)} · scaling to {rupiah(META.revenueD30Target)} MRR by D30.</p>
        </section>

        <section class="card">
          <h2><i class="fas fa-chart-pie"></i> D90 Revenue Mix</h2>
          <div class="mix-list">
            {D90_MIX.map((m) => (
              <div class="mix-row">
                <div class="mix-label"><b>{m.brand}</b><span>{m.detail}</span></div>
                <div class="mix-bar"><div class="mix-fill" style={`width:${m.pct}%`}></div><span class="mix-pct">{m.pct}%</span></div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </Layout>
  )
})

// ════════════════════════════════════════════════════════════════
// BARBERKAS Hub — Capster Commit Sub-Brand
// SSOT: docs/BARBERKAS-CAPSTER-COMMIT-SSOT.md v1.0
// ════════════════════════════════════════════════════════════════
const bkBadge = (s: string) => {
  const cls = s === 'LIVE' ? 'b-green' : s === 'ROADMAP' ? 'b-amber' : s === 'LOCKED' ? 'b-blue' : 'b-red'
  return <span class={`badge ${cls}`}>{s}</span>
}

app.get('/internal/barberkas', (c) => {
  return c.html(
    <Layout title={`BarberKas — Capster Commit Hub · ${META.name}`} noIndex>
      <Nav active="barberkas" />
      <main class="page">
        <section class="page-head" id="barberkas-hero">
          <span class="kicker"><i class="fas fa-scissors"></i> SUB-BRAND · {BARBERKAS.ssot}</span>
          <h1>BarberKas — Capster Commit Hub</h1>
          <p class="muted">{BARBERKAS.oneLiner}</p>
        </section>

        <section class="card highlight-card" id="commitment-card">
          <h2><i class="fas fa-lock"></i> Deklarasi Komitmen (Commitment Lock)</h2>
          <p>{BARBERKAS.commitment}</p>
          <p class="muted small">
            Payung hukum: <b>{LEGAL.companyName}</b> · {LEGAL.registrationNo} ·
            Rel uang: Oasis BI Pro (MoR) → PJP Duitku {META.duitku} → QRIS/VA
          </p>
        </section>

        <section class="card" id="dual-domain-section">
          <h2><i class="fas fa-globe"></i> Arsitektur Dual-Domain (LIVE)</h2>
          <table class="data-table">
            <thead><tr><th>Domain</th><th>Peran</th><th>Status</th></tr></thead>
            <tbody>
              {BARBERKAS.domains.map((d) => (
                <tr>
                  <td><code>{d.url}</code></td>
                  <td>{d.role}</td>
                  <td>{bkBadge(d.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section class="section" id="advantages-section">
          <div class="section-head">
            <h2>Unfair Advantage: Owner-as-Capster</h2>
            <p class="muted">Owner = Capster = Kustomer-0 · Eat your own dog food</p>
          </div>
          <div class="brand-grid">
            {BARBERKAS.advantages.map((a) => (
              <article class="brand-card" style="--accent:#3b82f6">
                <div class="brand-top"><i class={`fas ${a.icon}`}></i></div>
                <h3>{a.title}</h3>
                <p class="brand-tag">{a.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section class="card" id="ladder-section">
          <h2><i class="fas fa-stairs"></i> Tangga Monetisasi (Land → Retain → Expand)</h2>
          <table class="data-table">
            <thead><tr><th>Tier</th><th>Harga</th><th>Isi</th><th>Status</th></tr></thead>
            <tbody>
              {BARBERKAS.ladder.map((l) => (
                <tr>
                  <td><b>{l.tier}</b></td>
                  <td class="num">{l.price}</td>
                  <td>{l.desc}</td>
                  <td>{bkBadge(l.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section class="section" id="ai-staff-section">
          <div class="section-head">
            <h2>AI Staff Roster (Truth-Lock)</h2>
            <p class="muted">3/9 live — sisanya intro bertahap, jujur, no overpromise</p>
          </div>
          <div class="brand-grid">
            {BARBERKAS.aiStaff.map((s) => (
              <article class="brand-card" style="--accent:#3b82f6">
                <div class="brand-top"><i class={`fas ${s.icon}`}></i>{bkBadge(s.status)}</div>
                <h3>{s.name}</h3>
                <p class="brand-tag">{s.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section class="card" id="flywheel-section">
          <h2><i class="fas fa-arrows-spin"></i> Flywheel Capster → Produk</h2>
          <ol class="bullets">
            {BARBERKAS.flywheel.map((f) => (<li>{f}</li>))}
          </ol>
        </section>

        <section class="card" id="phases-section">
          <h2><i class="fas fa-flag-checkered"></i> Target 90 Hari (PROOF → TRACTION → SCALE)</h2>
          <table class="data-table">
            <thead><tr><th>Fase</th><th>Hari</th><th>Target Capster-Commit</th></tr></thead>
            <tbody>
              {BARBERKAS.phases.map((p) => (
                <tr><td><b>{p.phase}</b></td><td>{p.days}</td><td>{p.target}</td></tr>
              ))}
            </tbody>
          </table>
          <div class="hero-cta" style="margin-top:1.2rem">
            <a href="https://barberkas.sparkmind.web.id" class="btn btn-gold" target="_blank" rel="noopener"><i class="fas fa-scissors"></i> Buka BarberKas</a>
            <a href="https://barberkas-foundry.biz.id" class="btn btn-ghost" target="_blank" rel="noopener"><i class="fas fa-rocket"></i> Outcome SKU Landing</a>
          </div>
        </section>
      </main>
      <Footer />
    </Layout>
  )
})

// 404
app.get('*', () => notFoundResponse())
app.notFound(() => notFoundResponse())

export default app
