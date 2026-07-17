import { LEGAL, type Brand } from './data'

export const statusBadge = (s: Brand['status']) => {
  const map: Record<Brand['status'], { cls: string; label: string }> = {
    'DNS-FIX': { cls: 'b-red', label: 'DALAM PERBAIKAN' },
    'LIVE': { cls: 'b-green', label: 'TERSEDIA' },
    'PARTIAL': { cls: 'b-amber', label: 'BETA' },
    'REVIVING': { cls: 'b-blue', label: 'DIKEMBANGKAN' },
    'NEW': { cls: 'b-red', label: 'BARU' }
  }
  const item = map[s]
  return <span class={`badge ${item.cls}`}>{item.label}</span>
}

export const Nav = (props: { active: string }) => (
  <header id="topnav">
    <a href="/" class="brand-mark" aria-label="SparkMind — Beranda">
      <span class="brand-symbol" aria-hidden="true">S</span>
      <span>Spark<span>Mind</span></span>
    </a>
    <button class="nav-toggle" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="primary-nav">
      <i class="fas fa-bars" aria-hidden="true"></i>
    </button>
    <nav id="primary-nav" aria-label="Navigasi utama">
      <a href="/" class={props.active === 'home' ? 'active' : ''}>Beranda</a>
      <a href="/produk" class={props.active === 'products' ? 'active' : ''}>Produk</a>
      <a href="/belajar" class={props.active === 'learn' ? 'active' : ''}>Belajar</a>
      <a href="/tentang" class={props.active === 'about' ? 'active' : ''}>Tentang Kami</a>
      <a href="/kontak" class={props.active === 'contact' ? 'active' : ''}>Kontak</a>
    </nav>
  </header>
)

export const Footer = () => (
  <footer id="site-footer">
    <div class="foot-grid">
      <section>
        <a href="/" class="brand-mark" aria-label="SparkMind — Beranda">
          <span class="brand-symbol" aria-hidden="true">S</span>
          <span>Spark<span>Mind</span></span>
        </a>
        <p class="muted footer-statement">Produk AI yang benar-benar jalan dan pengetahuan yang membantu bisnis kecil membangun fondasi digitalnya sendiri.</p>
      </section>
      <section>
        <h2>Jelajahi</h2>
        <a href="/produk">Produk</a>
        <a href="/belajar">Belajar</a>
        <a href="/tentang">Tentang Kami</a>
        <a href="/kontak">Kontak</a>
      </section>
      <section>
        <h2>Legal</h2>
        <a href="/legal">Pusat Legal</a>
        <a href="/legal/ownership">Kepemilikan</a>
        <a href="/legal/terms">Syarat &amp; Ketentuan</a>
        <a href="/legal/privacy">Privasi</a>
        <a href="/legal/refund">Refund</a>
        <a href="/legal/disclaimer">Disclaimer</a>
      </section>
      <section>
        <h2>Badan Hukum</h2>
        <p><b>{LEGAL.companyName}</b></p>
        <p class="muted small">{LEGAL.companyType}</p>
        <p class="muted small">No. {LEGAL.registrationNo}</p>
        <p class="muted small">Domisili {LEGAL.domicile}</p>
      </section>
    </div>
    <div class="foot-bar">
      <span>© 2026 {LEGAL.companyName}</span>
      <span>Bangun bisnis digitalmu di atas fondasi sendiri.</span>
    </div>
  </footer>
)
