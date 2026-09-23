# Undangan Nikahan Digital 💍

Platform undangan pernikahan digital modern, mobile-first, dan elegan berbasis Next.js 15, Tailwind CSS, dan Prisma ORM.

---

## ✨ Fitur Utama

- 📱 **Mobile-First Canvas**: Tampilan optimal di layar ponsel (canvas terpusat max 480px di layar desktop).
- 💌 **Personalisasi Tamu**: Undangan khusus dengan nama tamu tertera otomatis (`/u/:slug?to=Nama+Tamu`).
- ⏳ **Hitung Mundur & Detail Acara**: Hitung mundur hari H, integrasi kalender, dan peta lokasi (Google Maps).
- 📸 **Galeri & Musik Latar**: Dukungan galeri foto, video cinta, dan audio background interaktif.
- 📝 **RSVP & Ucapan Doa**: Konfirmasi kehadiran tamu (pax) dan buku tamu interaktif.
- 🎁 **Amplop Digital (Gift)**: Informasi nomor rekening / e-wallet dengan tombol salin otomatis.
- 🎟️ **QR Code Check-in**: Verifikasi kehadiran tamu di lokasi menggunakan QR Code berbasis browser.
- 🎨 **Multi-Tema Dinamis**: Konfigurasi tema fleksibel berbasis JSON token.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & ORM**: PostgreSQL & [Prisma ORM](https://www.prisma.io/)
- **Ikon**: [Lucide React](https://lucide.dev/)

---

## 🚀 Memulai

### Prasyarat

- [Node.js](https://nodejs.org/) v18.18+ atau v20+
- [PostgreSQL](https://www.postgresql.org/) (lokal atau cloud seperti Neon/Supabase)

### Langkah Instalasi

1. **Clone repository & masuk ke direktori proyek**:
   ```bash
   git clone https://github.com/username/undangan-nikahan-digital.git
   cd undangan-nikahan-digital
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Sesuaikan konfigurasi, terutama nilai `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/undangan_db?schema=public"
   ```

4. **Inisialisasi Database (Prisma)**:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

5. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 📂 Struktur Direktori

```text
├── app/                  # Next.js App Router (pages, layout, styles)
│   ├── globals.css       # Global stylesheet & Tailwind directives
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── docs/                 # Dokumentasi PRD & Spesifikasi Desain
├── lib/                  # Utility & database client (Prisma)
│   └── db.ts             # Prisma client singleton
├── prisma/               # Schema & migrasi database
│   └── schema.prisma     # Definisi model data PostgreSQL
├── public/               # Asset statis (gambar, ikon, media)
├── technical-spec.md     # Spesifikasi teknis & arsitektur sistem
└── package.json          # Dependency & npm scripts
```

---

## 📜 Script yang Tersedia

| Command | Deskripsi |
| --- | --- |
| `npm run dev` | Menjalankan local development server |
| `npm run build` | Melakukan build aplikasi untuk produksi |
| `npm run start` | Menjalankan server aplikasi mode produksi |
| `npm run lint` | Menjalankan linter Next.js |
| `npm run prisma:generate` | Men-generate client Prisma |
| `npm run prisma:push` | Mendorong perubahan skema langsung ke database |

---

## 📄 Lisensi

Proyek ini dibuat untuk kebutuhan personal dan pengembangan undangan digital.
