type DetailRoute = "tournaments" | "missions" | "games" | "news" | "profile";

const LIVE_DETAIL_ROUTES: Record<DetailRoute, boolean> = {
  tournaments: false,
  missions: false,
  games: false,
  news: false,
  profile: false,
};

export const detailHref = (route: DetailRoute, id: string) =>
  LIVE_DETAIL_ROUTES[route] ? `/${route}/${id}` : null;
