import Link from "next/link";

import { UserAvatar } from "@/components/layout/user-avatar";
import {
  Crown,
  PODIUM_STYLE,
  PodiumMedal,
  type PodiumRank,
} from "@/components/sections/leaderboard-podium-style";
import { LevelIcon } from "@/components/sections/level-icon";
import { ValuePill } from "@/components/sections/value-pill";
import { levels, standings } from "@/lib/data/leaderboard";
import { cn } from "@/lib/utils";

const GRADIENT: Record<PodiumRank, string> = {
  1: "bg-podium-gold",
  2: "bg-podium-silver",
  3: "bg-podium-bronze",
};

const ORDER: Record<PodiumRank, string> = { 1: "order-2", 2: "order-1", 3: "order-3" };

export function StandingsPodium({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-end justify-center gap-6", className)}>
      {standings.slice(0, 3).map((entry, index) => {
        const rank = (index + 1) as PodiumRank;
        const style = PODIUM_STYLE[rank];
        const isFirst = rank === 1;

        return (
          <li key={entry.id} className={cn("flex w-73.25 shrink-0", ORDER[rank], isFirst && "pb-6")}>
            <Link
              href={`/profile/${entry.id}`}
              prefetch={false}
              aria-label={`Ver el perfil de ${entry.name}`}
              className={cn(
                "flex w-full items-center gap-6 rounded-lg px-6 ring-1 ring-inset transition-transform duration-250 ease-reveal hover:-translate-y-0.5 focus-visible:-translate-y-0.5 motion-reduce:transition-none",
                GRADIENT[rank],
                style.ring,
                isFirst ? "pb-6 pt-8 shadow-gold-glow-soft" : "py-6",
              )}
            >
              <div className="relative size-20 shrink-0">
                <UserAvatar
                  src={entry.avatarSrc}
                  size={80}
                  ringClassName={style.avatarRing}
                  className="size-20"
                >
                  <PodiumMedal rank={rank} className="size-6.5" />
                </UserAvatar>
                {isFirst && (
                  <Crown className="absolute bottom-full left-1/2 mb-1 h-4.5 w-7.5 -translate-x-1/2" />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 text-foreground">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-ui font-semibold">{entry.name}</p>
                  <div className="flex min-w-0 items-center gap-1">
                    <LevelIcon level={entry.level} />
                    <p className="truncate text-xs">Nivel: {levels[entry.level].label}</p>
                  </div>
                </div>
                <ValuePill points={entry.points} variant={style.pill} className="self-start" />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
