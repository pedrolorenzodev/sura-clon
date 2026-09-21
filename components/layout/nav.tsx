"use client";

import { usePathname } from "next/navigation";

import { NavDesktop } from "@/components/layout/nav-desktop";
import { NavMobile } from "@/components/layout/nav-mobile";
import { defaultActiveSectionId, homeSectionIds } from "@/lib/data/navigation";
import { useSectionSpy } from "@/lib/use-section-spy";

export function Nav() {
  const { activeId, select } = useSectionSpy(homeSectionIds, defaultActiveSectionId);
  const isHome = usePathname() === "/";

  return (
    <>
      <NavDesktop
        activeId={isHome ? activeId : null}
        onSelect={select}
        hrefBase={isHome ? "" : "/"}
      />
      <NavMobile
        activeId={isHome ? activeId : null}
        onSelect={select}
        hrefBase={isHome ? "" : "/"}
      />
    </>
  );
}
