Technical Specification

# Undangan Nikahan Digital — Tech Stack & Arsitektur

v1.0 · Pelengkap PRD & Design System · 23 September 2026

**Daftar Isi**

1. [Rekomendasi Tech Stack](#stack)
2. [Strategi Desktop vs Mobile](#desktop-mobile)
3. [Arsitektur Sistem](#arsitektur)
4. [Environment Variables](#env)
5. [Skema Data](#skema)
6. [Kontrak API (Ringkas)](#api)
7. [Struktur Folder Project](#folder)
8. [Hosting & Deployment](#deploy)

## 1. Rekomendasi Tech Stack

| Layer | Rekomendasi | Kenapa |
| --- | --- | --- |
| Frontend Framework | **Next.js (React) + TypeScript** | SSR/SSG untuk halaman undangan (penting untuk share-preview WhatsApp yang butuh meta tag server-rendered), dynamic route per slug tamu, image optimization bawaan, ekosistem terbesar untuk kasus seperti ini. |
| Styling | **Tailwind CSS** + CSS variables per tema | Cocok dengan pendekatan design token (spacing scale, warna) yang sudah dirancang; gampang bikin banyak tema tanpa file CSS terpisah-pisah. |
| Backend/API | **Next.js API Routes / Route Handlers** (mulai monolith dulu) | Tidak perlu server terpisah di awal; bisa dipecah ke NestJS terpisah nanti kalau logic membesar (mis. job compression media). |
| Database | **PostgreSQL** + **Prisma ORM** | Relasional cocok untuk data user–undangan–tamu–rekening; kolom JSONB untuk konfigurasi tema yang fleksibel. |
| Media Storage | **Cloudflare R2** atau AWS S3 | Object storage untuk foto/video/audio; R2 lebih murah untuk egress (penting karena tamu banyak yang buka link). |
| CDN & Image/Video Processing | **Cloudflare Images/Stream** atau proses via **ffmpeg** di background job | Kompresi & transcoding otomatis sebelum disajikan ke tamu, sesuai batas ukuran di Design System. |
| Autentikasi | **NextAuth.js / Auth.js** | Login email/Google, siap pakai dengan Next.js. |
| Background Job | **BullMQ + Redis** | Untuk kompresi media & generate thumbnail secara async, tidak blocking upload. |
| QR Code | **qrcode** (generate, server-side) + **html5-qrcode** atau **@zxing/browser** (scan via kamera browser) | Tidak perlu aplikasi native; scanner cukup dibuka lewat browser HP/tablet resepsionis. |
| Animasi | **Framer Motion** (animasi umum React) + **GSAP** (khusus animasi kompleks: particle/constellation, ink-bleed SVG path, scroll-triggered) | Framer Motion cukup untuk 80% kasus; GSAP dipakai hanya untuk animasi signature tema yang butuh kontrol path/timeline lebih presisi (lihat prd-lengkap.md bagian 17). |
| Device Preview Frame | Custom CSS/SVG bezel (bukan library pihak ketiga) — `<IPhoneFrame>` untuk mode Mobile (notch, tombol samping) dan `<BrowserFrame>` untuk mode Desktop (bar address bar sederhana) | Custom lebih ringan & mudah disesuaikan dibanding library device-mockup umum. BrowserFrame menegaskan preview desktop bukan lagi canvas sempit, tapi layout lebar sesungguhnya. |
| Hosting | **Vercel** (frontend+API) + **Neon/Supabase** (Postgres) | Deploy cepat, auto-scaling, cocok untuk trafik tamu yang bisa lonjak mendadak (mis. H-1 acara). |

Alternatif jika tim lebih familiar Vue: Nuxt 3 + Pinia bisa menggantikan Next.js dengan trade-off ekosistem sedikit lebih kecil untuk kasus media-heavy seperti ini.

## 2. Strategi Tampilan Desktop & Mobile

**Update:** pendekatan sebelumnya (canvas 480px di-center untuk semua ukuran layar) diganti menjadi **layout desktop yang benar-benar terpisah**, bukan skala dari versi mobile. Konsekuensinya, setiap tema perlu didesain 2 kali (mobile & desktop) — kompleksitas naik, tapi hasil di layar besar terasa proporsional, bukan sekadar kartu kecil terpusat.

- **Mobile (\< `lg`/1024px):** layout 1 kolom, full-bleed hingga 480px, komponen stacked vertikal, floating dock di bawah layar, sesuai spesifikasi lama.
- **Desktop (≥ `lg`/1024px):** layout memanfaatkan lebar layar — max-width konten 1200–1440px, komposisi multi-kolom (mis. hero split foto/teks, galeri grid multi-kolom, jadwal acara side-by-side dengan foto), sticky top nav menggantikan floating dock.
- Implementasi teknis: gunakan breakpoint Tailwind (`lg:`) di komponen tema yang sama, ATAU pisahkan jadi sub-komponen `*.mobile.tsx` / `*.desktop.tsx` per slot bila perbedaan layout terlalu besar untuk diatur lewat class breakpoint saja (rekomendasi: mulai dengan Tailwind breakpoint dulu, pecah file hanya jika kompleksitas JSX-nya sudah berbeda jauh).
- Data & konten (foto, teks, config tema) tetap satu sumber yang sama — yang berbeda hanya susunan/layout render-nya per breakpoint.
- Dashboard admin (tempat user mengelola undangan) tetap **responsive penuh** seperti sebelumnya — tidak terpengaruh perubahan ini.

**Kesimpulan baru:** Halaman undangan tamu kini punya 2 layout nyata per tema: mobile (1 kolom, dock bawah) dan desktop (multi-kolom, nav atas, max-width 1200–1440px). Bukan lagi 1 layout yang cuma di-center di layar besar.

Animasi signature per tema (constellation, particle, ink-bleed) wajib di-lazy-load dan dinonaktifkan otomatis jika `prefers-reduced-motion` aktif atau di koneksi lambat (deteksi via Network Information API bila tersedia), agar tidak membebani HP tamu dengan koneksi terbatas.

## 3. Arsitektur Sistem (Ringkas)

```
[Browser Tamu] ──► [Next.js SSR Page /invite/[slug]?to=guest]
                         │
                         ▼
                 [API Route / Route Handler]
                         │
        ┌────────────────┼─────────────────┐
        ▼                ▼                 ▼
  [PostgreSQL]     [Redis + BullMQ]   [Object Storage: R2/S3]
  (data undangan,   (job kompresi      (foto, video, audio
   tamu, RSVP,       media & thumbnail   asli & hasil kompresi)
   rekening, tema)   async)
```

## 4. Environment Variables (.env)

```
# App
NEXT_PUBLIC_APP_URL=https://undanganku.app
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/undangan_db

# Auth
NEXTAUTH_SECRET=xxxxxx
NEXTAUTH_URL=https://undanganku.app
GOOGLE_CLIENT_ID=xxxxxx
GOOGLE_CLIENT_SECRET=xxxxxx

# Object Storage (Cloudflare R2 / S3-compatible)
STORAGE_ENDPOINT=https://xxxx.r2.cloudflarestorage.com
STORAGE_ACCESS_KEY_ID=xxxxxx
STORAGE_SECRET_ACCESS_KEY=xxxxxx
STORAGE_BUCKET_NAME=undangan-media
STORAGE_PUBLIC_CDN_URL=https://cdn.undanganku.app

# Background Job
REDIS_URL=redis://default:pass@host:6379

# Upload limits (dipakai validasi FE & BE)
MAX_PHOTO_SIZE_MB=5
MAX_VIDEO_SIZE_MB=100
MAX_AUDIO_SIZE_MB=10
MAX_VIDEO_DURATION_SEC=60
MAX_AUDIO_DURATION_SEC=300
```

## 5. Skema Data (Ringkas)

| Tabel | Kolom Kunci |
| --- | --- |
| `users` | id, email, name, password_hash, created_at |
| `invitations` | id, user_id, slug, groom_name, bride_name, event_date, theme_id, is_published, created_at |
| `themes` | id, name, category, is_premium, config_json (token warna/font per tema), preview_thumbnail_url |
| `media_assets` | id, invitation_id, type (photo/video/audio), url, thumbnail_url, order, status (uploading/processing/ready/error) |
| `bank_accounts` | id, invitation_id, bank_code (relasi ke `banks`), account_number, account_holder |
| `banks` | id, code, name, logo_url (master data, dikelola admin) |
| `guests` | id, invitation_id, name, slug_token, group_label, is_opened, opened_at |
| `rsvps` | id, guest_id, attendance_status (hadir/ragu/tidak), pax_count, wish_message, created_at |
| `check_ins` | id, guest_id (unique), qr_token (unique, signed), checked_in_at, checked_in_by (id resepsionis/device), checkin_status (valid/duplicate_attempt) |

`qr_token` sebaiknya berupa token bertanda tangan (signed, mis. JWT singkat atau HMAC) yang di-generate dari `guest.slug_token` — bukan slug tamu itu sendiri, supaya QR tidak bisa ditebak/diduplikasi manual.

## 6. Kontrak API (Ringkas)

| Endpoint | Fungsi |
| --- | --- |
| `POST /api/invitations` | Buat undangan baru |
| `PATCH /api/invitations/:id` | Update data dasar & pilihan tema |
| `POST /api/invitations/:id/media` | Upload foto/video/audio (presigned URL ke object storage) |
| `POST /api/invitations/:id/bank-accounts` | Tambah rekening (bank_code dari master `banks`) |
| `POST /api/invitations/:id/guests` | Tambah/import daftar tamu → generate slug_token |
| `GET /api/invite/:slug?to=:token` | Ambil data undangan untuk render halaman tamu (SSR) |
| `POST /api/invite/:slug/rsvp` | Submit RSVP dari sisi tamu |
| `GET /api/invitations/:id/dashboard` | Rekap RSVP, check-in, & analitik kunjungan tamu |
| `GET /api/invite/:slug/qr?to=:token` | Generate/ambil kode QR unik tamu (dipanggil dari halaman undangan) |
| `POST /api/checkin/verify` | Verifikasi hasil scan QR dari halaman scanner resepsionis; body: `{ qr_token }`; response: valid/sudah-dipakai/tidak-valid + nama tamu |
| `GET /api/invitations/:id/checkin-stats` | Statistik real-time: total diundang vs RSVP hadir vs check-in aktual |

## 7. Struktur Folder Project (Next.js App Router)

```
/app
  /(dashboard)          → halaman pengelolaan (responsive penuh)
  /invite/[slug]        → halaman undangan publik (mobile-first canvas)
  /scan/[invitationId]  → halaman scanner resepsionis (netral, kamera fullscreen)
  /api                  → route handlers
/components
  /editor
    IPhoneFrame.tsx      → bezel iPhone (notch, tombol samping) untuk mode preview Mobile
    BrowserFrame.tsx     → bezel browser sederhana untuk mode preview Desktop
    PreviewToggle.tsx    → segmented control Desktop/Mobile
/components
  /themes/editorial-brutalism
    Hero.tsx             → gunakan breakpoint lg: internal untuk switch layout mobile/desktop
    Gallery.tsx
    ... (per slot, layout mobile & desktop diatur breakpoint di file yang sama;
         pecah jadi Hero.desktop.tsx terpisah hanya jika JSX-nya sudah terlalu berbeda)
  /themes/raw-wabi-sabi
  /themes/cyber-celestial-noir
  /themes/70s-warm-groovy
  /shared               → komponen wajib lintas tema (RSVP, BankCard, dst — sesuai Kontrak Portabilitas Tema)
/lib
  /db (prisma client)
  /storage (helper upload ke R2/S3)
  /jobs (BullMQ workers: compress-image, compress-video)
/prisma
  schema.prisma
```

## 8. Hosting & Deployment

- **Frontend + API:** Vercel (auto-scaling, cocok trafik lonjak H-1 acara).
- **Database:** Neon atau Supabase (Postgres managed, mendukung branching untuk staging).
- **Media & CDN:** Cloudflare R2 + Cloudflare CDN (murah untuk egress trafik tinggi dari tamu).
- **Background job worker:** jalan terpisah (mis. Railway/Fly.io) karena job compression butuh proses long-running, tidak cocok di serverless function biasa.
- **Monitoring dasar:** Vercel Analytics + Sentry untuk error tracking sejak awal.

---

Spesifikasi ini siap dipakai sebagai referensi awal untuk AI coding tool (mis. Claude Code) — simpan sebagai `docs/technical-spec.md` di repo project.