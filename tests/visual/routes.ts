export type VisualRoute = { path: string; name: string; status?: number; desktopOnly?: boolean };

const games = [
  "mundial-fifa-2026", "tekken-8", "marvel-rivals", "hollow-knight-silksong", "baldurs-gate-3", "fall-guys",
  "counter-strike-2", "league-of-legends", "clair-obscur-expedition-33", "apex-legends", "hades-ii",
  "street-fighter-6", "age-of-empires-iv", "palworld", "split-fiction", "the-finals", "rematch",
  "monster-hunter-wilds", "black-myth-wukong", "helldivers-2", "dota-2", "among-us", "civilization-vii",
  "rocket-league", "overwatch-2",
];

const tournaments = [
  "contenders-training-center-108", "american-cup", "copa-latam-sura", "noche-de-duelos", "clasificatorio-abierto",
  "contenders-training-center-110", "final-de-temporada", "torneo-relampago", "valorant-champions-tour",
  "fortnite-tournament", "liga-ancestral", "copa-rivals", "copa-sura-fc", "overwatch-open", "noches-de-asedio",
  "puno-de-hierro",
];

const news = [
  "ac-shadows-consejos", "cyberpunk-2077", "elden-ring", "guild-of-guardians", "liga-ancestral-inscripciones",
  "ligas-rocket-league", "marvel-rivals-temporada", "monster-hunter-wilds-actualizacion",
  "mundial-fifa-2026-mini-juego", "valorant-champions-equipos", "warzone-temporada-3",
];

const newsCategories = ["lanzamientos", "actualizaciones", "guias", "esports", "sura"];

const leaderboardViews = ["sura-points", "medallas", "racha", "eventos"].flatMap((metric) =>
  ["historico", "mensual", "semanal", "diario"].map((range) => ({
    path: `/leaderboard?metrica=${metric}&rango=${range}`,
    name: `leaderboard-${metric}-${range}`,
  })),
);

export const routes: VisualRoute[] = [
  { path: "/", name: "home" },
  { path: "/tournaments", name: "tournaments" },
  { path: "/tournaments?pagina=2", name: "tournaments-p2" },
  { path: "/tournaments?q=cup", name: "tournaments-q" },
  { path: "/tournaments?q=zzzz", name: "tournaments-empty" },
  ...tournaments.map((id) => ({ path: `/tournaments/${id}`, name: `tournament-${id}` })),
  { path: "/tournaments/contenders-training-center-108?tab=participantes", name: "tournament-108-participantes" },
  { path: "/tournaments/contenders-training-center-108?tab=ganadores", name: "tournament-108-ganadores" },
  { path: "/tournaments/contenders-training-center-108?tab=participantes&pagina=2", name: "tournament-108-participantes-p2" },
  { path: "/tournaments/contenders-training-center-108?tab=participantes&q=paisano", name: "tournament-108-participantes-q" },
  { path: "/tournaments/final-de-temporada?tab=ganadores", name: "tournament-final-ganadores" },
  { path: "/tournaments/final-de-temporada?tab=participantes", name: "tournament-final-participantes" },
  { path: "/tournaments/torneo-relampago?tab=participantes", name: "tournament-relampago-participantes" },
  { path: "/tournaments/valorant-champions-tour?tab=ganadores", name: "tournament-vct-ganadores" },
  { path: "/leaderboard", name: "leaderboard" },
  { path: "/leaderboard?pagina=2", name: "leaderboard-p2" },
  { path: "/leaderboard?pagina=5", name: "leaderboard-p5" },
  ...leaderboardViews,
  { path: "/leaderboard?q=paisano", name: "leaderboard-q" },
  { path: "/leaderboard?q=zzzz", name: "leaderboard-empty" },
  { path: "/leaderboard?jugador=gauchopaisano", name: "leaderboard-modal-gauchopaisano" },
  { path: "/leaderboard?jugador=nays1", name: "leaderboard-modal-nays1" },
  { path: "/leaderboard?jugador=pixelpampa", name: "leaderboard-modal-pixelpampa" },
  { path: "/leaderboard?jugador=cerdo-capitalista", name: "leaderboard-modal-me" },
  { path: "/missions", name: "missions" },
  { path: "/missions?pagina=2", name: "missions-p2" },
  { path: "/missions?categoria=sociales&estado=completadas", name: "missions-sociales-completadas" },
  { path: "/missions?categoria=eventos&estado=finalizadas", name: "missions-eventos-finalizadas" },
  { path: "/missions?categoria=sura", name: "missions-sura" },
  { path: "/missions?estado=finalizadas", name: "missions-finalizadas" },
  { path: "/missions?mision=gana-partida-fortnite", name: "missions-modal" },
  { path: "/missions?mision=conecta-x", name: "missions-modal-featured" },
  { path: "/missions?mision=sigue-tiktok", name: "missions-modal-sociales" },
  { path: "/missions?mision=tres-dias-seguidos", name: "missions-modal-sura" },
  { path: "/missions?mision=zona-final-apex", name: "missions-modal-ended" },
  { path: "/games", name: "games" },
  { path: "/games?pagina=2", name: "games-p2" },
  { path: "/games?genero=rpg,aventura&plataforma=pc", name: "games-filtered" },
  { path: "/games?q=zzzz", name: "games-empty" },
  { path: "/games?estado=beta", name: "games-beta" },
  { path: "/games?redes=discord,twitch", name: "games-redes" },
  { path: "/games?q=fifa", name: "games-q" },
  ...games.map((id) => ({ path: `/games/${id}`, name: `game-${id}` })),
  { path: "/news", name: "news" },
  ...newsCategories.map((category) => ({ path: `/news?categoria=${category}`, name: `news-${category}` })),
  ...news.map((id) => ({ path: `/news/${id}`, name: `news-${id}` })),
  { path: "/profile", name: "profile" },
  { path: "/ruta-que-no-existe", name: "not-found", status: 404 },
  { path: "/styleguide", name: "styleguide", desktopOnly: true },
];
