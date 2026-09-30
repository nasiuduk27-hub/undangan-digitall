"use client";

import { FloralTheme } from "@/components/themes/floral/floral-theme";
import type { FloralThemeConfig, Guest, Invitation, Wish } from "@/components/themes/floral/types";
import { anggrekFonts } from "./fonts";
import { AnggrekCorner, AnggrekDivider } from "./ornaments";
import { AnggrekCoverAnimation } from "./anggrek-cover";

export const anggrekBulanConfig: FloralThemeConfig = {
  id: "anggrek-bulan-elegan",
  palette: {
    bg: "#FBFAF7",
    surface: "#F1EFE7",
    text: "#1F4D3A",
    muted: "rgba(31,77,58,0.7)",
    accent: "#C6A75E",
    accentText: "#14352A",
    accentStrong: "#8A6D2F",
    border: "rgba(198,167,94,0.5)",
  },
  headerFontFamily: anggrekFonts.header,
  bodyFontFamily: anggrekFonts.body,
  copy: {
    coverTagline: "Dengan penuh kehormatan, kami mengundang Anda ke pernikahan kami",
    coverQuote: "Anggrek bulan mekar tenang — begitulah cinta yang matang dan setia.",
    galleryTitle: "Galeri Anggrek",
    profileTitle: "Mempelai",
    scheduleTitle: "Waktu & Tempat",
    bankTitle: "Tanda Kasih",
    wishesTitle: "Doa & Ucapan",
    nav: { gallery: "Galeri", profile: "Mempelai", schedule: "Jadwal", gift: "Hadiah" },
  },
  OrnamentCorner: AnggrekCorner,
  OrnamentDivider: AnggrekDivider,
  CoverAnimation: AnggrekCoverAnimation,
};

export function AnggrekBulanEleganTheme({
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
      config={anggrekBulanConfig}
      preview={preview}
    />
  );
}
