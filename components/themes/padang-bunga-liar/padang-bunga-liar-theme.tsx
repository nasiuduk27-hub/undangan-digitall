"use client";

import { FloralTheme } from "@/components/themes/floral/floral-theme";
import type { FloralThemeConfig, Guest, Invitation, Wish } from "@/components/themes/floral/types";
import { padangFonts } from "./fonts";
import { PadangCorner, PadangDivider } from "./ornaments";
import { PadangCoverAnimation } from "./padang-cover";

export const padangBungaLiarConfig: FloralThemeConfig = {
  id: "padang-bunga-liar",
  palette: {
    bg: "#F7F3E8",
    surface: "#ECEEDC",
    text: "#5E6B4E",
    muted: "rgba(94,107,78,0.72)",
    accent: "#E0B44C",
    accentText: "#3F4A32",
    accentStrong: "#8A6D1F",
    border: "rgba(143,163,126,0.5)",
  },
  headerFontFamily: padangFonts.header,
  bodyFontFamily: padangFonts.body,
  copy: {
    coverTagline: "Mari tumbuh bersama kami di hari yang cerah ini",
    coverQuote: "Seperti padang bunga liar — bebas, hangat, dan penuh kehidupan.",
    galleryTitle: "Galeri Taman",
    profileTitle: "Mempelai",
    scheduleTitle: "Waktu & Tempat",
    bankTitle: "Tanda Kasih",
    wishesTitle: "Doa & Ucapan",
    nav: { gallery: "Galeri", profile: "Mempelai", schedule: "Jadwal", gift: "Hadiah" },
  },
  OrnamentCorner: PadangCorner,
  OrnamentDivider: PadangDivider,
  CoverAnimation: PadangCoverAnimation,
};

export function PadangBungaLiarTheme({
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
      config={padangBungaLiarConfig}
      preview={preview}
    />
  );
}
