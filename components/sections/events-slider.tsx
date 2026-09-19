"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** Ancho de card + gap, por tamaño. Es lo que avanza cada click. */
const STEP = { mobile: 210 + 24, desktop: 365 + 24 };

/**
 * Viewport scrolleable de la sección Eventos.
 *
 * Es client component por las flechas y nada más: las cards llegan como
 * `children` y se siguen renderizando en el servidor.
 *
 * **El recorte de arriba lo hace este contenedor.** Las cards dejan que el
 * personaje se salga por arriba y acá se lo recorta con `overflow-hidden` más
 * un `padding-top` que deja el aire justo — 28px en desktop y 17 en mobile, que
 * es lo que mide el asomo menos los 2px que el propio frame corta.
 *
 * **Las flechas sí están en el diseño**, aunque no dentro del nodo de la
 * sección: viven en el frame compuesto del Home, apoyadas en los gutters. Se
 * midieron sobre el render a resolución completa (posición, tamaño de tinta y
 * los dos colores). En mobile no hay: ahí se scrollea con el dedo y la card
 * siguiente ya asoma.
 */
export function EventsSlider({ children }: { children: React.ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = viewport.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    /* El margen de 1px absorbe el redondeo a subpíxel del scroll: sin él la
       flecha derecha nunca llega a apagarse. */
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(sync, [sync]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = viewport.current;
    if (!el) return;
    const step = window.matchMedia("(min-width: 391px)").matches ? STEP.desktop : STEP.mobile;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={viewport}
        onScroll={sync}
        className="no-scrollbar flex gap-6 overflow-x-auto overflow-y-hidden pb-px pt-4.25 desktop:pb-0.5 desktop:pt-7"
      >
        {children}
      </div>

      <SliderButton side="left" disabled={atStart} onClick={() => scrollByCard(-1)} />
      <SliderButton side="right" disabled={atEnd} onClick={() => scrollByCard(1)} />
    </div>
  );
}

/**
 * Flecha de scroll, medida sobre el render del Home a resolución completa.
 *
 * | | Valor |
 * |---|---|
 * | Tinta | 10 × 18 px — un chevron de 32 con trazo 1.5 la reproduce exacta |
 * | Centro | 33px por fuera de la columna de contenido, a 202 del tope del slider |
 * | Activa | `#FFFFFF` |
 * | Inactiva | `#444444`, que es `--color-border-dim` |
 *
 * El diseño **apaga** la flecha en la punta en vez de esconderla: en el frame
 * la izquierda está gris porque el carrusel arranca al principio. El hover no
 * está definido y se resuelve como en el menú flotante, con el verde de marca.
 */
function SliderButton({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Ver eventos anteriores" : "Ver más eventos"}
      className={cn(
        "absolute top-50.5 hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center transition-colors duration-200 motion-reduce:transition-none desktop:flex",
        side === "left" ? "-left-13.25" : "-right-13.25",
        disabled
          ? "cursor-default text-border-dim"
          : "text-foreground hover:text-brand focus-visible:text-brand",
      )}
    >
      <Icon className="size-8" strokeWidth={1.5} />
    </button>
  );
}
