import { Hono } from 'hono'
import { Layout } from './renderer'
import { Nav, Footer } from './components'
import { META, LEGAL } from './data'

// ════════════════════════════════════════════════════════════════
// LEGAL PAGES — PT WASKITA CAKRAWARTI DIGITAL
// Sertifikat AHU-066746.AH.01.30.Tahun 2025 · Ditjen AHU Kemenkum RI
// ════════════════════════════════════════════════════════════════
const legal = new Hono()

const LegalShell = (props: { title: string; kicker: string; icon: string; children?: any }) => (
  <Layout title={`${props.title} — ${META.name}`}>
    <Nav active="legal" />
    <main class="page legal-page">
      <section class="page-head">
        <span class="kicker"><i class={`fas ${props.icon}`}></i> {props.kicker}</span>
        <h1>{props.title}</h1>
        <p class="muted small">
          Berlaku efektif: {LEGAL.effectiveDate} · Terakhir diperbarui: {LEGAL.lastUpdated}
        </p>
      </section>
      {props.children}
      <section class="card legal-entity-card">
        <h2><i class="fas fa-building-shield"></i> Identitas Penyelenggara</h2>
        <table class="data-table legal-table">
          <tbody>
            <tr><td>Badan Hukum</td><td><b>{LEGAL.companyName}</b></td></tr>
            <tr><td>Bentuk</td><td>{LEGAL.companyType}</td></tr>
            <tr><td>Nomor Pendaftaran</td><td><code>{LEGAL.registrationNo}</code></td></tr>
            <tr><td>Terdaftar pada</td><td>{LEGAL.registrationBody}</td></tr>
            <tr><td>Tanggal Terbit</td><td>{LEGAL.registrationDate}</td></tr>
            <tr><td>Kedudukan</td><td>{LEGAL.domicile}</td></tr>
            <tr><td>Pemilik / Direktur</td><td><b>{LEGAL.ownerFullName}</b> — {LEGAL.ownerRole}</td></tr>
            <tr><td>Kontak Resmi</td><td><a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a></td></tr>
          </tbody>
        </table>
      </section>
    </main>
    <Footer />
  </Layout>
)

// ── /legal — HUB ────────────────────────────────────────────────
legal.get('/', (c) =>
  c.html(
    <Layout title={`Legal Hub — ${META.name}`}>
      <Nav active="legal" />
      <main class="page legal-page">
        <section class="page-head">
          <span class="kicker"><i class="fas fa-scale-balanced"></i> LEGAL CENTER · RESMI &amp; TERDAFTAR</span>
          <h1>Pusat Legal SparkMind</h1>
          <p class="muted">
            Seluruh platform dalam ekosistem SparkMind ({LEGAL.mainDomain} beserta sub-brand-nya)
            dimiliki dan dioperasikan secara resmi oleh <b>{LEGAL.companyName}</b>,
            badan hukum Indonesia yang terdaftar pada {LEGAL.registrationBody}.
          </p>
        </section>

        <section class="card highlight-card">
          <h2><i class="fas fa-certificate"></i> Status Badan Hukum</h2>
          <p>
            <b>{LEGAL.companyName}</b> adalah {LEGAL.companyType} yang telah <b>terdaftar sebagai badan hukum</b> dan
            tercatat dalam pangkalan data Direktorat Jenderal Administrasi Hukum Umum,
            Kementerian Hukum Republik Indonesia, dengan Sertifikat Pendaftaran Pendirian
            Nomor <code>{LEGAL.registrationNo}</code>, diterbitkan di Jakarta pada {LEGAL.registrationDate},
            berkedudukan di {LEGAL.domicile}.
          </p>
          <p class="muted small">
            Pendiri tunggal, direktur, dan pemilik manfaat 100%: <b>{LEGAL.ownerFullName}</b>.
          </p>
        </section>

        <section class="legal-grid">
          <a href="/legal/ownership" class="legal-card">
            <i class="fas fa-crown"></i>
            <h3>Pernyataan Kepemilikan</h3>
            <p>Deklarasi resmi kepemilikan sparkmind.web.id &amp; seluruh ekosistem oleh {LEGAL.companyName}.</p>
          </a>
          <a href="/legal/terms" class="legal-card">
            <i class="fas fa-file-contract"></i>
            <h3>Syarat &amp; Ketentuan</h3>
            <p>Ketentuan penggunaan layanan, akun, pembayaran, dan hak kekayaan intelektual.</p>
          </a>
          <a href="/legal/privacy" class="legal-card">
            <i class="fas fa-user-shield"></i>
            <h3>Kebijakan Privasi</h3>
            <p>Pengelolaan data pribadi sesuai UU PDP No. 27 Tahun 2022.</p>
          </a>
          <a href="/legal/refund" class="legal-card">
            <i class="fas fa-rotate-left"></i>
            <h3>Kebijakan Refund</h3>
            <p>Ketentuan pengembalian dana untuk produk &amp; layanan digital berbayar.</p>
          </a>
          <a href="/legal/disclaimer" class="legal-card">
            <i class="fas fa-triangle-exclamation"></i>
            <h3>Disclaimer</h3>
            <p>Batasan tanggung jawab atas konten dan layanan platform.</p>
          </a>
        </section>

        <section class="card">
          <h2><i class="fas fa-gavel"></i> Dasar Hukum Operasional</h2>
          <ul class="bullets">
            {LEGAL.lawBasis.map((l) => (<li>{l}</li>))}
          </ul>
        </section>
      </main>
      <Footer />
    </Layout>
  )
)

// ── /legal/ownership ────────────────────────────────────────────
legal.get('/ownership', (c) =>
  c.html(
    <LegalShell title="Pernyataan Kepemilikan Resmi" kicker="OWNERSHIP LOCK · DEKLARASI RESMI" icon="fa-crown">
      <section class="card">
        <h2><i class="fas fa-stamp"></i> 1. Deklarasi Kepemilikan</h2>
        <p>
          Dengan ini dinyatakan secara resmi bahwa situs <b>{LEGAL.mainDomain}</b> ("SparkMind"),
          termasuk situs ini (SparkMind Sovereign Agent Foundry) beserta seluruh sub-brand,
          sub-domain, konten, merek, kode sumber, dan aset digital dalam ekosistem SparkMind,
          <b> dimiliki dan dioperasikan sepenuhnya oleh {LEGAL.companyName}</b> — {LEGAL.companyType},
          badan hukum Indonesia yang terdaftar pada {LEGAL.registrationBody} dengan Sertifikat
          Pendaftaran Nomor <code>{LEGAL.registrationNo}</code> tertanggal {LEGAL.registrationDate},
          berkedudukan di {LEGAL.domicile}.
        </p>
      </section>
      <section class="card">
        <h2><i class="fas fa-user-tie"></i> 2. Pemilik Manfaat (Beneficial Owner)</h2>
        <p>
          Pendiri tunggal, direktur, sekaligus pemilik manfaat 100% (sole beneficial owner) dari
          {' '}{LEGAL.companyName} adalah <b>{LEGAL.ownerFullName}</b>.
        </p>
        <ul class="bullets">
          <li><b>Peran:</b> {LEGAL.ownerRole}</li>
          <li><b>Alias kreatif:</b> {LEGAL.ownerAlias}</li>
          <li><b>Domain:</b> {LEGAL.mainDomain} terdaftar melalui {LEGAL.domainRegistry}</li>
        </ul>
        <p class="muted small">
          Setiap penyebutan "Reza Estes" pada dokumen atau konten lama merujuk pada orang yang
          sama, yaitu {LEGAL.ownerFullName}, dan bukan merupakan entitas hukum terpisah.
          Untuk semua urusan legal, domain, pajak, perbankan, dan kontrak digunakan nama asli
          sesuai data kependudukan: <b>{LEGAL.ownerFullName}</b>.
        </p>
      </section>
      <section class="card">
        <h2><i class="fas fa-sitemap"></i> 3. Cakupan Aset yang Dimiliki</h2>
        <ul class="bullets">
          <li>Domain utama <code>{LEGAL.mainDomain}</code> dan seluruh sub-domain di bawahnya (clarity, kuratorkas, barberkas, pacelokal, nurani, pwt, dan lainnya).</li>
          <li>Merek, nama, logo, dan identitas visual "SparkMind" beserta seluruh sub-brand ekosistem.</li>
          <li>Seluruh kode sumber, dokumentasi doktrin (SSOT), konten, dan basis data platform.</li>
          <li>Akun merchant pembayaran resmi: {LEGAL.paymentPartner}.</li>
        </ul>
      </section>
      <section class="card">
        <h2><i class="fas fa-shield-halved"></i> 4. Perlindungan Hukum</h2>
        <p>
          Penggunaan tanpa izin atas nama, merek, konten, atau kode milik {LEGAL.companyName} —
          termasuk peniruan identitas, klaim kepemilikan palsu, atau penyalahgunaan merek —
          dapat ditindak berdasarkan peraturan perundang-undangan Republik Indonesia yang berlaku,
          termasuk UU ITE dan ketentuan tentang hak kekayaan intelektual.
        </p>
      </section>
    </LegalShell>
  )
)

// ── /legal/terms ────────────────────────────────────────────────
legal.get('/terms', (c) =>
  c.html(
    <LegalShell title="Syarat & Ketentuan" kicker="TERMS OF SERVICE" icon="fa-file-contract">
      <section class="card">
        <h2>1. Penerimaan Ketentuan</h2>
        <p>
          Dengan mengakses atau menggunakan situs ini beserta layanan dalam ekosistem SparkMind
          ("Layanan") yang dioperasikan oleh <b>{LEGAL.companyName}</b> ("Kami"), Anda ("Pengguna")
          menyatakan telah membaca, memahami, dan menyetujui Syarat &amp; Ketentuan ini.
          Jika Anda tidak setuju, mohon hentikan penggunaan Layanan.
        </p>
      </section>
      <section class="card">
        <h2>2. Definisi Layanan</h2>
        <ul class="bullets">
          <li><b>SparkMind Sovereign Agent Foundry</b> — platform pusat (mother brand) yang menampilkan doktrin, roadmap, dan etalase produk ekosistem.</li>
          <li><b>Sub-brand</b> — layanan turunan (antara lain Clarity Coach, KuratorKas, BarberKas, PACE Lokal, Nurani OS, Event Tracker PWT) yang dapat memiliki ketentuan tambahan masing-masing.</li>
          <li>Layanan dapat berupa konten gratis (free tier) maupun produk/layanan digital berbayar.</li>
        </ul>
      </section>
      <section class="card">
        <h2>3. Akun &amp; Kewajiban Pengguna</h2>
        <ul class="bullets">
          <li>Pengguna wajib memberikan data yang benar, akurat, dan terkini saat mendaftar atau bertransaksi.</li>
          <li>Pengguna bertanggung jawab menjaga kerahasiaan kredensial akunnya sendiri.</li>
          <li>Dilarang menggunakan Layanan untuk aktivitas melanggar hukum, menyebarkan malware, scraping berlebihan, atau merugikan pengguna lain.</li>
          <li>Kami berhak menangguhkan atau menghentikan akses Pengguna yang melanggar ketentuan ini.</li>
        </ul>
      </section>
      <section class="card">
        <h2>4. Pembayaran &amp; Transaksi</h2>
        <ul class="bullets">
          <li>Seluruh transaksi berbayar diproses melalui mitra Penyedia Jasa Pembayaran (PJP) berizin Bank Indonesia: <b>{LEGAL.paymentPartner}</b>.</li>
          <li>Harga tercantum dalam Rupiah (IDR) dan dapat berubah sewaktu-waktu dengan pemberitahuan pada halaman produk terkait.</li>
          <li>Bukti pembayaran elektronik dari sistem PJP merupakan bukti transaksi yang sah.</li>
          <li>Ketentuan pengembalian dana diatur dalam <a href="/legal/refund">Kebijakan Refund</a>.</li>
        </ul>
      </section>
      <section class="card">
        <h2>5. Hak Kekayaan Intelektual</h2>
        <p>
          Seluruh konten, merek, logo, kode, desain, dan dokumentasi pada Layanan merupakan milik
          {' '}{LEGAL.companyName} atau pemberi lisensinya, dilindungi oleh hukum Republik Indonesia.
          Pengguna dilarang menyalin, memodifikasi, mendistribusikan, atau mengeksploitasi secara
          komersial tanpa izin tertulis dari Kami.
        </p>
      </section>
      <section class="card">
        <h2>6. Batasan Tanggung Jawab</h2>
        <p>
          Layanan disediakan "sebagaimana adanya" (as-is). Sepanjang diizinkan hukum yang berlaku,
          Kami tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial
          yang timbul dari penggunaan Layanan. Rincian lebih lanjut pada
          {' '}<a href="/legal/disclaimer">halaman Disclaimer</a>.
        </p>
      </section>
      <section class="card">
        <h2>7. Perubahan Ketentuan</h2>
        <p>
          Kami dapat memperbarui Syarat &amp; Ketentuan ini dari waktu ke waktu. Versi terbaru selalu
          dipublikasikan pada halaman ini beserta tanggal pembaruannya. Penggunaan Layanan setelah
          pembaruan dianggap sebagai persetujuan atas ketentuan yang baru.
        </p>
      </section>
      <section class="card">
        <h2>8. Hukum yang Berlaku &amp; Penyelesaian Sengketa</h2>
        <p>
          Syarat &amp; Ketentuan ini diatur oleh hukum Republik Indonesia. Sengketa yang timbul akan
          diupayakan diselesaikan secara musyawarah terlebih dahulu; apabila tidak tercapai, akan
          diselesaikan melalui forum penyelesaian sengketa yang berwenang di wilayah kedudukan
          {' '}{LEGAL.companyName} ({LEGAL.domicile}).
        </p>
      </section>
    </LegalShell>
  )
)

// ── /legal/privacy ──────────────────────────────────────────────
legal.get('/privacy', (c) =>
  c.html(
    <LegalShell title="Kebijakan Privasi" kicker="PRIVACY POLICY · UU PDP 27/2022 COMPLIANT" icon="fa-user-shield">
      <section class="card">
        <h2>1. Komitmen Kami</h2>
        <p>
          <b>{LEGAL.companyName}</b> berkomitmen melindungi data pribadi Pengguna sesuai
          Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) dan peraturan
          pelaksananya. Kebijakan ini menjelaskan data apa yang kami kumpulkan, bagaimana kami
          menggunakannya, dan hak-hak Anda sebagai subjek data.
        </p>
      </section>
      <section class="card">
        <h2>2. Data yang Dikumpulkan</h2>
        <ul class="bullets">
          <li><b>Data yang Anda berikan:</b> nama, alamat email, nomor telepon/WhatsApp saat mendaftar, berlangganan, atau bertransaksi.</li>
          <li><b>Data transaksi:</b> riwayat pembelian dan status pembayaran (diproses oleh PJP {LEGAL.paymentPartner}; kami tidak menyimpan data kartu/rekening Anda).</li>
          <li><b>Data teknis:</b> alamat IP, jenis peramban, dan data penggunaan dasar untuk keamanan dan analitik agregat.</li>
        </ul>
      </section>
      <section class="card">
        <h2>3. Tujuan Pemrosesan</h2>
        <ul class="bullets">
          <li>Menyediakan, mengoperasikan, dan meningkatkan Layanan.</li>
          <li>Memproses transaksi dan mengirimkan bukti/akses produk digital.</li>
          <li>Komunikasi layanan (pemberitahuan penting, dukungan pelanggan).</li>
          <li>Kepatuhan terhadap kewajiban hukum dan pencegahan penyalahgunaan.</li>
        </ul>
      </section>
      <section class="card">
        <h2>4. Penyimpanan &amp; Keamanan Data</h2>
        <ul class="bullets">
          <li>Data disimpan pada infrastruktur edge Cloudflare (D1/KV/R2) dengan enkripsi saat transit (HTTPS/TLS) dan saat tersimpan (encryption at rest).</li>
          <li>Akses data dibatasi hanya untuk keperluan operasional yang sah.</li>
          <li>Data disimpan selama diperlukan untuk tujuan pemrosesan atau sesuai ketentuan hukum, lalu dihapus atau dianonimkan.</li>
        </ul>
      </section>
      <section class="card">
        <h2>5. Pembagian Data kepada Pihak Ketiga</h2>
        <p>Kami tidak menjual data pribadi Anda. Data hanya dibagikan kepada:</p>
        <ul class="bullets">
          <li><b>PJP pembayaran</b> ({LEGAL.paymentPartner}) — sebatas keperluan pemrosesan transaksi.</li>
          <li><b>Penyedia infrastruktur</b> (Cloudflare) — sebagai pemroses data atas nama kami.</li>
          <li><b>Aparat penegak hukum</b> — hanya apabila diwajibkan oleh peraturan perundang-undangan.</li>
        </ul>
      </section>
      <section class="card">
        <h2>6. Hak Anda sebagai Subjek Data (UU PDP)</h2>
        <ul class="bullets">
          <li>Hak mendapatkan informasi mengenai pemrosesan data Anda.</li>
          <li>Hak mengakses dan memperoleh salinan data pribadi Anda.</li>
          <li>Hak memperbaiki dan memperbarui data yang tidak akurat.</li>
          <li>Hak menghapus data ("right to erasure") dan menarik persetujuan.</li>
          <li>Hak mengajukan keberatan atas pemrosesan tertentu.</li>
        </ul>
        <p>
          Untuk menggunakan hak-hak tersebut, hubungi kami di
          {' '}<a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
          Kami akan menanggapi sesuai jangka waktu yang diatur UU PDP.
        </p>
      </section>
      <section class="card">
        <h2>7. Cookies &amp; Teknologi Serupa</h2>
        <p>
          Kami menggunakan cookies/penyimpanan lokal secara minimal untuk fungsi esensial
          (sesi login, preferensi). Tidak ada iklan pihak ketiga yang melacak Anda di platform ini.
        </p>
      </section>
      <section class="card">
        <h2>8. Perubahan Kebijakan</h2>
        <p>
          Perubahan kebijakan privasi akan dipublikasikan pada halaman ini dengan tanggal
          pembaruan. Perubahan material akan diinformasikan melalui saluran komunikasi yang wajar.
        </p>
      </section>
    </LegalShell>
  )
)

// ── /legal/refund ───────────────────────────────────────────────
legal.get('/refund', (c) =>
  c.html(
    <LegalShell title="Kebijakan Refund" kicker="REFUND POLICY · PRODUK & LAYANAN DIGITAL" icon="fa-rotate-left">
      <section class="card">
        <h2>1. Prinsip Umum</h2>
        <p>
          Produk dan layanan dalam ekosistem SparkMind sebagian besar berbentuk <b>produk digital
          dan layanan berlangganan</b>. Karena sifatnya yang langsung terkirim/teraktivasi,
          pengembalian dana mengikuti ketentuan di bawah ini.
        </p>
      </section>
      <section class="card">
        <h2>2. Kondisi yang Memenuhi Syarat Refund</h2>
        <ul class="bullets">
          <li>Pembayaran berhasil terpotong namun produk/akses <b>tidak diterima</b> dalam 1×24 jam dan tidak dapat dipulihkan oleh tim kami.</li>
          <li>Terjadi <b>penagihan ganda</b> (double charge) untuk transaksi yang sama.</li>
          <li>Produk yang diterima <b>berbeda secara material</b> dari deskripsi pada halaman penjualan.</li>
        </ul>
      </section>
      <section class="card">
        <h2>3. Kondisi yang Tidak Memenuhi Syarat</h2>
        <ul class="bullets">
          <li>Perubahan pikiran setelah produk digital terkirim/akses teraktivasi.</li>
          <li>Ketidakcocokan preferensi pribadi terhadap konten yang sudah sesuai deskripsi.</li>
          <li>Pelanggaran Syarat &amp; Ketentuan yang menyebabkan penangguhan akun.</li>
        </ul>
      </section>
      <section class="card">
        <h2>4. Prosedur Pengajuan</h2>
        <ul class="bullets">
          <li>Kirim permohonan ke <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a> maksimal <b>7 hari kalender</b> sejak tanggal transaksi.</li>
          <li>Sertakan: nomor/bukti transaksi dari {LEGAL.paymentPartner}, email akun, dan kronologi singkat.</li>
          <li>Kami meninjau dalam <b>3 hari kerja</b>; apabila disetujui, dana dikembalikan melalui kanal pembayaran semula dalam <b>7–14 hari kerja</b> (mengikuti proses PJP/bank).</li>
        </ul>
      </section>
      <section class="card">
        <h2>5. Layanan Berlangganan</h2>
        <p>
          Pembatalan langganan menghentikan penagihan periode berikutnya. Biaya periode berjalan
          yang telah dibayar tidak dikembalikan secara prorata, kecuali terjadi kegagalan layanan
          material yang disebabkan oleh kami.
        </p>
      </section>
    </LegalShell>
  )
)

// ── /legal/disclaimer ───────────────────────────────────────────
legal.get('/disclaimer', (c) =>
  c.html(
    <LegalShell title="Disclaimer" kicker="BATASAN TANGGUNG JAWAB" icon="fa-triangle-exclamation">
      <section class="card">
        <h2>1. Sifat Informasi</h2>
        <p>
          Konten pada platform ini — termasuk doktrin, roadmap, target revenue, data pasar, dan
          materi edukasi — disediakan untuk tujuan <b>informasi dan dokumentasi internal ekosistem</b>.
          Konten tersebut bukan merupakan nasihat keuangan, hukum, atau investasi profesional.
        </p>
      </section>
      <section class="card">
        <h2>2. Produk AI &amp; Keterbatasannya</h2>
        <ul class="bullets">
          <li>Sebagian layanan kami menggunakan kecerdasan buatan (AI agents). Keluaran AI dapat mengandung ketidakakuratan dan sebaiknya diverifikasi sebelum digunakan untuk keputusan penting.</li>
          <li>Layanan AI kami bersifat alat bantu (assistive), bukan pengganti tenaga profesional bersertifikat (dokter, pengacara, konsultan keuangan, dan sebagainya).</li>
        </ul>
      </section>
      <section class="card">
        <h2>3. Ketersediaan Layanan</h2>
        <p>
          Kami berupaya menjaga ketersediaan layanan setinggi mungkin di atas infrastruktur edge
          Cloudflare, namun tidak menjamin layanan bebas gangguan 100%. Pemeliharaan terjadwal
          atau gangguan pihak ketiga dapat terjadi sewaktu-waktu.
        </p>
      </section>
      <section class="card">
        <h2>4. Tautan Pihak Ketiga</h2>
        <p>
          Platform dapat memuat tautan ke situs pihak ketiga. Kami tidak bertanggung jawab atas
          konten, kebijakan privasi, atau praktik situs pihak ketiga tersebut.
        </p>
      </section>
      <section class="card">
        <h2>5. Batas Tanggung Jawab</h2>
        <p>
          Sepanjang diizinkan oleh hukum Republik Indonesia, total tanggung jawab
          {' '}{LEGAL.companyName} atas klaim apa pun yang timbul dari penggunaan Layanan dibatasi
          maksimal sebesar jumlah yang telah dibayarkan Pengguna kepada kami dalam 12 (dua belas)
          bulan terakhir sebelum klaim timbul.
        </p>
      </section>
    </LegalShell>
  )
)

export default legal
