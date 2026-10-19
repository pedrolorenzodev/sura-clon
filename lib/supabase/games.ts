import "server-only";
import { cache } from "react";
import type { DetailArt } from "@/lib/data/detail-art";
import { facetLabel, gamesPromo, PROMO_GAME_ID, promoArt, type GameFacetValues } from "@/lib/data/games";
import { supabase } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

type GameDetailRow = Tables<"games"> & { game_reviews: Tables<"game_reviews">[] };

export type Game = {
  id: string;
  title: string;
  badges: string[];
  imageSrc: string;
  imageClass?: string;
  heroSrc?: string;
  about?: string;
  facets?: GameFacetValues;
};

export type GameDetail = {
  id: string;
  title: string[];
  rating: number;
  reviews: GameReview[];
  reviewsCount: number;
  tags: string[];
  platforms: string[];
  socials: string[];
  about: string;
  gallery: string[];
  art: DetailArt;
};

export type GameReview = {
  id: string;
  author: string;
  avatarSrc: string;
  time: string;
  rating: number | null;
  text: string;
  likes: number;
  liked: boolean;
};

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

const toGameReview = (row: Tables<"game_reviews">): GameReview => ({
  id: row.id,
  author: row.author,
  avatarSrc: row.avatar_src,
  time: row.time_label,
  rating: row.rating,
  text: row.text,
  likes: row.likes,
  liked: row.liked,
});

const toGameDetail = (row: GameDetailRow): GameDetail => {
  const isPromo = row.id === PROMO_GAME_ID;
  return {
    id: row.id,
    title: isPromo ? gamesPromo.title : [row.title],
    rating: row.rating,
    reviews: row.game_reviews.map(toGameReview),
    reviewsCount: row.reviews_count,
    tags: [...new Set([...row.genres.map((id) => facetLabel("genero", id)), ...row.badges])],
    platforms: row.platforms.map((id) => facetLabel("plataforma", id)),
    socials: row.socials.map((id) => facetLabel("redes", id)),
    about: row.about,
    gallery: row.gallery,
    art: isPromo ? promoArt : { desktop: row.hero_src, mobile: row.hero_src, className: "inset-0 size-full" },
  };
};

export async function getGameIds(): Promise<string[]> {
  const { data, error } = await supabase.from("games").select("id").order("sort_order");
  if (error) throw error;
  return data.map((row) => row.id);
}

export async function getGames(): Promise<Game[]> {
  const { data, error } = await supabase.from("games").select("*").eq("in_catalog", true).order("sort_order");
  if (error) throw error;
  return data.map(toGame);
}

export const getGameDetail = cache(async (id: string): Promise<GameDetail | null> => {
  const { data, error } = await supabase
    .from("games")
    .select("*, game_reviews(*)")
    .eq("id", id)
    .order("sort_order", { referencedTable: "game_reviews" })
    .maybeSingle();
  if (error) throw error;
  return data && toGameDetail(data);
});

export async function getSuggestedGames(id: string): Promise<Game[]> {
  const { data, error } = await supabase.from("games").select("*").eq("in_catalog", true).neq("id", id).order("sort_order").limit(7);
  if (error) throw error;
  return data.map(toGame);
}
