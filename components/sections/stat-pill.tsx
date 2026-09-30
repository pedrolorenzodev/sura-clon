import Image from "next/image";

import { MedalStack } from "@/components/sections/medal-stack";

function StatPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex shrink-0 items-center gap-1 rounded-sm bg-surface-2 p-2 text-xs font-medium text-foreground ring-1 ring-inset ring-muted-foreground/25">
      {children}
    </span>
  );
}

export function PlayerStats({
  points,
  medals,
  streak,
  className,
}: {
  points: string;
  medals: string;
  streak: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <StatPill>
        <Image src="/assets/home/sp-coin.webp" alt="" width={59} height={59} className="size-4 shrink-0" />
        {points}
      </StatPill>
      <StatPill>
        <MedalStack />
        {medals}
      </StatPill>
      <StatPill>
        <Image src="/assets/home/fire.png" alt="" width={112} height={112} className="size-4 shrink-0" />
        {streak}
      </StatPill>
    </div>
  );
}
