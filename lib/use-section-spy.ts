import { useCallback, useEffect, useRef, useState } from "react";

const anchorOffset = (section: HTMLElement) =>
  Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0;

const ANCHOR_TOLERANCE = 2;

const BAND_BOTTOM_RATIO = 0.4;

const BOTTOM_TOLERANCE = 4;

const FULLY_VISIBLE_RATIO = 0.99;

const SCROLL_RELEASE_FALLBACK = 700;

export function useSectionSpy(ids: readonly string[], defaultId: string) {
  const [activeId, setActiveId] = useState(defaultId);

  const presentIdsRef = useRef<readonly string[]>([]);
  const lockedRef = useRef(false);
  const releaseRef = useRef<() => void>(() => {});
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

    const isAnchored = (section: HTMLElement) =>
      Math.abs(section.getBoundingClientRect().top - anchorOffset(section)) <=
      ANCHOR_TOLERANCE;

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
  }, [ids]);

  useEffect(() => () => releaseRef.current(), []);

  const select = useCallback((id: string) => {
    if (!presentIdsRef.current.includes(id)) return;

    setActiveId(id);
    releaseRef.current();
    lockedRef.current = true;

    const release = () => {
      clearTimeout(timer);
      window.removeEventListener("scrollend", release);
      releaseRef.current = () => {};
      lockedRef.current = false;
      resolveRef.current();
    };

    const timer = setTimeout(release, SCROLL_RELEASE_FALLBACK);
    window.addEventListener("scrollend", release);
    releaseRef.current = release;
  }, []);

  return { activeId, select };
}
