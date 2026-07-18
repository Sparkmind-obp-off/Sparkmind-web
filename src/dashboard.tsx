import type { Child } from 'hono/jsx'

type DashboardSection = 'home' | 'ai-hub' | 'content' | 'assets' | 'brands' | 'settings'

const dashboardNavigation: Array<{ key: DashboardSection; icon: string; label: string; href: string }> = [
  { key: 'home', icon: '🏠', label: 'Dashboard', href: '/dashboard' },
  { key: 'ai-hub', icon: '🧠', label: 'AI Hub', href: '/dashboard/ai-hub' },
  { key: 'content', icon: '📝', label: 'Content', href: '/dashboard/content' },
  { key: 'assets', icon: '📁', label: 'Assets', href: '/dashboard/assets' },
  { key: 'brands', icon: '🏢', label: 'Brands', href: '/dashboard/brands' },
  { key: 'settings', icon: '⚙️', label: 'Settings', href: '/dashboard/settings' }
]

export const DashboardShell = (props: {
  active: DashboardSection
  title: string
  eyebrow?: string
  children?: Child
}) => (
  <main id="dashboard-shell" class="dashboard-shell">
    <aside class="dashboard-sidebar">
      <a href="/dashboard" class="brand-mark dashboard-brand" aria-label="SparkMind Dashboard">
        <img class="brand-symbol" src="/static/brand/sparkmind-symbol.svg" alt="" aria-hidden="true" />
        <span>Spark<span>Mind</span></span>
      </a>
      <p class="dashboard-label">Owner workspace</p>
      <nav class="dashboard-navigation" aria-label="Navigasi dashboard">
        {dashboardNavigation.map((item) => (
          <a href={item.href} class={props.active === item.key ? 'active' : ''} aria-current={props.active === item.key ? 'page' : undefined}>
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>
      <div class="dashboard-sidebar-foot">
        <a href="/" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i> Lihat website</a>
        <a href="/logout"><i class="fas fa-right-from-bracket" aria-hidden="true"></i> Keluar</a>
      </div>
    </aside>
    <section class="dashboard-workspace">
      <header class="dashboard-header">
        <div>
          <span class="section-number">{props.eyebrow || 'Dashboard pemilik'}</span>
          <h1>{props.title}</h1>
        </div>
        <span class="owner-chip"><i class="fas fa-lock" aria-hidden="true"></i> Sesi pemilik</span>
      </header>
      <section class="dashboard-content">
        {props.children}
      </section>
    </section>
  </main>
)

export const DashboardHome = (props: { gatewayConfigured: boolean }) => (
  <DashboardShell active="home" title="Selamat datang kembali.">
    <section class="dashboard-intro" aria-labelledby="dashboard-intro-title">
      <div>
        <p id="dashboard-intro-title">Ini adalah ruang kerja internal SparkMind. Mulai dari AI Hub untuk memakai gateway yang sudah tersedia.</p>
      </div>
      <a class="btn btn-gold" href="/dashboard/ai-hub">Buka AI Hub <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
    </section>
    <section class="dashboard-grid" aria-label="Ringkasan sistem">
      <article class="dashboard-panel gateway-status-card">
        <div class="panel-icon"><i class="fas fa-wand-magic-sparkles" aria-hidden="true"></i></div>
        <span class="panel-label">AI Gateway</span>
        <h2>Gemini provider</h2>
        <p class="muted">Status diambil langsung dari konfigurasi environment saat halaman dibuka.</p>
        <div class={`service-status ${props.gatewayConfigured ? 'configured' : 'unconfigured'}`}>
          <span aria-hidden="true"></span>
          {props.gatewayConfigured ? 'Terkonfigurasi' : 'Belum dikonfigurasi'}
        </div>
        {!props.gatewayConfigured ? <p class="status-guidance">Set secret <code>GEMINI_API_KEY</code> agar AI Hub dapat menghasilkan jawaban.</p> : null}
      </article>
      <article class="dashboard-panel">
        <div class="panel-icon"><i class="fas fa-circle-info" aria-hidden="true"></i></div>
        <span class="panel-label">Milestone 4</span>
        <h2>Shell lebih dulu</h2>
        <p class="muted">AI Hub sudah menjadi fungsi utama. Menu lain ditampilkan sebagai placeholder jujur sampai sprint berikutnya.</p>
      </article>
    </section>
  </DashboardShell>
)
