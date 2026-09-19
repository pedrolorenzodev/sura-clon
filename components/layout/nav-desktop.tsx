import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { homeSections } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";

/**
 * Menú flotante de secciones, versión desktop: riel vertical en el gutter
 * izquierdo. La versión mobile es otro componente (AGENTS regla 12).
 *
 * Geometría del Figma (`col-izq`, 148 × 720): la columna ocupa el gutter
 * izquierdo entero, arranca justo debajo del header y mide **lo mismo que la
 * fila del hero**. Eso no es casualidad: es lo que hace que el menú se vea
 * centrado contra el contenido del hero, que también está centrado en esos 720.
 * Los dos centros caen en el mismo píxel por construcción, sin depender del
 * alto del viewport. El menú (60 de ancho) va a 44px del borde.
 *
 * El borde va como `ring-inset`: en Figma el stroke se dibuja hacia adentro y
 * el menú mide 60px de ancho; un `border` lo llevaría a 62.
 *
 * El pill verde es **una sola capa que se desplaza**, no uno por ítem que
 * aparece y desaparece (PRD § 5). Va debajo de la lista; los íconos pintan
 * encima porque el `<ul>` también está posicionado.
 *
 * El tooltip de hover no está en el Figma: los estilos salen del elemento real
 * de app.suragaming.com (PRD § 5). El texto sí es nuestro — el live está en
 * inglés y la UI del rediseño va en español.
 *
 * **El `<nav>` va con `pointer-events-none`.** Mide 148 × 720 y está fijo, o
 * sea que tapa el gutter izquierdo entero de cualquier sección que pase por
 * debajo al scrollear: la flecha izquierda del slider de Eventos no recibía ni
 * el hover. Los eventos los toma el riel, que es lo único que se ve.
 */
export function NavDesktop({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const activeIndex = homeSections.findIndex((section) => section.id === activeId);

  return (
    <nav
      aria-label="Secciones del Home"
      className="pointer-events-none fixed left-0 top-header-desktop z-40 hidden h-hero-content-desktop w-gutter-desktop items-center px-11 desktop:flex"
    >
      <TooltipProvider>
        <div className="pointer-events-auto border-gradient-nav-desktop rounded-2xl bg-nav-glass py-2 shadow-nav backdrop-blur-nav">
          <div className="relative">
            <span
              aria-hidden
              style={{ "--nav-index": activeIndex } as React.CSSProperties}
              className="nav-pill-y pointer-events-none absolute inset-x-0 top-0 flex h-10.5 items-center justify-center transition-transform duration-250 ease-in-out motion-reduce:transition-none"
            >
              <span className="h-10.5 w-11.5 rounded-xl bg-brand" />
            </span>

            <ul className="relative flex flex-col items-center gap-0.5">
              {homeSections.map((section) => {
                const isActive = section.id === activeId;

                return (
                  <li key={section.id} className="h-10.5 w-15">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <a
                            href={`#${section.id}`}
                            onClick={() => onSelect(section.id)}
                            aria-current={isActive ? "true" : undefined}
                            className="group flex size-full items-center justify-center"
                          />
                        }
                      >
                        {/* El ícono es el SVG del diseño usado como máscara: el
                            color sale del token, no del archivo (globals.css).

                            El hover lo tiñe con el verde de marca — el mismo del
                            pill, así funciona como preview del activo.

                            El cambio a negro espera a que el pill entre en
                            tolerancia (`delay-150` + 75ms): antes de eso el ícono
                            quedaría negro fuera del pill, o sea invisible. Los
                            150ms salieron de medir cuánto tarda el pill en quedar
                            a menos de 10px del destino — que es el juego que
                            tiene el ícono de 26px dentro del pill de 46. */}
                        <span
                          className={cn(
                            "block shrink-0 transition-colors duration-75 motion-reduce:transition-none motion-reduce:delay-0",
                            section.icon,
                            section.iconSize,
                            isActive
                              ? "bg-primary-foreground delay-150"
                              : "bg-foreground group-hover:bg-brand group-focus-visible:bg-brand",
                          )}
                        />
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
          </div>
        </div>
      </TooltipProvider>
    </nav>
  );
}
