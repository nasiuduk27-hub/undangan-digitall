import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNavbar } from "@/components/marketing/navbar";
import { ThemeCatalog } from "@/components/marketing/theme-catalog";
import {
  ImageIcon,
  Sparkles,
  CreditCard,
  UserCheck,
  QrCode,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Undanganku — Platform Undangan Pernikahan Digital Modern & Elegan",
  description:
    "Buat undangan pernikahan digital impian dengan tema unik, upload musik & galeri foto/video sendiri, rekening bank otomatis, link personal tamu, serta QR check-in.",
  openGraph: {
    title: "Undanganku — Platform Undangan Pernikahan Digital",
    description:
      "Platform undangan pernikahan digital modern, mobile-first, dan elegan. Gratis buat sekarang.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#2b2420] antialiased selection:bg-[#a9724f] selection:text-white">
      {/* 1. Navbar */}
      <MarketingNavbar />

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e7ddd0]/60 border border-[#e7ddd0] text-xs font-semibold text-[#a9724f] mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Undangan Digital Masa Kini</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#2b2420] max-w-4xl mx-auto leading-[1.15]">
            Momen Spesial Anda, Dirayakan dengan <span className="text-[#a9724f]">Sempurna</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#7a6f63] max-w-2xl mx-auto leading-relaxed">
            Buat undangan digital unik yang mencerminkan karakter Anda dan pasangan. Bebas kustomisasi foto, musik, rekening bank, hingga QR code check-in untuk tamu.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#tema"
              className="px-6 py-3.5 rounded-xl bg-[#2b2420] text-white text-sm font-semibold hover:bg-[#423933] transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
            >
              Lihat Tema <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/register"
              className="px-6 py-3.5 rounded-xl bg-[#a9724f] text-white text-sm font-semibold hover:bg-[#8f5f40] transition-all shadow-md hover:shadow-lg"
            >
              Daftar Gratis
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="mt-12 pt-8 border-t border-[#e7ddd0]/80 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-xs text-[#7a6f63] font-medium">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#a9724f]" />
              <span>Tanpa Biaya Tersembunyi</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#a9724f]" />
              <span>Desain Mobile-First & Desktop</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#a9724f]" />
              <span>Link Personal Per Tamu</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#a9724f]" />
              <span>QR Check-in Real-Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Katalog Tema Section */}
      <ThemeCatalog />

      {/* 4. Keunggulan Fitur Section */}
      <section id="fitur" className="py-16 md:py-24 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#a9724f]">
              Fitur Unggulan
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#2b2420] sm:text-4xl mt-1">
              Segala Yang Anda Butuhkan dalam Satu Tempat
            </h2>
            <p className="mt-3 text-[#7a6f63] text-sm sm:text-base">
              Dirancang khusus untuk memberikan pengalaman terbaik bagi Anda sebagai pengantin dan para tamu undangan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 rounded-2xl bg-white border border-[#e7ddd0] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#faf7f2] border border-[#e7ddd0] flex items-center justify-center text-[#a9724f] mb-4">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#2b2420]">Galeri & Musik Bebas</h3>
              <p className="text-xs sm:text-sm text-[#7a6f63] mt-2 leading-relaxed">
                Upload galeri foto, video kenangan, hingga lagu backsound pilihan Anda sendiri tanpa batas kerumitan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e7ddd0] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#faf7f2] border border-[#e7ddd0] flex items-center justify-center text-[#a9724f] mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#2b2420]">Pilihan Tema Beragam</h3>
              <p className="text-xs sm:text-sm text-[#7a6f63] mt-2 leading-relaxed">
                Tema bervariasi dari Modern Non-Mainstream hingga Klasik Adat Nusantara yang dirancang estetik.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e7ddd0] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#faf7f2] border border-[#e7ddd0] flex items-center justify-center text-[#a9724f] mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#2b2420]">Rekening & Logo Bank Otomatis</h3>
              <p className="text-xs sm:text-sm text-[#7a6f63] mt-2 leading-relaxed">
                Fitur kado digital terintegrasi. Cukup pilih bank/e-wallet, logo dan nomor rekening langsung siap dipakai.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e7ddd0] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#faf7f2] border border-[#e7ddd0] flex items-center justify-center text-[#a9724f] mb-4">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#2b2420]">Link Personal Per Tamu</h3>
              <p className="text-xs sm:text-sm text-[#7a6f63] mt-2 leading-relaxed">
                Setiap tamu menerima link khusus dengan sapaan pribadi yang hangat dan eksklusif.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e7ddd0] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#faf7f2] border border-[#e7ddd0] flex items-center justify-center text-[#a9724f] mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#2b2420]">Konfirmasi RSVP & Ucapan</h3>
              <p className="text-xs sm:text-sm text-[#7a6f63] mt-2 leading-relaxed">
                Pantau siapa saja yang akan hadir lengkap dengan doa ucapan langsung di dashboard Anda.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e7ddd0] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#faf7f2] border border-[#e7ddd0] flex items-center justify-center text-[#a9724f] mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#2b2420]">QR Code Check-in Resepsionis</h3>
              <p className="text-xs sm:text-sm text-[#7a6f63] mt-2 leading-relaxed">
                Proses buku tamu cepat di gedung acara via scan QR dari browser HP resepsionis tanpa aplikasi tambahan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Cara Kerja Section */}
      <section className="py-16 md:py-24 bg-white border-t border-[#e7ddd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#a9724f]">
              Alur Penggunaan
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#2b2420] sm:text-4xl mt-1">
              Hanya 4 Langkah Mudah
            </h2>
            <p className="mt-3 text-[#7a6f63] text-sm sm:text-base">
              Siapkan undangan pernikahan digital Anda dalam hitungan menit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                title: "Pilih Tema",
                desc: "Pilih desain tema favorit dari katalog publik dan coba pratinjaunya secara gratis.",
              },
              {
                step: "02",
                title: "Isi Informasi",
                desc: "Masukkan detail nama pengantin, jadwal acara, lokasi, foto, dan rekening bank.",
              },
              {
                step: "03",
                title: "Tambah Tamu",
                desc: "Input daftar nama tamu untuk menghasilkan link personal unik per tamu.",
              },
              {
                step: "04",
                title: "Bagikan & Pantau",
                desc: "Kirim link via WhatsApp & pantau status konfirmasi RSVP secara real-time.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-[#faf7f2] border border-[#e7ddd0] flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-extrabold text-[#a9724f]/40 font-serif">
                    {item.step}
                  </span>
                  <h3 className="text-base font-bold text-[#2b2420] mt-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#7a6f63] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-[#faf7f2] border-t border-[#e7ddd0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#a9724f]">
              Pertanyaan Umum
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#2b2420] sm:text-4xl mt-1">
              Sering Ditanyakan
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Apakah saya bisa mencoba membuat undangan tanpa bayar?",
                a: "Ya! Anda bisa memilih tema, mengedit isi undangan, dan mencoba pratinjau penuh secara gratis tanpa komitmen.",
              },
              {
                q: "Apakah tamu butuh aplikasi khusus untuk membuka undangan?",
                a: "Tidak sama sekali. Undangan berupa link web yang bisa langsung dibuka di browser smartphone, tablet, atau komputer mana pun.",
              },
              {
                q: "Bagaimana cara kerja scan QR di lokasi acara?",
                a: "Resepsionis cukup membuka halaman scanner di browser HP/tablet mereka. Setiap QR code tamu yang di-scan akan memverifikasi kedatangan secara real-time.",
              },
              {
                q: "Apakah data tamu dan ucapan aman?",
                a: "Sangat aman. Setiap tamu memiliki link dan token unik yang terjaga dari pengakses tak berhak.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e7ddd0] shadow-xs"
              >
                <h3 className="text-base font-bold text-[#2b2420] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#a9724f] shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-[#7a6f63] mt-2 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Closing CTA */}
      <section className="py-16 md:py-20 bg-white border-t border-[#e7ddd0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#2b2420] sm:text-4xl">
            Siap membuat undangan impian Anda?
          </h2>
          <p className="mt-3 text-[#7a6f63] text-sm sm:text-base">
            Pilih tema favorit, isi detail acara, dan bagikan ke tamu dalam hitungan menit.
          </p>
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#a9724f] text-white text-sm font-semibold hover:bg-[#8f5f40] transition-all shadow-md hover:shadow-lg"
            >
              Daftar Gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2b2420] text-[#faf7f2] py-12 border-t border-[#423933]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-[#a9724f] text-white font-serif font-bold text-lg flex items-center justify-center">
              U
            </span>
            <div>
              <span className="font-bold text-base tracking-tight">Undanganku</span>
              <p className="text-xs text-[#a3988e]">Platform Undangan Digital Indonesia</p>
            </div>
          </div>

          <p className="text-xs text-[#a3988e] text-center">
            &copy; {new Date().getFullYear()} Undanganku. Hak Cipta Dilindungi.
          </p>

          <div className="flex items-center gap-6 text-xs text-[#a3988e]">
            <a href="#tema" className="hover:text-white transition-colors">
              Tema
            </a>
            <a href="#fitur" className="hover:text-white transition-colors">
              Fitur
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <Link href="/login" className="hover:text-white transition-colors">
              Masuk
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
