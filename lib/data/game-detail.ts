import { seeded } from "@/lib/collection";
import type { DetailArt } from "@/lib/data/detail-art";
import { facetLabel, games, gamesCatalog, gamesPromo, type Game } from "@/lib/data/games";


export type GameDetail = {
  id: string;
  title: string[];
  rating: number;
  reviewsCount: number;
  tags: string[];
  platforms: string[];
  socials: string[];
  about: string;
  gallery: string[];
  art: DetailArt;
};

export const PROMO_GAME_ID = "mundial-fifa-2026";

const GALLERY = ["/assets/games/detail/gallery-01.webp", "/assets/games/detail/gallery-02.webp"];

const promoGame: GameDetail = {
  id: PROMO_GAME_ID,
  title: gamesPromo.title,
  rating: 4.2,
  reviewsCount: 84,
  tags: ["Mini-Juego", "Fútbol", "Online"],
  platforms: [],
  socials: [],
  about:
    "Juega al nuevo juego de fútbol Soccer Super Star y disfruta de una experiencia de fútbol real, ultra rápida e inmersiva. ¿Te gustan los arcades de fútbol pero no tienes tiempo de practicar? Los controles de juego del nuevo Soccer Super Star son muy sencillos, diviértete desde el principio.",
  gallery: [...GALLERY, ...GALLERY],
  art: {
    desktop: "/assets/games/detail/hero-fc26.webp",
    mobile: "/assets/games/banner-mobile.webp",
    className:
      "left-[-31.36%] top-[-32.43%] aspect-square w-[162.72%] desktop:inset-0 desktop:aspect-auto desktop:size-full desktop:object-[50%_33.25%]",
  },
};

function detailFromGame(game: Game): GameDetail {
  const noise = seeded(`${game.id}:detail`);

  return {
    id: game.id,
    title: [game.title],
    rating: Math.round((4.1 + noise() * 0.8) * 10) / 10,
    reviewsCount: 12 + Math.floor(noise() * 240),
    tags: [...new Set([...(game.facets?.genero.map((id) => facetLabel("genero", id)) ?? []), ...game.badges])],
    platforms: game.facets?.plataforma.map((id) => facetLabel("plataforma", id)) ?? [],
    socials: game.facets?.redes.map((id) => facetLabel("redes", id)) ?? [],
    about: `${game.title} es parte del catálogo de Sura Gaming. Jugalo desde la app, sumá Sura Points con cada partida y competí en los eventos de la comunidad para escalar en el leaderboard.`,
    gallery: [],
    art: { desktop: game.imageSrc, mobile: game.imageSrc, className: "inset-0 size-full" },
  };
}

const details = new Map(
  [promoGame, ...[...games, ...gamesCatalog].map(detailFromGame)].map((detail) => [detail.id, detail]),
);

export const gameDetailIds = [...details.keys()];

export const getGameDetail = (id: string) => details.get(id);

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

export const gameReviews: GameReview[] = [
  {
    id: "jordan-smith",
    author: "Jordan Smith",
    avatarSrc: "/assets/games/detail/review-jordan.webp",
    time: "Hace 12 horas",
    rating: 5,
    text: "¡El mejor juego para móvil que he jugado este año! Los desarrolladores claramente le dedicaron mucho esfuerzo a cada aspecto del juego. ¡Lo recomiendo muchísimo!",
    likes: 5,
    liked: false,
  },
  {
    id: "taylor-kim",
    author: "Taylor Kim",
    avatarSrc: "/assets/games/detail/review-taylor.webp",
    time: "Hace 2 días",
    rating: 3,
    text: "Quería que me gustara este juego, pero se bloquea con demasiada frecuencia en mi dispositivo.",
    likes: 995,
    liked: true,
  },
];

export const gameNetwork = { name: "Solana", logoSrc: "/assets/games/detail/network-solana.webp" };

const FIGMA_SOCIALS = ["Whitepaper", "Twitter", "Discord", "Instagram", "Telegram", "Youtube", "Linkedin", "Medium"];

export const gameSocials = (game: GameDetail) => (game.socials.length ? game.socials : FIGMA_SOCIALS);

export const suggestedGames = (id: string) => games.filter((game) => game.id !== id).slice(0, 7);
