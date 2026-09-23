export type Game = {
  id: string;
  title: string;
  badges: string[];
  imageSrc: string;
  imageClass?: string;
};

export const games: Game[] = [
  {
    id: "wagmi-defense",
    title: "Wagmi Defense",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/wagmi.png",
  },
  {
    id: "ac-syndicate-mario",
    title: "Assassin's Creed Syndicate",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/mario.png",
  },
  {
    id: "ac-syndicate",
    title: "Assassin's Creed Syndicate",
    badges: ["Casual", "Free-To-Play", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/minecraft.png",
  },
  {
    id: "cod-modern-warfare",
    title: "Call of Duty Modern Warfare",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/cod-mw.png",
  },
  {
    id: "ac-syndicate-2",
    title: "Assassin's Creed Syndicate",
    badges: ["Casual", "Free-To-Play", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/minecraft.png",
  },
  {
    id: "cod-modern-warfare-2",
    title: "Call of Duty Modern Warfare",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/racing.png",
  },
  {
    id: "wagmi-defense-2",
    title: "Wagmi Defense",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/wagmi.png",
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
  imageSrc: "/assets/home/juegos/banner.png",
};

export const gamesFilters = ["Género", "Plataforma", "Estado", "Redes"];

const CATALOG: Omit<Game, "id">[] = [
  { title: "Wagmi Defense", badges: ["Casual", "Free-To-Play"], imageSrc: "/assets/home/juegos/wagmi.png" },
  {
    title: "Assassin's Creed Syndicate",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/mario.png",
  },
  {
    title: "The Plooshies",
    badges: ["Casual Multiplayer"],
    imageSrc: "/assets/games/plooshies.png",
  },
  {
    title: "Call of Duty Modern Warfare",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/cod-mw.png",
  },
  {
    title: "Assassin's Creed Syndicate",
    badges: ["Casual", "Free-To-Play", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/minecraft.png",
  },
  {
    title: "Call of Duty Modern Warfare",
    badges: ["Casual", "Free-To-Play"],
    imageSrc: "/assets/home/juegos/racing.png",
  },
  { title: "Wagmi Defense", badges: ["Casual", "Free-To-Play"], imageSrc: "/assets/home/juegos/wagmi.png" },
  {
    title: "Assasin's Creed Valhalla",
    badges: ["Casual Multiplayer"],
    imageSrc: "/assets/home/juegos/ac-valhalla.png",
    imageClass: "left-[-9.83%] top-[-14.87%] h-[114.8%] w-[120.19%]",
  },
];

export const gamesCatalog: Game[] = [...CATALOG, ...CATALOG.slice(0, 4)].map((game, index) => ({
  ...game,
  id: `${game.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${index + 1}`,
}));

export const gamesRoutePromo = {
  ...gamesPromo,
  label: "¡Novedad!",
  bodyMobile:
    "Para completar esta misión, debes hacer clic en el botón de abajo para visitar la página requerida.",
  imageSrcMobile: "/assets/games/banner-mobile.png",
};
