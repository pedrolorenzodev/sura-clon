export type EventBadgeIcon = "mode" | "format" | "players";

export type EventBadge = {
  icon: EventBadgeIcon;
  label: string;
};

export type EventCardData = {
  id: string;
  title: string;
  description: string;
  badges: EventBadge[];
  date: string;
  prize: string;
  surface: "gamepad" | "sunset";
  art: "domino" | "squad";
};

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
