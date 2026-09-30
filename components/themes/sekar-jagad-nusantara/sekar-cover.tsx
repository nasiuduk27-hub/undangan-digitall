"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { FloralGateContent } from "@/components/themes/floral/gate-parts";
import type { CoverAnimationProps } from "@/components/themes/floral/types";
import { SekarPattern } from "./ornaments";

export function SekarCoverAnimation({
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
    const t = setTimeout(onComplete, disableHeavyAnim ? 400 : 2200);
    return () => clearTimeout(t);
  }, [opened, disableHeavyAnim, onComplete]);

  const panelMotion = disableHeavyAnim
    ? { opacity: opened ? 0 : 1 }
    : { x: opened ? "-100%" : "0%" };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: 0.7, delay: opened ? 0.5 : 0 }}
      >
        <FloralGateContent config={config} groomName={groomName} brideName={brideName} guestName={guestName} />
      </motion.div>

      {!disableHeavyAnim && (
        <>
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 overflow-hidden border-r border-[#C9A34E]/50"
            style={{ backgroundColor: config.palette.bg }}
            initial={false}
            animate={panelMotion}
            transition={{ duration: 1.15, ease: [0.65, 0, 0.35, 1] }}
          >
            <SekarPattern id="sekar-left" />
          </motion.div>
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 overflow-hidden border-l border-[#C9A34E]/50"
            style={{ backgroundColor: config.palette.bg }}
            initial={false}
            animate={disableHeavyAnim ? { opacity: opened ? 0 : 1 } : { x: opened ? "100%" : "0%" }}
            transition={{ duration: 1.15, ease: [0.65, 0, 0.35, 1] }}
          >
            <SekarPattern id="sekar-right" />
          </motion.div>
        </>
      )}
    </div>
  );
}
