"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export function AudioControl({ audioUrl }: { audioUrl?: string | null }) {
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

    await audioRef.current.play();
    setPlaying(true);
  };

  return (
    <div className="fixed bottom-5 right-1/2 z-dock translate-x-[232px] max-[520px]:right-5 max-[520px]:translate-x-0">
      <audio ref={audioRef} src={audioUrl} loop />
      <button
        type="button"
        onClick={toggle}
        className="flex h-11 w-11 items-center justify-center border-2 border-black bg-[#D8FB38] text-black shadow-[4px_4px_0_#121212]"
        aria-label={playing ? "Pause audio" : "Play audio"}
      >
        {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </button>
    </div>
  );
}
