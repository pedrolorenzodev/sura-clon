"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** Ancho de card + gap, por tamaño. Es lo que avanza cada click. */
export type SliderStep = { mobile: number; desktop: number };

/**
 * Viewport scrolleable con flechas. Lo comparten Eventos y Misiones.
 *
 * Es client component por las flechas y nada más: las cards llegan como
 * `children` y se siguen renderizando en el servidor.
 *
 * Lo que cambia entre secciones son el paso, el recorte del viewport y la
 * altura de las flechas, así que los tres entran por prop. El recorte de
 * Eventos no es decorativo: sus cards dejan que el personaje se salga por
 * arriba y el `padding-top` del viewport es lo que deja el aire justo.
 *
 * **Las flechas sí están en el diseño** de Eventos, aunque no dentro del nodo
 * de la sección: viven en el frame compuesto del Home, apoyadas en los gutters.
 * Se midieron sobre el render a resolución completa (posición, tamaño de tinta
 * y los dos colores). En mobile no hay: ahí se scrollea con el dedo y la card
 * siguiente ya asoma.
 */
export function CardSlider({
  step,
  labels,
  viewportClassName,
  arrowClassName,
  children,
}: {
  step: SliderStep;
  labels: { prev: string; next: string };
  viewportClassName: string;
  arrowClassName: string;
  children: React.ReactNode;
}) {
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
    const amount = window.matchMedia("(min-width: 391px)").matches
      ? step.desktop
      : step.mobile;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={viewport}
        onScroll={sync}
        /* El `px` no es aire de diseño: un viewport con `overflow` recorta lo
           que se sale del área scrolleable, y el glow del hover de la primera y
           la última card caía justo ahí. El margen negativo lo devuelve, así
           las cards quedan donde el diseño las pone. El aire de arriba y abajo
           lo declara cada sección, que es la que sabe cuánto necesita. */
        className={cn(
          "no-scrollbar -mx-3 flex overflow-x-auto overflow-y-hidden px-3",
          viewportClassName,
        )}
      >
        {children}
      </div>

      <SliderButton
        side="left"
        label={labels.prev}
        className={arrowClassName}
        disabled={atStart}
        onClick={() => scrollByCard(-1)}
      />
      <SliderButton
        side="right"
        label={labels.next}
        className={arrowClassName}
        disabled={atEnd}
        onClick={() => scrollByCard(1)}
      />
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
  label,
  className,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  className: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "absolute hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center transition-colors duration-200 motion-reduce:transition-none desktop:flex",
        side === "left" ? "-left-13.25" : "-right-13.25",
        className,
        disabled
          ? "cursor-default text-border-dim"
          : "text-foreground hover:text-brand focus-visible:text-brand",
      )}
    >
      <Icon className="size-8" strokeWidth={1.5} />
    </button>
  );
}
