export type NavIconName = "home" | "torneos" | "leaderboard" | "misiones" | "news" | "juegos";

export type HomeSection = {
  id: string;
  label: string;
  icon: NavIconName;
  iconSize: string;
};

export const homeSections: HomeSection[] = [
  { id: "home", label: "Home", icon: "home", iconSize: "size-6.5" },
  { id: "eventos", label: "Eventos", icon: "torneos", iconSize: "size-6.5" },
  { id: "leaderboard", label: "Leaderboard", icon: "leaderboard", iconSize: "size-6" },
  { id: "misiones", label: "Misiones", icon: "misiones", iconSize: "size-4.5" },
  { id: "sura-news", label: "Sura News", icon: "news", iconSize: "size-5" },
  { id: "juegos", label: "Juegos", icon: "juegos", iconSize: "size-6" },
];

export const defaultActiveSectionId = "home";

export const homeSectionIds = homeSections.map((section) => section.id);
