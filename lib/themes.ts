export const THEME_PRESETS = {
  "editorial-brutalism": {
    name: "Editorial Brutalism",
    category: "Modern / Bold",
    is_premium: false,
    config_json: {
      palette: ["#F4EFEA", "#121212", "#D8FB38"],
      fontHeader: "Syne ExtraBold",
      fontBody: "Space Mono",
    },
  },
  "raw-wabi-sabi": {
    name: "Raw Wabi-Sabi",
    category: "Organic / Elegant",
    is_premium: false,
    config_json: {
      palette: ["#EBE5DC", "#A85A3C", "#BFA054"],
      fontHeader: "Garamond",
      fontBody: "Plus Jakarta Sans",
    },
  },
  "cyber-celestial-noir": {
    name: "Cyber-Celestial Noir",
    category: "Dark / Futuristic",
    is_premium: false,
    config_json: {
      palette: ["#0C0E14", "#00F5D4", "#7B2CBF"],
      fontHeader: "Cinzel",
      fontBody: "Outfit",
    },
  },
  "70s-warm-groovy": {
    name: "70s Warm Groovy",
    category: "Retro / Warm",
    is_premium: false,
    config_json: {
      palette: ["#FDF8EE", "#D96B27", "#EBB035"],
      fontHeader: "Fraunces",
      fontBody: "DM Sans",
    },
  },
  "melati-kencana": {
    name: "Melati Kencana",
    category: "Klasik-Adat",
    is_premium: false,
    config_json: {
      palette: ["#FFFCF5", "#B8860B", "#5C1A1A"],
      fontHeader: "Playfair Display",
      fontBody: "Lora",
    },
  },
  "sekar-jagad-nusantara": {
    name: "Sekar Jagad Nusantara",
    category: "Klasik-Adat",
    is_premium: false,
    config_json: {
      palette: ["#FAF3E8", "#8B2E2E", "#C9A34E"],
      fontHeader: "Cormorant",
      fontBody: "Plus Jakarta Sans",
    },
  },
  "mawar-blush": {
    name: "Mawar Blush",
    category: "Klasik-Adat",
    is_premium: false,
    config_json: {
      palette: ["#FFF6F4", "#E8A5A5", "#7A9A7E"],
      fontHeader: "Cormorant Garamond",
      fontBody: "Nunito Sans",
    },
  },
  "padang-bunga-liar": {
    name: "Padang Bunga Liar",
    category: "Klasik-Adat",
    is_premium: false,
    config_json: {
      palette: ["#F7F3E8", "#8FA37E", "#E0B44C"],
      fontHeader: "Libre Baskerville",
      fontBody: "Karla",
    },
  },
  "anggrek-bulan-elegan": {
    name: "Anggrek Bulan Elegan",
    category: "Klasik-Adat",
    is_premium: false,
    config_json: {
      palette: ["#FBFAF7", "#1F4D3A", "#C6A75E"],
      fontHeader: "Bodoni Moda",
      fontBody: "Lato",
    },
  },
} as const;

export function getThemePreset(themeId: string) {
  return THEME_PRESETS[themeId as keyof typeof THEME_PRESETS] || null;
}
