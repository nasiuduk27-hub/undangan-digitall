"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export type Wish = {
  id: string;
  wish_message: string | null;
  guest: { name: string };
};

interface WishesFeedProps {
  wishes?: Wish[];
  themeId?: string;
}

export function WishesFeed({
  wishes = [],
  themeId = "editorial-brutalism",
}: WishesFeedProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (!wishes || wishes.length === 0) {
    if (themeId === "cyber-celestial-noir") {
      return (
        <div className="rounded-lg border border-dashed border-[#00F5D4]/30 bg-[#151A24] p-4 text-center font-mono text-xs text-[#F4F7FB]/50">
          [NO MESSAGES RECEIVED]
        </div>
      );
    }
    if (themeId === "70s-warm-groovy") {
      return (
        <div className="rounded-2xl border-2 border-dashed border-[#D96B27]/40 p-4 text-center text-xs text-[#3A2418]/60">
          Belum ada ucapan.
        </div>
      );
    }
    if (themeId === "raw-wabi-sabi") {
      return (
        <div className="border border-dashed border-[#2E241D]/30 p-4 text-center font-serif text-xs italic text-[#2E241D]/60">
          Belum ada ucapan.
        </div>
      );
    }
    return (
      <div className="border-2 border-dashed border-[var(--theme-text)] p-4 text-center font-mono text-xs text-[var(--theme-muted)]">
        Belum ada ucapan dari tamu.
      </div>
    );
  }

  const shouldAnimate = wishes.length >= 2;
  const displayWishes = shouldAnimate ? [...wishes, ...wishes] : wishes;
  const duration = Math.max(14, wishes.length * 6);

  const renderWishCard = (wish: Wish, idx: number) => {
    if (themeId === "cyber-celestial-noir") {
      return (
        <article
          key={`${wish.id}-${idx}`}
          className="rounded-lg border border-[#00F5D4]/30 bg-[#151A24] p-4 font-mono shadow-xs"
        >
          <p className="text-xs text-[#00F5D4]">[FROM: {wish.guest.name}]</p>
          <p className="mt-2 text-xs text-[#F4F7FB]/90 leading-relaxed">
            {wish.wish_message}
          </p>
        </article>
      );
    }
    if (themeId === "70s-warm-groovy") {
      return (
        <article
          key={`${wish.id}-${idx}`}
          className="rounded-2xl border border-[#EBB035] bg-[#FFF2D0] p-4 shadow-xs"
        >
          <p className="font-sans text-xs font-bold text-[#D96B27]">{wish.guest.name}</p>
          <p className="mt-1 font-sans text-xs text-[#3A2418]">{wish.wish_message}</p>
        </article>
      );
    }
    if (themeId === "raw-wabi-sabi") {
      return (
        <article
          key={`${wish.id}-${idx}`}
          className="border border-[#2E241D]/15 bg-[#F7F0E8] p-4 rounded-sm shadow-xs"
        >
          <p className="font-serif text-xs italic text-[#BFA054]">{wish.guest.name}</p>
          <p className="mt-1 font-sans text-xs text-[#2E241D]">{wish.wish_message}</p>
        </article>
      );
    }
    return (
      <article
        key={`${wish.id}-${idx}`}
        className="border-2 border-[var(--theme-text)] bg-[var(--theme-bg)] p-4 shadow-xs"
      >
        <p className="font-mono text-[10px] font-bold uppercase text-[var(--theme-muted)]">
          {wish.guest.name}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--theme-text)]">
          {wish.wish_message}
        </p>
      </article>
    );
  };

  return (
    <div className="relative w-full space-y-2">
      <div className="flex items-center justify-between text-xs opacity-80">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wide">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Daftar Ucapan ({wishes.length})</span>
        </span>
        {shouldAnimate && (
          <span className="text-[10px] italic opacity-70">Arahkan kursor untuk jeda</span>
        )}
      </div>

      <div
        className="relative h-[340px] md:h-[420px] overflow-hidden rounded-md p-1"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {shouldAnimate ? (
          <motion.div
            className="space-y-3"
            animate={isPaused ? {} : { y: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: duration,
            }}
          >
            {displayWishes.map((wish, index) => renderWishCard(wish, index))}
          </motion.div>
        ) : (
          <div className="space-y-3 overflow-y-auto max-h-full pr-1">
            {wishes.map((wish, index) => renderWishCard(wish, index))}
          </div>
        )}
      </div>
    </div>
  );
}
