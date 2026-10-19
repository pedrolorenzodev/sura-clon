import "server-only";
import { supabase } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import type { Medal, MedalArt } from "@/lib/data/medals";
import type { ProfileMedal } from "@/lib/data/profile";

type MedalRow = Tables<"medals"> & { player_medals: Pick<Tables<"player_medals">, "claimed">[] };

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
