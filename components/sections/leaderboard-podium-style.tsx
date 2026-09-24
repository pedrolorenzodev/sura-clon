import Image from "next/image";

import type { ValuePillVariant } from "@/components/sections/value-pill";
import { cn } from "@/lib/utils";

export type PodiumRank = 1 | 2 | 3;

export const PODIUM_STYLE: Record<
  PodiumRank,
  { ring: string; avatarRing: string; pill: ValuePillVariant }
> = {
  1: { ring: "ring-gold-bright", avatarRing: "border border-gold-bright", pill: "gold" },
  2: { ring: "ring-silver-bright", avatarRing: "border border-silver-bright", pill: "silver" },
  3: { ring: "ring-bronze", avatarRing: "border border-bronze-deep", pill: "bronze" },
};

const MEDAL = {
  1: { src: "/assets/home/leaderboard/medal-1.webp", crop: true },
  2: { src: "/assets/home/leaderboard/medal-2.webp", crop: false },
  3: { src: "/assets/home/leaderboard/medal-3.webp", crop: true },
} as const;

export function PodiumMedal({ rank, className }: { rank: PodiumRank; className?: string }) {
  const medal = MEDAL[rank];

  return (
    <span
      className={cn(
        "pointer-events-none absolute -bottom-px -right-px overflow-hidden rounded-full drop-shadow-badge",
        className,
      )}
    >
      <Image
        src={medal.src}
        alt=""
        width={640}
        height={640}
        className={cn(
          "max-w-none",
          medal.crop ? "absolute left-[-27.88%] top-[-51.92%] size-[155.77%]" : "size-full",
        )}
      />
    </span>
  );
}

export function Crown({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/home/leaderboard/crown.webp"
      alt=""
      width={254}
      height={150}
      className={cn("pointer-events-none max-w-none object-cover", className)}
    />
  );
}
