import { homeSections } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";

/**
 * Menú flotante de secciones, versión mobile: la bottom bar del Figma
 * (`3567:92009`) con los ítems y el comportamiento de este Home.
 *
 * **Del Figma sale la caja**: 375 × 80, radio 16, borde `#494949`,
 * `backdrop-blur(10px)`, `px-10` y la sombra "Shadow 3" (`--shadow-bar`), con
 * los ítems reparibles en `flex-1` y sin gap.
 *
 * **De nosotros salen los ítems y el estado activo**: las 6 secciones que tienen
 * contenido en el Home en vez de los 5 destinos de app del diseño, y el pill
 * verde que se desplaza, como en desktop. El botón circular verde de Home del
 * Figma queda afuera por pedido del usuario (2026-09-18): todos los íconos van
 * en su estado normal. Razonado en PRD § 5.
 *
 * El ancho va como `px-2` (8px por lado) en vez de fijar 375: da 374 en una
 * pantalla de 390 — 1px del diseño, dentro de la tolerancia de § 6 — y no se
 * desborda en pantallas más angostas, que el Figma no contempla.
 */
export function NavMobile({
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
      className="pointer-events-none fixed inset-x-0 bottom-nav-safe z-40 flex justify-center px-2 desktop:hidden"
    >
      <div className="border-gradient-nav-mobile pointer-events-auto h-20 w-full rounded-2xl bg-nav-glass px-2.5 shadow-bar backdrop-blur-nav">
        <div className="relative h-full">
          <span
            aria-hidden
            style={
              {
                "--nav-index": activeIndex,
                "--nav-count": homeSections.length,
              } as React.CSSProperties
            }
            className="nav-pill-x pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center transition-transform duration-250 ease-in-out motion-reduce:transition-none"
          >
            <span className="size-12 rounded-2xl bg-brand" />
          </span>

          <ul className="relative flex h-full items-center">
            {homeSections.map((section) => {
              const isActive = section.id === activeId;

              return (
                <li key={section.id} className="h-full flex-1">
                  <a
                    href={`#${section.id}`}
                    onClick={() => onSelect(section.id)}
                    aria-current={isActive ? "true" : undefined}
                    className="group flex size-full items-center justify-center"
                  >
                    {/* El color sí sale del Figma de esta barra (`--color-nav-icon`,
                        gris azulado, no el blanco del riel desktop). El tamaño NO:
                        la barra del Figma unifica sus íconos en 24 porque están
                        dibujados con el mismo padding interno, y los nuestros no.
                        Medido: en una caja de 24, Misiones pinta 24 × 24 de tinta
                        contra los 18 × 18 de Home. Los tamaños nativos son los que
                        igualan la tinta — por eso se respetan (ver PRD § 5). */}
                    <span
                      className={cn(
                        "block shrink-0 transition-colors duration-75 motion-reduce:transition-none motion-reduce:delay-0",
                        section.icon,
                        section.iconSize,
                        isActive
                          ? "bg-primary-foreground delay-150"
                          : "bg-nav-icon group-active:bg-brand",
                      )}
                    />
                    <span className="sr-only">{section.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
