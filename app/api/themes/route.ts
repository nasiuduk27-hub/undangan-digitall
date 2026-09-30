import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { THEME_PRESETS } from "@/lib/themes";

export const revalidate = 3600; // Cache 1 hour for SSG/ISR performance

// Kategori katalog hanya punya 2 filter (Non-Mainstream & Klasik-Adat).
const NON_MAINSTREAM_IDS = new Set([
  "editorial-brutalism",
  "raw-wabi-sabi",
  "cyber-celestial-noir",
]);

const THUMBNAILS: Record<string, string> = {
  "melati-kencana": "/themes/melati-kencana.svg",
  "sekar-jagad-nusantara": "/themes/sekar-jagad-nusantara.svg",
  "mawar-blush": "/themes/mawar-blush.svg",
  "padang-bunga-liar": "/themes/padang-bunga-liar.svg",
  "anggrek-bulan-elegan": "/themes/anggrek-bulan-elegan.svg",
};

const DESCRIPTIONS: Record<string, string> = {
  "editorial-brutalism": "Border tegas 2px, shadow tanpa blur, grid asimetris, Syne + Space Mono",
  "raw-wabi-sabi": "Sudut organik tak beraturan, tekstur grain halus, Garamond + Plus Jakarta Sans",
  "cyber-celestial-noir": "Dark mode murni, glassmorphism, neon glow lembut, Cinzel + Outfit",
  "70s-warm-groovy": "Bentuk pil tebal, wavy divider, badge stempel vintage, Fraunces + DM Sans",
  "melati-kencana": "Bingkai bunga melati watercolor, garis emas tipis, monogram melingkar",
  "sekar-jagad-nusantara": "Motif batik sebagai border & divider, warna maroon-emas tradisional",
  "mawar-blush": "Karangan mawar blush pink dengan daun sage, nuansa romantis hangat",
  "padang-bunga-liar": "Ilustrasi bunga liar tersebar organik, palet sage-krem-mustard",
  "anggrek-bulan-elegan": "Anggrek bulan putih, aksen garis emas, tata letak simetris formal",
};

export async function GET() {
  // Sumber kebenaran daftar tema adalah THEME_PRESETS (kode), bukan tabel DB.
  // DB hanya untuk metadata dinamis (thumbnail/premium) agar tema baru tetap muncul
  // walau belum di-seed.
  const dbById = new Map<string, { is_premium: boolean; preview_thumbnail_url: string | null }>();
  try {
    const rows = await prisma.theme.findMany();
    for (const row of rows) {
      dbById.set(row.id, {
        is_premium: row.is_premium,
        preview_thumbnail_url: row.preview_thumbnail_url,
      });
    }
  } catch {
    // DB tidak tersedia — tetap tampilkan seluruh preset.
  }

  const themes = Object.entries(THEME_PRESETS).map(([id, preset]) => {
    const db = dbById.get(id);
    return {
      id,
      name: preset.name,
      category: NON_MAINSTREAM_IDS.has(id) ? "Non-Mainstream" : "Klasik-Adat",
      is_premium: db?.is_premium ?? preset.is_premium,
      preview_thumbnail_url: db?.preview_thumbnail_url ?? THUMBNAILS[id] ?? null,
      config_json: preset.config_json,
      description: DESCRIPTIONS[id],
    };
  });

  return NextResponse.json(themes);
}
