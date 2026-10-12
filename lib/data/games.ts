import type { DetailArt } from "@/lib/data/detail-art";

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

export const gamesPromo = {
  title: ["Juega y viaja al", "Mundial FIFA 2026"],
  body: ["Jugá las fechas del Mundial, sumá Sura Points", "y ganá un viaje para ver la final en vivo."],
  cta: "Jugar ahora",
  imageSrc: "/assets/home/juegos/banner.webp",
};

export const GAMES_PER_PAGE = 12;

export const gamesRoutePromo = {
  ...gamesPromo,
  label: "¡Novedad!",
  bodyMobile:
    "Jugá las fechas del Mundial, sumá Sura Points y ganá un viaje para ver la final en vivo.",
  imageSrcMobile: "/assets/games/banner-mobile.webp",
};

export const PROMO_GAME_ID = "mundial-fifa-2026";

export const promoArt: DetailArt = {
  desktop: "/assets/games/detail/hero-fc26.webp",
  mobile: "/assets/games/banner-mobile.webp",
  className: "left-[-31.36%] top-[-32.43%] aspect-square w-[162.72%] desktop:inset-0 desktop:aspect-auto desktop:size-full desktop:object-[50%_33.25%]",
};
