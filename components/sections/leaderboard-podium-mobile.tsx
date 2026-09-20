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
 * Podio del Leaderboard, versión mobile: un pódium escalonado, con el primer
 * puesto al centro, más ancho (144), más alto y con el avatar más grande (64).
 * En desktop son tres cards iguales en fila, así que es otro componente
 * (AGENTS regla 12).
 *
 * El DOM va 1-2-3, que es el orden de lectura, y el escalonado lo hace CSS con
 * `order-*`: la data no se reordena.
 *
 * Acá la corona **sí** va en el flujo — la card la tiene en cuenta en su alto,
 * al revés que en desktop, donde tendría que crecer para alojarla.
 *
 * Las bases se alinean con `items-end`: los hermanos `flex-1` reparten ancho
 * pero dejan de estirarse en alto, que es justo lo que se busca. No combinar
 * con `h-full`, que lo anula.
 *
 * Cada card es un link al perfil, igual que las filas de la tabla. El `order` y
 * el ancho se quedan en el `<li>` — son cosa del escalonado — y todo lo visual
 * baja al link.
 */
const GRADIENT: Record<PodiumRank, string> = {
  1: "bg-podium-gold-mobile",
  2: "bg-podium-silver-mobile",
  3: "bg-podium-bronze-mobile",
};

/** El escalonado: el 1º al medio. */
const ORDER: Record<PodiumRank, string> = {
  1: "order-2",
  2: "order-1",
  3: "order-3",
};

export function LeaderboardPodiumMobile({ className }: { className?: string }) {
  return (
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
