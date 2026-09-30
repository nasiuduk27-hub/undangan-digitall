"use client";

import { FloralTheme } from "@/components/themes/floral/floral-theme";
import type { FloralThemeConfig, Guest, Invitation, Wish } from "@/components/themes/floral/types";
import { mawarFonts } from "./fonts";
import { MawarCorner, MawarDivider } from "./ornaments";
import { MawarCoverAnimation } from "./mawar-cover";

export const mawarBlushConfig: FloralThemeConfig = {
  id: "mawar-blush",
  palette: {
    bg: "#FFF6F4",
    surface: "#FCE9E6",
    text: "#556B4E",
    muted: "rgba(85,107,78,0.7)",
    accent: "#E8A5A5",
    accentText: "#4A2E33",
    accentStrong: "#A8555A",
    border: "rgba(232,165,165,0.5)",
  },
  headerFontFamily: mawarFonts.header,
  bodyFontFamily: mawarFonts.body,
  copy: {
    coverTagline: "Dengan cinta yang hangat, kami mengundang Anda ke pernikahan kami",
    coverQuote: "Cinta itu seperti mawar — lembut, hangat, dan tumbuh subur bila dirawat.",
    galleryTitle: "Galeri Blush",
    profileTitle: "Mempelai",
    scheduleTitle: "Waktu & Tempat",
    bankTitle: "Tanda Kasih",
    wishesTitle: "Doa & Ucapan",
    nav: { gallery: "Galeri", profile: "Mempelai", schedule: "Jadwal", gift: "Hadiah" },
  },
  OrnamentCorner: MawarCorner,
  OrnamentDivider: MawarDivider,
  CoverAnimation: MawarCoverAnimation,
};

export function MawarBlushTheme({
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
      config={mawarBlushConfig}
      preview={preview}
    />
  );
}
