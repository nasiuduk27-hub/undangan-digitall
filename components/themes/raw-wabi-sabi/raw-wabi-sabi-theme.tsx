"use client";

import { useState } from "react";
import { useAnimSettings } from "@/lib/use-anim-settings";
import { WabiSabiInkBleed } from "@/components/themes/animations/wabi-sabi-ink-bleed";
import { AudioControl } from "@/components/shared/audio-control";
import { QuickRsvpDock } from "@/components/shared/quick-rsvp-dock";
import { BankCard } from "@/components/shared/bank-card";
import { QrCheckinModal } from "@/components/shared/qr-checkin-modal";
import { WishesForm } from "@/components/shared/wishes-form";
import { WishesFeed } from "@/components/shared/wishes-feed";
import { CalendarDays, MapPin } from "lucide-react";
import type { CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";

type MediaAsset = { id: string; type: string; url: string; status: string };
type BankAccount = {
  id: string;
  bank_code: string;
  account_number: string;
  account_holder: string;
  bank: { name: string; logo_url: string };
};
type Invitation = {
  slug: string;
  theme_id: string;
  groom_name: string;
  bride_name: string;
  event_date: Date;
  location: string | null;
  media_assets: MediaAsset[];
  bank_accounts: BankAccount[];
};
type Guest = {
  name: string;
  slug_token: string;
  rsvp?: null | { attendance_status: string; pax_count: number; wish_message: string | null };
};
type Wish = { id: string; wish_message: string | null; guest: { name: string } };

export function RawWabiSabiTheme({
  invitation,
  guest,
  wishes,
}: {
  invitation: Invitation;
  guest?: Guest | null;
  wishes?: Wish[];
}) {
  const [isOpened, setIsOpened] = useState(false);
  const { disableHeavyAnim } = useAnimSettings();
  const guestName = guest?.name;
  const photos = invitation.media_assets.filter((item) => item.type === "photo");
  const video = invitation.media_assets.find((item) => item.type === "video");
  const audio = invitation.media_assets.find((item) => item.type === "audio");

  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(invitation.event_date));

  const handleOpenInvitation = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const audioEl = document.querySelector<HTMLAudioElement>("audio");
    if (audioEl) {
      audioEl.play().catch(() => {});
    }
    setIsOpened(true);
  };

  return (
    <main
      className="min-h-screen bg-[#EBE5DC] text-[#2E241D] overflow-x-hidden gpu-layer"
      style={
        {
          "--theme-bg": "#EBE5DC",
          "--theme-text": "#2E241D",
          "--theme-accent": "#BFA054",
          "--theme-card": "#F7F0E8",
          "--theme-muted": "rgba(46,36,29,0.7)",
        } as CSSProperties
      }
    >
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-[#EBE5DC] text-[#2E241D] p-6 text-center gpu-layer"
          >
            <div className="relative z-10 max-w-lg mx-auto w-full my-auto space-y-6">
              <div className="font-mono text-xs uppercase tracking-widest text-[#BFA054]">
                {guestName ? `To: ${guestName}` : "Undangan Pernikahan"}
              </div>

              <WabiSabiInkBleed groomName={invitation.groom_name} brideName={invitation.bride_name} />

              <p className="mx-auto max-w-sm font-serif text-sm italic text-[#2E241D]/75 leading-relaxed">
                &ldquo;Keindahan dalam kesederhanaan, keabadian dalam ketulusan.&rdquo;
              </p>

              <button
                type="button"
                onClick={handleOpenInvitation}
                className="inline-block min-h-12 w-full sm:w-auto px-8 border border-[#2E241D] bg-[#F7F0E8] py-3.5 font-serif text-sm italic tracking-wide text-[#2E241D] shadow-sm transition hover:bg-[#BFA054] hover:text-white cursor-pointer active:scale-95 touch-manipulation"
              >
                ✉ Buka Undangan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isOpened && (
        <QuickRsvpDock
          slug={invitation.slug}
          token={guest?.slug_token}
          guestName={guest?.name}
          themeId="raw-wabi-sabi"
          initialStatus={guest?.rsvp?.attendance_status}
          initialPax={guest?.rsvp?.pax_count}
          initialWish={guest?.rsvp?.wish_message}
          audioUrl={audio?.url}
        />
      )}

      {/* Desktop Sticky Top Nav */}
      <header className="sticky top-0 z-40 hidden border-b border-[#2E241D]/15 bg-[#EBE5DC]/90 backdrop-blur-md px-8 py-3.5 lg:flex items-center justify-between font-serif shadow-sm">
        <div className="flex items-center gap-2 text-[#2E241D]">
          <span className="font-serif italic text-lg text-[#BFA054]">
            {invitation.groom_name} &amp; {invitation.bride_name}
          </span>
        </div>

        <nav className="flex items-center gap-6 text-xs tracking-wider uppercase text-[#2E241D]/80">
          <a href="#gallery" className="hover:text-[#BFA054] transition">Galeri</a>
          <a href="#profile" className="hover:text-[#BFA054] transition">Profil</a>
          <a href="#schedule" className="hover:text-[#BFA054] transition">Jadwal</a>
          <a href="#bank" className="hover:text-[#BFA054] transition">Hadiah</a>
        </nav>

        <div className="flex items-center gap-4">
          <AudioControl
            audioUrl={audio?.url}
            desktopClassName="hidden lg:inline-flex items-center gap-2 border border-[#2E241D]/30 bg-[#F7F0E8] px-3 py-1 font-serif text-xs italic text-[#2E241D] hover:bg-[#BFA054] hover:text-white transition"
          />
          <QuickRsvpDock
            isDesktopNav
            slug={invitation.slug}
            token={guest?.slug_token}
            guestName={guest?.name}
            themeId="raw-wabi-sabi"
            initialStatus={guest?.rsvp?.attendance_status}
            initialPax={guest?.rsvp?.pax_count}
            initialWish={guest?.rsvp?.wish_message}
          />
        </div>
      </header>

      {/* Cover / Gate */}
      <section className="flex min-h-[85vh] flex-col justify-between p-6 pb-28 lg:p-12 text-center lg:text-left">
        <div className="max-w-7xl mx-auto w-full my-auto lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          {/* Left Side */}
          <div className="lg:col-span-6 space-y-6">
            <div className="font-mono text-xs uppercase tracking-widest text-[#BFA054]">
              {guestName ? `To: ${guestName}` : "Undangan Pernikahan"}
            </div>

            <WabiSabiInkBleed groomName={invitation.groom_name} brideName={invitation.bride_name} />

            <p className="mx-auto lg:mx-0 max-w-sm font-serif text-sm italic text-[#2E241D]/75 leading-relaxed">
              &ldquo;Keindahan dalam kesederhanaan, keabadian dalam ketulusan.&rdquo;
            </p>
          </div>

          {/* Right Side - Featured Desktop Frame */}
          <div className="hidden lg:col-span-6 lg:block">
            {photos.length > 0 ? (
              <div className="relative p-4 border border-[#2E241D]/20 bg-[#F7F0E8] shadow-md rounded-sm">
                <img
                  src={photos[0].url}
                  alt="Couple Cover"
                  className="aspect-[4/5] w-full object-cover border border-[#2E241D]/10"
                />
                <p className="mt-3 text-center font-serif text-xs italic text-[#BFA054]">
                  {dateLabel}
                </p>
              </div>
            ) : (
              <div className="p-12 border border-[#2E241D]/20 bg-[#F7F0E8] text-center shadow-sm">
                <p className="font-serif text-xl italic text-[#BFA054]">{dateLabel}</p>
                <p className="mt-2 text-xs font-serif text-[#2E241D]/70">Pernikahan Suci &amp; Syukuran</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Paper mask texture divider */}
      <div className="h-4 w-full bg-[radial-gradient(#BFA054_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      {/* Content sections */}
      <div className="max-w-7xl mx-auto space-y-12 px-5 py-8 lg:px-12 lg:py-16">
        {/* Galeri Media */}
        <motion.section
          id="gallery"
          initial={disableHeavyAnim ? false : { opacity: 0, y: 20 }}
          whileInView={disableHeavyAnim ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-center font-serif text-2xl lg:text-3xl italic text-[#BFA054]">Galeri Kenangan</h2>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start space-y-4 lg:space-y-0">
            {video && (
              <div className="lg:col-span-5">
                <video
                  src={video.url}
                  controls
                  className="aspect-[9/16] w-full border border-[#2E241D]/20 bg-black object-cover shadow-sm"
                />
              </div>
            )}

            <div className={video ? "lg:col-span-7" : "lg:col-span-12"}>
              {photos.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {photos.map((photo, index) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={`Foto ${index + 1}`}
                      className={`border border-[#2E241D]/20 object-cover shadow-sm ${
                        index === 0 && !video ? "col-span-2 lg:col-span-2 aspect-[4/5] lg:aspect-auto lg:h-72 w-full" : "aspect-square w-full"
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-[#2E241D]/30 p-8 text-center font-serif text-xs italic text-[#2E241D]/60">
                  Galeri foto belum diisi.
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Profil Pasangan */}
        <section id="profile" className="space-y-6">
          <h2 className="text-center font-serif text-2xl lg:text-3xl italic text-[#BFA054]">Mempelai</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="border border-[#2E241D]/20 bg-[#F7F0E8] p-6 text-center shadow-sm">
              <p className="font-serif text-xs italic text-[#BFA054]">Mempelai Pria</p>
              <h3 className="mt-2 font-serif text-2xl text-[#2E241D]">{invitation.groom_name}</h3>
            </div>
            <div className="border border-[#2E241D]/20 bg-[#F7F0E8] p-6 text-center shadow-sm">
              <p className="font-serif text-xs italic text-[#BFA054]">Mempelai Wanita</p>
              <h3 className="mt-2 font-serif text-2xl text-[#2E241D]">{invitation.bride_name}</h3>
            </div>
          </div>
        </section>

        {/* Jadwal Acara */}
        <motion.section
          id="schedule"
          initial={disableHeavyAnim ? false : { opacity: 0, y: 20 }}
          whileInView={disableHeavyAnim ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border border-[#2E241D]/20 bg-[#F7F0E8] p-6 lg:p-10 shadow-sm"
        >
          <h2 className="text-center font-serif text-2xl lg:text-3xl italic text-[#BFA054]">Waktu &amp; Tempat</h2>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center font-sans text-sm text-[#2E241D]">
            <div className="flex items-center justify-center lg:justify-start gap-3 border-b lg:border-b-0 lg:border-r border-[#2E241D]/15 pb-4 lg:pb-0 lg:pr-8">
              <CalendarDays className="h-6 w-6 text-[#BFA054] shrink-0" />
              <span className="text-base lg:text-lg">{dateLabel}</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <MapPin className="h-6 w-6 text-[#BFA054] shrink-0" />
              <span className="text-base lg:text-lg">{invitation.location || "Lokasi Acara"}</span>
            </div>
          </div>
        </motion.section>

        {/* Rekening */}
        {invitation.bank_accounts.length > 0 && (
          <motion.section
            id="bank"
            initial={disableHeavyAnim ? false : { opacity: 0, y: 20 }}
            whileInView={disableHeavyAnim ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="font-serif text-xl italic text-[#BFA054]">Hadiah Undangan</h2>
            {invitation.bank_accounts.map((account) => (
              <BankCard
                key={account.id}
                bankName={account.bank.name}
                bankCode={account.bank_code}
                accountNumber={account.account_number}
                accountHolder={account.account_holder}
                logoUrl={account.bank.logo_url}
              />
            ))}
          </motion.section>
        )}

        {/* Ucapan & QR Check-in Desktop Multi-Column */}
        <motion.section
          initial={disableHeavyAnim ? false : { opacity: 0, y: 20 }}
          whileInView={disableHeavyAnim ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="font-serif text-xl italic text-[#BFA054]">Doa &amp; Ucapan</h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <WishesForm
                slug={invitation.slug}
                guestName={guest?.name}
                token={guest?.slug_token}
                themeId="raw-wabi-sabi"
              />
            </div>
            <div className="lg:col-span-7">
              <WishesFeed wishes={wishes} themeId="raw-wabi-sabi" />
            </div>
          </div>
        </motion.section>
      </div>

      <QrCheckinModal
        slug={invitation.slug}
        token={guest?.slug_token}
        guestName={guest?.name}
        themeId="raw-wabi-sabi"
      />
    </main>
  );
}
