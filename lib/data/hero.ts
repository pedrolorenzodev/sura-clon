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
 * Una entrada del slider del hero: un juego, su miniatura y el arte que el hero
 * muestra de fondo cuando está seleccionada.
 *
 * Valorant apunta al mismo archivo en los dos campos: la miniatura del Figma y
 * el arte del hero son el mismo asset (1440 × 811, verificado píxel a píxel),
 * así que no se duplica.
 */
export type HeroSlide = {
  /** Juego de la portada. Va como `alt`: la miniatura no es decorativa. */
  game: string;
  /** Portada chica del slider. */
  thumbnailSrc: string;
  /** Arte de fondo del hero. */
  artSrc: string;
  /**
   * Cómo se encuadra el arte en el hero.
   *
   * `design` es el encuadre medido sobre el Figma — 181.25% anclado arriba a la
   * izquierda en desktop, 254% en mobile — y sólo tiene sentido para el arte
   * del diseño, que está compuesto para ese recorte.
   *
   * `cover` es el default para los otros tres. El diseño no define cómo se ven,
   * y aplicarles el encuadre de Valorant los parte: son portadas centradas en
   * su logo, así que a 181% se ve un pedazo de letra. Centradas y a `cover` se
   * lee la composición que cada una trae.
   */
  framing: "design" | "cover";
};

export type Hero = {
  /** Las mayúsculas las pone el CSS: el diseño usa `text-transform`. */
  title: string;
  copy: CopySegment[];
  cta: { label: string; href: string };
  slides: HeroSlide[];
  /** Miniatura seleccionada al cargar. Después manda el click del usuario. */
  activeSlide: number;
  /** Cada cuánto avanza solo el carrusel. Se reinicia con cada cambio manual. */
  autoplayMs: number;
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
    {
      game: "Valorant",
      thumbnailSrc: "/assets/home/hero-art.jpg",
      artSrc: "/assets/home/hero-art@2x.jpg",
      framing: "design",
    },
    {
      game: "Fortnite",
      thumbnailSrc: "/assets/home/slider/fortnite.png",
      artSrc: "/assets/home/slider/fortnite@2x.jpg",
      framing: "cover",
    },
    {
      game: "Call of Duty: Black Ops 6",
      thumbnailSrc: "/assets/home/slider/black-ops-6.png",
      artSrc: "/assets/home/slider/black-ops-6@2x.jpg",
      framing: "cover",
    },
    {
      game: "Call of Duty: Modern Warfare III",
      thumbnailSrc: "/assets/home/slider/modern-warfare-3.png",
      artSrc: "/assets/home/slider/modern-warfare-3@2x.jpg",
      framing: "cover",
    },
  ],
  activeSlide: 0,
  autoplayMs: 3000,
};
