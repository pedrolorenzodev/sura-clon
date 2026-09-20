"use client";

import { NavDesktop } from "@/components/layout/nav-desktop";
import { NavMobile } from "@/components/layout/nav-mobile";
import { defaultActiveSectionId, homeSectionIds } from "@/lib/data/navigation";
import { useSectionSpy } from "@/lib/use-section-spy";

export function Nav() {
  const { activeId, select } = useSectionSpy(homeSectionIds, defaultActiveSectionId);

  return (
    <>
      <NavDesktop activeId={activeId} onSelect={select} />
      <NavMobile activeId={activeId} onSelect={select} />
    </>
  );
}
