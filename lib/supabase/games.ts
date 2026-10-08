import "server-only";
import type { Game } from "@/lib/data/games";
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

export async function getGames(): Promise<Game[]> {
  const { data, error } = await supabase.from("games").select("*").order("sort_order");
  if (error) throw error;
  return data.map(toGame);
}