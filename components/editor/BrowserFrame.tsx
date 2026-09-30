"use client";

import type { ReactNode } from "react";
import { Lock, RefreshCw, Globe } from "lucide-react";

export function BrowserFrame({
  children,
  invitationSlug = "preview-undangan",
}: {
  children: ReactNode;
  invitationSlug?: string;
}) {
  return (
    <div className="relative mx-auto my-4 w-full select-none rounded-2xl border border-gray-700/40 bg-[#1e1916] shadow-2xl overflow-hidden">
      {/* Browser Header Bar */}
      <div className="flex h-11 items-center justify-between border-b border-gray-800 bg-[#2b2420] px-4">
        {/* Window Control Dots (Traffic Lights) */}
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56] shadow-inner" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-inner" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f] shadow-inner" />
        </div>

        {/* Address Bar */}
        <div className="flex h-7 w-full max-w-md items-center justify-center gap-2 rounded-md bg-[#1a1513] px-3 font-mono text-xs text-gray-300 border border-gray-800 shadow-inner">
          <Lock className="h-3 w-3 text-emerald-400 shrink-0" />
          <span className="truncate">https://undanganku.app/u/{invitationSlug}</span>
        </div>

        {/* Browser Right Action Icons */}
        <div className="flex items-center gap-2 text-gray-400">
          <RefreshCw className="h-3.5 w-3.5 hover:text-white cursor-pointer transition-colors" />
          <Globe className="h-3.5 w-3.5 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>

      {/* Browser Screen Content Area */}
      <div className="relative h-[680px] w-full overflow-y-auto overflow-x-auto bg-white scrollbar-thin scrollbar-thumb-gray-400 [transform:translateZ(0)]">
        <div className="min-w-[1024px] w-full min-h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
