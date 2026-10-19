import "server-only";
import { cache } from "react";
import { MY_PLAYER_ID } from "@/lib/data/leaderboard";
import type { Mission, MissionCategory } from "@/lib/data/missions";
import { supabase } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

type MissionRow = Tables<"missions"> & {
  mission_steps: Pick<Tables<"mission_steps">, "position" | "text">[];
  player_missions: Pick<Tables<"player_missions">, "player_id">[];
};

export type MissionDetail = Mission & { steps: string[]; rewardPoints: number };

const toMission = (row: MissionRow): Mission => ({
  id: row.id,
  title: row.title,
  description: row.description,
  reward: `+${row.reward_points}`,
  imageSrc: row.image_src,
  status: row.ended ? "ended" : row.player_missions.length > 0 ? "completed" : "available",
  category: row.category as MissionCategory,
  highlighted: row.highlighted,
});

const toMissionDetail = (row: MissionRow): MissionDetail => ({
  ...toMission(row),
  steps: row.mission_steps.map((step) => step.text),
  rewardPoints: row.reward_points,
});

const getMissionRows = cache(async () => {
  const { data, error } = await supabase
    .from("missions")
    .select("*, mission_steps(position, text), player_missions(player_id)")
    .eq("player_missions.player_id", MY_PLAYER_ID)
    .order("sort_order")
    .order("position", { referencedTable: "mission_steps" });
  if (error) throw error;
  return data;
});

export async function getHomeMissions(): Promise<Mission[]> {
  const rows = await getMissionRows();
  return rows
    .filter((row) => row.home_position !== null)
    .sort((a, b) => (a.home_position ?? 0) - (b.home_position ?? 0))
    .map(toMission);
}

export async function getFeaturedMissions(): Promise<Mission[]> {
  return (await getMissionRows()).filter((row) => row.featured).map(toMission);
}

export async function getCollectionMissions(): Promise<Mission[]> {
  return (await getMissionRows()).filter((row) => !row.featured).map(toMission);
}

export async function getMissionDetails(): Promise<Record<string, MissionDetail>> {
  const rows = await getMissionRows();
  return Object.fromEntries(rows.map((row) => [row.id, toMissionDetail(row)]));
}
