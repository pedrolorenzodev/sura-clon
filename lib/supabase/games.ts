import "server-only";
import { cache } from "react";
import { facetLabel, type Game } from "@/lib/data/games";
import type { GameDetail } from "@/lib/data/game-detail";
import { supabase } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

const toGame = (row: Tables<"games">): Game => ({
  id: row.id,
  title: row.title,
  badges: row.badges,
  imageSrc: row.image_src,
  heroSrc: row.hero_src,
  about: row.about,
  facets: {
    genero: row.genres,
    plataforma: row.platforms,
    estado: row.statuses,
    redes: row.socials,
  },
});

const toGameDetail = (row: Tables<"games">): GameDetail => ({
  id: row.id,
  title: [row.title],
  rating: row.rating,
  reviewsCount: row.reviews_count,
  tags: [...new Set([...row.genres.map((id) => facetLabel("genero", id)), ...row.badges])],
  platforms: row.platforms.map((id) => facetLabel("plataforma", id)),
  socials: row.socials.map((id) => facetLabel("redes", id)),
  about: row.about,
  gallery: [],
  art: { desktop: row.hero_src, mobile: row.hero_src, className: "inset-0 size-full" },
});

export async function getGames(): Promise<Game[]> {
  const { data, error } = await supabase.from("games").select("*").order("sort_order");
  if (error) throw error;
  return data.map(toGame);
}

export const getGameDetail = cache(async (id: string): Promise<GameDetail | null> => {
  const { data, error } = await supabase.from("games").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data && toGameDetail(data);
});

export async function getSuggestedGames(id: string): Promise<Game[]> {
  const { data, error } = await supabase.from("games").select("*").neq("id", id).order("sort_order").limit(7);
  if (error) throw error;
  return data.map(toGame);
}