/** Navegación del Home. Fase 1: hardcodeada (AGENTS regla 9). */

export type HomeSection = {
  /** `id` de la `<section>` destino: el menú scrollea, no rutea (PRD § 5). */
  id: string;
  /** Nombre accesible del link: el menú es solo íconos. */
  label: string;
  /**
   * Clases del ícono: la máscara (el SVG exportado de Figma, definido como
   * `@utility` en `globals.css`) y su tamaño nativo del diseño. El color no va
   * acá: lo pone el componente según el estado.
   */
  iconClassName: string;
};

/**
 * Los seis ítems que tienen contenido dentro del Home, en el orden pedido por
 * diseño — que no es el del Figma.
 *
 * El Figma trae un séptimo ítem ("Niveles") que no tiene sección en el Home:
 * queda fuera hasta que exista la pantalla.
 */
export const homeSections: HomeSection[] = [
  { id: "home", label: "Home", iconClassName: "nav-icon-home size-6.5" },
  { id: "torneos", label: "Torneos", iconClassName: "nav-icon-torneos size-6.5" },
  { id: "leaderboard", label: "Leaderboard", iconClassName: "nav-icon-leaderboard size-6" },
  { id: "misiones", label: "Misiones", iconClassName: "nav-icon-misiones size-4.5" },
  { id: "sura-news", label: "Sura News", iconClassName: "nav-icon-news size-5" },
  { id: "juegos", label: "Juegos", iconClassName: "nav-icon-juegos size-6" },
];

/** Sección activa al cargar la página. Después manda el click del usuario. */
export const defaultActiveSectionId = "home";
