"use client";

import { NavDesktop } from "@/components/layout/nav-desktop";
import { NavMobile } from "@/components/layout/nav-mobile";
import { useSectionNav } from "@/components/layout/section-nav-context";

export function Nav() {
  const { activeId, isHome } = useSectionNav();

  return (
    <>
      <NavDesktop activeId={activeId} />
      <NavMobile activeId={activeId} away={!isHome} />
    </>
  );
}
