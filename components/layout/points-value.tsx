"use client";

import { useEffect, useRef, useState } from "react";

import { Odometer } from "@/components/layout/odometer";
import { readMs } from "@/lib/motion";
import { playSfx } from "@/lib/sfx";
import { useDailyClaim } from "@/lib/use-daily-claim";

const TICK_OFFSET_MS = 180;
const TICK_RATE_STEP = 0.07;

function changedDigitPositions(from: number, to: number) {
  const before = String(from);
  const after = String(to);
  const shared = Math.min(before.length, after.length);
  const positions: number[] = [];
  for (let position = 0; position < shared; position += 1) {
    if (before[before.length - 1 - position] !== after[after.length - 1 - position]) positions.push(position);
  }
  return positions;
}

export function PointsValue() {
  const { points, gain } = useDailyClaim();
  const [gainOnMount] = useState(gain?.id ?? 0);
  const freshGain = gain && gain.id !== gainOnMount ? gain : null;
  const ref = useRef<HTMLSpanElement>(null);
  const previousPoints = useRef(points);

  useEffect(() => {
    const from = previousPoints.current;
    previousPoints.current = points;
    if (from === points || !freshGain) return;
    const element = ref.current;
    if (!element || element.getClientRects().length === 0) return;

    const stagger = readMs("--odometer-stagger");
    const timers = changedDigitPositions(from, points).map((position, order) =>
      window.setTimeout(
        () => playSfx("tick", { rate: 1 + order * TICK_RATE_STEP, stack: true }),
        TICK_OFFSET_MS + position * stagger,
      ),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [points, freshGain]);

  return (
    <span ref={ref} className="relative inline-flex">
      <Odometer value={points} />
      {freshGain && (
        <span
          key={freshGain.id}
          aria-hidden
          className="reward-pop pointer-events-none absolute inset-x-0 top-full mt-2 flex justify-center whitespace-nowrap font-techno text-xs uppercase text-brand-vivid drop-shadow-link-hover"
        >
          +{freshGain.amount}
        </span>
      )}
    </span>
  );
}
