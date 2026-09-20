import Link from "next/link";

import { UserAvatar } from "@/components/layout/user-avatar";
import {
  Crown,
  PODIUM_STYLE,
  PodiumMedal,
  type PodiumRank,
} from "@/components/sections/leaderboard-podium-style";
import { ValuePill } from "@/components/sections/value-pill";
import { podium } from "@/lib/data/leaderboard";
import { cn } from "@/lib/utils";

const GRADIENT: Record<PodiumRank, string> = {
  1: "bg-podium-gold-mobile",
  2: "bg-podium-silver-mobile",
  3: "bg-podium-bronze-mobile",
};

const ORDER: Record<PodiumRank, string> = {
  1: "order-2",
  2: "order-1",
  3: "order-3",
};

export function LeaderboardPodiumMobile({ className }: { className?: string }) {
  return (
    /* no tocar: items-end hace el escalonado; h-full en las cards lo anula */
    <ul className={cn("flex w-full items-end gap-2", className)}>
      {podium.map((entry) => {
        const rank = entry.rank as PodiumRank;
        const style = PODIUM_STYLE[rank];
        const isFirst = rank === 1;

        return (
          <li
            key={entry.id}
            className={cn(
              "flex",
              ORDER[rank],
              isFirst ? "w-36 shrink-0" : "min-w-0 flex-1",
            )}
          >
            <Link
              href={`/profile/${entry.id}`}
              prefetch={false}
              aria-label={`Ver el perfil de ${entry.name}`}
              className={cn(
                "flex w-full flex-col items-center justify-end gap-2 rounded-lg p-3 ring-1 ring-inset transition-transform duration-250 ease-reveal hover:-translate-y-0.5 focus-visible:-translate-y-0.5 active:-translate-y-0.5 motion-reduce:transition-none",
                GRADIENT[rank],
                style.ring,
                isFirst && "shadow-gold-glow",
              )}
            >
              <div className="flex flex-col items-center gap-1">
                {isFirst && <Crown className="h-3 w-5" />}
                <UserAvatar
                  src={entry.avatarSrc}
                  size={isFirst ? 64 : 56}
                  ringClassName={style.avatarRing}
                  className={isFirst ? "size-16" : "size-14"}
                >
                  <PodiumMedal
                    rank={rank}
                    className={isFirst ? "size-5.25" : "size-4.5"}
                  />
                </UserAvatar>
              </div>

              <p
                className={cn(
                  "max-w-full truncate text-center font-semibold text-foreground",
                  isFirst ? "text-xs" : "text-2xs",
                )}
              >
                {entry.name}
              </p>

              <ValuePill
                points={entry.points}
                variant={style.pill}
                small={!isFirst}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
