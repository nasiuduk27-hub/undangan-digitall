import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { THEME_PRESETS } from "@/lib/themes";

export const revalidate = 3600; // Cache 1 hour for SSG/ISR performance

export async function GET() {
  try {
    const dbThemes = await prisma.theme.findMany({
      orderBy: { name: "asc" },
    });

    if (dbThemes.length > 0) {
      return NextResponse.json(dbThemes);
    }
  } catch {
    // Fallback if DB unavailable or empty
  }

  // Fallback to static theme presets matching PRD categories
  const themes = [
    {
      id: "editorial-brutalism",
      name: "Editorial Brutalism",
      category: "Non-Mainstream",
      is_premium: false,
      preview_thumbnail_url: null,
      config_json: THEME_PRESETS["editorial-brutalism"].config_json,
      description: "Border tegas 2px, shadow tanpa blur, grid asimetris, Syne + Space Mono",
    },
    {
      id: "raw-wabi-sabi",
      name: "Raw Wabi-Sabi",
      category: "Non-Mainstream",
      is_premium: false,
      preview_thumbnail_url: null,
      config_json: THEME_PRESETS["raw-wabi-sabi"].config_json,
      description: "Sudut organik tak beraturan, tekstur grain halus, Garamond + Plus Jakarta Sans",
    },
    {
      id: "cyber-celestial-noir",
      name: "Cyber-Celestial Noir",
      category: "Non-Mainstream",
      is_premium: true,
      preview_thumbnail_url: null,
      config_json: THEME_PRESETS["cyber-celestial-noir"].config_json,
      description: "Dark mode murni, glassmorphism, neon glow lembut, Cinzel + Outfit",
    },
    {
      id: "70s-warm-groovy",
      name: "70s Warm Groovy",
      category: "Klasik-Adat",
      is_premium: false,
      preview_thumbnail_url: null,
      config_json: THEME_PRESETS["70s-warm-groovy"].config_json,
      description: "Bentuk pil tebal, wavy divider, badge stempel vintage, Fraunces + DM Sans",
    },
    {
      id: "melati-kencana",
      name: "Melati Kencana",
      category: "Klasik-Adat",
      is_premium: false,
      preview_thumbnail_url: "/themes/melati-kencana.svg",
      config_json: THEME_PRESETS["melati-kencana"].config_json,
      description: "Bingkai bunga melati watercolor, garis emas tipis, monogram melingkar",
    },
    {
      id: "sekar-jagad-nusantara",
      name: "Sekar Jagad Nusantara",
      category: "Klasik-Adat",
      is_premium: false,
      preview_thumbnail_url: "/themes/sekar-jagad-nusantara.svg",
      config_json: THEME_PRESETS["sekar-jagad-nusantara"].config_json,
      description: "Motif batik sebagai border & divider, warna maroon-emas tradisional",
    },
    {
      id: "mawar-blush",
      name: "Mawar Blush",
      category: "Klasik-Adat",
      is_premium: false,
      preview_thumbnail_url: "/themes/mawar-blush.svg",
      config_json: THEME_PRESETS["mawar-blush"].config_json,
      description: "Karangan mawar blush pink dengan daun sage, nuansa romantis hangat",
    },
    {
      id: "padang-bunga-liar",
      name: "Padang Bunga Liar",
      category: "Klasik-Adat",
      is_premium: false,
      preview_thumbnail_url: "/themes/padang-bunga-liar.svg",
      config_json: THEME_PRESETS["padang-bunga-liar"].config_json,
      description: "Ilustrasi bunga liar tersebar organik, palet sage-krem-mustard",
    },
    {
      id: "anggrek-bulan-elegan",
      name: "Anggrek Bulan Elegan",
      category: "Klasik-Adat",
      is_premium: false,
      preview_thumbnail_url: "/themes/anggrek-bulan-elegan.svg",
      config_json: THEME_PRESETS["anggrek-bulan-elegan"].config_json,
      description: "Anggrek bulan putih, aksen garis emas, tata letak simetris formal",
    },
  ];

  return NextResponse.json(themes);
}
