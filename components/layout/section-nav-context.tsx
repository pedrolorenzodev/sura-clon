"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef } from "react";

import { defaultActiveSectionId, homeSectionIds } from "@/lib/data/navigation";
import { markAppReady } from "@/lib/motion";
import { useSectionSpy } from "@/lib/use-section-spy";

const HOME_PATH = "/";

type SectionNavState = {
  activeId: string | null;
  isHome: boolean;
  goTo: (id: string) => void;
  goBack: () => void;
};

const SectionNavContext = createContext<SectionNavState | null>(null);

export function SectionNavProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === HOME_PATH;
  const { activeId, select } = useSectionSpy(homeSectionIds, defaultActiveSectionId, pathname);

  const pendingRef = useRef<string | null>(null);
  const arrivedRef = useRef<string | null>(null);
  const firstPathRef = useRef(pathname);
  const navigatedRef = useRef(false);
  const currentPathRef = useRef(pathname);
  const previousPathRef = useRef<string | null>(null);
  const homeScrollRef = useRef(0);
  const restoreScrollRef = useRef<number | null>(null);

  useEffect(markAppReady, []);

  useEffect(() => {
    if (pathname !== firstPathRef.current) navigatedRef.current = true;
    if (pathname !== currentPathRef.current) {
      previousPathRef.current = currentPathRef.current;
      currentPathRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (!isHome) return;
    const remember = () => {
      homeScrollRef.current = window.scrollY;
    };
    document.addEventListener("click", remember, true);
    return () => document.removeEventListener("click", remember, true);
  }, [isHome]);

  const goBack = useCallback(() => {
    if (navigatedRef.current && previousPathRef.current !== HOME_PATH) {
      router.back();
      return;
    }
    if (previousPathRef.current === HOME_PATH) restoreScrollRef.current = homeScrollRef.current;
    router.push(HOME_PATH, { scroll: false, transitionTypes: ["nav-back"] });
  }, [router]);

  const goTo = useCallback(
    (id: string) => {
      if (!isHome) {
        pendingRef.current = id;
        router.push(HOME_PATH, { scroll: false, transitionTypes: ["nav-back"] });
        return;
      }
      select(id);
      document.getElementById(id)?.scrollIntoView();
    },
    [isHome, router, select],
  );

  useLayoutEffect(() => {
    const top = restoreScrollRef.current;
    if (!isHome || top === null) return;
    restoreScrollRef.current = null;
    window.scrollTo({ top, behavior: "instant" });
  }, [isHome]);

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
    () => ({ activeId: isHome ? activeId : null, isHome, goTo, goBack }),
    [activeId, isHome, goTo, goBack],
  );

  return <SectionNavContext.Provider value={value}>{children}</SectionNavContext.Provider>;
}

export function useSectionNav() {
  const context = useContext(SectionNavContext);
  if (!context) throw new Error("useSectionNav must be used within SectionNavProvider");
  return context;
}
