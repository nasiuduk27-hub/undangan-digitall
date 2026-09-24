"use client";

import { useEffect, useState } from "react";

export interface AnimSettings {
  prefersReducedMotion: boolean;
  isSlowConnection: boolean;
  disableHeavyAnim: boolean;
}

export function useAnimSettings(): AnimSettings {
  const [settings, setSettings] = useState<AnimSettings>({
    prefersReducedMotion: false,
    isSlowConnection: false,
    disableHeavyAnim: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReducedMotion = mediaQuery.matches;

    // Check connection speed
    let isSlowConnection = false;
    const connection = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (connection) {
      if (connection.saveData || connection.effectiveType === "2g" || connection.effectiveType === "slow-2g") {
        isSlowConnection = true;
      }
    }

    setSettings({
      prefersReducedMotion,
      isSlowConnection,
      disableHeavyAnim: prefersReducedMotion || isSlowConnection,
    });

    const handleChange = (e: MediaQueryListEvent) => {
      setSettings((prev) => ({
        ...prev,
        prefersReducedMotion: e.matches,
        disableHeavyAnim: e.matches || prev.isSlowConnection,
      }));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return settings;
}
