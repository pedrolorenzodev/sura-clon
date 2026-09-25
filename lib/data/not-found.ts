export type MapPoint = {
  x: number;
  y: number;
};

export type SpawnPointId = "home" | "eventos" | "misiones" | "leaderboard" | "juegos";

export type SpawnPoint = MapPoint & {
  id: SpawnPointId;
  label: string;
  href: string;
  icon: string;
  iconSize: string;
};

export const notFoundCopy = {
  eyebrow: "ERR 404 · Sector sin señal",
  titleLines: ["Fuera del", "mapa"],
  pathLabel: "Ruta",
  body: "La ruta que buscás no existe o se movió. Elegí un punto de reaparición y volvé a la partida.",
  cta: "Volver al Home",
  back: "Volver atrás",
  spawnsTitle: "Puntos de reaparición",
  mapTitle: "Mapa · Sura Gaming",
  mapScale: "100 M",
  zone: "Zona de juego",
  player: "Vos · 404",
  coordinates: "X 404 · Y 000",
  mapLabel: "Mapa: estás fuera de la zona de juego",
};

export type PlayZone = {
  inset: number;
  insetY: number;
  insetYDesktop: number;
};

export const playerPosition: MapPoint = { x: 94, y: 93 };

export const playZone: PlayZone = { inset: 12, insetY: 17, insetYDesktop: 12 };

export const homeSpawn: SpawnPoint = {
  id: "home",
  label: "Home",
  href: "/",
  icon: "nav-icon-home",
  iconSize: "size-6.5",
  x: 54,
  y: 50,
};

export const spawnPoints: SpawnPoint[] = [
  { id: "eventos", label: "Eventos", href: "/tournaments", icon: "nav-icon-torneos", iconSize: "size-6.5", x: 34, y: 37 },
  { id: "misiones", label: "Misiones", href: "/missions", icon: "nav-icon-misiones", iconSize: "size-4.5", x: 66, y: 26 },
  { id: "leaderboard", label: "Leaderboard", href: "/leaderboard", icon: "nav-icon-leaderboard", iconSize: "size-6", x: 48, y: 76 },
  { id: "juegos", label: "Juegos", href: "/games", icon: "nav-icon-juegos", iconSize: "size-6", x: 74, y: 63 },
];

export const mapPoints: SpawnPoint[] = [homeSpawn, ...spawnPoints];

export const spawnDistance = ({ x, y }: MapPoint) =>
  `${Math.round((Math.abs(playerPosition.x - x) + Math.abs(playerPosition.y - y)) * 9)} M`;
