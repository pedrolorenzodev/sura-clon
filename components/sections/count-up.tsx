"use client";

import { useEffect, useState } from "react";

import { useRevealState } from "@/components/sections/reveal-list";

const readMs = (name: string) => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = Number.parseFloat(raw);
  return raw.endsWith("ms") ? value : value * 1000;
};

const withThousands = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const easeOut = (t: number) => 1 - (1 - t) ** 3;

export function CountUp({ value, index }: { value: string; index: number }) {
  const reveal = useRevealState();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reveal !== "shown") return;

    const target = Number(value.replace(/\D/g, ""));
    const duration = readMs("--count-up-duration");
    const start = performance.now() + index * readMs("--row-reveal-stagger");
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - start) / duration));
      setDisplay(progress < 1 ? withThousands(Math.round(target * easeOut(progress))) : value);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reveal, value, index]);

  return (
    <span className="grid">
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {value}
      </span>
      <span className="col-start-1 row-start-1 text-right">{reveal === "armed" ? "0" : display}</span>
    </span>
  );
}
