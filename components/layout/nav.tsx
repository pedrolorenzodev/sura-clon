"use client";

import { useState } from "react";

import { NavDesktop } from "@/components/layout/nav-desktop";
import { NavMobile } from "@/components/layout/nav-mobile";
import { defaultActiveSectionId } from "@/lib/data/navigation";

/**
 * Menú flotante de secciones del Home. Desktop y mobile son dos componentes
 * distintos — riel vertical en el gutter contra barra horizontal abajo — pero
 * comparten data, tokens y **estado**: el ítem activo vive acá para que no haya
 * dos fuentes de verdad.
 *
 * Es client component por eso: el activo cambia con el click, aunque todavía no
 * haya secciones a donde scrollear. El scroll-spy llega cuando existan.
 */
export function Nav() {
  const [activeId, setActiveId] = useState(defaultActiveSectionId);

  return (
    <>
      <NavDesktop activeId={activeId} onSelect={setActiveId} />
      <NavMobile activeId={activeId} onSelect={setActiveId} />
    </>
  );
}
