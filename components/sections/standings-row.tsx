import Image from "next/image";

import { UserAvatar } from "@/components/layout/user-avatar";
import { CountUp } from "@/components/sections/count-up";
import { LevelIcon } from "@/components/sections/level-icon";
import { MedalStack } from "@/components/sections/medal-stack";
import { toneOf } from "@/components/sections/standings-tone";
import { PlayerLink } from "@/components/sections/player-link";
import { levels, type Standing } from "@/lib/data/leaderboard";
import { cn } from "@/lib/utils";

const CELL = "flex min-w-px flex-1 items-center justify-center";
const VALUE = "flex items-center gap-1 rounded-sm p-2 text-xs font-medium text-foreground";

export function StandingsRow({ entry, revealIndex }: { entry: Standing; revealIndex?: number }) {
  const tone = toneOf(entry.tone);

  return (
    <li
      style={
        revealIndex === undefined ? undefined : ({ "--reveal-index": revealIndex } as React.CSSProperties)
      }
      className={cn("flex", revealIndex !== undefined && "row-reveal")}
    >
      <PlayerLink
        playerId={entry.id}
        name={entry.name}
        className={cn(
          "group relative flex h-14 w-full items-center gap-6 overflow-hidden rounded-lg p-3",
          tone.row,
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none",
            tone.veil,
          )}
        />

        <span
          className={cn(
            "relative w-8.75 shrink-0 text-center transition-colors duration-200 motion-reduce:transition-none",
            tone.rank,
            tone.rankHover,
          )}
        >
          <span className="font-techno text-title-sm uppercase">{entry.rank}</span>
        </span>

        <div className="relative flex w-55.5 shrink-0 items-center gap-2">
          <UserAvatar
            src={entry.avatarSrc}
            size={32}
            ringClassName={tone.avatar}
            className="size-8"
          />
          <p className="min-w-px flex-1 truncate text-ui text-foreground">{entry.name}</p>
        </div>

        <div className={cn(CELL, "relative")}>
          <span className={VALUE}>
            <Coin />
            {revealIndex === undefined ? entry.points : <CountUp value={entry.points} index={revealIndex} />}
          </span>
        </div>

        <div className={cn(CELL, "relative")}>
          <span className={VALUE}>
            <MedalStack />
            {entry.medals}
          </span>
        </div>

        <div className={cn(CELL, "relative")}>
          <span className={VALUE}>
            <Image
              src="/assets/home/fire.png"
              alt=""
              width={112}
              height={112}
              className="size-4 shrink-0"
            />
            {entry.streak}
          </span>
        </div>

        <div className={cn(CELL, "relative")}>
          <span className={VALUE}>
            <LevelIcon level={entry.level} />
            {levels[entry.level].label}
          </span>
        </div>

        <div className="relative flex w-70.25 shrink-0 items-center gap-2 px-6">
          {entry.deficit && (
            <>
              <span className="flex items-center gap-1 text-xs font-medium text-foreground">
                {entry.deficitInPoints && <Coin />}
                {entry.deficit}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                para subir de posición.
              </span>
            </>
          )}
        </div>
      </PlayerLink>
    </li>
  );
}

function Coin() {
  return (
    <Image
      src="/assets/home/sp-coin.webp"
      alt=""
      width={2084}
      height={2084}
      className="size-4 shrink-0"
    />
  );
}
