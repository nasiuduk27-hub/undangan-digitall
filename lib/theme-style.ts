export const FLORAL_THEME_IDS = [
  "melati-kencana",
  "sekar-jagad-nusantara",
  "mawar-blush",
  "padang-bunga-liar",
  "anggrek-bulan-elegan",
] as const;

export type FloralThemeId = (typeof FLORAL_THEME_IDS)[number];

export function isFloralTheme(id?: string | null): id is FloralThemeId {
  return !!id && (FLORAL_THEME_IDS as readonly string[]).includes(id);
}

export type FloralAccent = {
  accent: string;
  accentText: string;
  surface: string;
  text: string;
  border: string;
};

export const FLORAL_ACCENTS: Record<FloralThemeId, FloralAccent> = {
  "melati-kencana": {
    accent: "#B8860B",
    accentText: "#FFFCF5",
    surface: "#FFFCF5",
    text: "#5C1A1A",
    border: "rgba(184,134,11,0.35)",
  },
  "sekar-jagad-nusantara": {
    accent: "#8B2E2E",
    accentText: "#FAF3E8",
    surface: "#FAF3E8",
    text: "#8B2E2E",
    border: "rgba(201,163,78,0.5)",
  },
  "mawar-blush": {
    accent: "#E8A5A5",
    accentText: "#4A2E33",
    surface: "#FFF6F4",
    text: "#6E8168",
    border: "rgba(232,165,165,0.5)",
  },
  "padang-bunga-liar": {
    accent: "#E0B44C",
    accentText: "#3F4A32",
    surface: "#F7F3E8",
    text: "#6F8460",
    border: "rgba(143,163,126,0.5)",
  },
  "anggrek-bulan-elegan": {
    accent: "#C6A75E",
    accentText: "#FBFAF7",
    surface: "#FBFAF7",
    text: "#1F4D3A",
    border: "rgba(198,167,94,0.5)",
  },
};

export function getFloralAccent(id?: string | null): FloralAccent | null {
  return isFloralTheme(id) ? FLORAL_ACCENTS[id] : null;
}
