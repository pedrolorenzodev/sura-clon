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

const routeLabels: Record<string, string> = {
  "/": "Home",
  "/tournaments": "Eventos",
  "/missions": "Misiones",
  "/leaderboard": "Leaderboard",
  "/games": "Juegos",
  "/news": "Sura News",
  "/profile": "Mi Perfil",
};

const detailLabels: Record<string, string> = {
  tournaments: "Evento",
  games: "Juego",
  news: "Noticia",
};

export function backLabel(path: string | null) {
  if (!path) return "Volver atrás";
  const name = routeLabels[path] ?? detailLabels[path.split("/")[1] ?? ""];
  return name ? `Volver a ${name}` : "Volver atrás";
}
