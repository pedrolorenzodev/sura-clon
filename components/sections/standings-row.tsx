import Image from "next/image";
import Link from "next/link";

import { UserAvatar } from "@/components/layout/user-avatar";
import { LevelIcon } from "@/components/sections/level-icon";
import { toneOf } from "@/components/sections/standings-tone";
import { levels, medalStack, type Standing } from "@/lib/data/leaderboard";
import { cn } from "@/lib/utils";

const CELL = "flex min-w-px flex-1 items-center justify-center";
const VALUE = "flex items-center gap-1 rounded-sm p-2 text-xs font-medium text-foreground";
const MEDAL_LAYER = ["z-3", "z-2", "z-1"];

export function StandingsRow({ entry }: { entry: Standing }) {
  const tone = toneOf(entry.tone);

  return (
    <li className="flex">
      <Link
        href={`/profile/${entry.id}`}
        prefetch={false}
        aria-label={`Ver el perfil de ${entry.name}`}
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
            {entry.points}
          </span>
        </div>

        <div className={cn(CELL, "relative")}>
          <span className={VALUE}>
            <span className="flex items-center">
              {medalStack.map((src, index) => (
                <span
                  key={src}
                  className={cn(
                    "relative flex size-4 shrink-0 items-center justify-center rounded-full border border-brand-vivid/30 bg-surface",
                    MEDAL_LAYER[index],
                    index < medalStack.length - 1 && "-mr-2.5",
                  )}
                >
                  <Image src={src} alt="" width={2048} height={2048} className="size-3" />
                </span>
              ))}
            </span>
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
                <Coin />
                {entry.deficit}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                para subir de posición.
              </span>
            </>
          )}
        </div>
      </Link>
    </li>
  );
}

function Coin() {
  return (
    <Image
      src="/assets/home/sp-coin.png"
      alt=""
      width={2084}
      height={2084}
      className="size-4 shrink-0"
    />
  );
}
