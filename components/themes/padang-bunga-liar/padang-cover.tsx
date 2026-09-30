"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type * as GsapNS from "gsap";
import { FloralGateContent } from "@/components/themes/floral/gate-parts";
import type { CoverAnimationProps } from "@/components/themes/floral/types";
import { PadangStems } from "./ornaments";

type GsapTimeline = ReturnType<typeof GsapNS.gsap.timeline>;

export function PadangCoverAnimation({
  groomName,
  brideName,
  guestName,
  opened,
  disableHeavyAnim,
  config,
  onComplete,
}: CoverAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!opened) return;
    if (disableHeavyAnim) {
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }

    let cancelled = false;
    let timeline: GsapTimeline | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      if (cancelled) return;
      const root = containerRef.current;
      if (!root) {
        setTimeout(onComplete, 2600);
        return;
      }
      const stems = root.querySelectorAll<SVGPathElement>(".padang-stem");
      stems.forEach((stem) => {
        const len = stem.getTotalLength();
        gsap.set(stem, { strokeDasharray: len, strokeDashoffset: len });
      });
      const blooms = root.querySelectorAll<SVGGElement>(".padang-bloom");
      gsap.set(blooms, { transformOrigin: "center bottom", scale: 0, opacity: 0 });

      timeline = gsap.timeline({ onComplete });
      timeline.to(stems, { strokeDashoffset: 0, duration: 1.6, ease: "power1.inOut", stagger: 0.08 }, 0);
      timeline.to(blooms, { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.6)", stagger: 0.08 }, 0.9);
    })();

    return () => {
      cancelled = true;
      timeline?.kill();
    };
  }, [opened, disableHeavyAnim, onComplete]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 flex items-center justify-center pb-24"
        animate={{ opacity: opened ? 1 : 0.9 }}
        transition={{ duration: 0.9, delay: opened ? 0.7 : 0 }}
      >
        <FloralGateContent config={config} groomName={groomName} brideName={brideName} guestName={guestName} />
      </motion.div>

      <PadangStems
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/5 w-full origin-bottom ${
          opened ? "" : "opacity-70"
        }`}
      />
    </div>
  );
}
