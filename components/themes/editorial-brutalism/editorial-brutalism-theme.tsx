"use client";

import { useAnimSettings } from "@/lib/use-anim-settings";
import { AudioControl } from "@/components/shared/audio-control";
import { QuickRsvpDock } from "@/components/shared/quick-rsvp-dock";
import { BankCard } from "@/components/shared/bank-card";
import { QrCheckinCard } from "@/components/shared/qr-checkin-card";
import { QrCheckinPlaceholder } from "@/components/shared/qr-checkin-placeholder";
import { RsvpForm } from "@/components/shared/rsvp-form";
import { RsvpPlaceholder } from "@/components/shared/rsvp-placeholder";
import { CalendarDays, MapPin } from "lucide-react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";

const THEME_SKINS = {
  "editorial-brutalism": {
    bg: "#F4EFEA",
    text: "#121212",
    accent: "#D8FB38",
    card: "#FFFFFF",
    muted: "rgba(18,18,18,0.7)",
    intro: "Brutal, honest, and joyfully loud. A digital wedding invitation built for mobile & desktop.",
  },
  "raw-wabi-sabi": {
    bg: "#EBE5DC",
    text: "#2E241D",
    accent: "#BFA054",
    card: "#F7F0E8",
    muted: "rgba(46,36,29,0.7)",
    intro: "Tenang, hangat, dan organik. Undangan digital dengan rasa intim dan bersahaja.",
  },
  "cyber-celestial-noir": {
    bg: "#0C0E14",
    text: "#F4F7FB",
    accent: "#00F5D4",
    card: "#151A24",
    muted: "rgba(244,247,251,0.72)",
    intro: "Gelap, kosmik, dan modern. Undangan digital dengan sentuhan neon yang elegan.",
  },
  "70s-warm-groovy": {
    bg: "#FDF8EE",
    text: "#3A2418",
    accent: "#D96B27",
    card: "#FFF2D0",
    muted: "rgba(58,36,24,0.7)",
    intro: "Hangat, retro, dan playful. Undangan digital dengan energi vintage yang ramah.",
  },
};

type MediaAsset = {
  id: string;
  type: string;
  url: string;
  status: string;
};

type BankAccount = {
  id: string;
  bank_code: string;
  account_number: string;
  account_holder: string;
  bank: {
    name: string;
    logo_url: string;
  };
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
  rsvp?: null | {
    attendance_status: string;
    pax_count: number;
    wish_message: string | null;
  };
};

type Wish = {
  id: string;
  wish_message: string | null;
  guest: {
    name: string;
  };
};

export function EditorialBrutalismTheme({
  invitation,
  guest,
  wishes,
}: {
  invitation: Invitation;
  guest?: Guest | null;
  wishes?: Wish[];
}) {
  const { disableHeavyAnim } = useAnimSettings();
  const guestName = guest?.name;
  const photos = invitation.media_assets.filter((item) => item.type === "photo");
  const video = invitation.media_assets.find((item) => item.type === "video");
  const audio = invitation.media_assets.find((item) => item.type === "audio");
  const skin = THEME_SKINS[invitation.theme_id as keyof typeof THEME_SKINS] || THEME_SKINS["editorial-brutalism"];
  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(invitation.event_date));

  return (
    <main
      className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]"
      style={
        {
          "--theme-bg": skin.bg,
          "--theme-text": skin.text,
          "--theme-accent": skin.accent,
          "--theme-card": skin.card,
          "--theme-muted": skin.muted,
        } as CSSProperties
      }
    >
      <QuickRsvpDock
        slug={invitation.slug}
        token={guest?.slug_token}
        guestName={guest?.name}
        themeId="editorial-brutalism"
        initialStatus={guest?.rsvp?.attendance_status}
        initialPax={guest?.rsvp?.pax_count}
        initialWish={guest?.rsvp?.wish_message}
        audioUrl={audio?.url}
      />

      {/* Sticky Top Nav Bar - Desktop Only (hidden lg:flex) */}
      <header className="sticky top-0 z-40 hidden border-b-4 border-[var(--theme-text)] bg-[var(--theme-bg)] px-8 py-3.5 lg:flex items-center justify-between shadow-[0_4px_0_var(--theme-text)]">
        <div className="flex items-center gap-3 font-mono text-sm font-black uppercase">
          <span className="border-2 border-[var(--theme-text)] bg-[var(--theme-accent)] px-2 py-0.5 text-xs text-[var(--theme-text)]">
            BRUTAL
          </span>
          <span>{invitation.groom_name} &amp; {invitation.bride_name}</span>
        </div>

        <nav className="flex items-center gap-6 font-mono text-xs font-bold uppercase">
          <a href="#gallery" className="hover:bg-[var(--theme-accent)] px-2 py-1 border border-transparent hover:border-[var(--theme-text)] transition">01 Galeri</a>
          <a href="#profile" className="hover:bg-[var(--theme-accent)] px-2 py-1 border border-transparent hover:border-[var(--theme-text)] transition">02 Profil</a>
          <a href="#schedule" className="hover:bg-[var(--theme-accent)] px-2 py-1 border border-transparent hover:border-[var(--theme-text)] transition">03 Jadwal</a>
          <a href="#bank" className="hover:bg-[var(--theme-accent)] px-2 py-1 border border-transparent hover:border-[var(--theme-text)] transition">04 Rekening</a>
          <a href="#rsvp" className="hover:bg-[var(--theme-accent)] px-2 py-1 border border-transparent hover:border-[var(--theme-text)] transition">05 RSVP</a>
        </nav>

        <div className="flex items-center gap-4">
          <AudioControl
            audioUrl={audio?.url}
            desktopClassName="hidden lg:inline-flex items-center gap-2 border-2 border-[var(--theme-text)] bg-[var(--theme-card)] px-3 py-1 font-mono text-xs font-bold uppercase shadow-[2px_2px_0_var(--theme-text)] hover:bg-[var(--theme-accent)] transition"
          />
          <QuickRsvpDock
            isDesktopNav
            slug={invitation.slug}
            token={guest?.slug_token}
            guestName={guest?.name}
            themeId="editorial-brutalism"
            initialStatus={guest?.rsvp?.attendance_status}
            initialPax={guest?.rsvp?.pax_count}
            initialWish={guest?.rsvp?.wish_message}
          />
        </div>
      </header>

      {/* Cover / Gate */}
      <section className="border-x-2 border-b-2 border-[var(--theme-text)] bg-[var(--theme-bg)] p-5 lg:p-12">
        <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[85vh] lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center lg:min-h-[75vh]">
          {/* Left Column (Main Info) */}
          <div className="lg:col-span-7 flex flex-col justify-between lg:justify-center">
            <div className="flex justify-between border-b-2 border-[var(--theme-text)] pb-3 font-mono text-xs font-bold uppercase tracking-[0.18em]">
              <span>Wedding Invite</span>
              <span>{guestName ? `To: ${guestName}` : "Public"}</span>
            </div>

            <div className="py-10 lg:py-8">
              <motion.p
                initial={disableHeavyAnim ? false : { scale: 2, opacity: 0, rotate: -8 }}
                animate={disableHeavyAnim ? undefined : { scale: 1, opacity: 1, rotate: -3 }}
                transition={{ duration: 0.15, ease: "linear" }}
                className="inline-block border-4 border-[var(--theme-text)] bg-[var(--theme-accent)] px-3 py-1 font-mono text-xs font-black uppercase text-[var(--theme-text)] shadow-[4px_4px_0_var(--theme-text)]"
              >
                ★ OFFICIAL INVITATION ★
              </motion.p>

              <motion.h1
                initial={disableHeavyAnim ? false : { x: -100 }}
                animate={disableHeavyAnim ? undefined : { x: [0, -4, 4, -2, 0] }}
                transition={{ duration: 0.2, ease: "linear" }}
                className="mt-6 text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.82] tracking-[-0.08em]"
              >
                {invitation.groom_name}
                <br className="hidden lg:inline" /> &amp; <br className="hidden lg:inline" />
                {invitation.bride_name}
              </motion.h1>

              <p className="mt-6 max-w-md border-l-4 border-[var(--theme-text)] pl-4 font-mono text-sm uppercase leading-relaxed text-[var(--theme-muted)]">
                {skin.intro}
              </p>
            </div>

            <a
              href="#schedule"
              className="inline-block min-h-11 border-2 border-[var(--theme-text)] bg-[var(--theme-text)] px-6 py-3 text-center font-mono text-sm font-bold uppercase text-[var(--theme-bg)] shadow-[6px_6px_0_var(--theme-accent)] transition-transform active:translate-x-1 active:translate-y-1 lg:w-fit"
            >
              Buka Undangan
            </a>
          </div>

          {/* Right Column - Desktop Poster/Featured Media */}
          <div className="hidden lg:col-span-5 lg:block">
            {photos.length > 0 ? (
              <div className="relative border-4 border-[var(--theme-text)] bg-[var(--theme-card)] p-3 shadow-[10px_10px_0_var(--theme-text)]">
                <img
                  src={photos[0].url}
                  alt="Featured Couple"
                  className="aspect-[4/5] w-full border-2 border-[var(--theme-text)] object-cover"
                />
                <div className="mt-3 flex justify-between font-mono text-xs font-black uppercase border-t-2 border-[var(--theme-text)] pt-2">
                  <span>SAVE THE DATE</span>
                  <span>{dateLabel}</span>
                </div>
              </div>
            ) : (
              <div className="border-4 border-[var(--theme-text)] bg-[var(--theme-accent)] p-8 text-center shadow-[10px_10px_0_var(--theme-text)]">
                <p className="font-mono text-2xl font-black uppercase tracking-wider">
                  {dateLabel}
                </p>
                <p className="mt-4 font-mono text-xs font-bold uppercase border-t-2 border-[var(--theme-text)] pt-4">
                  THE WEDDING CELEBRATION
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sections Container */}
      <div className="border-x-2 border-[var(--theme-text)] px-5 py-8 lg:px-12 lg:py-16 space-y-12 max-w-7xl mx-auto">
        {/* Galeri Media */}
        <motion.section
          id="gallery"
          initial={disableHeavyAnim ? false : { opacity: 0, x: -30 }}
          whileInView={disableHeavyAnim ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.1, ease: "linear" }}
          className="space-y-4"
        >
          <ThemeHeading number="01" title="Galeri Media" />

          {/* Desktop Multi-column Layout for Media */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start space-y-4 lg:space-y-0">
            {video && (
              <div className="lg:col-span-5">
                <video
                  src={video.url}
                  controls
                  className="aspect-[9/16] w-full border-2 border-[var(--theme-text)] bg-black object-cover shadow-[6px_6px_0_var(--theme-text)]"
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
                      className={`border-2 border-[var(--theme-text)] object-cover shadow-[4px_4px_0_var(--theme-text)] ${
                        index === 0 && !video
                          ? "col-span-2 lg:col-span-2 aspect-[4/5] lg:aspect-auto lg:h-72 w-full"
                          : "aspect-square w-full"
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <EmptySlot text="Galeri akan muncul setelah foto diunggah." />
              )}
            </div>
          </div>
        </motion.section>

        {/* Profil Pasangan */}
        <motion.section
          id="profile"
          initial={disableHeavyAnim ? false : { opacity: 0, y: 30 }}
          whileInView={disableHeavyAnim ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.1, ease: "linear" }}
          className="border-2 border-[var(--theme-text)] bg-[var(--theme-card)] p-5 lg:p-8 shadow-[6px_6px_0_var(--theme-text)]"
        >
          <ThemeHeading number="02" title="Profil Pasangan" />
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            <ProfileBox name={invitation.groom_name} label="Mempelai Pria" />
            <ProfileBox name={invitation.bride_name} label="Mempelai Wanita" />
          </div>
          <p className="mt-6 text-sm leading-relaxed text-[var(--theme-muted)] font-mono uppercase">
            Kami mengundang Anda untuk menjadi bagian dari hari bahagia kami.
          </p>
        </motion.section>

        {/* Jadwal Acara */}
        <motion.section
          id="schedule"
          initial={disableHeavyAnim ? false : { opacity: 0, x: 30 }}
          whileInView={disableHeavyAnim ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.1, ease: "linear" }}
          className="border-2 border-[var(--theme-text)] bg-[var(--theme-accent)] p-6 lg:p-10 text-[var(--theme-text)] shadow-[6px_6px_0_var(--theme-text)]"
        >
          <ThemeHeading number="03" title="Jadwal Acara" />
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center font-mono text-sm font-bold uppercase">
            <div className="space-y-4 border-b-2 lg:border-b-0 lg:border-r-2 border-[var(--theme-text)] pb-4 lg:pb-0 lg:pr-8">
              <div className="flex gap-3 items-center">
                <CalendarDays className="h-6 w-6 shrink-0" />
                <span className="text-base lg:text-lg">{dateLabel} WIB</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <MapPin className="h-6 w-6 shrink-0 mt-0.5" />
                <span className="text-base lg:text-lg">{invitation.location || "Lokasi akan segera diumumkan"}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Kartu Rekening & RSVP Desktop Multi-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kartu Rekening */}
          <motion.section
            id="bank"
            initial={disableHeavyAnim ? false : { opacity: 0, y: 30 }}
            whileInView={disableHeavyAnim ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.1, ease: "linear" }}
            className="lg:col-span-5 space-y-4"
          >
            <ThemeHeading number="04" title="Kartu Rekening" />
            {invitation.bank_accounts.length > 0 ? (
              <div className="space-y-4">
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
              </div>
            ) : (
              <EmptySlot text="Info rekening belum ditambahkan." />
            )}
          </motion.section>

          {/* RSVP */}
          <motion.section
            id="rsvp"
            initial={disableHeavyAnim ? false : { opacity: 0, x: -30 }}
            whileInView={disableHeavyAnim ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.1, ease: "linear" }}
            className="lg:col-span-7"
          >
            {guest ? (
              <RsvpForm
                slug={invitation.slug}
                token={guest.slug_token}
                guestName={guest.name}
                initialStatus={guest.rsvp?.attendance_status}
                initialPax={guest.rsvp?.pax_count}
                initialWish={guest.rsvp?.wish_message}
                themeId="editorial-brutalism"
              />
            ) : (
              <RsvpPlaceholder guestName={guestName} themeId="editorial-brutalism" />
            )}
          </motion.section>
        </div>

        {/* Ucapan & QR Check-in Desktop Multi-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Ucapan */}
          <motion.section
            initial={disableHeavyAnim ? false : { opacity: 0, y: 30 }}
            whileInView={disableHeavyAnim ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.1, ease: "linear" }}
            className="lg:col-span-7 border-2 border-[var(--theme-text)] bg-[var(--theme-card)] p-5 lg:p-8 shadow-[6px_6px_0_var(--theme-text)]"
          >
            <ThemeHeading number="05" title="Ucapan &amp; Doa" />
            {wishes && wishes.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {wishes.map((wish) => (
                  <article key={wish.id} className="border-2 border-[var(--theme-text)] bg-[var(--theme-bg)] p-4">
                    <p className="font-mono text-[10px] font-bold uppercase text-[var(--theme-muted)]">
                      {wish.guest.name}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed">{wish.wish_message}</p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptySlot text="Belum ada ucapan dari tamu." />
            )}
          </motion.section>

          {/* QR Check-in */}
          <motion.section
            initial={disableHeavyAnim ? false : { opacity: 0, y: 30 }}
            whileInView={disableHeavyAnim ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.1, ease: "linear" }}
            className="lg:col-span-5"
          >
            {guest ? (
              <QrCheckinCard slug={invitation.slug} token={guest.slug_token} />
            ) : (
              <QrCheckinPlaceholder />
            )}
          </motion.section>
        </div>
      </div>
    </main>
  );
}

function ThemeHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="border-2 border-[var(--theme-text)] bg-[var(--theme-accent)] px-2 py-1 font-mono text-xs font-black text-[var(--theme-text)]">
        {number}
      </span>
      <h2 className="text-2xl font-black uppercase leading-none tracking-[-0.04em]">
        {title}
      </h2>
    </div>
  );
}

function ProfileBox({ name, label }: { name: string; label: string }) {
  return (
    <div className="border-2 border-[var(--theme-text)] bg-[var(--theme-bg)] p-4">
      <p className="font-mono text-[10px] font-bold uppercase text-[var(--theme-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-black uppercase leading-none">{name}</p>
    </div>
  );
}

function EmptySlot({ text }: { text: string }) {
  return (
    <div className="border-2 border-dashed border-[var(--theme-text)] bg-[var(--theme-card)] p-5 font-mono text-xs font-bold uppercase text-[var(--theme-muted)]">
      {text}
    </div>
  );
}
