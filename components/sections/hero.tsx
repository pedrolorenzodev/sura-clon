import { HeroBackground } from "@/components/sections/hero-background";
import { HeroContent } from "@/components/sections/hero-content";
import { HeroSlideProvider } from "@/components/sections/hero-slide-context";

/**
 * Hero del Home y destino del ancla `#home` del menú de navegación.
 *
 * El `pt` no es decorativo: separa el contenido del header fijo. En mobile son
 * 112 (56 del header + los 56 que el diseño deja de aire); en desktop, los 106
 * del header, porque ahí el hero arranca pegado.
 *
 * `overflow-x-clip` acota la franja sin diseño: entre 391 y ~860px el título de
 * 64px no entra y la fila desborda. El PRD § 4 ya acepta que ahí se recorte
 * (pasa lo mismo con el header), pero sin esto el desborde empuja la página
 * entera y aparece scroll horizontal. `clip` recorta solo en X y deja pasar el
 * desborde vertical del fondo, que es el que tiene que verse.
 *
 * Esta `<section>` NO puede llevar `isolate`, `z-*`, `transform` ni `opacity`:
 * rompería el apilado del fondo. Ver el comentario en `hero-background.tsx`.
 *
 * Sigue siendo server component: el estado del slider vive en el provider, que
 * envuelve a los dos que lo necesitan sin arrastrar al resto.
 */
export function Hero() {
  return (
    <section id="home" className="relative scroll-mt-14 overflow-x-clip pt-28 desktop:scroll-mt-header-desktop desktop:pt-header-desktop">
      <HeroSlideProvider>
        <HeroBackground />
        <HeroContent />
      </HeroSlideProvider>
    </section>
  );
}
