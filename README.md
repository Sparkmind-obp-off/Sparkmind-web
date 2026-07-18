# SparkMind

Website publik SparkMind, Digital Brand Company Indonesia yang membangun produk AI siap pakai untuk UMKM sekaligus membagikan cara membangun brand dan bisnis digital secara sistematis.

**Tagline:** “Bangun bisnis digitalmu di atas fondasi sendiri.”

## Identitas

- **Badan hukum:** PT WASKITA CAKRAWARTI DIGITAL
- **Bentuk:** Perseroan Perorangan untuk Usaha Mikro dan Kecil
- **Nomor pendaftaran:** AHU-066746.AH.01.30.Tahun 2025
- **Founder:** Haidar Faras Muhadidzib — Pendiri Tunggal, Direktur, Pemilik Manfaat 100%
- **Domisili:** Kabupaten Banyumas, Jawa Tengah, Indonesia

Detail kepemilikan dan dokumen layanan tersedia melalui `/legal` dan `/legal/ownership`.

## Fitur yang Selesai

- Beranda publik baru dengan alur masalah, solusi Strategi–Sistem–AI, dua lapis audiens, produk, bukti dogfooding, artikel, dan CTA Instagram/email.
- Halaman Produk berisi lima sub-brand publik: Clarity Coach, KuratorKas, BarberKas, PACE Lokal, dan Nurani OS.
- Learn Hub dengan filter kategori dan lima artikel starter lengkap berukuran 400–600 kata.
- Template route detail artikel generik berbasis slug.
- Halaman Tentang Kami dengan cerita brand, empat nilai, dan rujukan ke SSOT legal.
- Halaman Kontak dengan form progresif berbasis `mailto`, email resmi, dan Instagram.
- Navigasi publik responsif dan footer dengan identitas badan hukum serta seluruh link legal.
- Halaman operasional lama dipertahankan di `/internal/*`, tidak ditautkan dari UI publik, dan menggunakan meta `noindex, nofollow`.
- Seluruh route dan isi Legal dipertahankan.
- API publik lama dipertahankan.
- AI Gateway v0.1 internal dengan adapter Gemini berbasis `fetch()` native, validasi input, dan error handling terstruktur.
- Handler 404 berstatus HTTP 404 dan tidak terindeks.

## Entry URI

### Publik

| Path | Keterangan |
|---|---|
| `/` | Beranda SparkMind |
| `/produk` | Daftar lima produk publik dan link ke subdomain produk |
| `/belajar` | Learn Hub dan filter kategori |
| `/belajar/:slug` | Detail artikel generik |
| `/tentang` | Cerita, nilai, dan identitas SparkMind |
| `/kontak` | Form kontak berbasis aplikasi email |

### Legal

| Path | Keterangan |
|---|---|
| `/legal` | Pusat Legal |
| `/legal/ownership` | Pernyataan Kepemilikan |
| `/legal/terms` | Syarat dan Ketentuan |
| `/legal/privacy` | Kebijakan Privasi |
| `/legal/refund` | Kebijakan Refund |
| `/legal/disclaimer` | Disclaimer |

### Internal

| Path | Keterangan |
|---|---|
| `/internal/doctrine` | Dokumen operasional doctrine lama |
| `/internal/sprint` | Sprint tracker lama |
| `/internal/revenue` | Revenue ledger lama |
| `/internal/barberkas` | Capster Commit Hub lama |

Route internal masih dapat dibuka langsung untuk menjaga data lama, tetapi tidak muncul di navigasi/footer publik dan ditandai `noindex, nofollow`.

### API

| Method & Path | Keterangan |
|---|---|
| `POST /api/ai/generate` | Gateway AI internal. Body JSON: `{ "prompt": "..." }`; membutuhkan binding `GEMINI_API_KEY` |
| `GET /api/health` | Status kesehatan aplikasi |
| `GET /api/state` | State publik lama yang dipertahankan |
| `GET /api/brands` | Seluruh data sub-brand |
| `GET /api/legal` | Identitas badan hukum |
| `GET /api/barberkas` | Data SSOT BarberKas |
| `GET /api/sprint` | Data sprint lama |
| `GET /api/revenue` | Data revenue lama |

## Data Architecture

- `src/data.ts` adalah SSOT untuk identitas publik, produk, artikel, legal, brand, serta data operasional lama.
- `src/index.tsx` berisi route SSR Hono, komposisi halaman, dan route masuk AI Gateway.
- `src/ai/gateway/` memvalidasi permintaan, memilih provider, dan mengekspor `runGateway()`.
- `src/ai/providers/gemini.ts` memanggil Gemini dengan `fetch()` native; API key hanya dibaca dari binding Cloudflare.
- `src/ai/types.ts` mendefinisikan kontrak request, response, provider, dan error terstruktur.
- `src/legal.tsx` berisi dokumen legal resmi dan tidak ditulis ulang dalam rebuild ini.
- `src/components.tsx` menyediakan navigasi dan footer bersama.
- `src/renderer.tsx` menyediakan layout HTML, metadata deskripsi, dan dukungan `noindex`.
- `public/static/style.css` berisi sistem visual gelap–emas yang responsif.
- `public/static/app.js` menyediakan menu mobile, filter artikel, smooth scroll, dan form kontak `mailto`.
- Tidak ada storage runtime. Konten dirender dari source dan form kontak tidak menyimpan data.

## Panduan Pengguna

1. Buka `/produk` untuk memilih alat berdasarkan masalah operasional yang ingin diselesaikan.
2. Buka `/belajar` untuk membaca framework dan studi kasus berdasarkan kategori.
3. Gunakan `/kontak` untuk menyiapkan email kepada SparkMind atau buka Instagram `@sparkmind.id`.
4. Gunakan footer untuk mengakses semua dokumen legal resmi.

## Pengembangan Lokal

```bash
npm install
npm run build
pm2 start ecosystem.config.cjs
curl http://localhost:3000/api/health
```

Aplikasi berjalan pada port `3000` melalui `wrangler pages dev dist`.

Untuk menguji gateway secara lokal, buat `.dev.vars` (file ini diabaikan Git) dan isi:

```dotenv
GEMINI_API_KEY=your_api_key
```

Contoh request:

```bash
curl -X POST http://localhost:3000/api/ai/generate \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Jelaskan kedaulatan data untuk UMKM."}'
```

Tanpa secret tersebut, endpoint merespons HTTP `503` dengan JSON yang aman dan terstruktur, bukan crash kosong. Untuk production, set `GEMINI_API_KEY` sebagai Cloudflare Pages secret—jangan simpan secret di source atau commit Git.

## Tech Stack

- Hono JSX SSR dan TypeScript
- Vite dan `@hono/vite-cloudflare-pages`
- Cloudflare Pages/Workers runtime
- Vanilla JavaScript
- Inter, Playfair Display, JetBrains Mono, dan Font Awesome

## Belum Diimplementasikan

- Backend newsletter dengan double opt-in.
- Penyimpanan formulir kontak menggunakan D1 atau KV.
- Publikasi Event Tracker PWT; produk ini tetap internal sampai siap untuk pelanggan luar.
- Billing, usage metering, caching, observability, multi-provider fallback, SDK publik, marketplace, dan plugin system untuk AI Gateway.
- Deployment rebuild ke production; menunggu persetujuan eksplisit pemilik.

## Langkah Berikutnya

1. Review copy, link produk, dan tampilan preview bersama pemilik.
2. Konfirmasi kanal kontak tambahan seperti WhatsApp bila tersedia.
3. Setelah disetujui, pilih jalur deployment Cloudflare dan deploy secara eksplisit.
4. Tambahkan analytics yang menghormati privasi untuk mengukur alur produk dan artikel.

## Status Deployment

- **Platform target:** Cloudflare Pages
- **Branch pengembangan saat ini:** `feat/ai-gateway-v0.1` (target PR: `main`)
- **Preview sandbox:** aktif untuk sesi pengembangan
- **Production rebuild:** belum dideploy; production yang ada tidak diubah dalam sesi ini
- **Terakhir diperbarui:** 18 Juli 2026
