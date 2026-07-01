"use client";

import { useEffect, useRef } from "react";

type PixelBlastProps = {
  className?: string;
};

export default function PixelBlast({ className = "" }: PixelBlastProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const state = { t: 0 };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      state.t += 0.01;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, w, h);

      const cell = 12;
      for (let y = 0; y < h; y += cell) {
        for (let x = 0; x < w; x += cell) {
          const n =
            Math.sin((x + state.t * 180) * 0.025) *
              Math.cos((y - state.t * 120) * 0.03) +
            Math.sin((x + y) * 0.01 + state.t * 2.5);
          const alpha = Math.max(0, Math.min(1, (n + 2) / 4));
          if (alpha < 0.35) continue;
          ctx.fillStyle = `rgba(192,192,192,${alpha * 0.45})`;
          ctx.fillRect(x + 1, y + 1, 2, 2);
        }
      }

      const grd = ctx.createRadialGradient(w * 0.5, h * 0.5, 10, w * 0.5, h * 0.5, h * 0.9);
      grd.addColorStop(0, "rgba(192,192,192,0.12)");
      grd.addColorStop(1, "rgba(9,9,11,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className={`h-full w-full ${className}`} />;
}

