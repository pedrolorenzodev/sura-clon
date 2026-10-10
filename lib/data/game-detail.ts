import { seeded } from "@/lib/collection";
import type { DetailArt } from "@/lib/data/detail-art";
import { PROMO_GAME_ID } from "@/lib/data/games";

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

const FIGMA_REVIEWS: GameReview[] = [
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

const REVIEW_POOL: GameReview[] = [
  {
    id: "valentina-rios",
    author: "Valentina Ríos",
    avatarSrc: "/assets/avatars/avatar-41.webp",
    time: "Hace 3 horas",
    rating: 5,
    text: "Lo juego todas las noches con mi clan. Las partidas se arman rápido y los eventos de Sura le suman un montón.",
    likes: 42,
    liked: false,
  },
  {
    id: "mateo-fernandez",
    author: "Mateo Fernández",
    avatarSrc: "/assets/avatars/avatar-42.webp",
    time: "Hace 5 horas",
    rating: 4,
    text: "Muy bueno, pero el matchmaking a veces tarda más de la cuenta en horario pico.",
    likes: 17,
    liked: false,
  },
  {
    id: "camila-duarte",
    author: "Camila Duarte",
    avatarSrc: "/assets/avatars/avatar-43.webp",
    time: "Hace 1 día",
    rating: 5,
    text: "Me enganchó desde la primera partida. El arte es increíble y la dificultad está bien pensada.",
    likes: 88,
    liked: false,
  },
  {
    id: "nicolas-paz",
    author: "Nicolás Paz",
    avatarSrc: "/assets/avatars/avatar-44.webp",
    time: "Hace 1 día",
    rating: 3,
    text: "Le falta contenido para quien ya lo terminó. Espero que la próxima temporada traiga más.",
    likes: 9,
    liked: false,
  },
  {
    id: "sofia-herrera",
    author: "Sofía Herrera",
    avatarSrc: "/assets/avatars/avatar-45.webp",
    time: "Hace 2 días",
    rating: 5,
    text: "Entré por la misión de Sura y me quedé. Ya llevo más de cuarenta horas.",
    likes: 134,
    liked: false,
  },
  {
    id: "lucas-mendez",
    author: "Lucas Méndez",
    avatarSrc: "/assets/avatars/avatar-46.webp",
    time: "Hace 3 días",
    rating: 4,
    text: "Excelente para jugar con amigos. Solo también está bueno, pero en grupo es otra cosa.",
    likes: 26,
    liked: false,
  },
  {
    id: "martina-solis",
    author: "Martina Solís",
    avatarSrc: "/assets/avatars/avatar-47.webp",
    time: "Hace 4 días",
    rating: 4,
    text: "Los servidores andan mucho mejor desde el último parche. Ahora sí lo recomiendo.",
    likes: 51,
    liked: false,
  },
  {
    id: "tomas-aguirre",
    author: "Tomás Aguirre",
    avatarSrc: "/assets/avatars/avatar-48.webp",
    time: "Hace 5 días",
    rating: 3,
    text: "Lindo juego, pero la última actualización me cambió todo lo que tenía armado.",
    likes: 12,
    liked: false,
  },
  {
    id: "julieta-campos",
    author: "Julieta Campos",
    avatarSrc: "/assets/avatars/avatar-49.webp",
    time: "Hace 1 semana",
    rating: 5,
    text: "El competitivo es exigente, pero ganar un torneo de la comunidad no tiene precio.",
    likes: 203,
    liked: false,
  },
  {
    id: "bruno-ledesma",
    author: "Bruno Ledesma",
    avatarSrc: "/assets/avatars/avatar-50.webp",
    time: "Hace 2 semanas",
    rating: 4,
    text: "Ideal para partidas cortas antes de dormir y sumar SP todos los días.",
    likes: 37,
    liked: false,
  },
];

export function gameReviews(gameId: string): GameReview[] {
  if (gameId === PROMO_GAME_ID) return FIGMA_REVIEWS;
  const first = Math.floor(seeded(`${gameId}:reviews`)() * REVIEW_POOL.length);
  const second = (first + 1 + (gameId.length % (REVIEW_POOL.length - 1))) % REVIEW_POOL.length;
  return [REVIEW_POOL[first], REVIEW_POOL[second]].toSorted((a, b) => REVIEW_POOL.indexOf(a) - REVIEW_POOL.indexOf(b));
}

export const gameNetwork = { name: "Solana", logoSrc: "/assets/games/detail/network-solana.webp" };

const FIGMA_SOCIALS = ["Whitepaper", "Twitter", "Discord", "Instagram", "Telegram", "Youtube", "Linkedin", "Medium"];

export const gameSocials = (game: GameDetail) => (game.socials.length ? game.socials : FIGMA_SOCIALS);
