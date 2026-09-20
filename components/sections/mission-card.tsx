import Image from "next/image";
import Link from "next/link";

import type { Mission } from "@/lib/data/missions";

/**
 * Card de una misión: portada con el premio encima, título y descripción.
 *
 * **Es la misma card en los dos tamaños.** El frame mobile dibujaba además una
 * barra de progreso y una card destacada en verde, pero es un error de diseño
 * (usuario, 2026-09-19): manda la card de desktop y en mobile sólo cambia el
 * ancho, que en el carrusel va fijo.
 *
 * El alto del título va fijo en 18: el Figma recorta esa caja a 17,787 aunque
 * el interlineado sea 20. Sin eso la card crece 2px.
 *
 * El borde va como `ring-inset` — el stroke del Figma se dibuja hacia adentro —
 * y la sombra como `box-shadow`: en el Figma es un `drop-shadow`, pero la card
 * es opaca y con radio, así que se ve igual.
 *
 * La card entera es un link a `/missions/:id`, que todavía no existe (regla 14:
 * se apunta al destino real y la ruta se implementa después). Va con
 * `prefetch={false}` para no pedir una ruta que hoy da 404.
 */
export function MissionCard({ mission }: { mission: Mission }) {
  return (
    <li className="flex w-mission-card-mobile shrink-0 desktop:w-67">
      <Link
        href={`/missions/${mission.id}`}
        prefetch={false}
        className="group flex w-full flex-col gap-4 rounded-lg bg-surface px-4 pb-6 pt-4 shadow-mission-card ring-1 ring-inset ring-border transition-shadow duration-200 hover:shadow-brand-glow focus-visible:shadow-brand-glow motion-reduce:transition-none"
      >
        <div className="relative aspect-[229.456/128] w-full overflow-hidden rounded-sm ring-1 ring-inset ring-border-muted/50">
          <Image
            src={mission.imageSrc}
            alt=""
            width={1920}
            height={1080}
            className="size-full object-cover transition-transform duration-250 ease-reveal group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
          />

          {/* Premio. El badge se apoya en la esquina y sólo dibuja los dos bordes
            que quedan hacia adentro de la imagen. */}
          <div className="absolute left-0 top-0 flex items-center gap-px overflow-hidden rounded-br-sm rounded-tl-[3px] border-b border-r border-brand bg-sp-badge px-1.5 pb-1.25 pt-1.5 shadow-sp-badge">
            <span className="pt-0.5 text-center font-techno text-reward uppercase text-sp-foreground">
              {mission.reward}
            </span>
            {/* La moneda del Figma está recortada: se ve un 109% de alto desde
              4,55% arriba. Es el mismo asset que el pill de puntos. */}
            <span className="relative block h-4 w-[17.455px] shrink-0 overflow-hidden">
              <Image
                src="/assets/home/sp-coin.png"
                alt=""
                width={2084}
                height={2084}
                className="absolute left-0 top-[-4.55%] h-[109.09%] w-full max-w-none"
              />
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="h-4.5 truncate font-techno text-sm uppercase text-foreground transition-colors duration-200 group-hover:text-brand group-focus-visible:text-brand motion-reduce:transition-none">
            {mission.title}
          </h3>
          <p className="text-2xs text-muted-foreground">
            {mission.description}
          </p>
        </div>
      </Link>
    </li>
  );
}
