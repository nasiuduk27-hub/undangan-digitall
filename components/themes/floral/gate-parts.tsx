"use client";

import type { FloralThemeConfig } from "./types";

export function FloralGateContent({
  config,
  groomName,
  brideName,
  guestName,
}: {
  config: FloralThemeConfig;
  groomName: string;
  brideName: string;
  guestName?: string | null;
}) {
  return (
    <div className="relative z-0 flex h-full w-full flex-col items-center justify-center px-6 text-center">
      <p
        className="text-[11px] uppercase tracking-[0.35em]"
        style={{ color: config.palette.accentStrong, fontFamily: config.bodyFontFamily }}
      >
        {guestName ? `Kepada: ${guestName}` : "Undangan Pernikahan"}
      </p>
      <h1
        className="mt-4 text-4xl leading-tight sm:text-5xl"
        style={{ fontFamily: config.headerFontFamily, color: config.palette.text }}
      >
        {groomName} <span style={{ color: config.palette.accent }}>&amp;</span> {brideName}
      </h1>
      <p
        className="mt-4 max-w-sm text-sm italic leading-relaxed opacity-80"
        style={{ color: config.palette.text, fontFamily: config.bodyFontFamily }}
      >
        {config.copy.coverTagline}
      </p>
    </div>
  );
}

export function FloralGateOpenButton({
  config,
  onOpen,
}: {
  config: FloralThemeConfig;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      className="pointer-events-auto min-h-12 rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide shadow-sm transition active:scale-95 touch-manipulation"
      style={{
        backgroundColor: config.palette.accent,
        color: config.palette.accentText,
        fontFamily: config.bodyFontFamily,
      }}
    >
      Buka Undangan
    </button>
  );
}

export function FloralGateSkipButton({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSkip();
      }}
      className="pointer-events-auto rounded-full border border-white/40 bg-black/20 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-black/30"
    >
      Lewati
    </button>
  );
}
