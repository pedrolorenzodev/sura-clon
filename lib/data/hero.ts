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

export type Hero = {
  /** Las mayúsculas las pone el CSS: el diseño usa `text-transform`. */
  title: string;
  copy: CopySegment[];
  cta: { label: string; href: string };
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
};
