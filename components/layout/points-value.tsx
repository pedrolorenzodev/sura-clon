"use client";

import { useState } from "react";

import { Odometer } from "@/components/layout/odometer";
import { useDailyClaim } from "@/lib/use-daily-claim";

export function PointsValue() {
  const { points, gain } = useDailyClaim();
  const [gainOnMount] = useState(gain?.id ?? 0);
  const freshGain = gain && gain.id !== gainOnMount ? gain : null;

  return (
    <span className="relative inline-flex">
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
