import { describe, it, expect } from "vitest";
import { FLORAL_THEME_IDS, FLORAL_ACCENTS, isFloralTheme } from "@/lib/theme-style";
import { THEME_PRESETS, getThemePreset } from "@/lib/themes";

describe("Registrasi tema Klasik/Adat", () => {
  it("mendaftarkan tepat 5 tema floral", () => {
    expect(FLORAL_THEME_IDS).toHaveLength(5);
  });

  it("setiap tema floral punya preset & kategori Klasik-Adat", () => {
    for (const id of FLORAL_THEME_IDS) {
      const preset = getThemePreset(id);
      expect(preset, `${id} harus ada di THEME_PRESETS`).toBeTruthy();
      expect(preset?.category).toBe("Klasik-Adat");
      expect(preset?.config_json.palette).toHaveLength(3);
      expect(FLORAL_ACCENTS[id]).toBeTruthy();
      expect(isFloralTheme(id)).toBe(true);
    }
  });

  it("mengenali kategori tema", () => {
    expect(Object.keys(THEME_PRESETS).length).toBeGreaterThanOrEqual(9);
    expect(isFloralTheme("raw-wabi-sabi")).toBe(false);
  });
});
