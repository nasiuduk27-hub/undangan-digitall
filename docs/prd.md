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
| Hosting | **Vercel** (frontend+API) + **Neon/Supabase** (Postgres) | Deploy cepat, auto-scaling, cocok untuk trafik tamu yang bisa lonjak mendadak (mis. H-1 acara). |

Alternatif jika tim lebih familiar Vue: Nuxt 3 + Pinia bisa menggantikan Next.js dengan trade-off ekosistem sedikit lebih kecil untuk kasus media-heavy seperti ini.

## 2. Strategi Tampilan Desktop & Mobile

Sesuai Design System, pendekatannya **bukan** "responsive penuh" (layout berubah total di breakpoint besar), melainkan **mobile-first canvas terpusat**:

- Canvas undangan tetap `max-width: 480px`, di-center secara horizontal menggunakan flex/grid pada wrapper halaman.
- Di layar desktop, area di luar canvas diberi background netral/blur/gradient dari tema (bukan konten kosong).
- Semua unit pakai `rem`/relative, `touch target` minimal 44px tetap berlaku di desktop (klik mouse tetap nyaman).
- Dashboard admin (tempat user mengelola undangan, upload media, lihat RSVP) sebaliknya dibuat **responsive penuh** — karena calon pengantin realistis akan mengelola dari laptop juga, bukan cuma HP.

**Kesimpulan:** Halaman undangan (yang dilihat tamu) = mobile-first, centered card. Dashboard pengelolaan (yang dipakai pembuat undangan) = responsive layout standar (sidebar di desktop, bottom nav di mobile).

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
  /themes/editorial-brutalism
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