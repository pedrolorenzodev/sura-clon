/** Navegación del Home. Fase 1: hardcodeada (AGENTS regla 9). */

export type HomeSection = {
  /** `id` de la `<section>` destino: el menú scrollea, no rutea (PRD § 5). */
  id: string;
  /** Nombre accesible del link: el menú es solo íconos. */
  label: string;
  /**
   * Clase de la máscara: el SVG exportado de Figma, definido como `@utility` en
   * `globals.css`. El color lo pone el componente según el estado.
   */
  icon: string;
  /**
   * Tamaño nativo del export, que es el que usa el riel desktop. La barra
   * mobile los unifica en 24, como su propio diseño.
   */
  iconSize: string;
};

/**
 * Los seis ítems que tienen contenido dentro del Home, en el orden pedido por
 * diseño — que no es el del Figma.
 *
 * El Figma trae un séptimo ítem ("Niveles") que no tiene sección en el Home:
 * queda fuera hasta que exista la pantalla.
 */
export const homeSections: HomeSection[] = [
  { id: "home", label: "Home", icon: "nav-icon-home", iconSize: "size-6.5" },
  { id: "eventos", label: "Eventos", icon: "nav-icon-torneos", iconSize: "size-6.5" },
  { id: "leaderboard", label: "Leaderboard", icon: "nav-icon-leaderboard", iconSize: "size-6" },
  { id: "misiones", label: "Misiones", icon: "nav-icon-misiones", iconSize: "size-4.5" },
  { id: "sura-news", label: "Sura News", icon: "nav-icon-news", iconSize: "size-5" },
  { id: "juegos", label: "Juegos", icon: "nav-icon-juegos", iconSize: "size-6" },
];

/** Sección activa al cargar la página. Después manda el click del usuario. */
export const defaultActiveSectionId = "home";
