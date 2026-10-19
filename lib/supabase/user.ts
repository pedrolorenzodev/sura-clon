import "server-only";
import { cache } from "react";
import { MY_PLAYER_ID, levels, type LevelId } from "@/lib/data/leaderboard";
import { HEADER_LEVEL_BADGE_SRC } from "@/lib/data/user";
import { supabase } from "@/lib/supabase/server";

export type CurrentUser = {
  name: string;
  avatarSrc: string;
  level: LevelId;
  levelLabel: string;
  levelBadgeSrc: string;
  streak: number;
  points: number;
};

export const getCurrentUser = cache(async (): Promise<CurrentUser> => {
  const { data, error } = await supabase
    .from("players")
    .select("name, avatar_src, level, points, streak")
    .eq("id", MY_PLAYER_ID)
    .single();
  if (error) throw error;
  return {
    name: data.name,
    avatarSrc: data.avatar_src,
    level: data.level as LevelId,
    levelLabel: `Nivel: ${levels[data.level as LevelId].label}`,
    levelBadgeSrc: HEADER_LEVEL_BADGE_SRC,
    streak: data.streak,
    points: data.points,
  };
});
