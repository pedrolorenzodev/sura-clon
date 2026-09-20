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

        <a
          href={hero.cta.href}
          className="inline-flex h-7.5 items-center self-start rounded-pill bg-brand px-4 font-techno text-cta-sm uppercase text-black shadow-cta-mobile transition duration-200 hover:bg-brand-bright hover:shadow-cta-hover motion-reduce:transition-none desktop:h-11.5 desktop:min-w-45.25 desktop:justify-center desktop:px-5 desktop:text-cta desktop:shadow-cta desktop:hover:shadow-cta-hover"
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
