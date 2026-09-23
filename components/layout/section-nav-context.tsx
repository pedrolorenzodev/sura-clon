"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef } from "react";

import { defaultActiveSectionId, homeSectionIds } from "@/lib/data/navigation";
import { useSectionSpy } from "@/lib/use-section-spy";

const HOME_PATH = "/";

type SectionNavState = {
  activeId: string | null;
  isHome: boolean;
  goTo: (id: string) => void;
};

const SectionNavContext = createContext<SectionNavState | null>(null);

export function SectionNavProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === HOME_PATH;
  const { activeId, select } = useSectionSpy(homeSectionIds, defaultActiveSectionId, pathname);

  const pendingRef = useRef<string | null>(null);
  const arrivedRef = useRef<string | null>(null);

  const goTo = useCallback(
    (id: string) => {
      if (!isHome) {
        pendingRef.current = id;
        router.push(HOME_PATH, { scroll: false });
        return;
      }
      select(id);
      document.getElementById(id)?.scrollIntoView();
    },
    [isHome, router, select],
  );

  useLayoutEffect(() => {
    const id = pendingRef.current;
    if (!isHome || !id) return;
    pendingRef.current = null;
    arrivedRef.current = id;
    document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  }, [isHome]);

  useEffect(() => {
    const id = arrivedRef.current;
    if (!isHome || !id) return;
    arrivedRef.current = null;
    select(id);
  }, [isHome, select]);

  const value = useMemo(
    () => ({ activeId: isHome ? activeId : null, isHome, goTo }),
    [activeId, isHome, goTo],
  );

  return <SectionNavContext.Provider value={value}>{children}</SectionNavContext.Provider>;
}

export function useSectionNav() {
  const context = useContext(SectionNavContext);
  if (!context) throw new Error("useSectionNav must be used within SectionNavProvider");
  return context;
}
