import "server-only";
import { cache } from "react";
import { supabase } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import type { DetailArt } from "@/lib/data/detail-art";
import type { LevelId } from "@/lib/data/leaderboard";
import { FIGMA_ART_CLASS, FIGMA_ART_ID } from "@/lib/data/tournament-detail";

type TournamentRow = Tables<"tournaments">;

type EventRow = Tables<"events"> & {
  tournaments: Pick<TournamentRow, "title" | "starts_at" | "prize_amount" | "prize_currency" | "mode" | "format" | "capacity">;
};

type DetailRow = TournamentRow & {
  tournament_prizes: Pick<Tables<"tournament_prizes">, "position" | "amount">[];
  tournament_participants: {
    position: number;
    players: Pick<Tables<"players">, "id" | "name" | "avatar_src" | "level">;
  }[];
};

export type TournamentBadgeIcon = "mode" | "format" | "players";

export type TournamentBadge = {
  icon: TournamentBadgeIcon;
  label: string;
};

export type Tournament = {
  id: string;
  game: string;
  title: string;
  date: string;
  prize: string;
  badges: TournamentBadge[];
  host: string;
  official?: boolean;
  about: string;
  imageSrc: string;
  heroSrc: string;
  bannerSrc: string;
};

export type TournamentParticipant = {
  id: string;
  name: string;
  avatarSrc: string;
  level: LevelId;
};

export type TournamentPrize = { position: number; prize: string | null };

export type TournamentDetail = Tournament & {
  art: DetailArt;
  startsInSeconds: number;
  joined: number;
  capacity: number;
  prizes: TournamentPrize[];
  participants: TournamentParticipant[];
};

export type EventCardData = Pick<TournamentDetail, "title" | "date" | "prize" | "badges"> & {
  id: string;
  tournamentId: string;
  description: string;
  surface: "gamepad" | "sunset" | "dota" | "valorant" | "fortnite" | "lol";
  art: "domino" | "squad" | "juggernaut" | "reyna" | "omega" | "yone";
};

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const ARGENTINA_OFFSET_MS = 3 * 60 * 60 * 1000;

const pad = (value: number) => String(value).padStart(2, "0");

const formatDate = (iso: string) => {
  const local = new Date(new Date(iso).getTime() - ARGENTINA_OFFSET_MS);
  return `${MONTHS[local.getUTCMonth()]} ${pad(local.getUTCDate())}, ${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}`;
};

const formatPrize = (row: Pick<TournamentRow, "prize_amount" | "prize_currency">) => `${row.prize_amount} ${row.prize_currency}`;

const toBadges = (row: Pick<TournamentRow, "mode" | "format">, players: string): TournamentBadge[] => [
  ...(row.mode ? [{ icon: "mode" as const, label: row.mode }] : []),
  { icon: "format", label: row.format },
  { icon: "players", label: players },
];

const toTournament = (row: TournamentRow): Tournament => ({
  id: row.id,
  game: row.game,
  title: row.title,
  date: formatDate(row.starts_at),
  prize: formatPrize(row),
  badges: toBadges(row, `${row.joined}/${row.capacity}`),
  host: row.host,
  official: row.official,
  about: row.about,
  imageSrc: row.image_src,
  heroSrc: row.hero_src,
  bannerSrc: row.banner_src,
});

const toEventCard = (row: EventRow): EventCardData => ({
  id: row.id,
  tournamentId: row.tournament_id,
  description: row.description,
  surface: row.surface as EventCardData["surface"],
  art: row.art as EventCardData["art"],
  title: row.tournaments.title,
  date: formatDate(row.tournaments.starts_at),
  prize: formatPrize(row.tournaments),
  badges: toBadges(row.tournaments, `${row.tournaments.capacity} participantes`),
});

const toTournamentDetail = (row: DetailRow): TournamentDetail => ({
  ...toTournament(row),
  badges: toBadges(row, `${row.capacity} participantes`),
  art: {
    desktop: row.hero_src,
    mobile: row.hero_src,
    className: row.id === FIGMA_ART_ID ? FIGMA_ART_CLASS : "inset-0 size-full",
  },
  startsInSeconds: row.starts_in_seconds,
  joined: row.joined,
  capacity: row.capacity,
  prizes: row.tournament_prizes.map((prize) => ({
    position: prize.position,
    prize: prize.amount === null ? null : `${prize.amount} ${row.prize_currency}`,
  })),
  participants: row.tournament_participants.map(({ players }) => ({
    id: players.id,
    name: players.name,
    avatarSrc: players.avatar_src,
    level: players.level as LevelId,
  })),
});

export async function getTournaments(): Promise<Tournament[]> {
  const { data, error } = await supabase.from("tournaments").select("*").order("sort_order");
  if (error) throw error;
  return data.map(toTournament);
}

export async function getTournamentIds(): Promise<string[]> {
  const { data, error } = await supabase.from("tournaments").select("id").order("sort_order");
  if (error) throw error;
  return data.map((row) => row.id);
}

export async function getEvents(): Promise<EventCardData[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*, tournaments(title, starts_at, prize_amount, prize_currency, mode, format, capacity)")
    .order("sort_order");
  if (error) throw error;
  return data.map(toEventCard);
}

export const getTournamentDetail = cache(async (id: string): Promise<TournamentDetail | null> => {
  const { data, error } = await supabase
    .from("tournaments")
    .select("*, tournament_prizes(position, amount), tournament_participants(position, players(id, name, avatar_src, level))")
    .eq("id", id)
    .order("position", { referencedTable: "tournament_prizes" })
    .order("position", { referencedTable: "tournament_participants" })
    .maybeSingle();
  if (error) throw error;
  return data && toTournamentDetail(data);
});
