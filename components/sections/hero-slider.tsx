import Image from "next/image";

import { hero } from "@/lib/data/hero";
import { cn } from "@/lib/utils";

/**
 * Slider de miniaturas del hero: las portadas de los cuatro juegos, con la
 * activa marcada.
 *
 * Es el mismo bloque en los dos tamaños, con el eje dado vuelta, así que va en
 * un solo componente (AGENTS regla 12, primer caso). En desktop es una columna
 * de 60px que vive en el gutter derecho — espejo del menú flotante, a los
 * mismos 44px del borde — y en mobile una fila de 32px centrada bajo el CTA.
 * El ancho de 148 es el del gutter: lo hereda del spacer que ocupaba este lugar
 * y es lo que mantiene la columna de texto en 927.
 *
 * Mobile sigue al Figma dentro de la política de normalización: radio 1.6 → 2
 * y borde 0.8 → 1. Desktop se aparta en dos valores, por decisión del usuario
 * (2026-09-19) y anotados en PRD § 6: radio **8px** contra 4.8, y borde **2px**
 * contra 1.5 — el medio píxel no se puede pintar con `border`, porque Chrome lo
 * trunca a entero, así que redondea para arriba en vez de resolverse con un
 * `ring`.
 *
 * El tercer desvío es de los dos tamaños: **las no seleccionadas van atenuadas
 * también en desktop.** El frame mobile las dibuja con la portada al 40% sobre
 * `--color-thumb-dim` y el desktop las deja a full; se unificó en el
 * tratamiento de mobile.
 *
 * Lo que sí sigue al diseño: el borde va en una capa ENCIMA de la portada. En
 * Figma el stroke se dibuja hacia adentro, y como la capa está posicionada su
 * `border` no le saca tamaño a la miniatura, que mide 60px justos.
 *
 * Las miniaturas se revelan escalonadas al cargar la página (`thumb-reveal` en
 * `globals.css`). No es decorativo: las portadas son los assets más pesados de
 * la página y van deliberadamente al final de la cola de red, así que el
 * escalonado es el colchón que tienen para llegar. Es el segundo desvío
 * consciente de AGENTS regla 16, con el mismo criterio que el pill del menú:
 * ninguna librería de motion, dos propiedades de CSS que resuelve el
 * compositor. El índice entra como custom property, que es la excepción de la
 * regla 6.
 *
 * Todavía no es interactivo: el diseño trae un solo arte de fondo, así que un
 * click no tendría a qué cambiar. Ver `hero.activeSlide`.
 */
export function HeroSlider() {
  return (
    <ul
      aria-label="Juegos destacados"
      className="flex shrink-0 justify-center gap-3 desktop:w-gutter-desktop desktop:flex-col desktop:gap-2.25 desktop:pl-11"
    >
      {hero.slides.map((slide, index) => {
        const isActive = index === hero.activeSlide;

        return (
          <li
            key={slide.game}
            aria-current={isActive ? "true" : undefined}
            style={{ "--thumb-index": index } as React.CSSProperties}
            /* `bg-thumb-dim` va en todas y no sólo en las atenuadas: mientras
               la portada no llegó es el placeholder, y una vez que llega la
               activa la tapa entera porque va opaca. */
            className="thumb-reveal relative size-8 shrink-0 overflow-hidden rounded-xs bg-thumb-dim shadow-thumb-mobile desktop:size-15 desktop:rounded-lg desktop:shadow-thumb"
          >
            {/* La activa es el arte del hero, que la página ya está bajando
                igual. Las otras tres pesan 4,2 MB entre las tres y no son lo
                primero que hay que ver: van al final de la cola para no
                competir con el arte ni con los assets del header. */}
            <Image
              src={slide.thumbnailSrc}
              alt={slide.game}
              width={60}
              height={60}
              fetchPriority={isActive ? undefined : "low"}
              className={cn("size-full object-cover", !isActive && "opacity-40")}
            />
            {isActive && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xs border border-brand-legacy desktop:rounded-lg desktop:border-2"
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
