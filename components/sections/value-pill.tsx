import Image from "next/image";

import { CountUp } from "@/components/sections/count-up";
import { cn } from "@/lib/utils";

export type ValuePillVariant = "neutral" | "gold" | "silver" | "bronze";

const VARIANT: Record<ValuePillVariant, string> = {
  neutral: "ring-muted-foreground/25 bg-surface-2",
  gold: "ring-gold bg-gold-deep",
  silver: "ring-silver bg-silver-deep",
  bronze: "ring-bronze bg-gold-deep",
};

export function ValuePill({
  points,
  variant = "neutral",
  small = false,
  countUpIndex,
  className,
}: {
  points: string;
  variant?: ValuePillVariant;
  small?: boolean;
  countUpIndex?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-1 rounded-sm p-2 ring-1 ring-inset",
        VARIANT[variant],
        className,
      )}
    >
      <Image
        src="/assets/home/sp-coin.png"
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0"
      />
      <span
        className={cn(
          "font-techno uppercase text-foreground",
          small ? "text-2xs" : "text-xs",
        )}
      >
        {countUpIndex === undefined ? points : <CountUp value={points} index={countUpIndex} />}
      </span>
    </div>
  );
}
