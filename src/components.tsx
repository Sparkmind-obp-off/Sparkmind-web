import { META, LEGAL, type Brand } from './data'

// ════════════════════════════════════════════════════════════════
// Shared view fragments — Nav / Footer / badges
// ════════════════════════════════════════════════════════════════
export const statusBadge = (s: Brand['status']) => {
  const map: Record<Brand['status'], { cls: string; label: string }> = {
    'DNS-FIX': { cls: 'b-red', label: 'DNS P0 FIX' },
    'LIVE': { cls: 'b-green', label: 'LIVE' },
    'PARTIAL': { cls: 'b-amber', label: 'PARTIAL' },
    'REVIVING': { cls: 'b-blue', label: 'REVIVING' },
    'NEW': { cls: 'b-red', label: 'NEW' }
  }
  const m = map[s]
  return <span class={`badge ${m.cls}`}>{m.label}</span>
}

export const Nav = (props: { active: string }) => (
  <header id="topnav">
    <a href="/" class="brand-mark">
      <i class="fas fa-industry"></i>
      <span>SparkMind <b>Sovereign</b></span>
    </a>
    <nav aria-label="Primary">
      <a href="/" class={props.active === 'home' ? 'active' : ''}>Foundry</a>
      <a href="/doctrine" class={props.active === 'doctrine' ? 'active' : ''}>Doctrine</a>
      <a href="/sprint" class={props.active === 'sprint' ? 'active' : ''}>Sprint</a>
      <a href="/revenue" class={props.active === 'revenue' ? 'active' : ''}>Revenue</a>
      <a href="/barberkas" class={props.active === 'barberkas' ? 'active' : ''}>BarberKas</a>
      <a href="/legal" class={props.active === 'legal' ? 'active' : ''}>Legal</a>
    </nav>
  </header>
)

export const Footer = () => (
  <footer id="site-footer">
    <div class="foot-grid">
      <div>
        <div class="brand-mark"><i class="fas fa-industry"></i><span>SparkMind <b>Sovereign</b></span></div>
        <p class="muted">{META.category}</p>
        <p class="muted small">"{META.taglineEN}" / "{META.taglineID}"</p>
        <p class="muted small legal-entity-line">
          <i class="fas fa-building-shield"></i> Dioperasikan oleh <b>{LEGAL.companyName}</b><br />
          {LEGAL.companyType} · {LEGAL.registrationNo}
        </p>
      </div>
      <div>
        <h4>Foundry</h4>
        <a href="/doctrine">Doctrine {META.doctrineVersion}</a>
        <a href="/sprint">Sprint Tracker</a>
        <a href="/revenue">Revenue Ledger</a>
        <a href="/barberkas">BarberKas Hub</a>
      </div>
      <div>
        <h4>Legal</h4>
        <a href="/legal">Legal Hub</a>
        <a href="/legal/ownership">Pernyataan Kepemilikan</a>
        <a href="/legal/terms">Syarat &amp; Ketentuan</a>
        <a href="/legal/privacy">Kebijakan Privasi</a>
        <a href="/legal/refund">Kebijakan Refund</a>
        <a href="/legal/disclaimer">Disclaimer</a>
      </div>
      <div>
        <h4>Lock Metadata</h4>
        <p class="muted small">Owner: {META.owner}</p>
        <p class="muted small">Entitas: {LEGAL.companyName}</p>
        <p class="muted small">Domisili: {LEGAL.domicile}</p>
        <p class="muted small">Doctrine: {META.doctrineDate}</p>
        <p class="muted small">Stack: 100% Cloudflare · Hono</p>
      </div>
    </div>
    <div class="foot-bar">
      <span>🔒 {META.status}</span>
      <span>© 2026 {LEGAL.companyName} · SparkMind Ecosystem · Public-safe</span>
    </div>
  </footer>
)
