"use client";

import { useState } from "react";
import { useAnimSettings } from "@/lib/use-anim-settings";
import { CyberConstellation } from "@/components/themes/animations/cyber-constellation";
import { AudioControl } from "@/components/shared/audio-control";
import { QuickRsvpDock } from "@/components/shared/quick-rsvp-dock";
import { BankCard } from "@/components/shared/bank-card";
import { QrCheckinModal } from "@/components/shared/qr-checkin-modal";
import { WishesForm } from "@/components/shared/wishes-form";
import { CalendarDays, MapPin, Cpu } from "lucide-react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";

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

export function CyberCelestialNoirTheme({
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

  const handleOpenInvitation = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpened(true);
    const audioEl = document.querySelector<HTMLAudioElement>("audio");
    if (audioEl && audioEl.paused) {
      audioEl.play().catch(() => {});
    }
    setTimeout(() => {
      const target = document.getElementById("gallery") || document.getElementById("schedule");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#0C0E14] text-[#F4F7FB]"
      style={
        {
          "--theme-bg": "#0C0E14",
          "--theme-text": "#F4F7FB",
          "--theme-accent": "#00F5D4",
          "--theme-card": "#151A24",
          "--theme-muted": "rgba(244,247,251,0.72)",
        } as CSSProperties
      }
    >
      {isOpened && (
        <QuickRsvpDock
          slug={invitation.slug}
          token={guest?.slug_token}
          guestName={guest?.name}
          themeId="cyber-celestial-noir"
          initialStatus={guest?.rsvp?.attendance_status}
          initialPax={guest?.rsvp?.pax_count}
          initialWish={guest?.rsvp?.wish_message}
          audioUrl={audio?.url}
        />
      )}

      {/* Desktop Sticky Top Nav */}
      <header className="sticky top-0 z-40 hidden border-b border-[#00F5D4]/30 bg-[#0C0E14]/90 backdrop-blur-md px-8 py-3 lg:flex items-center justify-between font-mono text-xs text-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.15)]">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-[#00F5D4] animate-pulse" />
          <span className="font-bold tracking-widest text-[#F4F7FB]">
            CELESTIAL.SYS &#47;&#47; {invitation.groom_name} x {invitation.bride_name}
          </span>
        </div>

        <nav className="flex items-center gap-6 font-mono text-xs">
          <a href="#gallery" className="hover:text-[#F4F7FB] transition">{"// GALERI"}</a>
          <a href="#profile" className="hover:text-[#F4F7FB] transition">{"// PROFIL"}</a>
          <a href="#schedule" className="hover:text-[#F4F7FB] transition">{"// JADWAL"}</a>
          <a href="#bank" className="hover:text-[#F4F7FB] transition">{"// REKENING"}</a>
        </nav>

        <div className="flex items-center gap-4">
          <AudioControl
            audioUrl={audio?.url}
            desktopClassName="hidden lg:inline-flex items-center gap-2 border border-[#00F5D4] bg-[#151A24] px-3 py-1 font-mono text-xs font-bold text-[#00F5D4] hover:bg-[#00F5D4] hover:text-[#0C0E14] transition"
          />
          <QuickRsvpDock
            isDesktopNav
            slug={invitation.slug}
            token={guest?.slug_token}
            guestName={guest?.name}
            themeId="cyber-celestial-noir"
            initialStatus={guest?.rsvp?.attendance_status}
            initialPax={guest?.rsvp?.pax_count}
            initialWish={guest?.rsvp?.wish_message}
          />
        </div>
      </header>

      {/* Cover / Gate */}
      <section className="flex min-h-[85vh] flex-col justify-between p-6 pb-28 lg:p-12">
        <div className="max-w-7xl mx-auto w-full my-auto lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-[#00F5D4]/30 pb-2 font-mono text-xs text-[#00F5D4]">
              <div className="flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5" />
                <span>CELESTIAL.SYS</span>
              </div>
              <span>{guestName ? `[TARGET: ${guestName}]` : "[PUBLIC ACCESS]"}</span>
            </div>

            <CyberConstellation groomName={invitation.groom_name} brideName={invitation.bride_name} />

            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent shadow-[0_0_8px_#00F5D4]" />

            <a
              href="#gallery"
              onClick={handleOpenInvitation}
              className="inline-block min-h-12 w-full lg:w-auto px-8 rounded-lg border border-[#00F5D4] bg-[#151A24] py-3 text-center font-mono text-sm font-bold uppercase tracking-widest text-[#00F5D4] shadow-[0_0_12px_rgba(0,245,212,0.3)] transition hover:bg-[#00F5D4] hover:text-[#0C0E14] cursor-pointer active:scale-95"
            >
              Enter Protocol (Buka Undangan)
            </a>
          </div>

          {/* Right side - Holographic Cyber Frame for Desktop */}
          <div className="hidden lg:col-span-5 lg:block">
            {photos.length > 0 ? (
              <div className="relative rounded-xl border border-[#00F5D4]/40 bg-[#151A24] p-3 shadow-[0_0_20px_rgba(0,245,212,0.25)]">
                <img
                  src={photos[0].url}
                  alt="Cyber Couple"
                  className="aspect-[4/5] w-full rounded-lg object-cover border border-[#00F5D4]/20"
                />
                <p className="mt-3 text-center font-mono text-xs text-[#00F5D4] tracking-widest">
                  [SYSTEM_TIMESTAMP: {dateLabel}]
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-[#00F5D4]/40 bg-[#151A24] p-10 text-center shadow-[0_0_20px_rgba(0,245,212,0.25)]">
                <p className="font-mono text-lg font-bold text-[#00F5D4]">{dateLabel}</p>
                <p className="mt-2 font-mono text-xs text-[#F4F7FB]/60">{"// INITIATING WEDDING PROTOCOL"}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content sections */}
      <div className="max-w-7xl mx-auto space-y-12 px-5 py-8 lg:px-12 lg:py-16">
        {/* Galeri Media */}
        <motion.section
          id="gallery"
          initial={disableHeavyAnim ? false : { opacity: 0, y: 30 }}
          whileInView={disableHeavyAnim ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2 border-l-2 border-[#00F5D4] pl-3 font-mono text-sm uppercase text-[#00F5D4]">
            <span>{"// DATA_GALLERY"}</span>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start space-y-4 lg:space-y-0">
            {video && (
              <div className="lg:col-span-5">
                <video
                  src={video.url}
                  controls
                  className="aspect-[9/16] w-full rounded-lg border border-[#00F5D4]/40 bg-black object-cover shadow-[0_0_15px_rgba(0,245,212,0.2)]"
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
                      className={`rounded-lg border border-[#00F5D4]/40 object-cover shadow-[0_0_10px_rgba(0,245,212,0.15)] ${
                        index === 0 && !video ? "col-span-2 lg:col-span-2 aspect-[4/5] lg:aspect-auto lg:h-72 w-full" : "aspect-square w-full"
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-[#00F5D4]/30 bg-[#151A24] p-8 text-center font-mono text-xs text-[#F4F7FB]/50">
                  [NO MEDIA DATA FOUND]
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Profil Pasangan */}
        <section id="profile" className="space-y-6">
          <div className="font-mono text-xs uppercase text-[#00F5D4]">{"// BIOMETRIC_PROFILES"}</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="rounded-lg border border-[#00F5D4]/30 bg-[#151A24] p-6 font-mono shadow-sm">
              <p className="text-xs text-[#00F5D4]">[GROOM_DATA]</p>
              <h3 className="mt-2 text-2xl font-bold text-[#F4F7FB]">{invitation.groom_name}</h3>
            </div>
            <div className="rounded-lg border border-[#00F5D4]/30 bg-[#151A24] p-6 font-mono shadow-sm">
              <p className="text-xs text-[#00F5D4]">[BRIDE_DATA]</p>
              <h3 className="mt-2 text-2xl font-bold text-[#F4F7FB]">{invitation.bride_name}</h3>
            </div>
          </div>
        </section>

        {/* Jadwal Acara */}
        <motion.section
          id="schedule"
          initial={disableHeavyAnim ? false : { opacity: 0, y: 30 }}
          whileInView={disableHeavyAnim ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-lg border border-[#00F5D4]/40 bg-[#151A24] p-6 lg:p-10 shadow-[0_0_15px_rgba(123,44,191,0.2)]"
        >
          <div className="font-mono text-xs uppercase text-[#7B2CBF]">{"// EVENT_TIME_STAMP"}</div>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center font-mono text-sm">
            <div className="flex items-center gap-3 text-[#00F5D4] border-b lg:border-b-0 lg:border-r border-[#00F5D4]/20 pb-4 lg:pb-0 lg:pr-8">
              <CalendarDays className="h-6 w-6 shrink-0" />
              <span className="text-base lg:text-lg">{dateLabel}</span>
            </div>
            <div className="flex items-center gap-3 text-[#F4F7FB]/80">
              <MapPin className="h-6 w-6 text-[#7B2CBF] shrink-0" />
              <span className="text-base lg:text-lg">{invitation.location || "Coordinates TBD"}</span>
            </div>
          </div>
        </motion.section>

        {/* Rekening */}
        {invitation.bank_accounts.length > 0 && (
          <motion.section
            id="bank"
            initial={disableHeavyAnim ? false : { opacity: 0, y: 30 }}
            whileInView={disableHeavyAnim ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="font-mono text-xs uppercase text-[#00F5D4]">{"// GIFT_GATEWAY"}</div>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Ucapan */}
          <motion.section
            initial={disableHeavyAnim ? false : { opacity: 0, y: 30 }}
            whileInView={disableHeavyAnim ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-4"
          >
            <div className="font-mono text-xs uppercase text-[#00F5D4]">{"// INCOMING_MESSAGES"}</div>
            <WishesForm
              slug={invitation.slug}
              guestName={guest?.name}
              token={guest?.slug_token}
              themeId="cyber-celestial-noir"
            />
            {wishes && wishes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {wishes.map((wish) => (
                  <article key={wish.id} className="rounded-lg border border-[#00F5D4]/30 bg-[#151A24] p-4 font-mono">
                    <p className="text-xs text-[#00F5D4]">[FROM: {wish.guest.name}]</p>
                    <p className="mt-2 text-xs text-[#F4F7FB]/90 leading-relaxed">{wish.wish_message}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[#00F5D4]/30 bg-[#151A24] p-4 text-center font-mono text-xs text-[#F4F7FB]/50">
                [NO MESSAGES RECEIVED]
              </div>
            )}
          </motion.section>
        </div>
      </div>

      <QrCheckinModal
        slug={invitation.slug}
        token={guest?.slug_token}
        guestName={guest?.name}
        themeId="cyber-celestial-noir"
      />
    </main>
  );
}
