import "server-only";
import { supabase } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

type MedalRow = Tables<"medals"> & { player_medals: Pick<Tables<"player_medals">, "claimed">[] };

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
  label: string;
  art: MedalArt;
  locked: boolean;
  sparkle: boolean;
  reward?: string;
};

export type ProfileMedalState = "claimed" | "claimable" | "locked";

export type ProfileMedal = Medal & { state: ProfileMedalState; reward: string; rewardPoints: number };

const toMedal = (row: MedalRow): Medal => {
  const owned = row.player_medals.length > 0;
  return {
    id: row.id,
    label: row.label,
    art: row.art as MedalArt,
    locked: !owned,
    sparkle: owned && row.sparkle,
  };
};

const toProfileMedal = (row: MedalRow): ProfileMedal => {
  const owned = row.player_medals[0];
  return {
    ...toMedal(row),
    state: !owned ? "locked" : owned.claimed ? "claimed" : "claimable",
    reward: `+${row.reward_points}`,
    rewardPoints: row.reward_points,
  };
};

const fetchMedalRows = async (playerId: string) => {
  const { data, error } = await supabase
    .from("medals")
    .select("*, player_medals(claimed)")
    .eq("player_medals.player_id", playerId)
    .order("sort_order");
  if (error) throw error;
  return data;
};

export async function getPlayerMedals(playerId: string): Promise<Medal[]> {
  return (await fetchMedalRows(playerId)).map(toMedal);
}

export async function getProfileMedals(playerId: string): Promise<ProfileMedal[]> {
  return (await fetchMedalRows(playerId)).map(toProfileMedal);
}
