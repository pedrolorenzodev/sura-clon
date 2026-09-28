"use client";

import { useState } from "react";

import { Odometer } from "@/components/layout/odometer";
import { dailyClaim } from "@/lib/data/user";
import { useDailyClaim } from "@/lib/use-daily-claim";

export function PointsValue() {
  const { claimed, points } = useDailyClaim();
  const [claimedOnMount] = useState(claimed);

  return (
    <span className="relative inline-flex">
      <Odometer value={points} />
      {claimed && !claimedOnMount && (
        <span
          aria-hidden
          className="reward-pop pointer-events-none absolute inset-x-0 top-full mt-2 flex justify-center whitespace-nowrap font-techno text-xs uppercase text-brand-vivid drop-shadow-link-hover"
        >
          +{dailyClaim.reward}
        </span>
      )}
    </span>
  );
}
