"use client";

import { FloralTheme } from "@/components/themes/floral/floral-theme";
import type { FloralThemeConfig, Guest, Invitation, Wish } from "@/components/themes/floral/types";
import { sekarFonts } from "./fonts";
import { SekarCorner, SekarDivider } from "./ornaments";
import { SekarCoverAnimation } from "./sekar-cover";

export const sekarJagadConfig: FloralThemeConfig = {
  id: "sekar-jagad-nusantara",
  palette: {
    bg: "#FAF3E8",
    surface: "#F3E7D0",
    text: "#5A1E1E",
    muted: "rgba(90,30,30,0.65)",
    accent: "#8B2E2E",
    accentText: "#FAF3E8",
    accentStrong: "#8B2E2E",
    border: "rgba(201,163,78,0.5)",
  },
  headerFontFamily: sekarFonts.header,
  bodyFontFamily: sekarFonts.body,
  copy: {
    coverTagline: "Dengan adat dan doa, kami mengundang Anda ke hari bahagia kami",
    coverQuote: "Seperti kain jagad, hidup kami ditenun dari doa dan restu.",
    galleryTitle: "Galeri Sekar",
    profileTitle: "Mempelai",
    scheduleTitle: "Waktu & Tempat",
    bankTitle: "Tanda Kasih",
    wishesTitle: "Doa & Ucapan",
    nav: { gallery: "Galeri", profile: "Mempelai", schedule: "Jadwal", gift: "Hadiah" },
  },
  OrnamentCorner: SekarCorner,
  OrnamentDivider: SekarDivider,
  CoverAnimation: SekarCoverAnimation,
};

export function SekarJagadNusantaraTheme({
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
      config={sekarJagadConfig}
      preview={preview}
    />
  );
}
