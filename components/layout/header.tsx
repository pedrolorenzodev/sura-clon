import { HeaderDesktop } from "@/components/layout/header-desktop";
import { HeaderMobile } from "@/components/layout/header-mobile";

/**
 * Header del Home. Va fijo arriba y siempre visible, sin tomar fondo al
 * scrollear: queda sobre el hero con el fondo casi transparente del diseño.
 *
 * Desktop y mobile son dos componentes separados, no el mismo markup
 * reordenado (AGENTS regla 12): desktop suma logo, botón de recompensa y
 * nivel, y sus contadores tienen otra estructura.
 */
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <HeaderMobile className="flex desktop:hidden" />
      <HeaderDesktop className="hidden desktop:flex" />
    </header>
  );
}
