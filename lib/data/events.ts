/** Sección Eventos del Home. Fase 1: hardcodeada (AGENTS regla 9). */

/** Ícono del badge. El archivo lo resuelve `event-card.tsx`. */
export type EventBadgeIcon = "mode" | "format" | "players";

export type EventBadge = {
  icon: EventBadgeIcon;
  label: string;
};

export type EventCardData = {
  id: string;
  title: string;
  /** Sólo se muestra en desktop: el frame mobile no la trae. */
  description: string;
  badges: EventBadge[];
  date: string;
  prize: string;
  /**
   * Fondo de la superficie de la card. `gamepad` es la foto oscura del joystick
   * y `sunset` el degradé naranja-azul, que se exportó del Figma porque es un
   * radial rotado y CSS no puede rotar un `radial-gradient`.
   */
  surface: "gamepad" | "sunset";
  /** Personaje que se sale por arriba de la card. */
  art: "domino" | "squad";
};

/**
 * Los cuatro eventos del frame desktop, en su orden.
 *
 * **La repetición es del diseño, no un error nuestro**: el Figma dibuja la
 * misma card de Valorant en las posiciones 1, 3 y 4. Se replica tal cual.
 *
 * El frame mobile trae sólo las tres primeras y a la primera le cambia la fecha
 * por "Comienza en 1 hr 30 min". Es variación de placeholder, no un estado
 * distinto: se unifica con el valor de desktop, que es el frame completo.
 */
export const events: EventCardData[] = [
  {
    id: "valorant-champions-tour",
    title: "Valorant Champions Tour",
    description:
      "Para completar esta misión, debes hacer clic en el botón de abajo para visitar la página requerida.",
    badges: [
      { icon: "mode", label: "Battle Royale" },
      { icon: "format", label: "2v2" },
      { icon: "players", label: "15 participantes" },
    ],
    date: "Nov 28, 8:00 PM",
    prize: "50 USD",
    surface: "gamepad",
    art: "domino",
  },
  {
    id: "fortnite-tournament",
    title: "Fortnite Tournament",
    description:
      "Para completar esta misión, debes hacer clic en el botón de abajo para visitar la página requerida.",
    badges: [
      { icon: "format", label: "1v1" },
      { icon: "players", label: "150 participantes" },
    ],
    date: "Nov 28, 8:00 PM",
    prize: "5 USD",
    surface: "sunset",
    art: "squad",
  },
  {
    id: "valorant-champions-tour-2",
    title: "Valorant Champions Tour",
    description:
      "Para completar esta misión, debes hacer clic en el botón de abajo para visitar la página requerida.",
    badges: [
      { icon: "mode", label: "Battle Royale" },
      { icon: "format", label: "2v2" },
      { icon: "players", label: "15 participantes" },
    ],
    date: "Nov 28, 8:00 PM",
    prize: "50 USD",
    surface: "gamepad",
    art: "domino",
  },
  {
    id: "valorant-champions-tour-3",
    title: "Valorant Champions Tour",
    description:
      "Para completar esta misión, debes hacer clic en el botón de abajo para visitar la página requerida.",
    badges: [
      { icon: "mode", label: "Battle Royale" },
      { icon: "format", label: "2v2" },
      { icon: "players", label: "15 participantes" },
    ],
    date: "Nov 28, 8:00 PM",
    prize: "50 USD",
    surface: "gamepad",
    art: "domino",
  },
];
