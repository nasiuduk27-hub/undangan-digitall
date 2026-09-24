"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export function AudioControl({
  audioUrl,
  desktopClassName,
  label = "Audio",
}: {
  audioUrl?: string | null;
  desktopClassName?: string;
  label?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  if (!audioUrl) return null;

  const toggle = async () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop />

      {/* Floating Dock - Mobile Only */}
      <div className="fixed bottom-5 right-5 z-dock lg:hidden">
        <button
          type="button"
          onClick={toggle}
          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-black bg-[#D8FB38] text-black shadow-[4px_4px_0_#121212] transition hover:scale-105 active:translate-y-0.5"
          aria-label={playing ? "Pause audio" : "Play audio"}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop Audio Control Button inside Sticky Top Nav */}
      <button
        type="button"
        onClick={toggle}
        className={
          desktopClassName ||
          "hidden lg:inline-flex items-center gap-2 border-2 border-current px-3 py-1 text-xs font-mono font-bold uppercase transition hover:opacity-80"
        }
        aria-label={playing ? "Pause audio" : "Play audio"}
      >
        {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        <span>{playing ? "Pause" : "Play"} {label}</span>
      </button>
    </>
  );
}
