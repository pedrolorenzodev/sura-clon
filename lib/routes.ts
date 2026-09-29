type DetailRoute = "tournaments" | "games" | "news";

const LIVE_DETAIL_ROUTES: Record<DetailRoute, boolean> = {
  tournaments: false,
  games: true,
  news: false,
};

export const detailHref = (route: DetailRoute, id: string) =>
  LIVE_DETAIL_ROUTES[route] ? `/${route}/${id}` : null;
