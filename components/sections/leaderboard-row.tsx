import { UserAvatar } from "@/components/layout/user-avatar";
import { ValuePill } from "@/components/sections/value-pill";
import type { LeaderboardEntry } from "@/lib/data/leaderboard";
import { cn } from "@/lib/utils";

/**
 * Fila de la tabla, del cuarto puesto para abajo. Un solo componente para los
 * dos tamaños: el markup y el layout son los mismos y lo único que difiere es
 * el alto.
 *
 * En mobile mide 56 sin que nadie lo declare — `p-12` × 2 más el avatar de 32.
 * El borde va como `ring-inset`, no como `border`: en Figma el stroke se dibuja
 * hacia adentro y no agrega tamaño, y con `border` la fila se iba a 58.
 * En desktop va `flex-1`, así las cinco se reparten los 329 que deja la fila de
 * 486 (PRD § 6): los 59,4 del Figma son esa división, no una medida.
 */
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
        "flex items-center gap-5 rounded-lg bg-surface p-3 ring-1 ring-inset ring-border desktop:flex-1",
        className,
      )}
    >
      <span className="w-8.75 shrink-0 text-center font-techno text-title-sm uppercase text-muted-foreground">
        {String(entry.rank).padStart(2, "0")}
      </span>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <UserAvatar
          src={entry.avatarSrc}
          size={32}
          ringClassName="border border-border"
          className="size-8"
        />
        <div className="flex min-w-0 flex-col">
          <p className="truncate text-xs text-foreground">{entry.name}</p>
          <p className="truncate text-3xs text-muted-foreground">{entry.levelLabel}</p>
        </div>
      </div>

      <ValuePill points={entry.points} />
    </li>
  );
}
