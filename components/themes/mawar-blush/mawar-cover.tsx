"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FloralGateContent } from "@/components/themes/floral/gate-parts";
import type { CoverAnimationProps } from "@/components/themes/floral/types";
import { RosePetal } from "./ornaments";

export function MawarCoverAnimation({
  groomName,
  brideName,
  guestName,
  opened,
  disableHeavyAnim,
  config,
  onComplete,
}: CoverAnimationProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  useEffect(() => {
    if (!opened) return;
    const t = setTimeout(onComplete, disableHeavyAnim ? 400 : 3000);
    return () => clearTimeout(t);
  }, [opened, disableHeavyAnim, onComplete]);

  const petals = useMemo(() => {
    const count = 20; // batas maksimum kelopak (juga saat desktop)
    return Array.from({ length: count }, (_, i) => ({
      left: (i * 37) % 100,
      delay: (i % 8) * 0.12,
      duration: 2.2 + ((i * 13) % 12) / 10,
      size: 14 + ((i * 7) % 18),
      drift: ((i % 5) - 2) * 22,
    }));
  }, []);

  const visiblePetals = disableHeavyAnim ? [] : isMobile ? petals.slice(0, 14) : petals;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `radial-gradient(120% 90% at 50% 10%, ${config.palette.surface} 0%, ${config.palette.bg} 60%)`,
      }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: opened ? 1 : 0.85 }}
        transition={{ duration: 1.1 }}
      >
        <FloralGateContent config={config} groomName={groomName} brideName={brideName} guestName={guestName} />
      </motion.div>

      {/* Kelopak mawar berjatuhan */}
      {visiblePetals.map((petal, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute top-0"
          style={{ left: `${petal.left}%` }}
          initial={{ y: "-12vh", opacity: 0, rotate: 0 }}
          animate={
            opened
              ? { y: "112vh", opacity: [0, 1, 1, 0], rotate: petal.drift * 4, x: petal.drift }
              : { y: "-12vh", opacity: 0 }
          }
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            ease: "easeIn",
          }}
        >
          <RosePetal style={{ width: petal.size, height: petal.size }} />
        </motion.div>
      ))}
    </div>
  );
}
