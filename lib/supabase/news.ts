import "server-only";
import { cache } from "react";
import { supabase } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import type { NewsCategory } from "@/lib/data/news";

export type NewsBlock = { type: "p" | "h" | "quote"; text: string };

export type NewsItem = {
  id: string;
  title: string;
  imageSrc: string;
  readTime: string;
  date: string;
  category: NewsCategory;
  body: NewsBlock[];
};

const formatDate = (iso: string) => {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year.slice(2)}`;
};

const toNewsItem = (row: Tables<"news">): NewsItem => ({
  id: row.id,
  title: row.title,
  imageSrc: row.image_src,
  category: row.category as NewsCategory,
  date: formatDate(row.published_at),
  readTime: `${row.read_minutes} min`,
  body: row.body as NewsBlock[],
});

export async function getNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase.from("news").select("*").order("sort_order");
  if (error) throw error;
  return data.map(toNewsItem);
}

export const getNewsItem = cache(async (id: string): Promise<NewsItem | null> => {
  const { data, error } = await supabase.from("news").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data && toNewsItem(data);
});

export async function getRelatedNews(item: NewsItem): Promise<NewsItem[]> {
  const [sameCategoriesResponse, otherCategoriesResponse] = await Promise.all([
    supabase.from("news").select("*").eq("category", item.category).neq("id", item.id).order("sort_order").limit(3),
    supabase.from("news").select("*").neq("category", item.category).neq("id", item.id).order("sort_order").limit(3),
  ]);
  if (sameCategoriesResponse.error) throw sameCategoriesResponse.error;
  if (otherCategoriesResponse.error) throw otherCategoriesResponse.error;
  const same = sameCategoriesResponse.data;
  const others = otherCategoriesResponse.data;

  return [...same, ...others].slice(0, 3).map(toNewsItem);
}
