"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { hero } from "@/lib/data/hero";

type HeroSlideState = {
  /** Índice de la entrada mostrada, dentro de `hero.slides`. */
  activeSlide: number;
  /** True desde el primer click. El fondo no se funde en la carga inicial. */
  hasSwitched: boolean;
  select: (index: number) => void;
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
 */
export function HeroSlideProvider({ children }: { children: React.ReactNode }) {
  const [activeSlide, setActiveSlide] = useState(hero.activeSlide);
  const [hasSwitched, setHasSwitched] = useState(false);

  const select = useCallback((index: number) => {
    setActiveSlide(index);
    setHasSwitched(true);
  }, []);

  const value = useMemo(
    () => ({ activeSlide, hasSwitched, select }),
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
