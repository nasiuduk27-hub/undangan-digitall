"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAnimSettings } from "@/lib/use-anim-settings";

export type GatePhase = "gate" | "opening" | "open";

export function useFloralGate(themeId: string, preview = false) {
  const { disableHeavyAnim } = useAnimSettings();
  const audioRef = useRef<HTMLAudioElement>(null);
  const storageKey = `undangan:opened:${themeId}`;
  const [phase, setPhase] = useState<GatePhase>(() => {
    if (preview || typeof window === "undefined") return "gate";
    try {
      return sessionStorage.getItem(storageKey) ? "open" : "gate";
    } catch {
      return "gate";
    }
  });

  useEffect(() => {
    if (preview) return;
    try {
      if (sessionStorage.getItem(storageKey)) setPhase("open");
    } catch {
      // ignore storage access errors (private mode)
    }
  }, [preview, storageKey]);

  const markOpened = useCallback(() => {
    if (preview) return;
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // ignore
    }
  }, [preview, storageKey]);

  const open = useCallback(() => {
    audioRef.current?.play().catch(() => {});
    markOpened();
    setPhase("opening");
  }, [markOpened]);

  const skip = useCallback(() => {
    markOpened();
    setPhase("open");
  }, [markOpened]);

  const finish = useCallback(() => setPhase("open"), []);

  return {
    phase,
    isOpened: phase !== "gate",
    disableHeavyAnim,
    audioRef,
    open,
    skip,
    finish,
  };
}
