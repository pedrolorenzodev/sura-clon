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
 * Seis eventos. El Figma trae cuatro y repite la misma card de Valorant en las
 * posiciones 1, 3 y 4; el usuario pidió (2026-09-20) seis eventos **distintos**
 * para que el carrusel tenga recorrido y no se vea la repetición.
 *
 * Las dos primeras quedan tal cual el diseño. Las cuatro siguientes son
 * nombres, modalidades, fechas y premios inventados: siguen siendo relleno
 * hasta que llegue el listado real, pero ya no se leen como un error.
 *
 * El **arte** sí se repite, y no hay forma de evitarlo: el personaje que se
 * sale por arriba de la card tiene que ser una figura recortada y el diseño
 * sólo exportó dos. Las portadas de la sección Juegos son rectángulos opacos
 * (medido: 0% de alfa) y no sirven. Domino y Squad alternan.
 *
 * El frame mobile trae sólo las tres primeras y a la primera le cambia la fecha
 * por "Comienza en 1 hr 30 min". Es variación de placeholder, no un estado
 * distinto: se unifica con el valor de desktop, que es el frame completo.
 */
const DESCRIPTION =
  "Para completar esta misión, debes hacer clic en el botón de abajo para visitar la página requerida.";

export const events: EventCardData[] = [
  {
    id: "valorant-champions-tour",
    title: "Valorant Champions Tour",
    description: DESCRIPTION,
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
    description: DESCRIPTION,
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
    id: "copa-latam",
    title: "Copa LATAM Sura",
    description: DESCRIPTION,
    badges: [
      { icon: "mode", label: "Eliminación" },
      { icon: "format", label: "5v5" },
      { icon: "players", label: "80 participantes" },
    ],
    date: "Dic 02, 7:00 PM",
    prize: "250 USD",
    surface: "gamepad",
    art: "domino",
  },
  {
    id: "noche-de-duelos",
    title: "Noche de Duelos",
    description: DESCRIPTION,
    badges: [
      { icon: "format", label: "1v1" },
      { icon: "players", label: "32 participantes" },
    ],
    date: "Dic 05, 9:30 PM",
    prize: "20 USD",
    surface: "sunset",
    art: "squad",
  },
  {
    id: "clasificatorio-abierto",
    title: "Clasificatorio Abierto",
    description: DESCRIPTION,
    badges: [
      { icon: "mode", label: "Battle Royale" },
      { icon: "format", label: "3v3" },
      { icon: "players", label: "120 participantes" },
    ],
    date: "Dic 09, 6:00 PM",
    prize: "100 USD",
    surface: "gamepad",
    art: "domino",
  },
  {
    id: "final-de-temporada",
    title: "Final de Temporada",
    description: DESCRIPTION,
    badges: [
      { icon: "mode", label: "Eliminación" },
      { icon: "players", label: "16 participantes" },
    ],
    date: "Dic 14, 8:00 PM",
    prize: "500 USD",
    surface: "sunset",
    art: "squad",
  },
];
