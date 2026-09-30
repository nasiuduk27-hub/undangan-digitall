import { PrismaClient } from "@prisma/client";
import { THEME_PRESETS } from "../lib/themes";

const prisma = new PrismaClient();

const FLORAL_THEME_IDS = [
  "melati-kencana",
  "sekar-jagad-nusantara",
  "mawar-blush",
  "padang-bunga-liar",
  "anggrek-bulan-elegan",
] as const;

async function main() {
  for (const id of FLORAL_THEME_IDS) {
    const preset = THEME_PRESETS[id];
    const data = {
      name: preset.name,
      category: preset.category,
      is_premium: preset.is_premium,
      config_json: JSON.parse(JSON.stringify(preset.config_json)),
      preview_thumbnail_url: `/themes/${id}.svg`,
    };

    await prisma.theme.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });

    console.log(`✓ ${preset.name} (${id})`);
  }

  console.log(`\nSeeded ${FLORAL_THEME_IDS.length} tema Klasik/Adat.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
