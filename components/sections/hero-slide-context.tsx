"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { hero } from "@/lib/data/hero";

type HeroSlideState = {
  /** Índice de la entrada mostrada, dentro de `hero.slides`. */
  activeSlide: number;
  /** True desde el primer cambio. El fondo no se funde en la carga inicial. */
  hasSwitched: boolean;
  /** Salta a un índice. Da la vuelta, así que sirve para las flechas. */
  select: (index: number) => void;
  /** El carrusel no avanza solo mientras el puntero o el foco están encima. */
  setHeld: (held: boolean) => void;
};

const HeroSlideContext = createContext<HeroSlideState | null>(null);

/**
 * Estado compartido del slider del hero: qué juego se está mostrando.
 *
 * Va como context y no como props porque los dos consumidores están en ramas
 * distintas del árbol — el fondo es una capa absoluta detrás de todo y el
 * slider vive adentro de la fila de contenido. Pasarlo por props obligaría a
 * `HeroContent`, que es estático, a recibir y reenviar algo que no usa, y a
 * volverse client component sin motivo.
 *
 * Con el provider acá, el único JS que baja al cliente es el fondo, el slider
 * y estas líneas: el título, el copy y el CTA se siguen renderizando en el
 * servidor.
 *
 * **El avance automático es un desvío consciente de AGENTS regla 16**, pedido
 * por el usuario (2026-09-20) y anotado en PRD § 5, igual que el pill del menú
 * y el revelado de las miniaturas: cero librerías de motion.
 */
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

  /**
   * Único lugar del proyecto donde `prefers-reduced-motion` se lee desde JS: el
   * resto son transiciones y las apaga el propio CSS. Arranca en `false` para
   * que servidor y cliente rindan igual, y se corrige al montar.
   */
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (held || tabHidden || reducedMotion) return;

    const timer = setInterval(() => select(activeSlide + 1), hero.autoplayMs);
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
