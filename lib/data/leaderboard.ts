import { seeded } from "@/lib/collection";
import { PROFILE_MEDALS, type Medal } from "@/lib/data/medals";
import { currentUser } from "@/lib/data/user";

export type LeaderboardEntry = {
  id: string;
  rank: number;
  name: string;
  levelLabel: string;
  points: string;
  avatarSrc: string;
};


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

const PAISANOS: Player[] = [
  { id: "gauchopaisano", name: "gauchopaisano", avatarSrc: AVATARS[0], level: "leyenda", points: 7015, medals: 30, streak: 3, events: 14 },
  { id: "nays1", name: "nays1_", avatarSrc: AVATARS[1], level: "leyenda", points: 6890, medals: 33, streak: 0, events: 12 },
  { id: "emalorenzo", name: "emalorenzo_", avatarSrc: AVATARS[2], level: "heroe", points: 6755, medals: 32, streak: 0, events: 11 },
  { id: "seba-ceballos", name: "Seba Ceballos", avatarSrc: AVATARS[3], level: "heroe", points: 6685, medals: 29, streak: 1, events: 9 },
  { id: "alvaroechazu", name: "AlvaroEchazu", avatarSrc: AVATARS[4], level: "guerrero", points: 5875, medals: 30, streak: 0, events: 10 },
  { id: "mormonnegro", name: "mormonnegro", avatarSrc: AVATARS[5], level: "guerrero", points: 5845, medals: 27, streak: 0, events: 8 },
  { id: "sofiferro", name: "SofiFerro", avatarSrc: AVATARS[6], level: "guerrero", points: 5625, medals: 13, streak: 8, events: 6 },
  { id: "maurohouseless", name: "maurohouseless", avatarSrc: AVATARS[7], level: "guerrero", points: 5495, medals: 24, streak: 1, events: 7 },
  { id: "ainponce", name: "ainponce", avatarSrc: AVATARS[8], level: "guerrero", points: 5210, medals: 24, streak: 0, events: 5 },
  { id: "gonzamartinese", name: "gonzamartinese", avatarSrc: AVATARS[9], level: "guerrero", points: 5100, medals: 24, streak: 0, events: 6 },
];

const PINNED_LEADER = "gauchopaisano";
const PINNED_RUNNERS_UP = ["nays1", "emalorenzo"] as const;

const EXTRA_NAMES = [
  "KoibitoSura", "Madness9891", "Gasstiel", "NebulaFox", "PixelPampa", "Zurdo_GG", "LaChilindrina", "VortexAR",
  "Maté_Frag", "Ninja_Tango", "CholoSniper", "Lupe.exe", "RayoRioplata", "ElKraken", "Cumbia_Clutch", "Nahuel404",
  "SrPancho", "Tormenta_7", "Quilmes_Aim", "Fideo_Pro", "Morocha_TTV", "Gaucho_Byte", "Ruido_Blanco", "Yaguareté",
  "ZetaBoss", "Colectivo_60", "Bizcochito", "Neon_Mendoza", "Cachafaz", "LunaTucu", "Kuka_Plays", "Dulce_de_Lag",
  "Trueno_Azul", "Pibe_Rush", "Carpincho_GG", "Milanesa_OP", "Sombra_Sur", "Alfajor_Aim", "Tano_Tilt", "Boludeo_Pro",
];


const random = seeded("sura-leaderboard");
let nextPoints = 5100;

const PLAYERS: Player[] = [
  ...PAISANOS,
  ...EXTRA_NAMES.map((name, index) => {
    nextPoints -= 40 + Math.round(random() * 60);
    return {
      id: name.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name,
      avatarSrc: `/assets/avatars/avatar-${String(index + 1).padStart(2, "0")}.webp`,
      level: nextPoints > 3000 ? "guerrero" : "novato",
      points: nextPoints,
      medals: 2 + Math.round(random() * 24),
      streak: Math.round(random() * 12),
      events: 1 + Math.round(random() * 12),
    } satisfies Player;
  }),
];

export const MY_PLAYER_ID = "cerdo-capitalista";

export const ME: Player = {
  id: MY_PLAYER_ID,
  name: currentUser.name,
  avatarSrc: "/assets/leaderboard/avatar-me.png",
  level: "novato",
  points: 473,
  medals: 43,
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

const METRIC_ORDER: LeaderboardMetric[] = ["sura-points", "medallas", "racha", "eventos"];

const RANGE_ORDER: LeaderboardRange[] = ["historico", "mensual", "semanal", "diario"];

function pinnedOrder(metric: LeaderboardMetric, range: LeaderboardRange) {
  const [first, second] = PINNED_RUNNERS_UP;
  const swapped = (METRIC_ORDER.indexOf(metric) + RANGE_ORDER.indexOf(range)) % 2 === 1;
  return [PINNED_LEADER, ...(swapped ? [second, first] : [first, second])];
}

function liftAbove(stats: PlayerStats, key: keyof PlayerStats, floor: number, step: number, cap: number) {
  return { ...stats, [key]: Math.min(cap, Math.max(stats[key], floor + step)) };
}

export function rankStandings(metric: LeaderboardMetric, range: LeaderboardRange) {
  const key = METRIC_KEY[metric];
  const pinnedIds = pinnedOrder(metric, range);
  const entries = PLAYERS.map((player) => ({ player, stats: statsFor(player, range) }));
  const rest = entries.filter(({ player }) => !pinnedIds.includes(player.id)).sort(byMetric(metric));
  const mine = { player: ME, stats: statsFor(ME, range) };

  const cap = key === "streak" ? STREAK_CAP[range] : Infinity;
  let floor = Math.max(rest[0]?.stats[key] ?? 0, mine.stats[key]);
  const pinned = pinnedIds
    .map((id) => entries.find(({ player }) => player.id === id)!)
    .reverse()
    .map((entry) => {
      const step = key === "points" ? 20 + Math.round(seeded(`${entry.player.id}:${metric}:${range}`)() * 60) : 1;
      const stats = liftAbove(entry.stats, key, floor, step, cap);
      floor = stats[key];
      return { ...entry, stats };
    })
    .reverse();
  const ranked = [...pinned, ...rest];

  const standings = ranked.map(({ player, stats }, index) =>
    toStanding(player, stats, metric, String(index + 1).padStart(2, "0"), ranked[index - 1]?.stats, TONES[index]),
  );

  const restIndex = rest.findIndex((entry) => byMetric(metric)(mine, entry) < 0);
  const myRank = pinned.length + (restIndex === -1 ? rest.length : restIndex);
  const me = toStanding(ME, mine.stats, metric, String(myRank + 1).padStart(2, "0"), ranked[myRank - 1]?.stats, "me");

  return { standings, me };
}

export const STANDINGS_PER_PAGE = 10;

export const standings: Standing[] = rankStandings("sura-points", "historico").standings;

const toEntry = (entry: Standing): LeaderboardEntry => ({
  id: entry.id,
  rank: Number(entry.rank),
  name: entry.name,
  levelLabel: `Nivel: ${levels[entry.level].label}`,
  points: entry.points,
  avatarSrc: entry.avatarSrc,
});

export const podium: LeaderboardEntry[] = standings.slice(0, 3).map(toEntry);

export const leaderboardRows: LeaderboardEntry[] = standings.slice(3, 8).map(toEntry);

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
