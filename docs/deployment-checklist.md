# Production Deployment Checklist — Undangan Nikahan Digital

Dokumen ini berisi panduan dan checklist manual langkah demi langkah untuk melakukan deployment project **Undangan Nikahan Digital** ke lingkungan Production (Vercel, Railway/Fly.io, Neon/Supabase, & Cloudflare R2).

---

## 📋 Checklist Persiapan Resource Production

### 1. Database PostgreSQL Production (Neon / Supabase)
- [ ] Buat project/database baru di **Neon** atau **Supabase**.
- [ ] Salin connection string Pooled (`DATABASE_URL`) dan Direct (`DIRECT_URL`).
- [ ] Dari komputer lokal (dengan `.env` yang diarahkan ke database production sementara atau via CLI), jalankan migration awal:
  ```bash
  npx prisma migrate deploy
  ```
- [ ] Seed master data (bank) jika diperlukan:
  ```bash
  npx prisma db seed
  ```

### 2. Object Storage (Cloudflare R2 / AWS S3)
- [ ] Buat bucket baru bernama `undangan-media` di Cloudflare R2 atau AWS S3.
- [ ] Atur CORS policy pada bucket agar mengizinkan request dari domain aplikasi production (`https://undanganku.app` / Vercel domain).
- [ ] Dapatkan API Credentials: `STORAGE_ENDPOINT`, `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY`.
- [ ] Hubungkan Custom Domain CDN (mis. `https://cdn.undanganku.app`) ke bucket R2 (opsional tapi direkomendasikan).

### 3. Redis Instance (Upstash / Railway Redis)
- [ ] Buat Redis instance di **Upstash** atau **Railway Redis**.
- [ ] Salin connection URL (`REDIS_URL`), mis. `redis://default:password@host:6379`.

---

## 🚀 Langkah Deployment

### 4. Deployment Application ke Vercel (Frontend & API)
- [ ] Hubungkan repository GitHub ke **Vercel**.
- [ ] Atur Framework Preset: **Next.js**.
- [ ] Masukkan SEMUA Environment Variables di Vercel Settings -> Environment Variables:
  - `NEXT_PUBLIC_APP_URL`
  - `NODE_ENV=production`
  - `DATABASE_URL`
  - `DIRECT_URL`
  - `NEXTAUTH_SECRET` (generate pakai `openssl rand -base64 32`)
  - `NEXTAUTH_URL`
  - `GOOGLE_CLIENT_ID` (opsional)
  - `GOOGLE_CLIENT_SECRET` (opsional)
  - `STORAGE_ENDPOINT`
  - `STORAGE_ACCESS_KEY_ID`
  - `STORAGE_SECRET_ACCESS_KEY`
  - `STORAGE_BUCKET_NAME`
  - `STORAGE_PUBLIC_CDN_URL`
  - `REDIS_URL`
- [ ] Klik **Deploy**.
- [ ] Pastikan build Vercel sukses (`postinstall: prisma generate` berjalan otomatis).

### 5. Deployment Background Worker ke Railway / Fly.io
- [ ] Buat project baru di **Railway**.
- [ ] Connect ke repository GitHub yang sama.
- [ ] Railway akan mendeteksi `railway.json` dan menggunakan start command: `npm run worker:start`.
- [ ] Masukkan Environment Variables wajib di Railway:
  - `DATABASE_URL`
  - `REDIS_URL`
  - `STORAGE_ENDPOINT`
  - `STORAGE_ACCESS_KEY_ID`
  - `STORAGE_SECRET_ACCESS_KEY`
  - `STORAGE_BUCKET_NAME`
- [ ] Deploy worker dan pastikan log menampilkan: `[Worker] Menjalankan proses worker BullMQ...`.

### 6. Konfigurasi Domain & SSL
- [ ] Tambahkan Custom Domain (mis. `undanganku.app`) di Dashboard Vercel.
- [ ] Konfigurasi CNAME / A Record di DNS Provider (Cloudflare / Namecheap / GoDaddy).
- [ ] Verifikasi SSL certificate telah aktif (HTTPS).

---

## 🧪 Testing End-to-End di Production

Setelah seluruh service ter-deploy, lakukan pengujian berikut:

1. **Registrasi & Autentikasi User**
   - [ ] Buat akun pengguna baru di `/register`.
   - [ ] Test login dengan akun yang baru dibuat di `/login`.

2. **Pengelolaan Undangan**
   - [ ] Buat undangan baru di Dashboard.
   - [ ] Pilih tema dan verifikasi render live preview.
   - [ ] Edit data pengantin, lokasi, dan tanggal acara.

3. **Media Upload & Storage**
   - [ ] Upload foto galeri & musik latar.
   - [ ] Pastikan file ter-upload ke Cloudflare R2 / S3 dan URL CDN publik dapat diakses.
   - [ ] Cek log Railway Worker untuk memastikannya memproses job latar belakang.

4. **Tamu Undangan & Pengiriman RSVP**
   - [ ] Tambahkan data tamu undangan.
   - [ ] Buka link undangan publik tamu (`/u/[slug]/[guestSlug]`).
   - [ ] Kirim RSVP (status kehadiran & ucapan).
   - [ ] Pastikan status RSVP ter-update di Dashboard host.

5. **QR Code Check-in & Scanner**
   - [ ] Buka halaman QR Code tamu.
   - [ ] Buka scanner resepsionis di `/scan/[invitationId]`.
   - [ ] Scan QR Code tamu dan verifikasi status check-in valid.
   - [ ] Coba scan ulang QR Code yang sama dan pastikan terdeteksi `duplicate_attempt`.
