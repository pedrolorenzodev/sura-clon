import { CardLink } from "@/components/layout/card-link";
import { UserAvatar } from "@/components/layout/user-avatar";
import { toneOf } from "@/components/sections/standings-tone";
import { ValuePill } from "@/components/sections/value-pill";
import type { StandingTone } from "@/lib/data/leaderboard";
import { cn } from "@/lib/utils";

export function LeaderboardRow({
  href,
  rank,
  name,
  levelLabel,
  points,
  avatarSrc,
  tone,
  elastic,
  className,
}: {
  href: string | null;
  rank: string;
  name: string;
  levelLabel: string;
  points: string;
  avatarSrc: string;
  tone?: StandingTone;
  elastic?: boolean;
  className?: string;
}) {
  const style = toneOf(tone);

  return (
    <li
      className={cn(
        "flex",
        elastic &&
          "transition-[flex-grow] duration-250 ease-reveal motion-reduce:transition-none desktop:flex-1 desktop:has-hover:grow-[1.25] desktop:has-focus-visible:grow-[1.25]",
        className,
      )}
    >
      <CardLink
        href={href}
        aria-label={`Ver el perfil de ${name}`}
        className={cn(
          "group relative flex w-full items-center gap-5 overflow-hidden rounded-lg p-3",
          style.row,
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none",
            style.veil,
          )}
        />

        <span
          className={cn(
            "relative w-8.75 shrink-0 text-center transition-colors duration-200 motion-reduce:transition-none",
            style.rank,
            style.rankHover,
          )}
        >
          <span className="font-techno text-title-sm uppercase">{rank}</span>
        </span>

        <div className="relative flex min-w-0 flex-1 items-center gap-2">
          <UserAvatar src={avatarSrc} size={32} ringClassName={style.avatar} className="size-8" />
          <div className="flex min-w-0 flex-col">
            <p className="truncate text-xs text-foreground">{name}</p>
            <p className="truncate text-3xs text-muted-foreground">{levelLabel}</p>
          </div>
        </div>

        <ValuePill points={points} className="relative" />
      </CardLink>
    </li>
  );
}
