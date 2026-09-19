import { Fragment } from "react";

import { hero } from "@/lib/data/hero";

/**
 * Contenido del hero: título, copy y CTA.
 *
 * El eje se da vuelta entre tamaños. En mobile es una columna y el slider va
 * debajo; en desktop es una fila y el slider vive en el gutter derecho, espejo
 * del menú flotante que ocupa el izquierdo. Por eso el mismo spacer pasa de
 * tener alto a tener ancho.
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

        {/* El `min-w` de desktop es deliberado: el botón del Figma mide 181
            porque su nodo de texto tiene un ancho fijo de 141, mientras que en
            mobile el mismo botón se ajusta al texto. Con la fuente sustituta
            ajustarse da 157.6, así que se fija un punto intermedio en 168.
            Ver deuda en PRD § 6. */}
        <a
          href={hero.cta.href}
          className="inline-flex items-center self-start rounded-pill bg-brand px-4 py-2 font-techno text-copy-sm text-black shadow-cta-mobile desktop:h-11.5 desktop:min-w-42 desktop:justify-center desktop:px-5 desktop:py-0 desktop:text-cta desktop:shadow-cta"
        >
          {hero.cta.label}
        </a>
      </div>

      {/* Espacio del slider de miniaturas, que todavía no se implementa. Sin
          reservarlo, en desktop la columna de texto pasaría de 927 a 1212 y el
          título dejaría de romper en dos líneas. TODO: bloque 3c. */}
      <div aria-hidden className="h-8 desktop:h-auto desktop:w-gutter-desktop desktop:shrink-0" />
    </div>
  );
}
