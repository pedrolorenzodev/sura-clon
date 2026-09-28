"use client";

import { useEffect, useRef, useState } from "react";

import { useRevealState } from "@/components/sections/reveal-list";
import { prefersReducedMotion, readMs } from "@/lib/motion";

const withThousands = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const toNumber = (text: string) => Number(text.match(/^[\d.]+/)?.[0].replace(/\./g, "") ?? 0);

const suffixOf = (text: string) => text.replace(/^[\d.]+/, "");

const easeOut = (t: number) => 1 - (1 - t) ** 3;

export function CountUp({ value, index }: { value: string; index: number }) {
  const reveal = useRevealState();
  const [display, setDisplay] = useState(value);
  const onScreen = useRef(value);
  const revealed = useRef(false);

  useEffect(() => {
    if (reveal === "armed") return;

    const firstReveal = reveal === "shown" && !revealed.current;
    if (firstReveal) revealed.current = true;
    if (!firstReveal && onScreen.current === value) return;

    const from = firstReveal ? 0 : toNumber(onScreen.current);
    const to = toNumber(value);
    const suffix = suffixOf(value);
    const instant = prefersReducedMotion();
    const duration = readMs("--count-up-duration");
    const start =
      performance.now() +
      (firstReveal ? index * readMs("--row-reveal-stagger") + readMs("--row-reveal-duration") : 0);
    let frame = 0;

    const tick = (now: number) => {
      const progress = instant ? 1 : Math.min(1, Math.max(0, (now - start) / duration));
      const text =
        progress < 1 ? `${withThousands(Math.round(from + (to - from) * easeOut(progress)))}${suffix}` : value;
      onScreen.current = text;
      setDisplay(text);
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
