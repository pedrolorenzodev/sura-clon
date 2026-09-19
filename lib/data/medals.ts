/** Sección Medallas del Home. Fase 1: hardcodeada (AGENTS regla 9). */

/**
 * Qué arte usa la medalla. El archivo y el recorte los resuelve `medal-card.tsx`.
 *
 * El Figma sirve las doradas en **dos sprites de 2 × 2** y recorta un cuadrante
 * por celda; las grises vienen como imagen suelta. Se replica así en vez de
 * pedir nueve exports: es el mismo asset del diseño, sin redibujarlo (regla 10).
 */
export type MedalArt =
  | "devocion"
  | "social"
  | "first-victory"
  | "consistencia"
  | "point-collector"
  | "sharpshooter"
  | "event-master"
  | "influencer"
  | "ranking";

export type Medal = {
  id: string;
  /** Nombre debajo de la medalla, tal cual el diseño. */
  label: string;
  art: MedalArt;
  /** Las bloqueadas van apagadas, sin borde verde y con candado. */
  locked: boolean;
  /** El destello sólo lo llevan tres de las nueve, y así está en el Figma. */
  sparkle: boolean;
};

/** Las nueve del Home, en el orden de la grilla (3 × 3, de izquierda a derecha). */
export const medals: Medal[] = [
  { id: "devocion-diaria", label: "Devoción diaria", art: "devocion", locked: false, sparkle: false },
  { id: "social-butterfly", label: "Social Butterfly", art: "social", locked: true, sparkle: false },
  { id: "first-victory", label: "First Victory", art: "first-victory", locked: false, sparkle: true },
  { id: "consistencia", label: "Consistencia", art: "consistencia", locked: true, sparkle: false },
  { id: "point-collector", label: "Point Collector", art: "point-collector", locked: false, sparkle: true },
  { id: "sharpshooter", label: "Sharpshooter", art: "sharpshooter", locked: true, sparkle: false },
  { id: "event-master", label: "Event Master", art: "event-master", locked: false, sparkle: true },
  { id: "influencer", label: "Influencer", art: "influencer", locked: true, sparkle: false },
  { id: "ranking", label: "Ranking", art: "ranking", locked: false, sparkle: false },
];
