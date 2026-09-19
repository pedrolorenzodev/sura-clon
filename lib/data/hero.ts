/** Contenido del hero del Home. Fase 1: hardcodeado (AGENTS regla 9). */

/**
 * Un tramo del copy. El diseño corta las líneas a mano y **corta distinto en
 * cada tamaño**: desktop parte en 2 líneas (después de "completando") y mobile
 * en 3 (después de "niveles" y de "Recolectá"). Por eso el corte no puede
 * quedar librado al wrap del navegador.
 */
export type CopySegment = {
  text: string;
  /** En qué tamaño corta la línea después de este tramo. */
  breakAt?: "mobile" | "desktop";
};

/**
 * Una entrada del slider de miniaturas. Cada miniatura es la portada de un
 * juego, y la de la entrada activa es el arte que el hero muestra de fondo —
 * por eso la primera reusa el asset del hero en vez de duplicarlo: son el mismo
 * archivo del Figma (1440 × 811, verificado píxel a píxel).
 */
export type HeroSlide = {
  /** Juego de la portada. Va como `alt`: la miniatura no es decorativa. */
  game: string;
  thumbnailSrc: string;
};

export type Hero = {
  /** Las mayúsculas las pone el CSS: el diseño usa `text-transform`. */
  title: string;
  copy: CopySegment[];
  cta: { label: string; href: string };
  slides: HeroSlide[];
  /**
   * Miniatura seleccionada. Es una constante y no estado: el diseño trae un
   * solo arte de fondo, así que no hay adónde cambiar. Cuando lleguen los otros
   * tres, esto pasa a estado y el slider se vuelve client component.
   */
  activeSlide: number;
};

export const hero: Hero = {
  title: "Bienvenidos a la comunidad de sura",
  copy: [
    { text: "Unite a Sura, desbloqueá niveles", breakAt: "mobile" },
    { text: "completando", breakAt: "desktop" },
    { text: "misiones. Recolectá", breakAt: "mobile" },
    { text: "recompensas y ganá dinero jugando" },
  ],
  cta: { label: "COMENZAR AHORA", href: "#eventos" },
  slides: [
    { game: "Valorant", thumbnailSrc: "/assets/home/hero-art.jpg" },
    { game: "Fortnite", thumbnailSrc: "/assets/home/slider/fortnite.png" },
    { game: "Call of Duty: Black Ops 6", thumbnailSrc: "/assets/home/slider/black-ops-6.png" },
    { game: "Call of Duty: Modern Warfare III", thumbnailSrc: "/assets/home/slider/modern-warfare-3.png" },
  ],
  activeSlide: 0,
};
