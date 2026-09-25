import { CardLink } from "@/components/layout/card-link";
import { UserAvatar } from "@/components/layout/user-avatar";
import {
  Crown,
  PODIUM_STYLE,
  PodiumMedal,
  type PodiumRank,
} from "@/components/sections/leaderboard-podium-style";
import { ValuePill } from "@/components/sections/value-pill";
import { PodiumSheen } from "@/components/sections/podium-sheen";
import { podium } from "@/lib/data/leaderboard";
import { detailHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

const GRADIENT: Record<PodiumRank, string> = {
  1: "bg-podium-gold",
  2: "bg-podium-silver",
  3: "bg-podium-bronze",
};

export function LeaderboardPodiumDesktop({
  className,
}: {
  className?: string;
}) {
  return (
    <ul className={cn("flex gap-3", className)}>
      {podium.map((entry) => {
        const rank = entry.rank as PodiumRank;
        const style = PODIUM_STYLE[rank];

        return (
          <li key={entry.id} className="flex min-w-0 flex-1">
            <CardLink
              href={detailHref("profile", entry.id)}
              aria-label={`Ver el perfil de ${entry.name}`}
              className={cn(
                "relative flex h-podium-card w-full min-w-0 items-center gap-4 rounded-lg p-4 ring-1 ring-inset transition-transform duration-200 ease-reveal hover:-translate-y-0.5 focus-visible:-translate-y-0.5 motion-reduce:transition-none",
                GRADIENT[rank],
                style.ring,
                rank === 1 && "shadow-gold-glow",
              )}
            >
              <div className="relative shrink-0">
                <UserAvatar
                  src={entry.avatarSrc}
                  size={56}
                  ringClassName={style.avatarRing}
                  className="size-14"
                >
                  <PodiumMedal rank={rank} className="size-4.5" />
                </UserAvatar>
                {rank === 1 && (
                  <Crown className="absolute bottom-full left-1/2 mb-1 h-3.5 w-6 -translate-x-1/2" />
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <div className="flex min-w-0 flex-col">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {entry.name}
                  </p>
                  <p className="truncate text-3xs text-foreground">
                    {entry.levelLabel}
                  </p>
                </div>
                <ValuePill points={entry.points} variant={style.pill} />
              </div>
              {rank === 1 && <PodiumSheen />}
            </CardLink>
          </li>
        );
      })}
    </ul>
  );
}
