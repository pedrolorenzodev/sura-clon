import Link from "next/link";

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
 * En desktop va `flex-1`, así las cinco se reparten los 329 que deja la fila de
 * 486 (PRD § 6): los 59,4 del Figma son esa división, no una medida.
 *
 * El borde se apaga hacia abajo, como en el diseño, y por eso no puede ser un
 * `ring`: va como anillo enmascarado en un `::before` (`border-gradient-row`),
 * que tampoco agrega tamaño — con `border` la fila se iría a 58.
 *
 * Con el puntero encima la fila **se agranda y empuja a las de abajo**, pero la
 * tabla no cambia de alto: las cinco se reparten los mismos 329 con `flex-1`,
 * así que subirle el `grow` a una se lo quita a las otras. Es lo que mantiene
 * la sección alineada con Medallas, que comparte la fila de 486.
 *
 * La fila entera es un link al perfil del usuario. La ruta todavía no existe
 * (regla 14: se apunta al destino real y la ruta se implementa después), así
 * que va con `prefetch={false}` para no pedir algo que hoy da 404.
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
        {/* El fondo del hover va como capa y no como `bg-*` en el propio link:
            el `::before` del borde ya ocupa ese lugar y pintarlos juntos haría
            que el degradé del anillo compusiera contra el color nuevo. */}
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
