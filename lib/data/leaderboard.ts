import { PROFILE_MEDALS, type Medal } from "@/lib/data/medals";

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
];

export const podium = leaderboard.slice(0, 3);

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
  deficitInPoints?: boolean;
  score: string;
  tone?: StandingTone;
};

export type LeaderboardMetric = "sura-points" | "medallas" | "racha" | "eventos";

export type LeaderboardRange = "historico" | "mensual" | "semanal" | "diario";

type Player = {
  id: string;
  name: string;
  avatarSrc: string;
  level: LevelId;
  points: number;
  medals: number;
  streak: number;
  events: number;
};

type PlayerStats = Pick<Player, "points" | "medals" | "streak" | "events">;

const AVATARS = [
  "/assets/home/leaderboard/avatar-1.webp",
  "/assets/home/leaderboard/avatar-2.webp",
  "/assets/home/leaderboard/avatar-3.png",
  "/assets/leaderboard/avatar-04.webp",
  "/assets/leaderboard/avatar-05.webp",
  "/assets/leaderboard/avatar-06.webp",
  "/assets/leaderboard/avatar-07.jpg",
  "/assets/leaderboard/avatar-08.webp",
  "/assets/leaderboard/avatar-09.webp",
  "/assets/leaderboard/avatar-10.webp",
];

const DESIGN_PLAYERS: Player[] = [
  { id: "desenfrenado", name: "DesenfrenadO_", avatarSrc: AVATARS[0], level: "leyenda", points: 7015, medals: 30, streak: 3, events: 14 },
  { id: "bretasnft", name: "BretasNFT", avatarSrc: AVATARS[1], level: "guerrero", points: 6890, medals: 33, streak: 0, events: 12 },
  { id: "saboomafoo", name: "SabooMafoo", avatarSrc: AVATARS[2], level: "heroe", points: 6755, medals: 32, streak: 0, events: 11 },
  { id: "gushvz", name: "gushvz", avatarSrc: AVATARS[3], level: "heroe", points: 6685, medals: 29, streak: 1, events: 9 },
  { id: "lobo-blanco", name: "Lobo Blanco", avatarSrc: AVATARS[4], level: "guerrero", points: 5875, medals: 30, streak: 0, events: 10 },
  { id: "hardnft", name: "HarDNFT", avatarSrc: AVATARS[5], level: "guerrero", points: 5845, medals: 27, streak: 0, events: 8 },
  { id: "loscar", name: "Loscar", avatarSrc: AVATARS[6], level: "guerrero", points: 5625, medals: 13, streak: 8, events: 6 },
  { id: "xynta", name: "Xynta", avatarSrc: AVATARS[7], level: "guerrero", points: 5495, medals: 24, streak: 1, events: 7 },
  { id: "hitori", name: "Hitori", avatarSrc: AVATARS[8], level: "guerrero", points: 5210, medals: 24, streak: 0, events: 5 },
  { id: "senhorpopo", name: "SenhorPopo", avatarSrc: AVATARS[9], level: "guerrero", points: 5100, medals: 24, streak: 0, events: 6 },
];

const EXTRA_NAMES = [
  "KoibitoSura", "Madness9891", "Gasstiel", "NebulaFox", "PixelPampa", "Zurdo_GG", "LaChilindrina", "VortexAR",
  "Maté_Frag", "Ninja_Tango", "CholoSniper", "Lupe.exe", "RayoRioplata", "ElKraken", "Cumbia_Clutch", "Nahuel404",
  "SrPancho", "Tormenta_7", "Quilmes_Aim", "Fideo_Pro", "Morocha_TTV", "Gaucho_Byte", "Ruido_Blanco", "Yaguareté",
  "ZetaBoss", "Colectivo_60", "Bizcochito", "Neon_Mendoza", "Cachafaz", "LunaTucu", "Kuka_Plays", "Dulce_de_Lag",
  "Trueno_Azul", "Pibe_Rush", "Carpincho_GG", "Milanesa_OP", "Sombra_Sur", "Alfajor_Aim", "Tano_Tilt", "Boludeo_Pro",
];

function seeded(seed: string) {
  let state = [...seed].reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619), 2166136261);
  return () => {
    state = Math.imul(state ^ (state >>> 15), 2246822507);
    state = Math.imul(state ^ (state >>> 13), 3266489909);
    return ((state ^= state >>> 16) >>> 0) / 4294967296;
  };
}

const random = seeded("sura-leaderboard");
let nextPoints = 5100;

const PLAYERS: Player[] = [
  ...DESIGN_PLAYERS,
  ...EXTRA_NAMES.map((name, index) => {
    nextPoints -= 40 + Math.round(random() * 60);
    return {
      id: name.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name,
      avatarSrc: AVATARS[(index + 3) % AVATARS.length],
      level: nextPoints > 3000 ? "guerrero" : "novato",
      points: nextPoints,
      medals: 2 + Math.round(random() * 24),
      streak: Math.round(random() * 12),
      events: 1 + Math.round(random() * 12),
    } satisfies Player;
  }),
];

const ME: Player = {
  id: "rocketman1989",
  name: "RocketMan1989",
  avatarSrc: "/assets/leaderboard/avatar-me.png",
  level: "novato",
  points: 473,
  medals: 0,
  streak: 5,
  events: 1,
};

const POINTS_FACTOR: Record<LeaderboardRange, number> = { historico: 1, mensual: 0.22, semanal: 0.06, diario: 0.012 };

const COUNT_FACTOR: Record<LeaderboardRange, number> = { historico: 1, mensual: 0.4, semanal: 0.15, diario: 0.05 };

const STREAK_CAP: Record<LeaderboardRange, number> = { historico: Infinity, mensual: 30, semanal: 7, diario: 1 };

function statsFor(player: Player, range: LeaderboardRange): PlayerStats {
  if (range === "historico") return player;
  const noise = seeded(`${player.id}:${range}`);
  const scale = (value: number, factor: Record<LeaderboardRange, number>) =>
    Math.round(value * factor[range] * (0.5 + noise()));
  return {
    points: scale(player.points, POINTS_FACTOR),
    medals: scale(player.medals, COUNT_FACTOR),
    streak: Math.min(player.streak, STREAK_CAP[range]),
    events: scale(player.events, COUNT_FACTOR),
  };
}

const METRIC_KEY: Record<LeaderboardMetric, keyof PlayerStats> = {
  "sura-points": "points",
  medallas: "medals",
  racha: "streak",
  eventos: "events",
};

export const LEADERBOARD_METRIC_ICON: Record<LeaderboardMetric, string> = {
  "sura-points": "/assets/home/sp-coin.webp",
  medallas: "/assets/leaderboard/medal-mini-1.webp",
  racha: "/assets/home/fire.png",
  eventos: "/assets/home/eventos/trophy.webp",
};

const withThousands = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const plural = (value: number, one: string, many: string) => `${value} ${value === 1 ? one : many}`;

const UNIT: Record<LeaderboardMetric, ((value: number) => string) | null> = {
  "sura-points": null,
  medallas: (value) => plural(value, "medalla", "medallas"),
  racha: (value) => plural(value, "día", "días"),
  eventos: (value) => plural(value, "evento", "eventos"),
};

const TONES: StandingTone[] = ["gold", "silver", "bronze"];

function toStanding(
  player: Player,
  stats: PlayerStats,
  metric: LeaderboardMetric,
  rank: string,
  ahead: PlayerStats | undefined,
  tone: StandingTone | undefined,
): Standing {
  const key = METRIC_KEY[metric];
  const gap = ahead ? ahead[key] - stats[key] + 1 : undefined;
  return {
    id: player.id,
    rank,
    name: player.name,
    avatarSrc: player.avatarSrc,
    points: withThousands(stats.points),
    medals: String(stats.medals),
    streak: plural(stats.streak, "día", "días"),
    level: player.level,
    score: metric === "racha" ? plural(stats.streak, "día", "días") : withThousands(stats[key]),
    deficit: gap === undefined ? undefined : UNIT[metric] ? UNIT[metric](gap) : withThousands(gap),
    deficitInPoints: !UNIT[metric],
    tone,
  };
}

const byMetric = (metric: LeaderboardMetric) => {
  const key = METRIC_KEY[metric];
  return (a: { stats: PlayerStats; player: Player }, b: { stats: PlayerStats; player: Player }) =>
    b.stats[key] - a.stats[key] || b.stats.points - a.stats.points || a.player.name.localeCompare(b.player.name);
};

export function rankStandings(metric: LeaderboardMetric, range: LeaderboardRange) {
  const ranked = PLAYERS.map((player) => ({ player, stats: statsFor(player, range) })).sort(byMetric(metric));

  const standings = ranked.map(({ player, stats }, index) =>
    toStanding(player, stats, metric, String(index + 1).padStart(2, "0"), ranked[index - 1]?.stats, TONES[index]),
  );

  const mine = { player: ME, stats: statsFor(ME, range) };
  const myIndex = ranked.findIndex((entry) => byMetric(metric)(mine, entry) < 0);
  const myRank = myIndex === -1 ? ranked.length : myIndex;
  const me = toStanding(ME, mine.stats, metric, String(myRank + 1), ranked[myRank - 1]?.stats, "me");

  return { standings, me };
}

export const STANDINGS_PER_PAGE = 10;

export const standings: Standing[] = rankStandings("sura-points", "historico").standings;

export const leaderboardRows: LeaderboardEntry[] = standings.slice(3, 8).map((entry) => ({
  id: entry.id,
  rank: Number(entry.rank),
  name: entry.name,
  levelLabel: `Nivel: ${levels[entry.level].label}`,
  points: entry.points,
  avatarSrc: entry.avatarSrc,
}));

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

const LEVEL_ORDER: LevelId[] = ["novato", "guerrero", "heroe", "leyenda"];

const LEVEL_GOAL: Record<LevelId, number> = { novato: 1500, guerrero: 10000, heroe: 50000, leyenda: 125000 };

export type PlayerProfile = {
  id: string;
  name: string;
  avatarSrc: string;
  rank: number;
  daysAtRank: number;
  points: string;
  medals: string;
  streak: string;
  level: LevelId;
  nextLevel: LevelId;
  levelPoints: string;
  levelGoal: string;
  levelProgress: number;
  medalCollection: Medal[];
  unlockedMedals: number;
};

const HISTORIC_RANKING = [...PLAYERS].sort((a, b) => b.points - a.points);

export function playerProfile(id: string): PlayerProfile | undefined {
  const player = id === ME.id ? ME : PLAYERS.find((candidate) => candidate.id === id);
  if (!player) return undefined;

  const index = HISTORIC_RANKING.indexOf(player);
  const rank = index === -1 ? HISTORIC_RANKING.filter((other) => other.points > player.points).length + 1 : index + 1;
  const noise = seeded(`${player.id}:profile`);
  const unlockable = PROFILE_MEDALS.filter((medal) => !medal.locked);
  const unlocked = Math.min(unlockable.length, Math.round((player.medals / 30) * unlockable.length));
  const unlockedIds = new Set(
    unlockable
      .map((medal) => ({ medal, order: noise() }))
      .sort((a, b) => a.order - b.order)
      .slice(0, unlocked)
      .map(({ medal }) => medal.id),
  );
  const goal = LEVEL_GOAL[player.level];

  return {
    id: player.id,
    name: player.name,
    avatarSrc: player.avatarSrc,
    rank,
    daysAtRank: 1 + Math.floor(noise() * 40),
    points: withThousands(player.points),
    medals: String(player.medals),
    streak: plural(player.streak, "día", "días"),
    level: player.level,
    nextLevel: LEVEL_ORDER[Math.min(LEVEL_ORDER.indexOf(player.level) + 1, LEVEL_ORDER.length - 1)],
    levelPoints: withThousands(player.points),
    levelGoal: withThousands(goal),
    levelProgress: Math.min(1, player.points / goal),
    medalCollection: PROFILE_MEDALS.map((medal) => ({
      ...medal,
      locked: !unlockedIds.has(medal.id),
      sparkle: unlockedIds.has(medal.id) && medal.sparkle,
    })),
    unlockedMedals: unlocked,
  };
}
