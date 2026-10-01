import { HeroBackground } from "@/components/sections/hero-background";
import { HeroContent } from "@/components/sections/hero-content";
import { HeroSlideProvider } from "@/components/sections/hero-slide-context";

export function Hero() {
  return (
    <section
      id="home"
      /* no tocar: isolate, z-*, transform u opacity acá rompen el apilado del fondo, y overflow-x-clip evita el scroll lateral en los anchos sin diseño */
      className="relative scroll-mt-header-mobile overflow-x-clip pt-28 desktop:scroll-mt-header-desktop desktop:pt-header-desktop"
    >
      <HeroSlideProvider>
        <HeroBackground />
        <HeroContent />
      </HeroSlideProvider>
    </section>
  );
}
