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
} as const;

export function getThemePreset(themeId: string) {
  return THEME_PRESETS[themeId as keyof typeof THEME_PRESETS] || null;
}
