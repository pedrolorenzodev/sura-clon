"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { hero } from "@/lib/data/hero";

type HeroSlideState = {
  activeSlide: number;
  hasSwitched: boolean;
  select: (index: number) => void;
  setHeld: (held: boolean) => void;
};

const HeroSlideContext = createContext<HeroSlideState | null>(null);

export function HeroSlideProvider({ children }: { children: React.ReactNode }) {
  const [activeSlide, setActiveSlide] = useState(hero.activeSlide);
  const [hasSwitched, setHasSwitched] = useState(false);
  const [held, setHeld] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const select = useCallback((index: number) => {
    const total = hero.slides.length;
    setActiveSlide(((index % total) + total) % total);
    setHasSwitched(true);
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const { autoplayMs } = hero;
    if (autoplayMs === null || held || tabHidden || reducedMotion) return;

    const timer = setInterval(() => select(activeSlide + 1), autoplayMs);
    return () => clearInterval(timer);
  }, [activeSlide, held, tabHidden, reducedMotion, select]);

  const value = useMemo(
    () => ({ activeSlide, hasSwitched, select, setHeld }),
    [activeSlide, hasSwitched, select],
  );

  return <HeroSlideContext value={value}>{children}</HeroSlideContext>;
}

export function useHeroSlide() {
  const value = useContext(HeroSlideContext);

  if (!value) {
    throw new Error("useHeroSlide necesita estar dentro de <HeroSlideProvider>");
  }

  return value;
}
