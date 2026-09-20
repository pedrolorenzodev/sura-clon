import Link from "next/link";

import { UserAvatar } from "@/components/layout/user-avatar";
import { ValuePill } from "@/components/sections/value-pill";
import type { LeaderboardEntry } from "@/lib/data/leaderboard";
import { cn } from "@/lib/utils";

export function LeaderboardRow({
  entry,
  className,
}: {
  entry: LeaderboardEntry;
  className?: string;
}) {
  return (
    <li
      className={cn(
        "flex transition-[flex-grow] duration-250 ease-reveal motion-reduce:transition-none desktop:flex-1 desktop:has-hover:grow-[1.25] desktop:has-focus-visible:grow-[1.25]",
        className,
      )}
    >
      <Link
        href={`/profile/${entry.id}`}
        prefetch={false}
        aria-label={`Ver el perfil de ${entry.name}`}
        className="border-gradient-row group flex w-full items-center gap-5 overflow-hidden rounded-lg bg-surface p-3"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-surface-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
        />

        <span className="relative w-8.75 shrink-0 text-center font-techno text-title-sm uppercase text-muted-foreground transition-colors duration-200 group-hover:text-foreground group-focus-visible:text-foreground motion-reduce:transition-none">
          {String(entry.rank).padStart(2, "0")}
        </span>

        <div className="relative flex min-w-0 flex-1 items-center gap-2">
          <UserAvatar
            src={entry.avatarSrc}
            size={32}
            ringClassName="border border-border"
            className="size-8"
          />
          <div className="flex min-w-0 flex-col">
            <p className="truncate text-xs text-foreground">{entry.name}</p>
            <p className="truncate text-3xs text-muted-foreground">
              {entry.levelLabel}
            </p>
          </div>
        </div>

        <ValuePill points={entry.points} className="relative" />
      </Link>
    </li>
  );
}
