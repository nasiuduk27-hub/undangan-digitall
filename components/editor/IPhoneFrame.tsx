"use client";

import type { ReactNode } from "react";

export function IPhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto my-4 max-w-[420px] select-none">
      {/* Side Button - Power (Right) */}
      <div className="absolute -right-[13px] top-[140px] h-[50px] w-[5px] rounded-r-md bg-[#2b2420]" />

      {/* Side Buttons - Volume Up & Down (Left) */}
      <div className="absolute -left-[13px] top-[110px] h-[40px] w-[5px] rounded-l-md bg-[#2b2420]" />
      <div className="absolute -left-[13px] top-[165px] h-[40px] w-[5px] rounded-l-md bg-[#2b2420]" />

      {/* Outer Device Body */}
      <div className="relative overflow-hidden rounded-[48px] border-[12px] border-[#1e1916] bg-[#1e1916] shadow-2xl ring-1 ring-black/20">
        {/* Dynamic Island / Notch */}
        <div className="absolute left-1/2 top-3 z-50 h-6 w-28 -translate-x-1/2 rounded-full bg-black flex items-center justify-between px-3 shadow-sm">
          <div className="h-2.5 w-2.5 rounded-full bg-[#0a0a0f] border border-gray-800" />
          <div className="h-2 w-2 rounded-full bg-[#1a1a24] opacity-60" />
        </div>

        {/* Screen Area */}
        <div className="relative h-[680px] w-full overflow-y-auto rounded-[36px] bg-white scrollbar-thin scrollbar-thumb-gray-400 [transform:translateZ(0)]">
          {children}
        </div>

        {/* Home Indicator Bar at Bottom */}
        <div className="pointer-events-none absolute bottom-2 left-1/2 z-50 h-1 w-32 -translate-x-1/2 rounded-full bg-black/40 backdrop-blur-sm" />
      </div>
    </div>
  );
}
