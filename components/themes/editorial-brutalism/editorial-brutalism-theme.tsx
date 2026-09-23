import { AudioControl } from "@/components/shared/audio-control";
import { BankCard } from "@/components/shared/bank-card";
import { QrCheckinCard } from "@/components/shared/qr-checkin-card";
import { QrCheckinPlaceholder } from "@/components/shared/qr-checkin-placeholder";
import { RsvpForm } from "@/components/shared/rsvp-form";
import { RsvpPlaceholder } from "@/components/shared/rsvp-placeholder";
import { CalendarDays, MapPin } from "lucide-react";
import type { CSSProperties } from "react";

const THEME_SKINS = {
  "editorial-brutalism": {
    bg: "#F4EFEA",
    text: "#121212",
    accent: "#D8FB38",
    card: "#FFFFFF",
    muted: "rgba(18,18,18,0.7)",
    intro: "Brutal, honest, and joyfully loud. A digital wedding invitation built for mobile first.",
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
      <AudioControl audioUrl={audio?.url} />

      {/* Cover / Gate - wajib */}
      <section className="flex min-h-screen flex-col justify-between border-x-2 border-[var(--theme-text)] bg-[var(--theme-bg)] p-5">
        <div className="flex justify-between border-b-2 border-[var(--theme-text)] pb-3 font-mono text-xs font-bold uppercase tracking-[0.18em]">
          <span>Wedding Invite</span>
          <span>{guestName ? `To: ${guestName}` : "Public"}</span>
        </div>
        <div className="py-16">
          <p className="inline-block border-2 border-[var(--theme-text)] bg-[var(--theme-accent)] px-3 py-1 font-mono text-xs font-bold uppercase text-[var(--theme-text)] shadow-[4px_4px_0_var(--theme-text)]">
            You are invited
          </p>
          <h1 className="mt-6 text-[clamp(3rem,17vw,5.5rem)] font-black uppercase leading-[0.82] tracking-[-0.08em]">
            {invitation.groom_name}
            <br />&<br />
            {invitation.bride_name}
          </h1>
          <p className="mt-6 max-w-sm border-l-4 border-[var(--theme-text)] pl-4 font-mono text-sm uppercase leading-relaxed text-[var(--theme-muted)]">
            {skin.intro}
          </p>
        </div>
        <a
          href="#schedule"
          className="min-h-11 border-2 border-[var(--theme-text)] bg-[var(--theme-text)] px-4 py-3 text-center font-mono text-sm font-bold uppercase text-[var(--theme-bg)] shadow-[6px_6px_0_var(--theme-accent)]"
        >
          Buka Undangan
        </a>
      </section>

      <div className="space-y-8 border-x-2 border-[var(--theme-text)] px-5 py-8">
        {/* Galeri Media - wajib, boleh empty */}
        <section className="space-y-4">
          <ThemeHeading number="01" title="Galeri Media" />
          {video && (
            <video
              src={video.url}
              controls
              className="aspect-[9/16] w-full border-2 border-[var(--theme-text)] bg-black object-cover shadow-[6px_6px_0_var(--theme-text)]"
            />
          )}
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo, index) => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt={`Foto ${index + 1}`}
                  className={`border-2 border-[var(--theme-text)] object-cover shadow-[4px_4px_0_var(--theme-text)] ${
                    index === 0 ? "col-span-2 aspect-[4/5]" : "aspect-square"
                  }`}
                />
              ))}
            </div>
          ) : (
            <EmptySlot text="Galeri akan muncul setelah foto diunggah." />
          )}
        </section>

        {/* Cerita / Profil Pasangan - wajib, boleh hidden; placeholder dulu */}
        <section className="border-2 border-[var(--theme-text)] bg-[var(--theme-card)] p-5 shadow-[6px_6px_0_var(--theme-text)]">
          <ThemeHeading number="02" title="Profil Pasangan" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ProfileBox name={invitation.groom_name} label="Mempelai Pria" />
            <ProfileBox name={invitation.bride_name} label="Mempelai Wanita" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[var(--theme-muted)]">
            Cerita pasangan dan detail profil akan dilengkapi pada editor konten berikutnya.
          </p>
        </section>

        {/* Jadwal Acara - wajib */}
        <section id="schedule" className="border-2 border-[var(--theme-text)] bg-[var(--theme-accent)] p-5 text-[var(--theme-text)] shadow-[6px_6px_0_var(--theme-text)]">
          <ThemeHeading number="03" title="Jadwal Acara" />
          <div className="mt-5 space-y-4 font-mono text-sm font-bold uppercase">
            <div className="flex gap-3">
              <CalendarDays className="h-5 w-5 shrink-0" />
              <span>{dateLabel} WIB</span>
            </div>
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0" />
              <span>{invitation.location || "Lokasi akan segera diumumkan"}</span>
            </div>
          </div>
        </section>

        {/* Kartu Rekening - wajib, boleh hidden jika kosong */}
        <section className="space-y-4">
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
        </section>

        {/* RSVP - wajib */}
        {guest ? (
          <RsvpForm
            slug={invitation.slug}
            token={guest.slug_token}
            guestName={guest.name}
            initialStatus={guest.rsvp?.attendance_status}
            initialPax={guest.rsvp?.pax_count}
            initialWish={guest.rsvp?.wish_message}
          />
        ) : (
          <RsvpPlaceholder guestName={guestName} />
        )}

        {/* Ucapan / Wishes - wajib */}
        <section className="border-2 border-[var(--theme-text)] bg-[var(--theme-card)] p-5 shadow-[6px_6px_0_var(--theme-text)]">
          <ThemeHeading number="06" title="Ucapan" />
          {wishes && wishes.length > 0 ? (
            <div className="mt-4 space-y-3">
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
        </section>

        {/* QR Check-in - wajib */}
        {guest ? (
          <QrCheckinCard slug={invitation.slug} token={guest.slug_token} />
        ) : (
          <QrCheckinPlaceholder />
        )}
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
    <div className="border-2 border-[var(--theme-text)] bg-[var(--theme-bg)] p-3">
      <p className="font-mono text-[10px] font-bold uppercase text-[var(--theme-muted)]">{label}</p>
      <p className="mt-2 text-xl font-black uppercase leading-none">{name}</p>
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
