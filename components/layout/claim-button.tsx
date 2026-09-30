"use client";

import Image from "next/image";

import { dailyClaim } from "@/lib/data/user";
import { claimDailyReward, useDailyClaim } from "@/lib/use-daily-claim";

export function ClaimButton() {
  const { claimed } = useDailyClaim();

  return (
    <button
      type="button"
      onClick={claimDailyReward}
      disabled={claimed}
      data-sfx="claim"
      data-sfx-hover
      className="group flex cursor-pointer items-center gap-2 rounded-lg bg-claim py-1 pl-3 pr-4 ring-1 ring-inset ring-brand-vivid drop-shadow-claim transition-[box-shadow,opacity,translate] duration-200 enabled:hover:shadow-brand-glow enabled:focus-visible:shadow-brand-glow enabled:active:translate-y-px disabled:cursor-default disabled:opacity-50 motion-reduce:transition-none"
    >
      <span className="relative size-8 shrink-0">
        <span className="absolute -left-0.5 top-0.5 h-8 w-9">
          <span className="absolute inset-0 bg-claim-glow" />
          <span className="absolute inset-0 overflow-hidden">
            <Image
              src={dailyClaim.gameIconSrc}
              alt=""
              width={128}
              height={128}
              className="absolute left-[-11.72%] top-[-20.6%] h-[135.52%] w-[123.3%] max-w-none"
            />
          </span>
        </span>
        <Image
          src={dailyClaim.sparkleSrc}
          alt=""
          width={12}
          height={12}
          className="absolute left-3 top-0 size-3 object-contain"
        />
      </span>
      <span className="text-base font-semibold text-brand transition-colors duration-200 group-enabled:group-hover:text-brand-bright group-enabled:group-focus-visible:text-brand-bright motion-reduce:transition-none">
        {dailyClaim.label}
      </span>
    </button>
  );
}
