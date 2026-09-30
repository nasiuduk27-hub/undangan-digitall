import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FloralTheme } from "@/components/themes/floral/floral-theme";
import type { FloralThemeConfig, Guest, Invitation, Wish } from "@/components/themes/floral/types";
import { FLORAL_THEME_IDS } from "@/lib/theme-style";
import { MelatiCoverAnimation } from "@/components/themes/melati-kencana/melati-cover";
import { MelatiCorner, MelatiDivider } from "@/components/themes/melati-kencana/ornaments";
import { SekarCoverAnimation } from "@/components/themes/sekar-jagad-nusantara/sekar-cover";
import { SekarCorner, SekarDivider } from "@/components/themes/sekar-jagad-nusantara/ornaments";
import { MawarCoverAnimation } from "@/components/themes/mawar-blush/mawar-cover";
import { MawarCorner, MawarDivider } from "@/components/themes/mawar-blush/ornaments";
import { PadangCoverAnimation } from "@/components/themes/padang-bunga-liar/padang-cover";
import { PadangCorner, PadangDivider } from "@/components/themes/padang-bunga-liar/ornaments";
import { AnggrekCoverAnimation } from "@/components/themes/anggrek-bulan-elegan/anggrek-cover";
import { AnggrekCorner, AnggrekDivider } from "@/components/themes/anggrek-bulan-elegan/ornaments";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  sessionStorage.clear();
});

const PARTS: Record<
  string,
  { corner: FloralThemeConfig["OrnamentCorner"]; divider: FloralThemeConfig["OrnamentDivider"]; cover: FloralThemeConfig["CoverAnimation"] }
> = {
  "melati-kencana": { corner: MelatiCorner, divider: MelatiDivider, cover: MelatiCoverAnimation },
  "sekar-jagad-nusantara": { corner: SekarCorner, divider: SekarDivider, cover: SekarCoverAnimation },
  "mawar-blush": { corner: MawarCorner, divider: MawarDivider, cover: MawarCoverAnimation },
  "padang-bunga-liar": { corner: PadangCorner, divider: PadangDivider, cover: PadangCoverAnimation },
  "anggrek-bulan-elegan": { corner: AnggrekCorner, divider: AnggrekDivider, cover: AnggrekCoverAnimation },
};

function makeConfig(id: string): FloralThemeConfig {
  const parts = PARTS[id];
  return {
    id,
    palette: {
      bg: "#FFFFFF",
      surface: "#F5F5F5",
      text: "#222222",
      muted: "rgba(0,0,0,0.6)",
      accent: "#999999",
      accentText: "#ffffff",
      accentStrong: "#555555",
      border: "rgba(0,0,0,0.2)",
    },
    headerFontFamily: "serif",
    bodyFontFamily: "sans-serif",
    copy: {
      coverTagline: "Tagline cover",
      coverQuote: "Quote cover",
      galleryTitle: "Galeri Test",
      profileTitle: "Mempelai Test",
      scheduleTitle: "Jadwal Test",
      bankTitle: "Rekening Test",
      wishesTitle: "Ucapan Test",
      nav: { gallery: "Galeri", profile: "Mempelai", schedule: "Jadwal", gift: "Hadiah" },
    },
    OrnamentCorner: parts.corner,
    OrnamentDivider: parts.divider,
    CoverAnimation: parts.cover,
  };
}

const invitation: Invitation = {
  slug: "pratinjau",
  theme_id: "melati-kencana",
  groom_name: "Rian",
  bride_name: "Sarah",
  event_date: new Date("2026-12-20T10:00:00.000Z"),
  location: "Jakarta",
  media_assets: [
    { id: "m1", type: "photo", url: "/a.jpg", status: "ready" },
    { id: "m2", type: "photo", url: "/b.jpg", status: "ready" },
    { id: "v1", type: "video", url: "/v.mp4", status: "ready" },
    { id: "a1", type: "audio", url: "/a.mp3", status: "ready" },
  ],
  bank_accounts: [
    {
      id: "b1",
      bank_code: "bca",
      account_number: "1234567890",
      account_holder: "Rian",
      bank: { name: "Bank Central Asia (BCA)", logo_url: "/banks/bca.png" },
    },
  ],
};

const guest: Guest = { name: "Budi", slug_token: "token-1", rsvp: null };
const wishes: Wish[] = [
  { id: "w1", wish_message: "Selamat menempuh hidup baru", guest: { name: "Anita" } },
];

describe.each(FLORAL_THEME_IDS)("Kontrak Portabilitas Tema — %s", (themeId) => {
  it("merender seluruh slot wajib dalam layout mobile & desktop", () => {
    render(
      <FloralTheme
        invitation={{ ...invitation, theme_id: themeId }}
        guest={guest}
        wishes={wishes}
        config={makeConfig(themeId)}
        preview
      />
    );

    // Cover / Gate + tombol buka (audio mulai via tombol ini)
    expect(screen.getAllByRole("button", { name: "Buka Undangan" }).length).toBeGreaterThan(0);
    // Audio control
    expect(document.querySelector("audio")).toBeTruthy();
    // Jadwal
    expect(screen.getByText("Jadwal Test")).toBeInTheDocument();
    // Profil
    expect(screen.getByText("Mempelai Test")).toBeInTheDocument();
    // Galeri
    expect(screen.getByText("Galeri Test")).toBeInTheDocument();
    // Rekening
    expect(screen.getByText("Rekening Test")).toBeInTheDocument();
    expect(screen.getByText("Nomor Rekening")).toBeInTheDocument();
    // Ucapan + form
    expect(screen.getByText("Ucapan Test")).toBeInTheDocument();
    expect(screen.getByText("Tulis Ucapan & Doa")).toBeInTheDocument();
    expect(screen.getByText(/Daftar Ucapan/)).toBeInTheDocument();
    // RSVP (Quick RSVP dock) + QR check-in
    expect(screen.getAllByText("Hadir").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Buka Barcode Tamu" })).toBeInTheDocument();
  });

  it("menyembunyikan animasi buka setelah pernah dibuka (sessionStorage)", () => {
    sessionStorage.setItem(`undangan:opened:${themeId}`, "1");
    render(<FloralTheme invitation={invitation} guest={guest} wishes={wishes} config={makeConfig(themeId)} />);
    expect(screen.queryByRole("button", { name: "Buka Undangan" })).not.toBeInTheDocument();
  });

  it("selalu memutar animasi di mode preview", () => {
    sessionStorage.setItem(`undangan:opened:${themeId}`, "1");
    render(
      <FloralTheme invitation={invitation} guest={guest} wishes={wishes} config={makeConfig(themeId)} preview />
    );
    expect(screen.getAllByRole("button", { name: "Buka Undangan" }).length).toBeGreaterThan(0);
  });
});
