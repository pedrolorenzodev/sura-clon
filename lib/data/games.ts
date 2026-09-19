/** Sección Juegos del Home. Fase 1: hardcodeada (AGENTS regla 9). */

export type Game = {
  id: string;
  title: string;
  badges: string[];
  imageSrc: string;
  /** Recorte del Figma, cuando el arte no llena la card. */
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
