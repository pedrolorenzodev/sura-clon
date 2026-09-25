"use client";

import { useEffect, useRef, useState } from "react";

import { prefersReducedMotion, readMs } from "@/lib/motion";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const scramble = (text: string, progress: number) =>
  Array.from(text, (char, index) =>
    char === " " || index / text.length < progress
      ? char
      : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
  ).join("");

export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const host = el.closest("a, button") ?? el;
    let frame = 0;
    let running = false;

    const run = () => {
      if (running || prefersReducedMotion()) return;
      running = true;
      setWidth(el.getBoundingClientRect().width);

      const duration = readMs("--scramble-duration");
      const step = readMs("--scramble-step");
      const start = performance.now();
      let last = -Infinity;

      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        if (progress === 1) {
          setDisplay(text);
          setWidth(null);
          running = false;
          return;
        }
        if (now - last >= step) {
          last = now;
          setDisplay(scramble(text, progress));
        }
        frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    host.addEventListener("pointerenter", run);
    host.addEventListener("focusin", run);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointerenter", run);
      host.removeEventListener("focusin", run);
    };
  }, [text]);

  return (
    <>
      <span
        ref={ref}
        aria-hidden
        style={width === null ? undefined : ({ "--scramble-w": `${width}px` } as React.CSSProperties)}
        className={cn(
          "inline-block overflow-x-clip whitespace-nowrap",
          width !== null && "w-(--scramble-w)",
          className,
        )}
      >
        {display}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}
