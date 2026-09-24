"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAnimSettings } from "@/lib/use-anim-settings";

export function WabiSabiInkBleed({ groomName, brideName }: { groomName: string; brideName: string }) {
  const { disableHeavyAnim } = useAnimSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (disableHeavyAnim) return;

    // Ink bleed SVG path animation with GSAP
    if (pathRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: "power2.inOut",
      });
    }

    // Floating dust particles settling down
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      speedY: Math.random() * 0.3 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(191, 160, 84, ${p.alpha})`;
        ctx.fill();

        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y > height) p.y = 0;
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [disableHeavyAnim]);

  if (disableHeavyAnim) {
    return (
      <div className="text-center font-serif text-4xl italic text-[#2E241D]">
        {groomName} & {brideName}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center py-6">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
      <svg className="h-16 w-64" viewBox="0 0 300 80">
        <defs>
          <filter id="ink-bleed-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <path
          ref={pathRef}
          d="M 20 40 Q 75 10 150 40 T 280 40"
          fill="none"
          stroke="#A85A3C"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#ink-bleed-filter)"
        />
      </svg>
      <h1 className="relative mt-[-40px] font-serif text-4xl italic tracking-wide text-[#2E241D]">
        {groomName} <span className="font-sans text-2xl not-italic text-[#BFA054]">&</span> {brideName}
      </h1>
    </div>
  );
}
