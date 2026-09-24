"use client";

import { Monitor, Smartphone } from "lucide-react";

export type PreviewMode = "desktop" | "mobile";

export function PreviewToggle({
  mode,
  onChange,
}: {
  mode: PreviewMode;
  onChange: (mode: PreviewMode) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-xl bg-[#e7ddd0]/60 p-1 shadow-inner border border-[#e7ddd0]">
      <button
        type="button"
        onClick={() => onChange("desktop")}
        className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
          mode === "desktop"
            ? "bg-white text-[#2b2420] shadow-sm ring-1 ring-black/5"
            : "text-[#7a6f63] hover:text-[#2b2420]"
        }`}
      >
        <Monitor className="h-4 w-4 text-[#a9724f]" />
        <span>Desktop</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("mobile")}
        className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
          mode === "mobile"
            ? "bg-white text-[#2b2420] shadow-sm ring-1 ring-black/5"
            : "text-[#7a6f63] hover:text-[#2b2420]"
        }`}
      >
        <Smartphone className="h-4 w-4 text-[#a9724f]" />
        <span>Mobile (iPhone)</span>
      </button>
    </div>
  );
}
