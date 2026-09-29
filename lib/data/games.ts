import { rotate } from "@/lib/collection";

export const gameFacets = [
  {
    id: "genero",
    label: "Género",
    options: [
      { id: "accion", label: "Acción" },
      { id: "aventura", label: "Aventura" },
      { id: "casual", label: "Casual" },
      { id: "estrategia", label: "Estrategia" },
      { id: "rpg", label: "RPG" },
    ],
  },
  {
    id: "plataforma",
    label: "Plataforma",
    options: [
      { id: "pc", label: "PC" },
      { id: "consola", label: "Consola" },
      { id: "mobile", label: "Mobile" },
      { id: "web", label: "Web" },
    ],
  },
  {
    id: "estado",
    label: "Estado",
    options: [
      { id: "disponible", label: "Disponible" },
      { id: "beta", label: "Beta" },
      { id: "proximamente", label: "Próximamente" },
    ],
  },
  {
    id: "redes",
    label: "Redes",
    options: [
      { id: "discord", label: "Discord" },
      { id: "x", label: "X" },
      { id: "instagram", label: "Instagram" },
      { id: "youtube", label: "YouTube" },
      { id: "twitch", label: "Twitch" },
      { id: "tiktok", label: "TikTok" },
    ],
  },
] as const;

export type GameFacetId = (typeof gameFacets)[number]["id"];

export type GameFacetValues = { [K in GameFacetId]: string[] };

export const facetLabel = (facet: GameFacetId, option: string) =>
  gameFacets.find((item) => item.id === facet)!.options.find((item) => item.id === option)!.label;

export type Game = {
  id: string;
  title: string;
  badges: string[];
  imageSrc: string;
  imageClass?: string;
  facets?: GameFacetValues;
};

export const games: Game[] = [
  {
    id: "wagmi-defense",
    title: "Wagmi Defense",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/wagmi.webp",
  },
  {
    id: "ac-syndicate-mario",
    title: "Assassin's Creed Syndicate",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/mario.webp",
  },
  {
    id: "ac-syndicate",
    title: "Assassin's Creed Syndicate",
    badges: ["Casual", "Free-To-Play", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/minecraft.webp",
  },
  {
    id: "cod-modern-warfare",
    title: "Call of Duty Modern Warfare",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/cod-mw.webp",
  },
  {
    id: "ac-syndicate-2",
    title: "Assassin's Creed Syndicate",
    badges: ["Casual", "Free-To-Play", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/minecraft.webp",
  },
  {
    id: "cod-modern-warfare-2",
    title: "Call of Duty Modern Warfare",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/racing.webp",
  },
  {
    id: "wagmi-defense-2",
    title: "Wagmi Defense",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/wagmi.webp",
  },
  {
    id: "ac-valhalla",
    title: "Assasin's Creed Valhalla",
    badges: ["Casual Multiplayer"],
    imageSrc: "/assets/home/juegos/ac-valhalla.png",
    imageClass: "left-[-9.83%] top-[-14.87%] h-[114.8%] w-[120.19%]",
  },
];

export const gamesPromo = {
  title: ["Juega y viaja al", "Mundial FIFA 2026"],
  body: ["Para completar esta misión, debes hacer clic en", "el botón de abajo para visitar la página requerida."],
  cta: "Jugar ahora",
  imageSrc: "/assets/home/juegos/banner.webp",
};

const CATALOG: Omit<Game, "id">[] = [
  {
    title: "Wagmi Defense",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/wagmi.webp",
    facets: { genero: ["estrategia"], plataforma: ["web", "mobile"], estado: ["disponible"], redes: ["discord", "x"] },
  },
  {
    title: "Assassin's Creed Syndicate",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/mario.webp",
    facets: { genero: ["aventura"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["x", "youtube", "instagram"] },
  },
  {
    title: "The Plooshies",
    badges: ["Casual Multiplayer"],
    imageSrc: "/assets/games/plooshies.webp",
    facets: { genero: ["casual"], plataforma: ["mobile"], estado: ["beta"], redes: ["discord", "tiktok", "instagram"] },
  },
  {
    title: "Call of Duty Modern Warfare",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/cod-mw.webp",
    facets: { genero: ["accion"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["x", "youtube", "twitch"] },
  },
  {
    title: "Assassin's Creed Syndicate",
    badges: ["Casual", "Free-To-Play", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/minecraft.webp",
    facets: { genero: ["aventura"], plataforma: ["pc", "consola", "mobile"], estado: ["disponible"], redes: ["youtube", "instagram"] },
  },
  {
    title: "Call of Duty Modern Warfare",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/racing.webp",
    facets: { genero: ["accion"], plataforma: ["mobile"], estado: ["proximamente"], redes: ["x", "twitch"] },
  },
  {
    title: "Wagmi Defense",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/wagmi.webp",
    facets: { genero: ["estrategia"], plataforma: ["web"], estado: ["beta"], redes: ["discord"] },
  },
  {
    title: "Assasin's Creed Valhalla",
    badges: ["Casual Multiplayer"],
    imageSrc: "/assets/home/juegos/ac-valhalla.png",
    imageClass: "left-[-9.83%] top-[-14.87%] h-[114.8%] w-[120.19%]",
    facets: { genero: ["rpg"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["youtube", "x", "twitch"] },
  },
];

export const GAMES_PER_PAGE = 12;

export const gamesCatalog: Game[] = [0, 1, 2]
  .flatMap((round) => [...rotate(CATALOG, round * 3), ...rotate(CATALOG, round * 3).slice(0, 4)])
  .map((game, index) => ({
    ...game,
    id: `${game.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${index + 1}`,
  }));

export const gamesRoutePromo = {
  ...gamesPromo,
  label: "¡Novedad!",
  bodyMobile:
    "Para completar esta misión, debes hacer clic en el botón de abajo para visitar la página requerida.",
  imageSrcMobile: "/assets/games/banner-mobile.webp",
};
