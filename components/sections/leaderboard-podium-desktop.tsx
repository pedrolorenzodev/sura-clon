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

/**
 * Podio del Leaderboard, versión desktop: tres cards iguales en fila, con el
 * avatar a la izquierda y el texto a la derecha. La versión mobile es un
 * pódium escalonado y por eso es otro componente (AGENTS regla 12).
 *
 * Cada card mide 211 × 97 y el alto lo define el texto, no el avatar: nombre 16
 * + nivel 10 + gap 8 + pill 32 = 66, contra los 56 de la foto.
 *
 * La corona va `absolute` sobre el avatar y no en el flujo: 14 + 4 + 56 = 74 no
 * entra en los 65 de contenido que deja una card de 97 con `p-16`, y la card se
 * iría a ~106.
 *
 * Cada card es un link al perfil, igual que las filas de la tabla: son
 * usuarios, no adornos. Con el puntero encima se eleva 2px — acá no puede
 * crecer como las filas, porque las tres comparten una fila horizontal.
 *
 * El borde va como `ring-inset` (el stroke del Figma se dibuja hacia adentro) y
 * el tinte negro del 20% está horneado en el token del degradé: como capa
 * hermana se apilaría sobre el avatar, y la card no puede llevar
 * `overflow-hidden` porque la medallita se sale.
 */
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
            <Link
              href={`/profile/${entry.id}`}
              prefetch={false}
              aria-label={`Ver el perfil de ${entry.name}`}
              className={cn(
                "flex h-podium-card w-full min-w-0 items-center gap-4 rounded-lg p-4 ring-1 ring-inset transition-transform duration-250 ease-reveal hover:-translate-y-0.5 focus-visible:-translate-y-0.5 motion-reduce:transition-none",
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
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
