"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { AudioControl } from "@/components/shared/audio-control";
import { QuickRsvpDock } from "@/components/shared/quick-rsvp-dock";
import { BankCard } from "@/components/shared/bank-card";
import { QrCheckinModal } from "@/components/shared/qr-checkin-modal";
import { WishesForm } from "@/components/shared/wishes-form";
import { WishesFeed } from "@/components/shared/wishes-feed";
import { useFloralGate } from "./use-open-gate";
import { FloralGateOpenButton, FloralGateSkipButton } from "./gate-parts";
import type { FloralThemeConfig, Guest, Invitation, Wish } from "./types";

export function FloralTheme({
  invitation,
  guest,
  wishes,
  config,
  preview = false,
}: {
  invitation: Invitation;
  guest?: Guest | null;
  wishes?: Wish[];
  config: FloralThemeConfig;
  preview?: boolean;
}) {
  const { phase, isOpened, disableHeavyAnim, audioRef, open, skip, finish } = useFloralGate(
    config.id,
    preview
  );
  const guestName = guest?.name;
  const photos = invitation.media_assets.filter((item) => item.type === "photo");
  const video = invitation.media_assets.find((item) => item.type === "video");
  const audio = invitation.media_assets.find((item) => item.type === "audio");
  const { OrnamentCorner, OrnamentDivider } = config;

  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(invitation.event_date));

  const vars = {
    "--f-bg": config.palette.bg,
    "--f-surface": config.palette.surface,
    "--f-text": config.palette.text,
    "--f-muted": config.palette.muted,
    "--f-accent": config.palette.accent,
    "--f-accent-text": config.palette.accentText,
    "--f-accent-strong": config.palette.accentStrong,
    "--f-border": config.palette.border,
  } as CSSProperties;

  const headerFont = { fontFamily: config.headerFontFamily };

  const reveal = (delay = 0) => ({
    initial: disableHeavyAnim ? false : { opacity: 0, y: 24 },
    whileInView: disableHeavyAnim ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay },
  });

  return (
    <main
      className="min-h-screen bg-[var(--f-bg)] text-[var(--f-text)]"
      style={{ ...vars, fontFamily: config.bodyFontFamily }}
    >
      {/* Signature open animation gate */}
      {phase !== "open" && (
        <div
          onClick={skip}
          className="fixed inset-0 z-50 overflow-hidden bg-[var(--f-bg)]"
          role="presentation"
        >
          <config.CoverAnimation
            groomName={invitation.groom_name}
            brideName={invitation.bride_name}
            guestName={guestName}
            opened={phase === "opening"}
            disableHeavyAnim={disableHeavyAnim}
            config={config}
            onComplete={finish}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-14 z-30 flex justify-center px-6">
            {phase === "gate" && <FloralGateOpenButton config={config} onOpen={open} />}
          </div>
          <div className="absolute right-4 top-4 z-30">
            <FloralGateSkipButton onSkip={skip} />
          </div>
        </div>
      )}

      {isOpened && (
        <QuickRsvpDock
          slug={invitation.slug}
          token={guest?.slug_token}
          guestName={guest?.name}
          themeId={config.id}
          initialStatus={guest?.rsvp?.attendance_status}
          initialPax={guest?.rsvp?.pax_count}
          initialWish={guest?.rsvp?.wish_message}
          audioUrl={audio?.url}
          audioRef={audioRef}
        />
      )}

      {/* Desktop sticky top nav */}
      <header className="sticky top-0 z-40 hidden items-center justify-between border-b border-[var(--f-border)] bg-[var(--f-bg)]/90 px-8 py-3.5 backdrop-blur-md lg:flex">
        <span className="text-lg" style={headerFont}>
          {invitation.groom_name} &amp; {invitation.bride_name}
        </span>

        <nav className="flex items-center gap-6 text-xs uppercase tracking-widest text-[var(--f-muted)]">
          <a href="#gallery" className="transition hover:text-[var(--f-accent)]">{config.copy.nav.gallery}</a>
          <a href="#profile" className="transition hover:text-[var(--f-accent)]">{config.copy.nav.profile}</a>
          <a href="#schedule" className="transition hover:text-[var(--f-accent)]">{config.copy.nav.schedule}</a>
          <a href="#bank" className="transition hover:text-[var(--f-accent)]">{config.copy.nav.gift}</a>
        </nav>

        <div className="flex items-center gap-4">
          <AudioControl
            audioUrl={audio?.url}
            audioRef={audioRef}
            desktopClassName="hidden items-center gap-2 rounded-full border border-[var(--f-border)] bg-[var(--f-surface)] px-3 py-1 text-xs transition hover:bg-[var(--f-accent)] hover:text-[var(--f-accent-text)] lg:inline-flex"
          />
          <QuickRsvpDock
            isDesktopNav
            slug={invitation.slug}
            token={guest?.slug_token}
            guestName={guest?.name}
            themeId={config.id}
            initialStatus={guest?.rsvp?.attendance_status}
            initialPax={guest?.rsvp?.pax_count}
            initialWish={guest?.rsvp?.wish_message}
            audioRef={audioRef}
          />
        </div>
      </header>

      {/* Cover / Hero */}
      <section className="relative overflow-hidden px-6 pb-28 pt-10 lg:px-12 lg:pb-24 lg:pt-16">
        <OrnamentCorner className="pointer-events-none absolute left-2 top-2 h-20 w-20 opacity-50 lg:h-28 lg:w-28" />
        <OrnamentCorner className="pointer-events-none absolute right-2 top-2 h-20 w-20 -scale-x-100 opacity-50 lg:h-28 lg:w-28" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 text-center lg:col-span-6 lg:text-left">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--f-accent-strong)]">
              {guestName ? `Kepada: ${guestName}` : "Undangan Pernikahan"}
            </p>
            <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.05]" style={headerFont}>
              {invitation.groom_name} <span className="text-[var(--f-accent)]">&amp;</span> {invitation.bride_name}
            </h1>
            <p className="mx-auto max-w-sm text-sm italic leading-relaxed text-[var(--f-muted)] lg:mx-0">
              &ldquo;{config.copy.coverQuote}&rdquo;
            </p>
          </div>

          <div className="hidden lg:col-span-6 lg:block">
            {photos.length > 0 ? (
              <div className="relative rounded-[2rem] border border-[var(--f-border)] bg-[var(--f-surface)] p-4 shadow-sm">
                <img
                  src={photos[0].url}
                  alt="Couple Cover"
                  className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
                />
                <p className="mt-3 text-center text-xs italic text-[var(--f-accent-strong)]">{dateLabel}</p>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-[var(--f-border)] bg-[var(--f-surface)] p-12 text-center shadow-sm">
                <p className="text-xl text-[var(--f-accent)]" style={headerFont}>{dateLabel}</p>
                <p className="mt-2 text-xs text-[var(--f-muted)]">Dengan penuh sukacita</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <OrnamentDivider className="mx-auto h-8 w-56 text-[var(--f-accent)]" />

      <div className="mx-auto max-w-7xl space-y-12 px-5 py-8 lg:px-12 lg:py-16">
        {/* Galeri Media */}
        <motion.section id="gallery" {...reveal()} className="space-y-6">
          <SectionTitle config={config} title={config.copy.galleryTitle} />
          <div className="space-y-4 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8 lg:space-y-0">
            {video && (
              <div className="lg:col-span-5">
                <video
                  src={video.url}
                  controls
                  className="aspect-[9/16] w-full rounded-2xl border border-[var(--f-border)] bg-black object-cover shadow-sm"
                />
              </div>
            )}
            <div className={video ? "lg:col-span-7" : "lg:col-span-12"}>
              {photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
                  {photos.map((photo, index) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={`Foto ${index + 1}`}
                      className={`rounded-2xl border border-[var(--f-border)] object-cover shadow-sm ${
                        index === 0 && !video
                          ? "col-span-2 aspect-[4/5] w-full lg:aspect-auto lg:h-72"
                          : "aspect-square w-full"
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--f-border)] p-8 text-center text-xs italic text-[var(--f-muted)]">
                  Galeri foto belum diisi.
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Profil Pasangan */}
        <motion.section id="profile" {...reveal()} className="space-y-6">
          <SectionTitle config={config} title={config.copy.profileTitle} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {[
              { label: "Mempelai Pria", name: invitation.groom_name },
              { label: "Mempelai Wanita", name: invitation.bride_name },
            ].map((person) => (
              <div
                key={person.label}
                className="relative overflow-hidden rounded-[1.75rem] border border-[var(--f-border)] bg-[var(--f-surface)] p-6 text-center shadow-sm"
              >
                <OrnamentCorner className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 opacity-40" />
                <p className="text-xs italic text-[var(--f-accent-strong)]">{person.label}</p>
                <h3 className="mt-2 text-2xl" style={headerFont}>{person.name}</h3>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Jadwal Acara */}
        <motion.section
          id="schedule"
          {...reveal()}
          className="rounded-[1.75rem] border border-[var(--f-border)] bg-[var(--f-surface)] p-6 shadow-sm lg:p-10"
        >
          <SectionTitle config={config} title={config.copy.scheduleTitle} />
          <div className="mt-6 grid grid-cols-1 items-center gap-6 text-sm lg:grid-cols-2 lg:gap-8">
            <div className="flex items-center justify-center gap-3 border-b border-[var(--f-border)] pb-4 lg:justify-start lg:border-b-0 lg:border-r lg:border-[var(--f-border)] lg:pb-0 lg:pr-8">
              <CalendarDays className="h-6 w-6 shrink-0 text-[var(--f-accent)]" />
              <span className="text-base lg:text-lg">{dateLabel}</span>
            </div>
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <MapPin className="h-6 w-6 shrink-0 text-[var(--f-accent)]" />
              <span className="text-base lg:text-lg">{invitation.location || "Lokasi Acara"}</span>
            </div>
          </div>
        </motion.section>

        {/* Rekening */}
        {invitation.bank_accounts.length > 0 && (
          <motion.section id="bank" {...reveal()} className="space-y-4">
            <SectionTitle config={config} title={config.copy.bankTitle} align="left" />
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

        {/* Ucapan & Wishes */}
        <motion.section {...reveal()} className="space-y-4">
          <SectionTitle config={config} title={config.copy.wishesTitle} align="left" />
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <WishesForm
                slug={invitation.slug}
                guestName={guest?.name}
                token={guest?.slug_token}
                themeId={config.id}
              />
            </div>
            <div className="lg:col-span-7">
              <WishesFeed wishes={wishes} themeId={config.id} />
            </div>
          </div>
        </motion.section>
      </div>

      <QrCheckinModal
        slug={invitation.slug}
        token={guest?.slug_token}
        guestName={guest?.name}
        themeId={config.id}
      />
    </main>
  );
}

function SectionTitle({
  config,
  title,
  align = "center",
}: {
  config: FloralThemeConfig;
  title: string;
  align?: "center" | "left";
}) {
  return (
    <h2
      className={`text-2xl lg:text-3xl ${align === "center" ? "text-center" : "text-left"}`}
      style={{ fontFamily: config.headerFontFamily }}
    >
      {title}
    </h2>
  );
}
