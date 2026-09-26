import { useCallback, useEffect, useRef, useState } from "react";

const anchorOffset = (section: HTMLElement) =>
  Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0;

const ANCHOR_TOLERANCE = 2;

const isAnchored = (section: HTMLElement) =>
  Math.abs(section.getBoundingClientRect().top - anchorOffset(section)) <= ANCHOR_TOLERANCE;

const BAND_BOTTOM_RATIO = 0.4;

const BOTTOM_TOLERANCE = 4;

const FULLY_VISIBLE_RATIO = 0.99;

const SCROLL_RELEASE_FALLBACK = 1500;

const USER_SCROLL_EVENTS = ["wheel", "touchstart", "keydown"] as const;

const scrollCannotAdvance = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return window.scrollY <= 0 || window.scrollY >= max - BOTTOM_TOLERANCE;
};

export function useSectionSpy(ids: readonly string[], defaultId: string, pathname: string) {
  const [activeId, setActiveId] = useState(defaultId);

  const presentIdsRef = useRef<readonly string[]>([]);
  const lockedRef = useRef(false);
  const cancelRef = useRef<() => void>(() => {});
  const resolveRef = useRef<() => void>(() => {});

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    presentIdsRef.current = sections.map((section) => section.id);
    if (sections.length === 0) return;

    const last = sections[sections.length - 1];
    let lastIsFullyVisible = false;

    const touchesBand = (section: HTMLElement) => {
      const rect = section.getBoundingClientRect();
      return (
        rect.bottom > anchorOffset(section) &&
        rect.top < window.innerHeight * BAND_BOTTOM_RATIO
      );
    };

    const tailWins = () =>
      lastIsFullyVisible ||
      window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - BOTTOM_TOLERANCE;

    const resolve = () => {
      if (lockedRef.current) return;

      const doc = document.documentElement;
      if (doc.scrollHeight - window.innerHeight <= BOTTOM_TOLERANCE) return;

      const next =
        sections.find(isAnchored)?.id ??
        (tailWins() ? last.id : sections.findLast(touchesBand)?.id);
      if (next) setActiveId(next);
    };
    resolveRef.current = resolve;

    const band = new IntersectionObserver(resolve, {
      rootMargin: `0px 0px -${(1 - BAND_BOTTOM_RATIO) * 100}% 0px`,
    });
    for (const section of sections) band.observe(section);

    const tail = new IntersectionObserver(
      ([entry]) => {
        lastIsFullyVisible = entry.intersectionRatio >= FULLY_VISIBLE_RATIO;
        resolve();
      },
      { threshold: [FULLY_VISIBLE_RATIO, 1] },
    );
    tail.observe(last);

    return () => {
      band.disconnect();
      tail.disconnect();
      resolveRef.current = () => {};
    };
  }, [ids, pathname]);

  useEffect(() => () => cancelRef.current(), []);

  const select = useCallback((id: string) => {
    if (!presentIdsRef.current.includes(id)) return;
    const target = document.getElementById(id);
    if (!target) return;

    cancelRef.current();
    setActiveId(id);
    lockedRef.current = true;

    const cancel = () => {
      clearTimeout(timer);
      window.removeEventListener("scrollend", onScrollEnd);
      USER_SCROLL_EVENTS.forEach((type) => window.removeEventListener(type, release, true));
      cancelRef.current = () => {};
    };

    const release = () => {
      cancel();
      lockedRef.current = false;
      resolveRef.current();
    };

    const onScrollEnd = () => {
      if (isAnchored(target) || scrollCannotAdvance()) release();
    };

    const timer = setTimeout(release, SCROLL_RELEASE_FALLBACK);
    window.addEventListener("scrollend", onScrollEnd);
    USER_SCROLL_EVENTS.forEach((type) =>
      window.addEventListener(type, release, { capture: true, passive: true }),
    );
    cancelRef.current = cancel;
  }, []);

  return { activeId, select };
}
