import type { DetailArt } from "@/lib/data/detail-art";

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

export const starFill = (rating: number, index: number) => {
  const filled = Math.ceil(rating * 2) / 2 - index;
  return filled >= 1 ? "full" : filled > 0 ? "half" : "empty";
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

export const gameNetwork = { name: "Solana", logoSrc: "/assets/games/detail/network-solana.webp" };

const FIGMA_SOCIALS = ["Whitepaper", "Twitter", "Discord", "Instagram", "Telegram", "Youtube", "Linkedin", "Medium"];

export const gameSocials = (game: GameDetail) => (game.socials.length ? game.socials : FIGMA_SOCIALS);
