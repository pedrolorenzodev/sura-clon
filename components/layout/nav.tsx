"use client";

import { NavDesktop } from "@/components/layout/nav-desktop";
import { NavMobile } from "@/components/layout/nav-mobile";
import { defaultActiveSectionId, homeSectionIds } from "@/lib/data/navigation";
import { useSectionSpy } from "@/lib/use-section-spy";

/**
 * Menú flotante de secciones del Home. Desktop y mobile son dos componentes
 * distintos — riel vertical en el gutter contra barra horizontal abajo — pero
 * comparten data, tokens y **estado**: el ítem activo vive acá para que no haya
 * dos fuentes de verdad.
 *
 * Es client component por eso: el activo lo escriben el click y el scroll
 * (`useSectionSpy`), que además es lo que hace que el logo del header —que
 * también apunta a `#home`— mueva el pill sin tener que sincronizar nada.
 */
export function Nav() {
  const { activeId, select } = useSectionSpy(homeSectionIds, defaultActiveSectionId);

  return (
    <>
      <NavDesktop activeId={activeId} onSelect={select} />
      <NavMobile activeId={activeId} onSelect={select} />
    </>
  );
}
