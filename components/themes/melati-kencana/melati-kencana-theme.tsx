"use client";

import { FloralTheme } from "@/components/themes/floral/floral-theme";
import type { FloralThemeConfig, Guest, Invitation, Wish } from "@/components/themes/floral/types";
import { melatiFonts } from "./fonts";
import { MelatiCorner, MelatiDivider } from "./ornaments";
import { MelatiCoverAnimation } from "./melati-cover";

export const melatiKencanaConfig: FloralThemeConfig = {
  id: "melati-kencana",
  palette: {
    bg: "#FFFCF5",
    surface: "#FBF3E4",
    text: "#5C1A1A",
    muted: "rgba(92,26,26,0.65)",
    accent: "#B8860B",
    accentText: "#3A1212",
    accentStrong: "#8A6508",
    border: "rgba(184,134,11,0.35)",
  },
  headerFontFamily: melatiFonts.header,
  bodyFontFamily: melatiFonts.body,
  copy: {
    coverTagline: "Dengan penuh sukacita kami mengundang Anda ke pernikahan kami",
    coverQuote: "Cinta yang tumbuh seperti melati — sederhana, wangi, dan setia.",
    galleryTitle: "Galeri Kencana",
    profileTitle: "Mempelai",
    scheduleTitle: "Waktu & Tempat",
    bankTitle: "Hadiah & Tanda Kasih",
    wishesTitle: "Doa & Ucapan",
    nav: { gallery: "Galeri", profile: "Mempelai", schedule: "Jadwal", gift: "Hadiah" },
  },
  OrnamentCorner: MelatiCorner,
  OrnamentDivider: MelatiDivider,
  CoverAnimation: MelatiCoverAnimation,
};

export function MelatiKencanaTheme({
  invitation,
  guest,
  wishes,
  preview,
}: {
  invitation: Invitation;
  guest?: Guest | null;
  wishes?: Wish[];
  preview?: boolean;
}) {
  return (
    <FloralTheme
      invitation={invitation}
      guest={guest}
      wishes={wishes}
      config={melatiKencanaConfig}
      preview={preview}
    />
  );
}
