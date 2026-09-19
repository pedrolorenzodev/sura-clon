import { Fragment } from "react";

import { HeroSlider } from "@/components/sections/hero-slider";
import { hero } from "@/lib/data/hero";

/**
 * Contenido del hero: título, copy y CTA.
 *
 * El eje se da vuelta entre tamaños. En mobile es una columna y el slider va
 * debajo; en desktop es una fila y el slider vive en el gutter derecho, espejo
 * del menú flotante que ocupa el izquierdo.
 *
 * El CTA va como elemento nativo y no con `components/ui/button.tsx`: el cva de
 * shadcn trae `text-sm`, `rounded-lg`, `border` y un `active:translate-y-px` que
 * el diseño no define (AGENTS regla 16). Mismo criterio que el botón "Reclamar"
 * del header.
 */
export function HeroContent() {
  return (
    <div className="flex flex-col gap-8 pb-6 pt-16 desktop:h-hero-content-desktop desktop:flex-row desktop:items-center desktop:gap-hero-gap desktop:pb-6 desktop:pl-gutter-desktop desktop:pt-6">
      <div className="flex flex-col gap-6 px-gutter desktop:min-w-px desktop:flex-1 desktop:justify-center desktop:px-10">
        {/* En mobile el título y el copy van más juntos (12) que el resto del
            bloque (24); en desktop los tres hermanos comparten los 24. */}
        <div className="flex flex-col gap-3 desktop:gap-6">
          <h1 className="font-display text-display-xs uppercase text-foreground desktop:text-display">
            {hero.title}
          </h1>
          {/* Los cortes de línea salen del diseño y difieren por tamaño, así que
              van como <br> que se prenden y apagan. El espacio va ANTES del
              <br>: si fuera después, al cortar quedaría indentando la línea
              siguiente. */}
          <p className="font-techno text-copy-sm uppercase text-foreground desktop:text-copy">
            {hero.copy.map((segmento, i) => (
              <Fragment key={segmento.text}>
                {segmento.text}
                {i < hero.copy.length - 1 && " "}
                {segmento.breakAt === "mobile" && <br className="desktop:hidden" />}
                {segmento.breakAt === "desktop" && <br className="hidden desktop:inline" />}
              </Fragment>
            ))}
          </p>
        </div>

        {/* Los dos tamaños tienen el alto fijo y el ancho lo pone el texto,
            que con la fuente sustituta no mide lo mismo que en el diseño.

            En mobile el botón del Figma es 133 × 30 y el nuestro da 143.4 de
            ancho: la tinta de Tektur mide 111.4 contra los 101 de KH
            Interference. A 30 de alto el botón se veía chato, así que el alto
            sube a 32, que es lo que conserva la proporción del diseño
            (143.4 / (133/30) = 32.35).

            En desktop el botón mide 181 porque su nodo de texto tiene un ancho
            fijo de 141, mientras que en mobile se ajusta al texto. Ajustarse
            daba 157.6, así que se fija un punto intermedio en 168.

            Las dos decisiones son del usuario y están en la deuda, PRD § 6. */}
        <a
          href={hero.cta.href}
          className="inline-flex h-8 items-center self-start rounded-pill bg-brand px-4 font-techno text-cta-sm text-black shadow-cta-mobile desktop:h-11.5 desktop:min-w-42 desktop:justify-center desktop:px-5 desktop:text-cta desktop:shadow-cta"
        >
          {hero.cta.label}
        </a>
      </div>

      {/* El slider ocupa el gutter derecho y por eso define el ancho de la
          columna de texto: sin él, en desktop pasaría de 927 a 1212 y el título
          dejaría de romper en dos líneas. */}
      <HeroSlider />
    </div>
  );
}
