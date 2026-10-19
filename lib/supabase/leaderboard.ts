import "server-only";
import { cache } from "react";
import { supabase } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import {
  levels,
  MY_PLAYER_ID,
  LEVEL_ORDER,
  LEVEL_GOAL,
  type LeaderboardMetric,
  type LeaderboardRange,
  type LevelId,
  type PlayerProfile,
  type Standing,
  type StandingTone,
  type LeaderboardEntry,
} from "@/lib/data/leaderboard";
import type { MedalArt } from "@/lib/data/medals";

type EntryRow = Tables<"leaderboard_entries"> & {
  players: Pick<Tables<"players">, "name" | "avatar_src" | "level">;
};

type PlayerRow = Tables<"players"> & {
  player_medals: Pick<Tables<"player_medals">, "medal_id">[];
};

export type LeaderboardView = { standings: Standing[]; me: Standing };

export type LeaderboardViews = Record<LeaderboardMetric, Record<LeaderboardRange, LeaderboardView>>;

const withThousands = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const plural = (value: number, one: string, many: string) => `${value} ${value === 1 ? one : many}`;

const UNIT: Record<LeaderboardMetric, ((value: number) => string) | null> = {
  "sura-points": null,
  medallas: (value) => plural(value, "medalla", "medallas"),
  racha: (value) => plural(value, "día", "días"),
  eventos: (value) => plural(value, "evento", "eventos"),
};

const TONES: StandingTone[] = ["gold", "silver", "bronze"];

const METRIC_KEY: Record<LeaderboardMetric, "points" | "medal_count" | "streak" | "events"> = {
  "sura-points": "points",
  medallas: "medal_count",
  racha: "streak",
  eventos: "events",
};

const toStanding = (
  row: EntryRow,
  metric: LeaderboardMetric,
  ahead: EntryRow | undefined,
  tone: StandingTone | undefined,
): Standing => {
  const key = METRIC_KEY[metric];
  const gap = ahead ? ahead[key] - row[key] + 1 : undefined;
  const unit = UNIT[metric];
  return {
    id: row.player_id,
    rank: String(row.position).padStart(2, "0"),
    name: row.players.name,
    avatarSrc: row.players.avatar_src,
    points: withThousands(row.points),
    medals: String(row.medal_count),
    streak: plural(row.streak, "día", "días"),
    level: row.players.level as LevelId,
    score: metric === "racha" ? plural(row.streak, "día", "días") : withThousands(row[key]),
    deficit: gap === undefined ? undefined : unit ? unit(gap) : withThousands(gap),
    deficitInPoints: !unit,
    tone,
  };
};

const toView = (rows: EntryRow[], metric: LeaderboardMetric): LeaderboardView => {
  const list = rows.filter((row) => row.player_id !== MY_PLAYER_ID);
  const mine = rows.find((row) => row.player_id === MY_PLAYER_ID)!;
  return {
    standings: list.map((row, index) => toStanding(row, metric, list[index - 1], TONES[index])),
    me: toStanding(mine, metric, list.find((row) => row.position === mine.position - 1), "me"),
  };
};

const METRICS: LeaderboardMetric[] = ["sura-points", "medallas", "racha", "eventos"];

const RANGES: LeaderboardRange[] = ["historico", "mensual", "semanal", "diario"];

export async function getLeaderboardView(metric: LeaderboardMetric, range: LeaderboardRange): Promise<LeaderboardView> {
  const { data, error } = await supabase
    .from("leaderboard_entries")
    .select("*, players(name, avatar_src, level)")
    .eq("metric", metric)
    .eq("period", range)
    .order("position");
  if (error) throw error;
  return toView(data, metric);
}

export async function getLeaderboardViews(): Promise<LeaderboardViews> {
  const { data, error } = await supabase
    .from("leaderboard_entries")
    .select("*, players(name, avatar_src, level)")
    .order("position");
  if (error) throw error;
  const views = METRICS.map((metric) => [
    metric,
    Object.fromEntries(
      RANGES.map((range) => [range, toView(data.filter((row) => row.metric === metric && row.period === range), metric)]),
    ),
  ]);
  return Object.fromEntries(views) as LeaderboardViews;
}

const toEntry = (entry: Standing): LeaderboardEntry => ({
  id: entry.id,
  rank: Number(entry.rank),
  name: entry.name,
  levelLabel: `Nivel: ${levels[entry.level].label}`,
  points: entry.points,
  avatarSrc: entry.avatarSrc,
});

export async function getLeaderboardPreview(): Promise<{ podium: LeaderboardEntry[]; rows: LeaderboardEntry[] }> {
  const { standings } = await getLeaderboardView("sura-points", "historico");
  return {
    podium: standings.slice(0, 3).map(toEntry),
    rows: standings.slice(3, 8).map(toEntry),
  };
}

const toPlayerProfile = (row: PlayerRow, catalog: Tables<"medals">[]): PlayerProfile => {
  const level = row.level as LevelId;
  const goal = LEVEL_GOAL[level];
  const owned = new Set(row.player_medals.map((medal) => medal.medal_id));
  return {
    id: row.id,
    name: row.name,
    avatarSrc: row.avatar_src,
    rank: row.historic_rank,
    daysAtRank: row.days_at_rank,
    points: withThousands(row.points),
    medals: String(row.medal_count),
    streak: plural(row.streak, "día", "días"),
    level,
    nextLevel: LEVEL_ORDER[Math.min(LEVEL_ORDER.indexOf(level) + 1, LEVEL_ORDER.length - 1)],
    levelPoints: withThousands(row.points),
    levelGoal: withThousands(goal),
    levelProgress: Math.min(1, row.points / goal),
    medalCollection: catalog.map((medal) => ({
      id: medal.id,
      label: medal.label,
      art: medal.art as MedalArt,
      locked: !owned.has(medal.id),
      sparkle: owned.has(medal.id) && medal.sparkle,
      reward: `+${medal.reward_points}`,
    })),
    unlockedMedals: owned.size,
  };
};

export const getPlayerProfiles = cache(async (): Promise<Record<string, PlayerProfile>> => {
  const [players, medals] = await Promise.all([
    supabase.from("players").select("*, player_medals(medal_id)"),
    supabase.from("medals").select("*").order("sort_order"),
  ]);
  if (players.error) throw players.error;
  if (medals.error) throw medals.error;
  return Object.fromEntries(players.data.map((row) => [row.id, toPlayerProfile(row, medals.data)]));
});
