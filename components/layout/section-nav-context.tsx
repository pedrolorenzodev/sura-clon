"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { defaultActiveSectionId, homeSectionIds } from "@/lib/data/navigation";
import { dispatchTraverse, markAppReady } from "@/lib/motion";
import { hideScrollbar, showScrollbarAfterTransition } from "@/lib/scrollbar-visibility";
import { scrollInstant, scrollToElement } from "@/lib/smooth-scroll";
import { useSectionSpy } from "@/lib/use-section-spy";

const HOME_PATH = "/";
const NAV_STACK_KEY = "sura-nav-stack";

type NavEntry = { path: string; y: number };
type NavStack = { entries: NavEntry[]; index: number };

const navigationType = () =>
  (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.type;

function readNavStack(pathname: string): NavStack {
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(NAV_STACK_KEY) ?? "") as NavStack;
    if (stored.entries[stored.index]?.path === pathname) return stored;
    if (navigationType() === "back_forward") {
      const paths = stored.entries.map((entry) => entry.path);
      const at = paths.lastIndexOf(pathname, stored.index);
      const found = at !== -1 ? at : paths.indexOf(pathname, stored.index);
      if (found !== -1) return { ...stored, index: found };
    } else {
      pushNavEntry(stored, pathname);
      return stored;
    }
  } catch {}
  return { entries: [{ path: pathname, y: 0 }], index: 0 };
}

function writeNavStack(stack: NavStack) {
  try {
    window.sessionStorage.setItem(NAV_STACK_KEY, JSON.stringify(stack));
  } catch {}
}

function rememberScroll(stack: NavStack) {
  const current = stack.entries[stack.index];
  if (current) current.y = window.scrollY;
  writeNavStack(stack);
}

function pushNavEntry(stack: NavStack, path: string) {
  stack.entries = [...stack.entries.slice(0, stack.index + 1), { path, y: 0 }];
  stack.index = stack.entries.length - 1;
  writeNavStack(stack);
}

function traverseNavStack(stack: NavStack, to: string) {
  const { entries, index } = stack;
  let back: boolean;
  if (entries[index - 1]?.path === to) {
    stack.index = index - 1;
    back = true;
  } else if (entries[index + 1]?.path === to) {
    stack.index = index + 1;
    back = false;
  } else {
    const earlier = entries.slice(0, index).map((entry) => entry.path).lastIndexOf(to);
    back = earlier !== -1;
    if (back) stack.index = earlier;
    else pushNavEntry(stack, to);
  }
  writeNavStack(stack);
  return back;
}

type SectionNavState = {
  activeId: string | null;
  isHome: boolean;
  canGoBack: boolean;
  backPath: string | null;
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
  const traversedRef = useRef(false);
  const ownBackRef = useRef(false);
  const restoreScrollRef = useRef<number | null>(null);
  const stackRef = useRef<NavStack>({ entries: [{ path: pathname, y: 0 }], index: 0 });
  const [canGoBack, setCanGoBack] = useState(false);
  const [backPath, setBackPath] = useState<string | null>(null);

  useEffect(markAppReady, []);

  useLayoutEffect(() => {
    if (pathname === firstPathRef.current && !navigatedRef.current) stackRef.current = readNavStack(pathname);
    if (pathname !== firstPathRef.current) navigatedRef.current = true;
    if (pathname !== currentPathRef.current) {
      currentPathRef.current = pathname;
      showScrollbarAfterTransition();
      if (traversedRef.current) traversedRef.current = false;
      else pushNavEntry(stackRef.current, pathname);
    }
    setCanGoBack(stackRef.current.index > 0);
    setBackPath(stackRef.current.entries[stackRef.current.index - 1]?.path ?? null);
  }, [pathname]);

  useEffect(() => {
    const remember = () => rememberScroll(stackRef.current);
    const hideOnLeave = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      if (link.origin === window.location.origin && link.pathname !== window.location.pathname) hideScrollbar();
    };
    document.addEventListener("click", remember, true);
    document.addEventListener("click", hideOnLeave, true);
    return () => {
      document.removeEventListener("click", remember, true);
      document.removeEventListener("click", hideOnLeave, true);
    };
  }, []);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      if (!event.state?.__NA) return;
      const from = currentPathRef.current;
      const { pathname: to, search, hash } = window.location;
      if (to === from) return;

      event.stopImmediatePropagation();
      hideScrollbar();
      rememberScroll(stackRef.current);
      const back = traverseNavStack(stackRef.current, to);
      traversedRef.current = true;
      if (!ownBackRef.current) dispatchTraverse(back);
      ownBackRef.current = false;
      restoreScrollRef.current = stackRef.current.entries[stackRef.current.index]?.y ?? 0;
      const leftAt = window.scrollY;
      window.setTimeout(() => {
        scrollInstant(leftAt);
        router.replace(to + search + hash, { scroll: false, transitionTypes: back ? ["nav-back"] : [] });
      });
    };
    window.addEventListener("popstate", onPopState, true);
    return () => window.removeEventListener("popstate", onPopState, true);
  }, [router]);

  const goBack = useCallback(() => {
    hideScrollbar();
    const { entries, index } = stackRef.current;
    if (index === 0) {
      router.push(HOME_PATH, { scroll: false, transitionTypes: ["nav-back"] });
      return;
    }
    const freshDocument = !navigatedRef.current && navigationType() === "navigate";
    if (freshDocument) {
      router.push(entries[index - 1].path, { scroll: false, transitionTypes: ["nav-back"] });
      return;
    }
    ownBackRef.current = true;
    router.back();
  }, [router]);

  const goTo = useCallback(
    (id: string) => {
      if (!isHome) {
        hideScrollbar();
        pendingRef.current = id;
        router.push(HOME_PATH, { scroll: false, transitionTypes: ["nav-back"] });
        return;
      }
      select(id);
      const target = document.getElementById(id);
      if (target) scrollToElement(target);
    },
    [isHome, router, select],
  );

  useLayoutEffect(() => {
    const top = restoreScrollRef.current;
    if (top === null) return;
    restoreScrollRef.current = null;
    scrollInstant(top);
  }, [pathname]);

  useLayoutEffect(() => {
    const id = pendingRef.current;
    if (!isHome || !id) return;
    pendingRef.current = null;
    arrivedRef.current = id;
    const target = document.getElementById(id);
    if (target) scrollToElement(target, { instant: true });
  }, [isHome]);

  useEffect(() => {
    const id = arrivedRef.current;
    if (!isHome || !id) return;
    arrivedRef.current = null;
    select(id);
  }, [isHome, select]);

  const value = useMemo(
    () => ({ activeId: isHome ? activeId : null, isHome, canGoBack, backPath, goTo, goBack }),
    [activeId, isHome, canGoBack, backPath, goTo, goBack],
  );

  return <SectionNavContext.Provider value={value}>{children}</SectionNavContext.Provider>;
}

export function useSectionNav() {
  const context = useContext(SectionNavContext);
  if (!context) throw new Error("useSectionNav must be used within SectionNavProvider");
  return context;
}
