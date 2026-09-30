"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type * as GsapNS from "gsap";
import { FloralGateContent } from "@/components/themes/floral/gate-parts";
import type { CoverAnimationProps } from "@/components/themes/floral/types";

type GsapTimeline = ReturnType<typeof GsapNS.gsap.timeline>;

function JasmineCluster({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 220 260"
      className={`h-56 w-48 ${flip ? "-scale-x-100" : ""}`}
      aria-hidden="true"
    >
      <g fill="none" stroke="#B8860B" strokeWidth="1.4" opacity="0.75">
        <path d="M110 250 C 104 190, 118 150, 108 108" />
        <path d="M110 200 q -30 -10 -44 -38" />
        <path d="M110 176 q 30 -12 42 -40" />
      </g>
      <g fill="#8AA37E" opacity="0.9">
        <path d="M66 162 q -6 -20 14 -30 q 8 20 -14 30Z" />
        <path d="M152 136 q 8 -20 -12 -32 q -8 20 12 32Z" />
      </g>
      <g fill="#FFFDF8" stroke="#C9A227" strokeWidth="1">
        {[
          { x: 108, y: 96, r: 20 },
          { x: 72, y: 122, r: 14 },
          { x: 148, y: 130, r: 13 },
          { x: 96, y: 158, r: 11 },
        ].map((f, i) => (
          <g key={i} transform={`translate(${f.x} ${f.y})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy={-f.r} rx={f.r * 0.42} ry={f.r} transform={`rotate(${a})`} />
            ))}
            <circle r="3" fill="#B8860B" stroke="none" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function MelatiCoverAnimation({
  groomName,
  brideName,
  guestName,
  opened,
  disableHeavyAnim,
  config,
  onComplete,
}: CoverAnimationProps) {
  const goldRef = useRef<SVGPathElement>(null);

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
      const path = goldRef.current;
      if (!path) {
        setTimeout(onComplete, 2600);
        return;
      }
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
      timeline = gsap.timeline({ onComplete });
      timeline.to(path, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 0.4);
    })();

    return () => {
      cancelled = true;
      timeline?.kill();
    };
  }, [opened, disableHeavyAnim, onComplete]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: 0.8, delay: opened ? 0.7 : 0 }}
      >
        <FloralGateContent config={config} groomName={groomName} brideName={brideName} guestName={guestName} />
      </motion.div>

      {/* Gold line "digambar" mengelilingi nama */}
      <svg
        className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-80 -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 320 180"
        aria-hidden="true"
      >
        <path
          ref={goldRef}
          d="M28 90 Q 160 8 292 90 Q 160 172 28 90"
          fill="none"
          stroke={config.palette.accent}
          strokeWidth="1.4"
          opacity="0"
        />
      </svg>

      {/* Kuncup mekar yang membelah kiri-kanan */}
      {!disableHeavyAnim && (
        <>
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-0 flex w-1/2 items-center justify-end overflow-hidden bg-[var(--f-bg)]"
            style={{ backgroundColor: config.palette.bg }}
            animate={opened ? { x: "-100%", opacity: 0 } : { x: "0%" }}
            transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
          >
            <motion.div
              animate={opened ? {} : { scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <JasmineCluster />
            </motion.div>
          </motion.div>
          <motion.div
            className="pointer-events-none absolute inset-y-0 right-0 flex w-1/2 items-center justify-start overflow-hidden"
            style={{ backgroundColor: config.palette.bg }}
            animate={opened ? { x: "100%", opacity: 0 } : { x: "0%" }}
            transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
          >
            <motion.div
              animate={opened ? {} : { scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <JasmineCluster flip />
            </motion.div>
          </motion.div>
        </>
      )}
    </div>
  );
}
