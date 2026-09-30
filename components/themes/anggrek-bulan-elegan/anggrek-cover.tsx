"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { FloralGateContent } from "@/components/themes/floral/gate-parts";
import type { CoverAnimationProps } from "@/components/themes/floral/types";
import { Orchid } from "./ornaments";

export function AnggrekCoverAnimation({
  groomName,
  brideName,
  guestName,
  opened,
  disableHeavyAnim,
  config,
  onComplete,
}: CoverAnimationProps) {
  useEffect(() => {
    if (!opened) return;
    const t = setTimeout(onComplete, disableHeavyAnim ? 400 : 2600);
    return () => clearTimeout(t);
  }, [opened, disableHeavyAnim, onComplete]);

  const transition = disableHeavyAnim
    ? { duration: 0.4 }
    : { duration: 1.7, ease: [0.22, 0.61, 0.36, 1] as const };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: 0.9, delay: opened ? 0.6 : 0 }}
      >
        <FloralGateContent config={config} groomName={groomName} brideName={brideName} guestName={guestName} />
      </motion.div>

      {/* Garis emas menyala tipis saat panel terbuka */}
      <motion.div
        className="pointer-events-none absolute inset-y-8 left-1/2 w-px -translate-x-1/2"
        style={{ background: `linear-gradient(${config.palette.bg}, ${config.palette.accent}, ${config.palette.bg})` }}
        initial={false}
        animate={{ opacity: opened ? 0 : 0.7, scaleY: opened ? 0.6 : 1 }}
        transition={{ duration: disableHeavyAnim ? 0.3 : 1.6 }}
      />

      {!disableHeavyAnim && (
        <>
          <motion.div
            className="absolute inset-y-0 left-0 flex w-1/2 items-center justify-end overflow-hidden bg-[var(--f-bg)]"
            style={{ backgroundColor: config.palette.bg }}
            initial={false}
            animate={{ x: opened ? "-100%" : "0%" }}
            transition={transition}
          >
            <Orchid className="h-[70vh] w-auto opacity-90" />
          </motion.div>
          <motion.div
            className="absolute inset-y-0 right-0 flex w-1/2 items-center justify-start overflow-hidden bg-[var(--f-bg)]"
            style={{ backgroundColor: config.palette.bg }}
            initial={false}
            animate={{ x: opened ? "100%" : "0%" }}
            transition={transition}
          >
            <Orchid className="h-[70vh] w-auto -scale-x-100 opacity-90" />
          </motion.div>
        </>
      )}
    </div>
  );
}
