"use client";

import { useState } from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { defaultActiveSectionId, homeSections } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";

/**
 * Menú flotante de secciones del Home. Solo desktop: en mobile el diseño usa
 * una bottom bar, que es otro componente (AGENTS regla 12).
 *
 * Geometría del Figma (`col-izq`, 148 × 720): la columna ocupa el gutter
 * izquierdo entero y el menú (60 × 322 con los 7 ítems del diseño) va centrado
 * vertical, a 44px del borde. Acá la columna arranca justo debajo del header
 * fijo y llega hasta el pie del viewport, así el centrado sigue siendo el del
 * diseño sin depender del alto de la página.
 *
 * El borde va como `ring-inset`: en Figma el stroke se dibuja hacia adentro y
 * el menú mide 60px de ancho; un `border` lo llevaría a 62.
 *
 * El tooltip de hover no está en el Figma: los estilos salen del elemento real
 * de app.suragaming.com (PRD § 6). El texto sí es nuestro — el live está en
 * inglés y la UI del rediseño va en español.
 *
 * Es client component por dos razones: el ítem activo cambia con el click y el
 * tooltip necesita estado. El scroll-spy llega cuando existan las secciones.
 */
export function NavDesktop() {
  const [activeId, setActiveId] = useState(defaultActiveSectionId);

  return (
    <nav
      aria-label="Secciones del Home"
      className="fixed bottom-0 left-0 top-header-desktop z-40 hidden w-gutter-desktop items-center px-11 desktop:flex"
    >
      <TooltipProvider>
        <ul className="flex flex-col items-center gap-0.5 rounded-2xl bg-nav-glass py-2 shadow-nav ring-1 ring-border ring-inset backdrop-blur-nav">
          {homeSections.map((section) => {
            const isActive = section.id === activeId;

            return (
              <li key={section.id} className="h-10.5 w-15">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <a
                        href={`#${section.id}`}
                        onClick={() => setActiveId(section.id)}
                        aria-current={isActive ? "true" : undefined}
                        className="group flex size-full items-center justify-center"
                      />
                    }
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center rounded-xl",
                        isActive && "bg-brand px-2.5 py-2",
                      )}
                    >
                      {/* El ícono es el SVG del diseño usado como máscara: el color
                          sale del token, no del archivo (ver globals.css).

                          El hover tiñe la tinta con el verde de marca — el mismo
                          del pill activo, así el hover funciona como preview del
                          estado seleccionado. No sale del Figma ni del live:
                          decisión nuestra, anotada en el PRD. El activo no
                          reacciona porque ya está en su estado final. */}
                      <span
                        className={cn(
                          "block shrink-0 transition-colors duration-200",
                          section.iconClassName,
                          isActive
                            ? "bg-background"
                            : "bg-foreground group-hover:bg-brand group-focus-visible:bg-brand",
                        )}
                      />
                    </span>
                    <span className="sr-only">{section.label}</span>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12}>
                    {section.label}
                  </TooltipContent>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </TooltipProvider>
    </nav>
  );
}
