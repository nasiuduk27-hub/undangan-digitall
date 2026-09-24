"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimSettings } from "@/lib/use-anim-settings";

export function CyberConstellation({ groomName, brideName }: { groomName: string; brideName: string }) {
  const { disableHeavyAnim } = useAnimSettings();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fullText = `[INITIALIZING... COUPLE: ${groomName.toUpperCase()} & ${brideName.toUpperCase()}]`;
  const [displayText, setDisplayText] = useState(disableHeavyAnim ? fullText : "");

  useEffect(() => {
    if (disableHeavyAnim) {
      setDisplayText(fullText);
      return;
    }

    // Terminal boot-up text animation
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    // Constellation Canvas particle animation
    const canvas = canvasRef.current;
    if (!canvas) return () => clearInterval(interval);
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => clearInterval(interval);

    const width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    const height = (canvas.height = 200);

    const numPoints = 25;
    const points = Array.from({ length: numPoints }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
    }));

    let animFrame: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw constellation lines
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = `rgba(0, 245, 212, ${1 - dist / 80})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#00F5D4";
        ctx.shadowColor = "#00F5D4";
        ctx.shadowBlur = 8;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animFrame);
    };
  }, [disableHeavyAnim, groomName, brideName, fullText]);

  if (disableHeavyAnim) {
    return (
      <div className="font-mono text-center text-xl font-bold tracking-widest text-[#00F5D4]">
        {groomName} & {brideName}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden py-4">
      <canvas ref={canvasRef} className="pointer-events-none h-[200px] w-full" />
      <div className="mt-[-120px] z-10 text-center font-mono">
        <p className="text-xs tracking-widest text-[#7B2CBF] uppercase">{displayText}</p>
        <h1 className="mt-2 text-3xl font-black tracking-widest text-[#00F5D4] drop-shadow-[0_0_10px_#00F5D4]">
          {groomName} <span className="text-[#7B2CBF]">&</span> {brideName}
        </h1>
      </div>
    </div>
  );
}
