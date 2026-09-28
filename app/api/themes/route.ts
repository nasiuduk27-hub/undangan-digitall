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
  ];

  return NextResponse.json(themes);
}
