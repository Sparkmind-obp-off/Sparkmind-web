import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { Layout } from './renderer'
import { Nav, Footer, statusBadge } from './components'
import legal from './legal'
import {
  META, PILLARS, BRANDS, SPRINT, REVENUE, D90_MIX, TARGETS,
  DECISIONS, GAPS, GAP_STATS, MARKET, LEGAL, BARBERKAS, currentSprintDay, rupiah
} from './data'

const app = new Hono()

app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))

// Inline SVG favicon (avoids 500 from serveStatic on missing /favicon.ico)
const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0a0a0a"/><text x="32" y="44" font-size="38" text-anchor="middle" fill="#d4af37" font-family="serif" font-weight="700">S</text></svg>`
app.get('/favicon.ico', (c) => c.body(FAVICON, 200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' }))
app.get('/favicon.svg', (c) => c.body(FAVICON, 200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' }))

// ════════════════════════════════════════════════════════════════
// JSON API — Sprint / Revenue / Doctrine state (public-safe)
// ════════════════════════════════════════════════════════════════
app.get('/api/health', (c) => c.json({ ok: true, doctrine: META.doctrineVersion, ts: Date.now() }))

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
// HOME — Mother Brand Landing (DoD 2: Doctrine v11.0 published)
// ════════════════════════════════════════════════════════════════
app.get('/', (c) => {
  const day = currentSprintDay()
  return c.html(
    <Layout title={`${META.name} — ${META.category}`}>
      <Nav active="home" />

      <main>
        <section id="hero-section" class="hero">
          <div class="hero-inner">
            <span class="kicker"><i class="fas fa-lock"></i> {META.status}</span>
            <h1 class="display">THE SOVEREIGN<br />AGENT FOUNDRY</h1>
            <p class="lead-en">{META.taglineEN}</p>
            <p class="lead-id">{META.taglineID}</p>
            <p class="hero-desc">
              {META.category}. Kami tempa agen AI khusus untuk UMKM Indonesia —
              jalan di edge sendiri, ngomong Bahasa Indonesia, terima Rupiah, dan nggak tunduk ke cloud asing.
            </p>
            <div class="hero-cta">
              <a href="#brands-section" class="btn btn-gold"><i class="fas fa-compass"></i> Jelajahi Foundry</a>
              <a href="/doctrine" class="btn btn-ghost"><i class="fas fa-scroll"></i> Baca Doctrine {META.doctrineVersion}</a>
            </div>
            <div class="hero-meta">
              <span><i class="fas fa-calendar-day"></i> Sprint Day <b>D{day}</b> / D14</span>
              <span><i class="fas fa-bullseye"></i> Target D30 <b>{rupiah(META.revenueD30Target)}</b></span>
              <span><i class="fas fa-code-branch"></i> {META.repo}</span>
            </div>
          </div>
        </section>

        <section class="pillars" aria-label="Sovereignty Pillars">
          {PILLARS.map((p) => (
            <article class="pillar-card">
              <i class={`fas ${p.icon}`}></i>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </section>

        <section id="brands-section" class="section">
          <div class="section-head">
            <h2>Foundry Products</h2>
            <p class="muted">7 sub-brand AKTIF — no parking (Doctrine {META.doctrineVersion} · The Mold)</p>
          </div>
          <div class="brand-grid">
            {BRANDS.map((b) => (
              <article class="brand-card" style={`--accent:${b.accent}`}>
                <div class="brand-top">
                  <i class={`fas ${b.icon}`}></i>
                  {statusBadge(b.status)}
                </div>
                <h3>{b.name}</h3>
                <p class="brand-tag">{b.tagline}</p>
                <div class="brand-foot">
                  <span class="brand-focus">{b.focus}</span>
                  <span class="brand-price">{b.pricing}</span>
                </div>
                <code class="brand-url">{b.subdomain}</code>
              </article>
            ))}
          </div>
        </section>

        <section class="section market-band">
          <div class="section-head"><h2>Market Intel</h2><p class="muted">The Hammer · 2026</p></div>
          <div class="market-grid">
            {MARKET.map((m) => (
              <div class="market-stat"><b>{m.value}</b><span>{m.label}</span></div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </Layout>
  )
})

// ════════════════════════════════════════════════════════════════
// DOCTRINE viewer
// ════════════════════════════════════════════════════════════════
app.get('/doctrine', (c) => {
  return c.html(
    <Layout title={`Doctrine ${META.doctrineVersion} — ${META.name}`}>
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
app.get('/sprint', (c) => {
  const today = currentSprintDay()
  return c.html(
    <Layout title={`Sprint Tracker — ${META.name}`}>
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
app.get('/revenue', (c) => {
  const totalChannels = REVENUE.reduce((s, r) => s + r.targetIdr, 0)
  return c.html(
    <Layout title={`Revenue Ledger — ${META.name}`}>
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

app.get('/barberkas', (c) => {
  return c.html(
    <Layout title={`BarberKas — Capster Commit Hub · ${META.name}`}>
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
app.notFound((c) => {
  const body = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"/>` +
    `<meta name="viewport" content="width=device-width, initial-scale=1.0"/>` +
    `<title>404 — SparkMind Sovereign</title>` +
    `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/>` +
    `<link href="/static/style.css" rel="stylesheet"/></head>` +
    `<body><main class="page center-page">` +
    `<h1 class="display">404</h1>` +
    `<p class="muted">Halaman ini belum di-forge. Kembali ke <a href="/">Foundry</a>.</p>` +
    `</main></body></html>`
  return c.newResponse(body, 404, { 'Content-Type': 'text/html; charset=utf-8' })
})

export default app
