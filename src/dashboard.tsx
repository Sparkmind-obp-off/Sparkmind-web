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

export const AIHubPage = (props: { gatewayConfigured: boolean }) => (
  <DashboardShell active="ai-hub" title="AI Hub" eyebrow="AI workspace v0.1">
    <section class="ai-hub" aria-labelledby="ai-hub-intro-title">
      <header class="ai-hub-intro">
        <div>
          <span class="panel-label">Pilih cara bekerja</span>
          <h2 id="ai-hub-intro-title">Satu ruang, tiga mode AI.</h2>
          <p>Gunakan mode yang sesuai dengan pekerjaan Anda. Setiap permintaan diproses langsung tanpa menyimpan riwayat di server.</p>
        </div>
        <div class={`service-status ${props.gatewayConfigured ? 'configured' : 'unconfigured'}`}>
          <span aria-hidden="true"></span>
          {props.gatewayConfigured ? 'Gemini siap' : 'Gemini belum siap'}
        </div>
      </header>

      <nav class="ai-mode-tabs" role="tablist" aria-label="Mode AI Hub">
        <button id="ai-tab-text" class="ai-mode-tab active" type="button" role="tab" aria-selected="true" aria-controls="ai-panel-text" data-ai-mode="text">
          <i class="fas fa-pen-nib" aria-hidden="true"></i><span>Generate Text</span>
        </button>
        <button id="ai-tab-chat" class="ai-mode-tab" type="button" role="tab" aria-selected="false" aria-controls="ai-panel-chat" data-ai-mode="chat" tabindex="-1">
          <i class="fas fa-comments" aria-hidden="true"></i><span>Chat</span>
        </button>
        <button id="ai-tab-image" class="ai-mode-tab" type="button" role="tab" aria-selected="false" aria-controls="ai-panel-image" data-ai-mode="image" tabindex="-1">
          <i class="fas fa-image" aria-hidden="true"></i><span>Generate Image</span>
        </button>
      </nav>

      <section id="ai-panel-text" class="ai-mode-panel" role="tabpanel" aria-labelledby="ai-tab-text">
        <div class="ai-hub-layout">
          <form id="ai-generate-form" class="ai-composer">
            <div class="ai-composer-head">
              <div>
                <span class="panel-label">Generate text</span>
                <h2>Ubah arahan menjadi draf.</h2>
              </div>
            </div>
            <div class="form-field">
              <label for="ai-prompt">Prompt</label>
              <textarea id="ai-prompt" name="prompt" required maxlength="20000" placeholder="Contoh: Buat kerangka pesan produk yang menjelaskan manfaat tanpa klaim berlebihan."></textarea>
            </div>
            <div class="ai-composer-actions">
              <p>Maksimum 20.000 karakter. Jawaban dibuat melalui Gemini.</p>
              <button id="ai-generate-button" class="btn btn-gold" type="submit">
                <span>Generate</span><i class="fas fa-wand-magic-sparkles" aria-hidden="true"></i>
              </button>
            </div>
            {!props.gatewayConfigured ? <p class="ai-config-notice" role="status">Layanan AI belum dikonfigurasi. Permintaan akan menampilkan error 503 yang aman sampai <code>GEMINI_API_KEY</code> tersedia.</p> : null}
          </form>
          <section id="ai-result-panel" class="ai-result-panel" aria-labelledby="ai-result-title" aria-live="polite">
            <div class="ai-result-head">
              <div><span class="panel-label">Output</span><h2 id="ai-result-title">Hasil akan muncul di sini.</h2></div>
              <span id="ai-result-status" class="ai-result-status">Siap</span>
            </div>
            <pre id="ai-result" class="ai-result">Masukkan prompt yang jelas, lalu pilih Generate.</pre>
          </section>
        </div>
      </section>

      <section id="ai-panel-chat" class="ai-mode-panel" role="tabpanel" aria-labelledby="ai-tab-chat" hidden>
        <section class="ai-chat" aria-labelledby="ai-chat-title">
          <header class="ai-chat-head">
            <div>
              <span class="panel-label">Chat stateless</span>
              <h2 id="ai-chat-title">Percakapan langsung dengan Gemini.</h2>
              <p>Riwayat hanya berada di tab browser ini dan dikirim ulang bersama pesan berikutnya. Server tidak menyimpannya.</p>
            </div>
            <button id="ai-chat-clear" class="btn btn-ghost ai-chat-clear" type="button" disabled>Hapus chat</button>
          </header>
          <section id="ai-chat-messages" class="ai-chat-messages" aria-live="polite" aria-label="Riwayat percakapan">
            <div id="ai-chat-empty" class="ai-chat-empty">
              <i class="fas fa-comments" aria-hidden="true"></i>
              <p>Mulai percakapan dengan konteks yang cukup jelas.</p>
            </div>
          </section>
          <form id="ai-chat-form" class="ai-chat-form">
            <label class="sr-only" for="ai-chat-input">Pesan untuk AI</label>
            <textarea id="ai-chat-input" name="message" required maxlength="20000" rows="3" placeholder="Tulis pesan Anda…"></textarea>
            <button id="ai-chat-send" class="btn btn-gold" type="submit">
              <span>Kirim</span><i class="fas fa-paper-plane" aria-hidden="true"></i>
            </button>
          </form>
          <p id="ai-chat-status" class="ai-chat-status" role="status">Maksimum 50 pesan atau 100.000 karakter per permintaan.</p>
          {!props.gatewayConfigured ? <p class="ai-config-notice" role="status">Layanan AI belum dikonfigurasi. Permintaan akan menampilkan error 503 yang aman sampai <code>GEMINI_API_KEY</code> tersedia.</p> : null}
        </section>
      </section>

      <section id="ai-panel-image" class="ai-mode-panel" role="tabpanel" aria-labelledby="ai-tab-image" hidden>
        <div class="ai-image-layout">
          <form id="ai-image-form" class="ai-composer ai-image-composer">
            <div class="ai-composer-head">
              <div>
                <span class="panel-label">Nano Banana 2</span>
                <h2>Ubah deskripsi menjadi gambar.</h2>
                <p>Jelaskan subjek, gaya, suasana, komposisi, dan detail penting secara spesifik.</p>
              </div>
            </div>
            <div class="form-field">
              <label for="ai-image-prompt">Prompt gambar</label>
              <textarea id="ai-image-prompt" name="prompt" required maxlength="10000" placeholder="Contoh: Foto produk kopi lokal di atas meja kayu gelap, cahaya pagi hangat, komposisi editorial minimal, tanpa teks."></textarea>
            </div>
            <div class="ai-composer-actions">
              <p>Satu gambar persegi 1K per permintaan. Gambar tidak disimpan oleh aplikasi.</p>
              <button id="ai-image-button" class="btn btn-gold" type="submit">
                <span>Generate</span><i class="fas fa-image" aria-hidden="true"></i>
              </button>
            </div>
            <p id="ai-image-status" class="ai-chat-status" role="status">Siap membuat gambar baru.</p>
            {!props.gatewayConfigured ? <p class="ai-config-notice" role="status">Layanan AI belum dikonfigurasi. Permintaan akan menampilkan error 503 yang aman sampai <code>GEMINI_API_KEY</code> tersedia.</p> : null}
          </form>
          <section class="ai-image-preview" aria-labelledby="ai-image-preview-title" aria-live="polite">
            <header class="ai-result-head">
              <div><span class="panel-label">Preview</span><h2 id="ai-image-preview-title">Gambar akan muncul di sini.</h2></div>
              <a id="ai-image-download" class="btn btn-ghost ai-image-download" href="#" download="sparkmind-ai-image.png" hidden>Unduh</a>
            </header>
            <div id="ai-image-canvas" class="ai-image-canvas">
              <i class="fas fa-image" aria-hidden="true"></i>
              <p>Masukkan prompt yang jelas, lalu pilih Generate.</p>
              <img id="ai-image-output" alt="Gambar yang dibuat oleh AI berdasarkan prompt" hidden />
            </div>
          </section>
        </div>
      </section>
    </section>
  </DashboardShell>
)

export const ComingSoonPage = (props: {
  section: 'content' | 'assets' | 'brands' | 'settings'
  title: string
  description: string
  icon: string
}) => (
  <DashboardShell active={props.section} title={props.title} eyebrow="Rencana produk">
    <section class="coming-soon-panel" aria-labelledby="coming-soon-title">
      <span class="coming-soon-icon" aria-hidden="true">{props.icon}</span>
      <span class="panel-label">Status saat ini</span>
      <h2 id="coming-soon-title">Segera hadir — belum dibangun.</h2>
      <p>{props.description}</p>
      <p class="muted">Halaman ini sengaja belum menampilkan kontrol atau data palsu. Fungsinya akan dibangun pada sprint terpisah setelah ruang lingkupnya dikunci.</p>
      <a class="btn btn-ghost" href="/dashboard">Kembali ke Dashboard</a>
    </section>
  </DashboardShell>
)
