import Image from "next/image";

import type { ValuePillVariant } from "@/components/sections/value-pill";
import { cn } from "@/lib/utils";

/**
 * Lo que comparten los dos podios — el de desktop y el de mobile son
 * componentes distintos (AGENTS regla 12), pero la paleta por puesto y la
 * medallita son las mismas.
 *
 * El degradé de fondo **no** está acá: cada tamaño tiene el suyo, porque Figma
 * define el fill en el espacio normalizado de la caja y al cambiar la
 * proporción de la card cambia el ángulo. Cada componente declara el suyo.
 */
export type PodiumRank = 1 | 2 | 3;

export const PODIUM_STYLE: Record<
  PodiumRank,
  { ring: string; avatarRing: string; pill: ValuePillVariant }
> = {
  1: { ring: "ring-gold-bright", avatarRing: "border border-gold-bright", pill: "gold" },
  2: { ring: "ring-silver-bright", avatarRing: "border border-silver-bright", pill: "silver" },
  3: { ring: "ring-bronze", avatarRing: "border border-bronze-deep", pill: "bronze" },
};

/**
 * Medallita que se apoya en la esquina del avatar.
 *
 * Los tres assets no vienen iguales: el de oro y el de bronce son el emoji
 * entero, con cinta, y el diseño los recorta a la chapa con una ventana; el de
 * plata ya viene recortado y se usa completo. Por eso el recorte va por
 * medalla y no como una regla del componente.
 *
 * La sombra del Figma (`0 1.125px 5.625px rgb(0 0 0 / .2)`) cae dentro de la
 * tolerancia de `--drop-shadow-badge`, que además es `drop-shadow` y no
 * `box-shadow` — que es lo que corresponde acá, porque el PNG tiene alfa y la
 * sombra tiene que seguir la silueta redonda.
 */
const MEDAL = {
  1: { src: "/assets/home/leaderboard/medal-1.png", crop: true },
  2: { src: "/assets/home/leaderboard/medal-2.png", crop: false },
  3: { src: "/assets/home/leaderboard/medal-3.png", crop: true },
} as const;

export function PodiumMedal({ rank, className }: { rank: PodiumRank; className?: string }) {
  const medal = MEDAL[rank];

  return (
    <span
      className={cn(
        "pointer-events-none absolute -bottom-px -right-px overflow-hidden rounded-full drop-shadow-badge",
        className,
      )}
    >
      <Image
        src={medal.src}
        alt=""
        width={640}
        height={640}
        className={cn(
          "max-w-none",
          medal.crop ? "absolute left-[-27.88%] top-[-51.92%] size-[155.77%]" : "size-full",
        )}
      />
    </span>
  );
}

/**
 * Corona del primer puesto. El asset trae la proporción del diseño (254 × 150
 * contra los 23.7 × 14 del nodo), así que el `object-cover` recorta un 1%.
 */
export function Crown({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/home/leaderboard/crown.png"
      alt=""
      width={254}
      height={150}
      className={cn("pointer-events-none max-w-none object-cover", className)}
    />
  );
}
