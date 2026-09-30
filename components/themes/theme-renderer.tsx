"use client";

import dynamic from "next/dynamic";

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

const loading = () => <div className="min-h-screen bg-[#faf7f2]" />;

// Kode tema dipecah per tema (code-split) supaya font & GSAP hanya dimuat
// untuk tema yang benar-benar dipakai.
const EditorialBrutalismTheme = dynamic(
  () => import("@/components/themes/editorial-brutalism/editorial-brutalism-theme").then((m) => m.EditorialBrutalismTheme),
  { ssr: false, loading }
);
const RawWabiSabiTheme = dynamic(
  () => import("@/components/themes/raw-wabi-sabi/raw-wabi-sabi-theme").then((m) => m.RawWabiSabiTheme),
  { ssr: false, loading }
);
const CyberCelestialNoirTheme = dynamic(
  () => import("@/components/themes/cyber-celestial-noir/cyber-celestial-noir-theme").then((m) => m.CyberCelestialNoirTheme),
  { ssr: false, loading }
);
const Groovy70sTheme = dynamic(
  () => import("@/components/themes/70s-warm-groovy/groovy-theme").then((m) => m.Groovy70sTheme),
  { ssr: false, loading }
);
const MelatiKencanaTheme = dynamic(
  () => import("@/components/themes/melati-kencana/melati-kencana-theme").then((m) => m.MelatiKencanaTheme),
  { ssr: false, loading }
);
const SekarJagadNusantaraTheme = dynamic(
  () => import("@/components/themes/sekar-jagad-nusantara/sekar-jagad-nusantara-theme").then((m) => m.SekarJagadNusantaraTheme),
  { ssr: false, loading }
);
const MawarBlushTheme = dynamic(
  () => import("@/components/themes/mawar-blush/mawar-blush-theme").then((m) => m.MawarBlushTheme),
  { ssr: false, loading }
);
const PadangBungaLiarTheme = dynamic(
  () => import("@/components/themes/padang-bunga-liar/padang-bunga-liar-theme").then((m) => m.PadangBungaLiarTheme),
  { ssr: false, loading }
);
const AnggrekBulanEleganTheme = dynamic(
  () => import("@/components/themes/anggrek-bulan-elegan/anggrek-bulan-elegan-theme").then((m) => m.AnggrekBulanEleganTheme),
  { ssr: false, loading }
);

export function ThemeRenderer({
  invitation,
  guest,
  wishes,
  preview = false,
}: {
  invitation: Invitation;
  guest?: Guest | null;
  wishes?: Wish[];
  preview?: boolean;
}) {
  switch (invitation.theme_id) {
    case "raw-wabi-sabi":
      return <RawWabiSabiTheme invitation={invitation} guest={guest} wishes={wishes} />;
    case "cyber-celestial-noir":
      return <CyberCelestialNoirTheme invitation={invitation} guest={guest} wishes={wishes} />;
    case "70s-warm-groovy":
      return <Groovy70sTheme invitation={invitation} guest={guest} wishes={wishes} />;
    case "melati-kencana":
      return <MelatiKencanaTheme invitation={invitation} guest={guest} wishes={wishes} preview={preview} />;
    case "sekar-jagad-nusantara":
      return <SekarJagadNusantaraTheme invitation={invitation} guest={guest} wishes={wishes} preview={preview} />;
    case "mawar-blush":
      return <MawarBlushTheme invitation={invitation} guest={guest} wishes={wishes} preview={preview} />;
    case "padang-bunga-liar":
      return <PadangBungaLiarTheme invitation={invitation} guest={guest} wishes={wishes} preview={preview} />;
    case "anggrek-bulan-elegan":
      return <AnggrekBulanEleganTheme invitation={invitation} guest={guest} wishes={wishes} preview={preview} />;
    case "editorial-brutalism":
    default:
      return <EditorialBrutalismTheme invitation={invitation} guest={guest} wishes={wishes} />;
  }
}
