export type HomeSection = {
  id: string;
  label: string;
  icon: string;
  iconSize: string;
};

export const homeSections: HomeSection[] = [
  { id: "home", label: "Home", icon: "nav-icon-home", iconSize: "size-6.5" },
  { id: "eventos", label: "Eventos", icon: "nav-icon-torneos", iconSize: "size-6.5" },
  { id: "leaderboard", label: "Leaderboard", icon: "nav-icon-leaderboard", iconSize: "size-6" },
  { id: "misiones", label: "Misiones", icon: "nav-icon-misiones", iconSize: "size-4.5" },
  { id: "sura-news", label: "Sura News", icon: "nav-icon-news", iconSize: "size-5" },
  { id: "juegos", label: "Juegos", icon: "nav-icon-juegos", iconSize: "size-6" },
];

export const defaultActiveSectionId = "home";

export const homeSectionIds = homeSections.map((section) => section.id);
