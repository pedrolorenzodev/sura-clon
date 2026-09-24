export type LeaderboardEntry = {
  id: string;
  rank: number;
  name: string;
  levelLabel: string;
  points: string;
  avatarSrc: string;
};

export const leaderboard: LeaderboardEntry[] = [
  {
    id: "desenfrenado",
    rank: 1,
    name: "DesenfrenadO_",
    levelLabel: "Nivel: Leyenda",
    points: "7.015",
    avatarSrc: "/assets/home/leaderboard/avatar-1.webp",
  },
  {
    id: "bretasnft",
    rank: 2,
    name: "BretasNFT",
    levelLabel: "Nivel: Guerrero",
    points: "6.890",
    avatarSrc: "/assets/home/leaderboard/avatar-2.webp",
  },
  {
    id: "saboomafoo",
    rank: 3,
    name: "SabooMafoo",
    levelLabel: "Nivel: Héroe",
    points: "6.755",
    avatarSrc: "/assets/home/leaderboard/avatar-3.png",
  },
  ...["6.420", "5.980", "5.315", "4.870", "4.205"].map((points, i) => ({
    id: `usuario-${i + 4}`,
    rank: i + 4,
    name: "NombreUsuario",
    levelLabel: "Nivel: Leyenda",
    points,
    avatarSrc: "/assets/home/leaderboard/avatar-row.png",
  })),
];

export const podium = leaderboard.slice(0, 3);

export const leaderboardRows = leaderboard.slice(3);

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

export type Standing = {
  id: string;
  rank: string;
  name: string;
  avatarSrc: string;
  points: string;
  medals: string;
  streak: string;
  level: LevelId;
  deficit?: string;
  tone?: StandingTone;
};

export const standings: Standing[] = [
  {
    id: "desenfrenado",
    rank: "01",
    name: "DesenfrenadO_",
    avatarSrc: "/assets/home/leaderboard/avatar-1.webp",
    points: "7.015",
    medals: "30",
    streak: "3 días",
    level: "leyenda",
    tone: "gold",
  },
  {
    id: "bretasnft",
    rank: "02",
    name: "BretasNFT",
    avatarSrc: "/assets/home/leaderboard/avatar-2.webp",
    points: "6.890",
    medals: "33",
    streak: "0 días",
    level: "guerrero",
    deficit: "126",
    tone: "silver",
  },
  {
    id: "saboomafoo",
    rank: "03",
    name: "SabooMafoo",
    avatarSrc: "/assets/home/leaderboard/avatar-3.png",
    points: "6.755",
    medals: "32",
    streak: "0 días",
    level: "heroe",
    deficit: "136",
    tone: "bronze",
  },
  {
    id: "gushvz",
    rank: "04",
    name: "gushvz",
    avatarSrc: "/assets/leaderboard/avatar-04.webp",
    points: "6.685",
    medals: "29",
    streak: "1 día",
    level: "heroe",
    deficit: "71",
  },
  {
    id: "lobo-blanco",
    rank: "05",
    name: "Lobo Blanco",
    avatarSrc: "/assets/leaderboard/avatar-05.webp",
    points: "5.875",
    medals: "30",
    streak: "0 días",
    level: "guerrero",
    deficit: "811",
  },
  {
    id: "hardnft",
    rank: "06",
    name: "HarDNFT",
    avatarSrc: "/assets/leaderboard/avatar-06.webp",
    points: "5.845",
    medals: "27",
    streak: "0 días",
    level: "guerrero",
    deficit: "31",
  },
  {
    id: "loscar",
    rank: "07",
    name: "Loscar",
    avatarSrc: "/assets/leaderboard/avatar-07.jpg",
    points: "5.625",
    medals: "13",
    streak: "8 días",
    level: "guerrero",
    deficit: "221",
  },
  {
    id: "xynta",
    rank: "08",
    name: "Xynta",
    avatarSrc: "/assets/leaderboard/avatar-08.webp",
    points: "5.495",
    medals: "24",
    streak: "1 día",
    level: "guerrero",
    deficit: "131",
  },
  {
    id: "hitori",
    rank: "09",
    name: "Hitori",
    avatarSrc: "/assets/leaderboard/avatar-09.webp",
    points: "5.210",
    medals: "24",
    streak: "0 días",
    level: "guerrero",
    deficit: "286",
  },
  {
    id: "senhorpopo",
    rank: "10",
    name: "SenhorPopo",
    avatarSrc: "/assets/leaderboard/avatar-10.webp",
    points: "5.100",
    medals: "24",
    streak: "0 días",
    level: "guerrero",
    deficit: "111",
  },
];

export const myStanding: Standing = {
  id: "rocketman1989",
  rank: "+40",
  name: "RocketMan1989",
  avatarSrc: "/assets/leaderboard/avatar-me.png",
  points: "473",
  medals: "0",
  streak: "5 días",
  level: "novato",
  deficit: "1.996",
  tone: "me",
};

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
