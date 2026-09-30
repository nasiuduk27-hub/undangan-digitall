Product Requirements Document — Lengkap

# Undangan Nikahan Digital

Versi 2.0 (gabungan PRD + Design System) · 23 September 2026 · Status: Draft

**Daftar Isi**

1. [Latar Belakang & Tujuan](#latar)
2. [Target Pengguna](#target)
3. [Lingkup Produk](#lingkup)
4. [Fitur Utama](#fitur)
5. [Alur Pengguna](#alur)
6. [Kebutuhan Non-Fungsional](#nonfungsional)
7. [Metrik Keberhasilan](#metrik)
8. [Asumsi, Dependensi & Risiko](#asumsi)
9. [Roadmap Bertahap](#roadmap)
10. [4.6 Check-in Tamu via Barcode/QR](#fitur46)
11. [Design System — Fondasi & Token](#ds-fondasi)
12. [Design System — Kurasi Tema](#ds-tema)
13. [Design System — Komponen Inti](#ds-komponen)
14. [Design System — Kontrak Portabilitas Tema](#ds-kontrak)
15. [Design System — Aset Logo Bank & Pembayaran](#ds-aset)
16. [Design System — Media Upload & State](#ds-upload)
17. [Design System — Komponen Tambahan & Catatan](#ds-lain)
18. [Design System — Animasi Signature per Tema](#ds-animasi)
19. [Design System — Preview Frame Editor](#ds-preview)
20. [Pertanyaan Terbuka](#pertanyaan)

## 1. Latar Belakang & Tujuan

Undangan pernikahan digital saat ini banyak yang bersifat template statis dengan personalisasi terbatas. Pengguna (calon pengantin) ingin undangan yang mencerminkan cerita mereka sendiri — foto/video sendiri, musik pilihan sendiri, tema visual sesuai selera, info rekening yang rapi, dan kemampuan mengirim undangan yang dipersonalisasi per tamu.

**Tujuan produk:**

- Memungkinkan pengguna membuat undangan digital yang sepenuhnya bisa dikustomisasi tanpa keahlian desain.
- Mempercepat proses pembuatan undangan (target \< 15 menit untuk kasus dasar).
- Meningkatkan pengalaman tamu lewat personalisasi nama/ucapan per penerima (guest path).

## 2. Target Pengguna

| Persona | Kebutuhan Utama |
| --- | --- |
| Calon pengantin | Kustomisasi cepat, tema menarik, mudah dibagikan, info rekening rapi |
| Tamu undangan | Cepat dibuka di HP, terasa personal, mudah RSVP |
| Wedding Organizer / vendor | Membuatkan undangan untuk banyak klien, kebutuhan branding/reseller |

## 3. Lingkup Produk

**Termasuk (v1):**

- Upload media (foto & video) oleh user
- Upload backsound musik oleh user
- Pemilihan tema dari katalog yang terus bertambah
- Info rekening bank/e-wallet dengan logo otomatis
- Personalisasi undangan per tamu (guest path)

**Tidak termasuk (v1):**

- Editor drag-and-drop layout bebas
- Cetak undangan fisik
- Payment gateway terintegrasi — hanya menampilkan info rekening

## 4. Fitur Utama

### 4.1 Upload Foto & Video Sendiri Media

- Upload multi-foto (galeri) dengan drag-to-reorder, minimal 1 foto cover wajib.
- Upload 1 video utama (cover/opening), format MP4/MOV, maks. 100MB.
- Kompresi & konversi otomatis di server agar loading tetap cepat.
- Crop/preview sebelum simpan untuk rasio konsisten per tema.
- Validasi format & ukuran dengan pesan error jelas.

### 4.2 Upload Backsound Musik Sendiri Media

- Upload file audio sendiri (MP3/WAV), maks. 10MB / 5 menit.
- Alternatif: katalog musik bebas royalti bawaan platform.
- Autoplay setelah interaksi pertama tamu (sesuai kebijakan browser).
- Disclaimer hak cipta — user bertanggung jawab atas lagu yang diunggah.

### 4.3 Pilihan Tema Desain

- Katalog tema berkategori, preview real-time saat memilih/mengganti tema.
- Setiap tema punya set komponen standar agar konten user portable antar tema.
- Arsitektur tema modular — tema baru = kumpulan style + layout config, bukan ubah logika inti.
- Filter tema gratis vs premium (jika ada monetisasi berjenjang).
- Filter kategori: Non-Mainstream vs Klasik/Adat — dua koleksi dengan positioning berbeda, ditampilkan jelas terpisah agar user tidak bingung saat browsing katalog.

### 4.4 Info Rekening dengan Logo Bank Otomatis Konten

- Form tambah rekening: dropdown bank/e-wallet (searchable), nomor rekening, nama pemilik.
- Logo bank otomatis muncul berdasarkan bank yang dipilih (aset dikelola sistem).
- Dukung multi-rekening (mempelai pria & wanita).
- Tombol "salin nomor rekening" dengan feedback visual toast.
- Opsi sembunyikan/tampilkan bagian rekening.

### 4.5 Personalisasi Undangan per Tamu (Guest Path) Personalisasi

- Input daftar tamu (manual/import) berisi nama & opsional grup.
- Link unik per tamu, mis. `domain.com/acara?to=nama-tamu`.
- Sapaan personal otomatis dari parameter link.
- RSVP per tamu (hadir/tidak/jumlah orang) tersimpan & bisa direkap.
- Dashboard rekap: siapa sudah buka link, siapa sudah RSVP.

### 4.6 Check-in Tamu via Barcode/QR Kehadiran

**User story:** Sebagai calon pengantin, saya ingin tahu berapa tamu yang benar-benar datang (bukan cuma RSVP "hadir"), dan resepsionis butuh cara cepat memverifikasi tamu di pintu masuk.

- Setiap link undangan per tamu (guest path) otomatis menghasilkan **kode QR unik** yang tampil di halaman undangan digital tamu tersebut.
- Resepsionis menggunakan halaman scanner (dibuka dari HP/tablet browser, tidak perlu instal aplikasi) untuk memindai QR saat tamu datang.
- Saat QR discan: sistem memverifikasi validitas (1 QR = 1 tamu/grup, tidak bisa dipakai dobel), lalu menandai status *checked-in* beserta waktu kedatangan.
- Dashboard pembuat undangan menampilkan rekap real-time: **jumlah tamu diundang vs. RSVP hadir vs. benar-benar check-in di lokasi**.
- Dukung mode offline-first sederhana di scanner (antre sinkron saat koneksi kembali) untuk antisipasi sinyal lemah di venue.
- Opsi multi-resepsionis (beberapa HP scan bersamaan di pintu berbeda) tanpa risiko QR yang sama tervalidasi dua kali.

### 4.7 Preview Toggle Desktop & Mobile (Frame HP Nyata) Editor

**User story:** Sebagai calon pengantin yang sedang mengedit undangan, saya ingin melihat persis bagaimana tampilannya di HP tamu saya nanti, bukan cuma versi lebar di layar laptop.

- Di halaman editor/dashboard, tersedia toggle dua tombol: **"Desktop"** dan **"Mobile"** untuk beralih mode preview undangan secara real-time saat mengedit.
- Mode **Desktop**: preview menampilkan **layout desktop sesungguhnya** (multi-kolom, hero split, navigasi sticky top) — bukan sekadar canvas 480px yang di-center, karena tema kini punya layout desktop terpisah dari layout mobile.
- Mode **Mobile**: preview dibungkus dalam **frame/bezel berbentuk iPhone sungguhan** (bukan sekadar mengecilkan lebar browser) — lengkap dengan notch/Dynamic Island, tombol samping, dan sudut melengkung — supaya kesan "ini beneran HP" terasa nyata, bukan cuma resize window.
- Konten di dalam frame HP tetap interaktif & scrollable, termasuk audio backsound dan animasi signature tema bisa dicoba langsung dari preview ini.
- Perubahan yang diedit user (ganti tema, ganti foto, dll) langsung ter-refresh di kedua mode preview tanpa reload halaman.

### 4.8 Landing Page & Katalog Tema Publik Marketing

**User story:** Sebagai calon pengguna yang baru datang, saya ingin melihat dan mencoba pratinjau tema-tema undangan dulu tanpa harus daftar, supaya saya yakin sebelum membuat akun.

- Halaman utama (`/`) berubah dari halaman polos menjadi **landing page pemasaran** dengan urutan: hero (judul, sub-judul, tombol *Masuk* dan *Daftar* tetap ada di navbar dan hero), katalog tema, keunggulan fitur, cara kerja singkat, FAQ, footer.
- **Katalog tema publik** berupa grid kartu: thumbnail tema, nama, kategori (Non-Mainstream / Klasik-Adat), label gratis/premium, dan tombol *Pratinjau*. Ada filter kategori dan pencarian sederhana.
- **Halaman pratinjau tema** (mis. `/tema/[slug]`) tanpa login: menampilkan tema dengan **data contoh** (nama pasangan, foto, jadwal, rekening dummy), dengan toggle **Desktop / Mobile (frame iPhone)** yang sama seperti preview editor (fitur 4.7), plus tombol *Gunakan Tema Ini*.
- Tombol *Gunakan Tema Ini*: jika belum login diarahkan ke Daftar/Masuk, lalu setelah login langsung membuat undangan baru dengan tema terpilih (tema tidak hilang selama alur daftar).
- Data contoh di pratinjau bersifat statis (bukan data user mana pun) dan tidak menyimpan apa pun ke database; RSVP/QR di mode pratinjau hanya demo non-fungsional.
- Landing dan katalog harus cepat dimuat dan ramah SEO (di-render server/statis), karena ini pintu masuk utama pengguna baru.
- Tombol *Dashboard* di halaman saat ini hanya tampil untuk pengguna yang sudah login (yang belum login hanya melihat Masuk dan Daftar).

## 5. Alur Pengguna (Ringkas)

1. Buka landing page → jelajahi katalog tema dan coba pratinjau (tanpa login) → pilih tema → daftar/login → buat undangan baru dengan tema itu → isi data dasar (nama pasangan, tanggal, lokasi).
2. Pilih tema → preview otomatis terisi data.
3. Upload foto, video, backsound.
4. Isi info rekening (pilih bank → logo otomatis).
5. Tambah daftar tamu → generate link personal per tamu.
6. Publish → bagikan link via WhatsApp/media sosial.
7. Pantau RSVP & analitik kunjungan dari dashboard.

## 6. Kebutuhan Non-Fungsional

| Aspek | Kebutuhan |
| --- | --- |
| Performa | Halaman tamu tetap ringan meski ada foto/video/musik — lazy-load & CDN |
| Penyimpanan | Object storage dengan kuota per akun/paket |
| Keamanan | Rekening & data tamu tidak terekspos selain lewat link yang dituju |
| Skalabilitas tema | Tambah tema baru tanpa deploy ulang seluruh sistem |
| Kompatibilitas | Optimal di mobile browser (mayoritas tamu dari WhatsApp) |

## 7. Metrik Keberhasilan

- Waktu rata-rata pembuatan undangan pertama (target \< 15 menit).
- Completion rate dari "mulai buat" sampai "publish".
- Rasio tamu yang membuka link personal & mengisi RSVP.
- Distribusi popularitas tema.
- Retensi: user membuat lebih dari satu undangan.
- Akurasi kehadiran: selisih antara jumlah RSVP "hadir" vs. jumlah check-in aktual di venue.

## 8. Asumsi, Dependensi & Risiko

- **Asumsi:** mayoritas trafik tamu dari mobile via link WhatsApp.
- **Dependensi:** katalog logo bank/e-wallet perlu dikurasi & diperbarui berkala.
- **Risiko hak cipta:** musik upload user bisa melanggar hak cipta — perlu disclaimer & takedown.
- **Risiko performa:** video/musik besar memperlambat loading — mitigasi kompresi & batas ukuran.

## 9. Roadmap Bertahap

| Fase | Fokus |
| --- | --- |
| Fase 1 (MVP) | Landing page + katalog tema publik dengan pratinjau, upload foto/video, 5–10 tema awal (campuran non-mainstream & minimal 1 tema klasik/adat), rekening + logo bank, link umum |
| Fase 2 | Upload backsound sendiri, katalog musik bawaan, dashboard RSVP dasar |
| Fase 3 | Personalisasi penuh per tamu (guest path), QR check-in + halaman scanner resepsionis, analitik kunjungan |
| Fase 4 | Ekspansi tema, tema premium, preview frame Desktop/Mobile (iPhone) di editor, fitur kolaborasi WO |

---

Bagian Design System

## 10. Design System — Fondasi & Token Global

| Token | Nilai | Catatan |
| --- | --- | --- |
| Content Width | Mobile: 480px full-bleed · Desktop: layout lebar sesungguhnya, max-width konten 1200–1440px | Desktop BUKAN skala dari canvas mobile — layout & komposisi berbeda per breakpoint |
| Breakpoint | `md: 768px`, `lg: 1024px` | Di bawah `lg` pakai layout mobile; di atas `lg` pakai layout desktop penuh |
| Grid System | 4-kolom, margin 16px, gutter 12px | Untuk kartu jadwal & profil pasangan |
| Spacing Scale | 4/8/12/16/24/32/48/64px | Kelipatan 8px untuk ritme vertikal |
| Touch Target | Min 44x44px | Wajib untuk tombol RSVP, audio toggle |
| Z-Index | BG(0), Content(10), Floating Dock(50), Modal(100) | Cegah tombol tertutup ornamen |

## 11. Design System — Kurasi Tema

Katalog terdiri dari 2 kategori dengan tujuan berbeda: **Non-Mainstream** (4 tema di bawah) untuk pengguna yang ingin tampil beda, dan **Klasik/Adat** (kategori baru) untuk pengguna yang justru mencari nuansa familiar — floral, motif adat Nusantara, warna emas — karena pasar undangan digital di Indonesia tetap didominasi selera ini. Filter kategori di halaman pemilihan tema (fitur 4.3) memisahkan keduanya dengan jelas.

### 11.1 Kategori Non-Mainstream

| Tema | Palet | Tipografi | Karakteristik |
| --- | --- | --- | --- |
| Editorial Brutalism | #F4EFEA #121212 #D8FB38 | Syne ExtraBold / Space Mono | Border tegas 2px, shadow tanpa blur, grid asimetris |
| Raw Wabi-Sabi | #EBE5DC #A85A3C #BFA054 | Cormorant Garamond Italic / Plus Jakarta Sans | Sudut organik tak beraturan, tekstur grain halus |
| Cyber-Celestial Noir | #0C0E14 #00F5D4 #7B2CBF | Cinzel Decorative / Outfit | Dark mode murni, glassmorphism, neon glow lembut |
| 70s Warm Groovy | #FDF8EE #D96B27 #EBB035 | Fraunces Soft Serif / DM Sans | Bentuk pil tebal, wavy divider, badge stempel vintage |

### 11.2 Kategori Klasik/Adat (Mainstream, Floral)

| Tema | Palet | Tipografi | Karakteristik |
| --- | --- | --- | --- |
| Melati Kencana | #FFFCF5 #B8860B #5C1A1A | Playfair Display (Italic) / Lora | Bingkai bunga melati & mawar watercolor, garis emas tipis (gold foil), inisial pasangan dalam monogram melingkar, ornamen sudut khas undangan klasik |
| Sekar Jagad Nusantara | #FAF3E8 #8B2E2E #C9A34E | Cormorant / Plus Jakarta Sans | Motif batik/kain adat sebagai border & divider, ornamen ukiran khas daerah (dapat disesuaikan per adat: Jawa/Sunda/Bali), warna maroon-emas tradisional |
| Mawar Blush | #FFF6F4 #E8A5A5 #7A9A7E | Cormorant Garamond (Italic) / Nunito Sans | Karangan mawar watercolor blush pink dengan daun hijau sage, sudut lembut, nuansa romantis hangat |
| Padang Bunga Liar | #F7F3E8 #8FA37E #E0B44C | Libre Baskerville / Karla | Ilustrasi bunga liar (daisy, lavender, bunga kuning) tersebar organik di tepi halaman, palet sage-krem-mustard, kesan taman outdoor santai |
| Anggrek Bulan Elegan | #FBFAF7 #1F4D3A #C6A75E | Bodoni Moda / Lato | Anggrek bulan putih dengan daun hijau tua, aksen garis emas, tata letak simetris formal untuk acara resmi |

Kedua tema klasik ini tetap wajib mengikuti seluruh Kontrak Portabilitas Tema (bagian 13) dan aturan aksesibilitas/kontras yang sama — hanya gaya visualnya yang berbeda dari koleksi non-mainstream.

## 12. Design System — Komponen Inti

- **Cover/Gate:** fullscreen dengan nama tamu dinamis (`?to=`); tombol "Buka Undangan" memicu scroll & audio via user-gesture.
- **Couple Profile:** foto duotone/frame geometric; ikon sosial media monoline.
- **Countdown & Timeline:** blok tanggal dengan zona waktu otomatis (WIB/WITA/WIT); tombol Add to Calendar (.ics).
- **Direct Gift/Angpau:** kartu rekening dengan 1-click copy + toast; toggle QRIS statis/dinamis.
- **RSVP & Wishes:** dua lapis interaksi — *Quick RSVP* (1 tap langsung dari Floating Dock/nav, lihat poin di bawah) untuk pilihan cepat Hadir/Tidak Hadir/Mungkin, lalu form detail (jumlah pax, pesan ucapan) muncul sebagai langkah kedua setelah quick pick dipilih — bukan form panjang di awal. Feed ucapan infinite scroll tetap ada di section terpisah.
- **Floating Dock (mobile):** bar melayang di bawah layar berisi (a) play/pause audio, (b) **tombol Quick RSVP** — 3 opsi ringkas (Hadir/Tidak Hadir/Mungkin) yang bisa dipilih satu tap tanpa scroll ke section RSVP, mirip pola "pill bar" yang umum di banyak undangan digital tapi gaya visualnya tetap mengikuti tema (lihat variasi per tema di bawah), (c) quick-jump ke section RSVP lengkap. Di layout desktop, elemen ini digantikan **sticky top nav bar** dengan tombol Quick RSVP yang sama — pola UI mobile ini tidak dipaksakan ke desktop, tapi fungsinya tetap ada.
- **QR Check-in Card:** kode QR unik ditampilkan di halaman undangan tamu (mis. dekat bagian RSVP), dengan label "Tunjukkan QR ini saat kedatangan". Desain kartu QR tetap mengikuti gaya tema, tapi kode QR sendiri selalu di atas background putih solid agar tetap terscan dengan baik apa pun temanya.
- **Halaman Scanner Resepsionis:** antarmuka terpisah (bukan bagian dari tema undangan) — tampilan netral, kamera fullscreen, indikator besar hijau/merah untuk hasil scan (valid/sudah dipakai/tidak valid), dan counter jumlah check-in berjalan.

**Aksesibilitas:** audio tidak autoplay sebelum gestur klik; `prefers-reduced-motion` mematikan parallax; kontras teks minimal 4.5:1 (WCAG AA); aset WebP/AVIF dengan initial bundle \< 1.8MB.

## 13. Design System — Kontrak Portabilitas Tema

Setiap tema baru wajib menyediakan slot berikut, apa pun gaya visualnya:

| Slot Wajib | Sumber Data | Boleh disembunyikan? |
| --- | --- | --- |
| Cover / Gate | Nama pasangan, nama tamu | Tidak |
| Galeri Media | Foto & video upload user | Ya, jika kosong |
| Cerita/Profil Pasangan | Teks + foto | Ya |
| Jadwal Acara | Tanggal, lokasi, sesi | Tidak |
| Kartu Rekening | Bank + nomor + logo otomatis | Ya (toggle user) |
| RSVP | Form kehadiran + pax | Ya |
| Ucapan/Wishes | Feed komentar tamu | Ya |
| Audio Control | Backsound upload/pilihan | Ya |
| QR Check-in | Kode QR unik per tamu (generated backend) | Ya (jika fitur check-in dimatikan) |

Tema baru diverifikasi terhadap tabel ini sebelum masuk katalog — bukan hanya dinilai dari keindahan visual.

**Catatan penting:** setiap slot wajib di atas kini harus punya **dua definisi layout** — versi mobile (\< `lg` breakpoint) dan versi desktop (≥ `lg`) yang benar-benar didesain untuk lebar layar besar (bukan sekadar men-scale versi mobile). Contoh: Galeri Media di mobile berupa scroll horizontal/1 kolom, di desktop jadi grid multi-kolom; Jadwal Acara di mobile stacked vertikal, di desktop bisa side-by-side dengan foto. QA checklist tema baru wajib mengecek kedua versi ini secara terpisah.

## 14. Design System — Aset Logo Bank & Pembayaran

- Logo disimpan sebagai SVG monokrom + versi warna asli; tema gelap pakai varian kontras.
- Ukuran konsisten: 32x32px di kartu rekening, 20x20px di list ringkas.
- Container logo berbackground netral agar tetap terbaca di tema gelap/bertekstur.
- Fallback: bank tak dikenal → badge inisial bulat, bukan logo pecah.

## 15. Design System — Media Upload & State

| Elemen | Rasio/Ukuran | Catatan |
| --- | --- | --- |
| Foto cover | 4:5, dicrop otomatis | Preview crop sebelum simpan |
| Galeri foto | 1:1 atau 4:5 | Maks. \~300KB/foto setelah kompresi |
| Video cover | 9:16, maks 100MB/60 detik | Thumbnail dari frame pertama |
| Audio backsound | Maks 10MB/5 menit | Fallback katalog musik bawaan |

State wajib di tiap tema: *empty state* (belum upload), *loading state* (kompresi berjalan), *error state* (format/ukuran salah + tombol coba lagi).

## 16. Design System — Komponen Tambahan & Catatan

- **Tipografi dinamis:** truncation nama tamu panjang (maks 2 baris + ellipsis); fluid type (`clamp()`) untuk judul; overlay gradient di atas foto user agar teks tetap kontras.
- **Tombol & CTA hierarchy:** Primary ("Konfirmasi Hadir"), Secondary ("Lihat Peta"), Ghost/Text — konsisten struktur, gaya ikut tema.
- **Form field standar:** input text, dropdown bank searchable, radio RSVP — DOM sama, styling ikut tema.
- **Toast/notifikasi:** untuk salin rekening, RSVP terkirim, error upload.
- **Theme preview thumbnail:** rasio 3:4 untuk katalog pemilihan tema.
- **Dark-mode lock:** tema gelap (Cyber-Celestial Noir) mengunci palet sendiri, tidak ikut auto dark/light OS tamu.
- **Versioning tema:** revisi tema lama tidak mengubah tampilan undangan yang sudah dipublish tiba-tiba.
- **QA checklist tema baru:** kontras, kelengkapan slot wajib, ukuran file — sebelum rilis ke katalog.
- **Variasi Quick RSVP per tema** (agar tidak semua tema terlihat sama seperti pill bar generik): Editorial Brutalism — 3 kotak persegi bersebelahan dengan border tegas, teks besar tanpa emoji; Raw Wabi-Sabi — 3 pilihan dipisah garis tipis organik, ikon line-art minimal (bukan emoji); Cyber-Celestial Noir — pill dengan outline neon glow, ikon monoline; 70s Warm Groovy — pill tebal bulat (paling natural dengan gaya tema ini, boleh pakai emoji karena sesuai karakter playful-nya).

## 17. Design System — Animasi Signature per Tema

Prinsip: animasi bukan hiasan generik yang sama di semua tema (hindari pola "amplop dibuka" yang mainstream), melainkan bagian dari identitas visual tiap tema. Animasi berat (constellation, ink bleed) hanya dijalankan sekali di awal (cover open); animasi ringan dipakai berulang saat scroll.

| Tema | Animasi Signature | Catatan Implementasi |
| --- | --- | --- |
| Editorial Brutalism | Hard-cut reveal + sedikit shake (bukan fade halus); elemen slide masuk lalu berhenti mendadak tanpa easing; efek stempel pada judul acara | Framer Motion tanpa easing/spring, transisi instan |
| Raw Wabi-Sabi | Ink-bleed pada nama pasangan (tinta menyebar); transisi antar-section dengan mask tekstur kertas tak beraturan; partikel debu mengendap di cover | SVG filter/mask + GSAP untuk animasi path |
| Cyber-Celestial Noir | Partikel bintang membentuk nama pasangan (constellation forming); teks muncul karakter-per-karakter gaya terminal boot-up; portal tipis sebagai transisi | Canvas/WebGL ringan atau GSAP untuk particle animation |
| 70s Warm Groovy | Blob morphing bergerak lambat sebagai background; garis wavy "digambar" (draw-on) sebagai divider; vinyl berputar dekat tombol audio | CSS `@keyframes` untuk blob & vinyl, SVG stroke-dashoffset untuk draw-on |
| Melati Kencana | **Melati mekar:** kuncup melati di tengah layar mekar perlahan lalu kelopaknya membelah ke kiri-kanan membuka cover; garis emas "digambar" mengelilingi nama pasangan | SVG path + GSAP timeline, sekali putar saat tombol "Buka Undangan" ditekan |
| Sekar Jagad Nusantara | **Tirai kain adat:** dua panel bermotif batik tersibak ke samping seperti tirai, memperlihatkan cover; motif border muncul bertahap | Dua elemen dengan `transform: translateX` (Framer Motion), tekstur batik berupa SVG pattern ringan |
| Mawar Blush | **Kelopak berjatuhan:** kelopak mawar jatuh melayang dari atas layar saat undangan dibuka, cover muncul dengan fade lembut; kelopak mereda setelah beberapa detik | Partikel CSS/canvas ringan (maks. 20 kelopak di mobile), berhenti otomatis |
| Padang Bunga Liar | **Bunga tumbuh:** batang dan bunga liar tumbuh dari tepi bawah layar ke atas (draw-on), lalu cover terbuka di antara tanaman | SVG stroke-dashoffset + GSAP, dijalankan sekali |
| Anggrek Bulan Elegan | **Gerbang bunga:** dua panel berhias anggrek membuka pelan ke kiri-kanan dengan easing halus, garis emas menyala tipis saat panel terbuka | Framer Motion dengan easing lambat, tanpa partikel agar tetap terasa formal |

**Interaksi lintas-tema (opsional, tidak spesifik satu tema):**

- *Scroll-triggered reveal* — konten section muncul bertahap sesuai scroll, bukan animasi total di awal saja (lebih ramah performa mobile).
- *Tekan & tahan untuk membuka* — progress ring mengisi saat ditahan, sebagai pengganti tap amplop yang mainstream.
- *Polaroid develop* — foto upload user muncul perlahan seperti foto polaroid baru dicetak, relevan karena media di-upload sendiri oleh user.

**Aturan animasi buka undangan (berlaku untuk semua tema):**

- Dipicu tombol "Buka Undangan" di Cover/Gate (sekaligus memulai audio, sesuai kebijakan autoplay browser).
- Durasi total maksimal sekitar 3–4 detik, dan tersedia tombol *Lewati* atau tap di mana saja untuk langsung membuka.
- Animasi hanya berjalan sekali per kunjungan; kunjungan berikutnya di sesi yang sama boleh langsung membuka.
- Jumlah partikel (kelopak, dll) dikurangi otomatis di perangkat mobile/koneksi lambat; dengan `prefers-reduced-motion` diganti transisi fade sederhana.
- Animasi juga bisa dicoba di preview editor dan halaman pratinjau tema publik.

Wajib hormati `prefers-reduced-motion` (lihat bagian 12) — semua animasi signature di atas harus punya fallback statis/instan untuk tamu yang sensitif gerak.

## 18. Design System — Preview Frame Editor

Komponen ini khusus untuk halaman editor/dashboard (bukan halaman yang dilihat tamu), agar calon pengantin bisa melihat hasil edit sedekat mungkin dengan pengalaman tamu asli.

- **Toggle Desktop/Mobile:** dua tombol segmented control di atas area preview, state aktif ditandai jelas (bukan cuma warna, tapi juga ikon: 🖥️/📱 atau outline device).
- **Frame Mobile (iPhone):** bezel dengan proporsi iPhone modern — sudut membulat besar, notch/Dynamic Island di atas, tombol power & volume samar di sisi kanan/kiri frame, area layar dengan `border-radius` mengikuti lengkung device asli (bukan kotak persegi biasa).
- **Frame Desktop:** preview dibungkus **bezel browser sederhana** (bar atas mirip address bar, tanpa perlu fungsional) agar konsisten dengan pendekatan "frame device nyata" seperti di mode Mobile, lalu menampilkan layout desktop lebar (1200–1440px) yang memang didesain ulang per tema — bukan versi mobile yang diperlebar.
- **Live update:** setiap perubahan di form editor (ganti tema, upload foto, dsb) merefleksikan perubahan ke preview tanpa reload — pakai state React yang sama, bukan iframe terpisah yang perlu di-refresh manual.
- **Skala frame responsif:** frame HP tetap proporsional & tidak terpotong di layar editor kecil (mis. scale-down dengan `transform: scale()` sambil mempertahankan interaksi scroll di dalamnya).

## 19. Pertanyaan Terbuka

- Model bisnis: gratis, freemium, atau berbayar penuh per undangan?
- Perlu integrasi payment gateway, atau cukup tampilkan nomor rekening?
- Batas kuota penyimpanan media per akun/paket?
- Dukungan custom domain di fase awal atau nanti?

---

Dokumen gabungan PRD + Design System — siap dikembangkan menjadi spesifikasi teknis atau wireframe per fitur.