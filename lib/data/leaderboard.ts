export type LevelId = "novato" | "guerrero" | "heroe" | "leyenda";

export const levels: Record<
  LevelId,
  { label: string; iconSrc: string; iconWidth: number; iconHeight: number }
> = {
  novato: {
    label: "Novato",
    iconSrc: "/assets/leaderboard/level-novato.webp",
    iconWidth: 1080,
    iconHeight: 1080,
  },
  guerrero: {
    label: "Guerrero",
    iconSrc: "/assets/leaderboard/level-guerrero.webp",
    iconWidth: 1080,
    iconHeight: 1080,
  },
  heroe: {
    label: "Héroe",
    iconSrc: "/assets/leaderboard/level-heroe.webp",
    iconWidth: 888,
    iconHeight: 1056,
  },
  leyenda: {
    label: "Leyenda",
    iconSrc: "/assets/leaderboard/level-leyenda.webp",
    iconWidth: 1080,
    iconHeight: 1080,
  },
};

export type StandingTone = "gold" | "silver" | "bronze" | "me";

export type LeaderboardMetric = "sura-points" | "medallas" | "racha" | "eventos";

export type LeaderboardRange = "historico" | "mensual" | "semanal" | "diario";

export const MY_PLAYER_ID = "cerdo-capitalista";

export const LEADERBOARD_METRIC_ICON: Record<LeaderboardMetric, string> = {
  "sura-points": "/assets/home/sp-coin.webp",
  medallas: "/assets/leaderboard/medal-mini-1.webp",
  racha: "/assets/home/fire.png",
  eventos: "/assets/home/eventos/trophy.webp",
};

export const STANDINGS_PER_PAGE = 10;

export const standingsColumns = [
  "#",
  "Jugador",
  "Sura Points",
  "Medallas",
  "Racha de 0 días",
  "Nivel",
];

export const leaderboardTabs = [
  { id: "sura-points", label: "Sura Points" },
  { id: "medallas", label: "Medallas" },
  { id: "racha", label: "Racha" },
  { id: "eventos", label: "Eventos" },
];

export const leaderboardRanges = [
  { id: "historico", label: "Histórico" },
  { id: "mensual", label: "Mensual" },
  { id: "semanal", label: "Semanal" },
  { id: "diario", label: "Diario" },
];

export const medalStack = [
  "/assets/leaderboard/medal-mini-1.webp",
  "/assets/leaderboard/medal-mini-2.webp",
  "/assets/leaderboard/medal-mini-3.webp",
];

export const LEVEL_ORDER: LevelId[] = ["novato", "guerrero", "heroe", "leyenda"];

export const LEVEL_GOAL: Record<LevelId, number> = { novato: 1500, guerrero: 10000, heroe: 50000, leyenda: 125000 };
