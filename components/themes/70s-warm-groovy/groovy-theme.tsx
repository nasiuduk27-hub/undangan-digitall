"use client";

import { useAnimSettings } from "@/lib/use-anim-settings";
import { AudioControl } from "@/components/shared/audio-control";
import { QuickRsvpDock } from "@/components/shared/quick-rsvp-dock";
import { BankCard } from "@/components/shared/bank-card";
import { QrCheckinCard } from "@/components/shared/qr-checkin-card";
import { QrCheckinPlaceholder } from "@/components/shared/qr-checkin-placeholder";
import { WishesForm } from "@/components/shared/wishes-form";
import { CalendarDays, MapPin, Disc } from "lucide-react";
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

export function Groovy70sTheme({
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
      className="relative min-h-screen overflow-hidden bg-[#FDF8EE] text-[#3A2418]"
      style={
        {
          "--theme-bg": "#FDF8EE",
          "--theme-text": "#3A2418",
          "--theme-accent": "#D96B27",
          "--theme-card": "#FFF2D0",
          "--theme-muted": "rgba(58,36,24,0.7)",
        } as CSSProperties
      }
    >
      {/* Morphing Blob background */}
      <div
        className={`pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-[#EBB035] opacity-30 blur-2xl ${
          disableHeavyAnim ? "" : "animate-[spin_20s_linear_infinite]"
        }`}
      />
      <div
        className={`pointer-events-none absolute top-1/2 -right-16 h-80 w-80 rounded-full bg-[#D96B27] opacity-25 blur-2xl ${
          disableHeavyAnim ? "" : "animate-[ping_15s_cubic-bezier(0,0,0.2,1)_infinite]"
        }`}
      />

      <QuickRsvpDock
        slug={invitation.slug}
        token={guest?.slug_token}
        guestName={guest?.name}
        themeId="70s-warm-groovy"
        initialStatus={guest?.rsvp?.attendance_status}
        initialPax={guest?.rsvp?.pax_count}
        initialWish={guest?.rsvp?.wish_message}
        audioUrl={audio?.url}
      />

      {/* Desktop Sticky Top Nav */}
      <header className="sticky top-0 z-40 hidden border-b-2 border-[#D96B27]/30 bg-[#FDF8EE]/90 backdrop-blur-md px-8 py-3.5 lg:flex items-center justify-between font-sans shadow-sm">
        <div className="flex items-center gap-2 font-bold text-[#D96B27]">
          <Disc className={`h-5 w-5 text-[#EBB035] ${disableHeavyAnim ? "" : "animate-spin"}`} />
          <span className="font-serif text-lg text-[#3A2418]">
            {invitation.groom_name} ♥ {invitation.bride_name}
          </span>
        </div>

        <nav className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#3A2418]/80">
          <a href="#gallery" className="hover:text-[#D96B27] transition">~ Galeri ~</a>
          <a href="#profile" className="hover:text-[#D96B27] transition">~ Profil ~</a>
          <a href="#schedule" className="hover:text-[#D96B27] transition">~ Jadwal ~</a>
          <a href="#bank" className="hover:text-[#D96B27] transition">~ Rekening ~</a>
        </nav>

        <div className="flex items-center gap-4">
          <AudioControl
            audioUrl={audio?.url}
            desktopClassName="hidden lg:inline-flex items-center gap-2 rounded-full border border-[#D96B27] bg-[#FFF2D0] px-3 py-1 font-sans text-xs font-bold text-[#D96B27] hover:bg-[#D96B27] hover:text-[#FDF8EE] transition"
          />
          <QuickRsvpDock
            isDesktopNav
            slug={invitation.slug}
            token={guest?.slug_token}
            guestName={guest?.name}
            themeId="70s-warm-groovy"
            initialStatus={guest?.rsvp?.attendance_status}
            initialPax={guest?.rsvp?.pax_count}
            initialWish={guest?.rsvp?.wish_message}
          />
        </div>
      </header>

      {/* Floating Audio Badge for Mobile Header */}
      <div className="relative z-20 flex lg:hidden items-center justify-between p-4">
        <div className="flex items-center gap-2 rounded-full bg-[#EBB035]/20 px-3 py-1 font-mono text-xs text-[#D96B27]">
          <Disc className={`h-4 w-4 ${disableHeavyAnim ? "" : "animate-spin"}`} />
          <span>70s Groovy Sound</span>
        </div>
      </div>

      {/* Cover / Gate */}
      <section className="relative z-10 flex min-h-[85vh] flex-col justify-between p-6 lg:p-12 text-center lg:text-left">
        <div className="max-w-7xl mx-auto w-full my-auto lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block rounded-full bg-[#D96B27] px-4 py-1.5 font-sans font-bold text-xs uppercase tracking-wider text-[#FDF8EE]">
              {guestName ? `For You: ${guestName}` : "Special Invitation"}
            </div>

            <h1 className="font-serif text-5xl lg:text-6xl font-extrabold tracking-tight text-[#D96B27]">
              {invitation.groom_name}
              <span className="block text-3xl font-normal text-[#EBB035]">&amp;</span>
              {invitation.bride_name}
            </h1>

            <WavyDivider disableHeavyAnim={disableHeavyAnim} />

            <p className="mx-auto lg:mx-0 max-w-sm text-sm leading-relaxed text-[#3A2418]/80">
              Hangat, retro, dan penuh cinta. Bergabunglah merayakan hari kebahagiaan kami!
            </p>

            <a
              href="#schedule"
              className="inline-block min-h-12 w-full lg:w-auto px-8 rounded-full bg-[#D96B27] py-3 font-sans text-sm font-bold uppercase text-[#FDF8EE] shadow-md transition hover:bg-[#3A2418] text-center"
            >
              Buka Undangan
            </a>
          </div>

          {/* Right Side - Vintage Groovy Desktop Media */}
          <div className="hidden lg:col-span-6 lg:block">
            {photos.length > 0 ? (
              <div className="relative rounded-3xl border-4 border-[#EBB035] bg-[#FFF2D0] p-4 shadow-xl">
                <img
                  src={photos[0].url}
                  alt="Groovy Couple"
                  className="aspect-[4/5] w-full rounded-2xl object-cover"
                />
                <p className="mt-3 text-center font-serif text-sm font-bold text-[#D96B27]">
                  {dateLabel}
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border-4 border-[#EBB035] bg-[#FFF2D0] p-10 text-center shadow-xl">
                <p className="font-serif text-2xl font-bold text-[#D96B27]">{dateLabel}</p>
                <p className="mt-2 text-xs font-sans text-[#3A2418]/70">CELEBRATING OUR SPECIAL DAY</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-12 px-5 py-8 lg:px-12 lg:py-16">
        {/* Galeri Media */}
        <motion.section
          id="gallery"
          initial={disableHeavyAnim ? false : { opacity: 0, y: 30 }}
          whileInView={disableHeavyAnim ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-center font-serif text-2xl lg:text-3xl font-bold text-[#D96B27]">Momen Bahagia</h2>
          <WavyDivider disableHeavyAnim={disableHeavyAnim} />

          <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start space-y-4 lg:space-y-0">
            {video && (
              <div className="lg:col-span-5">
                <video
                  src={video.url}
                  controls
                  className="aspect-[9/16] w-full rounded-2xl border-4 border-[#EBB035] bg-black object-cover shadow-lg"
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
                      className={`rounded-2xl border-2 border-[#EBB035] object-cover shadow-md ${
                        index === 0 && !video ? "col-span-2 lg:col-span-2 aspect-[4/5] lg:aspect-auto lg:h-72 w-full" : "aspect-square w-full"
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-[#D96B27]/40 p-8 text-center text-xs text-[#3A2418]/60">
                  Galeri foto belum diunggah.
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Profil Pasangan */}
        <section id="profile" className="space-y-6">
          <h2 className="text-center font-serif text-2xl lg:text-3xl font-bold text-[#D96B27]">Pasangan</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="rounded-3xl border-2 border-[#EBB035] bg-[#FFF2D0] p-6 text-center shadow-md">
              <p className="text-xs font-bold text-[#D96B27] uppercase">Mempelai Pria</p>
              <h3 className="mt-2 font-serif text-3xl font-bold text-[#3A2418]">{invitation.groom_name}</h3>
            </div>
            <div className="rounded-3xl border-2 border-[#EBB035] bg-[#FFF2D0] p-6 text-center shadow-md">
              <p className="text-xs font-bold text-[#D96B27] uppercase">Mempelai Wanita</p>
              <h3 className="mt-2 font-serif text-3xl font-bold text-[#3A2418]">{invitation.bride_name}</h3>
            </div>
          </div>
        </section>

        {/* Jadwal Acara */}
        <motion.section
          id="schedule"
          initial={disableHeavyAnim ? false : { opacity: 0, scale: 0.95 }}
          whileInView={disableHeavyAnim ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-[#FFF2D0] p-6 lg:p-10 shadow-md border-2 border-[#EBB035]"
        >
          <h2 className="text-center font-serif text-2xl lg:text-3xl font-bold text-[#D96B27]">Jadwal Acara</h2>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center text-sm font-semibold text-[#3A2418]">
            <div className="flex items-center justify-center lg:justify-start gap-3 border-b lg:border-b-0 lg:border-r border-[#D96B27]/20 pb-4 lg:pb-0 lg:pr-8 text-[#D96B27]">
              <CalendarDays className="h-6 w-6 shrink-0" />
              <span className="text-base lg:text-lg">{dateLabel}</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <MapPin className="h-6 w-6 text-[#D96B27] shrink-0" />
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
            <h2 className="font-serif text-xl font-bold text-[#D96B27]">Kartu Hadiah</h2>
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
            initial={disableHeavyAnim ? false : { opacity: 0, y: 20 }}
            whileInView={disableHeavyAnim ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-4"
          >
            <h2 className="font-serif text-xl font-bold text-[#D96B27]">Ucapan &amp; Doa Restu</h2>
            <WishesForm
              slug={invitation.slug}
              guestName={guest?.name}
              token={guest?.slug_token}
              themeId="70s-warm-groovy"
            />
            {wishes && wishes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {wishes.map((wish) => (
                  <article key={wish.id} className="rounded-2xl border border-[#EBB035] bg-[#FFF2D0] p-4 shadow-sm">
                    <p className="font-sans text-xs font-bold text-[#D96B27]">{wish.guest.name}</p>
                    <p className="mt-1 font-sans text-xs text-[#3A2418]">{wish.wish_message}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-[#D96B27]/40 p-4 text-center text-xs text-[#3A2418]/60">
                Belum ada ucapan.
              </div>
            )}
          </motion.section>

          {/* QR Check-in */}
          <motion.section
            initial={disableHeavyAnim ? false : { opacity: 0, y: 20 }}
            whileInView={disableHeavyAnim ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
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

function WavyDivider({ disableHeavyAnim }: { disableHeavyAnim: boolean }) {
  return (
    <div className="my-3 flex justify-center">
      <svg className="h-4 w-32 text-[#D96B27]" viewBox="0 0 100 20" fill="none">
        <path
          d="M 0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={disableHeavyAnim ? undefined : "120"}
          strokeDashoffset={disableHeavyAnim ? undefined : "0"}
        />
      </svg>
    </div>
  );
}
