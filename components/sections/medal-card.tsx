import Image from "next/image";

import type { Medal, MedalArt } from "@/lib/data/medals";
import { cn } from "@/lib/utils";

/**
 * Arte de cada medalla. Las doradas salen de **dos sprites de 2 × 2** que el
 * Figma recorta por celda, así que el asset se comparte y lo que cambia es la
 * ventana — el mismo patrón que los personajes de las cards de Eventos. Las
 * grises vienen como imagen suelta y se usan enteras.
 *
 * Los porcentajes son los del Figma, sin convertir: como la caja del arte es
 * cuadrada y escala con la celda, sirven igual en los dos tamaños.
 */
const ART: Record<MedalArt, { src: string; image: string }> = {
  devocion: {
    src: "/assets/home/medallas/sprite-gold-1.png",
    image: "left-[-12.29%] top-[-14.38%] size-[244.15%]",
  },
  "first-victory": {
    src: "/assets/home/medallas/sprite-gold-1.png",
    image: "left-[-7.87%] top-[-117.04%] h-[226.55%] w-[230.11%]",
  },
  "point-collector": {
    src: "/assets/home/medallas/sprite-gold-1.png",
    image: "left-[-121.3%] top-[-118.51%] h-[226.55%] w-[230.11%]",
  },
  "event-master": {
    src: "/assets/home/medallas/sprite-gold-2.png",
    image: "left-[-127.8%] top-[-125.93%] size-[239.25%]",
  },
  ranking: { src: "/assets/home/medallas/ranking.png", image: "inset-0 size-full" },
  /* El Figma la trae rotada y espejada. Se replica: el asset se usa como el
     diseño lo usa (regla 10). */
  social: {
    src: "/assets/home/medallas/social.png",
    image: "inset-0 size-full rotate-90 -scale-y-100",
  },
  consistencia: { src: "/assets/home/medallas/consistencia.png", image: "inset-0 size-full" },
  sharpshooter: { src: "/assets/home/medallas/sharpshooter.png", image: "inset-0 size-full" },
  influencer: { src: "/assets/home/medallas/influencer.png", image: "inset-0 size-full" },
};

/**
 * Una medalla de la grilla.
 *
 * Todo lo de adentro del círculo va en porcentajes para que la celda escale
 * sola: el Figma la define en 106 de ancho con un círculo de 86, y en mobile
 * la misma grilla de 3 columnas la deja en ~98.
 *
 * El diseño pone el círculo en 86 dentro de una caja de 82 con `p-12`, o sea
 * que sobresale 2px por lado. Acá es `p-10` con el círculo al ancho completo:
 * misma geometría renderizada — 86 de círculo a 10 del borde de la celda y 130
 * de alto— sin depender de un desborde.
 *
 * Desbloqueada: fondo propio, anillo verde, la textura de marca al 20% y el
 * brillo diagonal. Bloqueada: sin fondo ni anillo, brillo gris, la medalla
 * apagada con un velo en `mix-blend-darken` y el candado en la esquina.
 */
export function MedalCard({ medal }: { medal: Medal }) {
  const art = ART[medal.art];

  return (
    <li
      className={cn(
        "flex flex-col items-center justify-end gap-3 rounded-lg p-2.5",
        !medal.locked && "bg-background",
      )}
    >
      <div className="relative aspect-square w-full">
        <div
          className={cn(
            "absolute inset-0 overflow-hidden rounded-full",
            medal.locked ? "bg-medal-sheen-locked" : "border border-brand",
          )}
        >
          {!medal.locked && (
            <>
              <Image
                src="/assets/home/medallas/texture.png"
                alt=""
                width={1920}
                height={1080}
                className="absolute left-[-4.74%] top-0 h-full w-[177.78%] max-w-none object-cover opacity-20"
              />
              <span className="absolute inset-0 bg-medal-sheen" />
            </>
          )}

          <span className="absolute inset-[11%] overflow-hidden rounded-full">
            <Image
              src={art.src}
              alt=""
              width={1024}
              height={1024}
              className={cn("absolute max-w-none", art.image)}
            />
            {medal.locked && (
              <span className="absolute inset-0 rounded-full bg-medal-veil mix-blend-darken" />
            )}
          </span>

          {medal.sparkle && (
            <Image
              src="/assets/home/sparkling.png"
              alt=""
              width={736}
              height={736}
              className="absolute left-[12.7%] top-[12.7%] size-[25.4%] -rotate-12"
            />
          )}
        </div>

        {medal.locked && (
          <Image
            src="/assets/home/medallas/lock.svg"
            alt=""
            width={22}
            height={22}
            className="absolute bottom-0 right-0 size-[25.6%]"
          />
        )}
      </div>

      <p
        className={cn(
          "w-full truncate text-center text-2xs",
          medal.locked ? "text-locked-foreground" : "text-foreground",
        )}
      >
        {medal.label}
      </p>
    </li>
  );
}
