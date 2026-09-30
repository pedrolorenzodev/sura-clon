export type TournamentBadgeIcon = "mode" | "format" | "players";

export type TournamentBadge = {
  icon: TournamentBadgeIcon;
  label: string;
};

export type Tournament = {
  id: string;
  game: string;
  title: string;
  date: string;
  prize: string;
  badges: TournamentBadge[];
  host: string;
  official?: boolean;
  about: string;
  imageSrc: string;
  heroSrc: string;
  bannerSrc: string;
};

const cover = (id: string) => ({
  imageSrc: `/assets/tournaments/covers/${id}.webp`,
  heroSrc: `/assets/tournaments/covers/${id}-hero.webp`,
  bannerSrc: `/assets/tournaments/covers/${id}-banner.webp`,
});

export const tournaments: Tournament[] = [
  {
    id: "contenders-training-center-108",
    game: "PUBG: BATTLEGROUNDS",
    title: "Contenders Training Center #108",
    date: "Ene 24, 14:00 PM",
    prize: "40 USDC",
    badges: [
      { icon: "mode", label: "Battle Royale" },
      { icon: "format", label: "4v4" },
      { icon: "players", label: "56/60" },
    ],
    host: "CommunityGaming",
    official: true,
    about:
      "Escuadras de cuatro en Erangel y Miramar, con zona que cierra rápido y puntos por posición y por bajas. Es la fecha de entrenamiento antes de la clasificación del Contenders.",
    ...cover("contenders-training-center-108"),
  },
  {
    id: "american-cup",
    game: "Apex Legends",
    title: "American Cup",
    date: "Abr 30, 14:00 PM",
    prize: "40 USDC",
    badges: [
      { icon: "mode", label: "Battle Royale" },
      { icon: "format", label: "3v3" },
      { icon: "players", label: "56/60" },
    ],
    host: "CommunityGaming",
    official: true,
    about:
      "La copa de tríos de Apex para equipos de todo el continente. Seis partidas en World's Edge y Storm Point, y suma el que mejor combine supervivencia y bajas.",
    ...cover("american-cup"),
  },
  {
    id: "copa-latam-sura",
    game: "Valorant",
    title: "Copa LATAM Sura",
    date: "Dic 02, 19:00 PM",
    prize: "250 USDC",
    badges: [
      { icon: "mode", label: "Eliminación" },
      { icon: "format", label: "5v5" },
      { icon: "players", label: "78/80" },
    ],
    host: "SuraGaming",
    official: true,
    about:
      "La copa regional de Valorant organizada por Sura. Eliminación directa al mejor de tres, con Ascent como mapa de la final y casteo en vivo en el Discord de la comunidad.",
    ...cover("copa-latam-sura"),
  },
  {
    id: "noche-de-duelos",
    game: "Street Fighter 6",
    title: "Noche de Duelos",
    date: "Dic 05, 21:30 PM",
    prize: "20 USDC",
    badges: [
      { icon: "mode", label: "Eliminación" },
      { icon: "format", label: "1v1" },
      { icon: "players", label: "28/32" },
    ],
    host: "CommunityGaming",
    about:
      "Una noche de peleas uno contra uno en Street Fighter 6. Se juega a dos de tres, con controles clásicos o modernos, y el que gana sigue en la mesa hasta que alguien lo baje.",
    ...cover("noche-de-duelos"),
  },
  {
    id: "clasificatorio-abierto",
    game: "Call of Duty",
    title: "Clasificatorio Abierto",
    date: "Dic 09, 18:00 PM",
    prize: "100 USDC",
    badges: [
      { icon: "mode", label: "Battle Royale" },
      { icon: "format", label: "3v3" },
      { icon: "players", label: "112/120" },
    ],
    host: "CommunityGaming",
    about:
      "Clasificatorio abierto de Warzone en tríos: cualquiera se puede anotar y los diez mejores equipos pasan a la final del mes. Cuentan las tres mejores partidas de cada equipo.",
    ...cover("clasificatorio-abierto"),
  },
  {
    id: "contenders-training-center-110",
    game: "Fortnite",
    title: "Contenders Training Center #110",
    date: "Dic 11, 14:00 PM",
    prize: "40 USDC",
    badges: [
      { icon: "mode", label: "Battle Royale" },
      { icon: "format", label: "4v4" },
      { icon: "players", label: "44/60" },
    ],
    host: "CommunityGaming",
    official: true,
    about:
      "La edición 110 del Training Center llega a Fortnite: escuadras de cuatro, construcción activada y tres partidas para sumar puntos antes del corte del Contenders.",
    imageSrc: "/assets/tournaments/covers/contenders-training-center-110.webp",
    heroSrc: "/assets/tournaments/detail/hero-fortnite.webp",
    bannerSrc: "/assets/tournaments/detail/banner-fortnite.webp",
  },
  {
    id: "final-de-temporada",
    game: "League of Legends",
    title: "Final de Temporada",
    date: "Dic 14, 20:00 PM",
    prize: "500 USDC",
    badges: [
      { icon: "mode", label: "Eliminación" },
      { icon: "format", label: "5v5" },
      { icon: "players", label: "16/16" },
    ],
    host: "SuraGaming",
    official: true,
    about:
      "La final de temporada de la liga de League of Legends de Sura: los dieciséis mejores equipos de la Grieta se cruzan en llaves al mejor de tres, con el premio más grande del año y casteo en vivo.",
    ...cover("final-de-temporada"),
  },
  {
    id: "torneo-relampago",
    game: "Rocket League",
    title: "Torneo Relámpago",
    date: "Dic 18, 17:00 PM",
    prize: "60 USDC",
    badges: [
      { icon: "mode", label: "Eliminación" },
      { icon: "format", label: "3v3" },
      { icon: "players", label: "31/40" },
    ],
    host: "CommunityGaming",
    about:
      "Un torneo que se juega en una sola tarde: partidos de cinco minutos, eliminación directa y la final antes de la cena. Ideal para equipos que recién arrancan.",
    ...cover("torneo-relampago"),
  },
  {
    id: "valorant-champions-tour",
    game: "Valorant",
    title: "Valorant Champions Tour",
    date: "Nov 28, 20:00 PM",
    prize: "50 USDC",
    badges: [
      { icon: "mode", label: "Eliminación" },
      { icon: "format", label: "5v5" },
      { icon: "players", label: "12/15" },
    ],
    host: "SuraGaming",
    official: true,
    about:
      "La fecha de la comunidad del Champions Tour: doce equipos, grupos a una partida y playoffs al mejor de tres en Sunset y Haven. Los dos primeros se llevan el premio.",
    ...cover("valorant-champions-tour"),
  },
  {
    id: "fortnite-tournament",
    game: "Fortnite",
    title: "Fortnite Tournament",
    date: "Nov 28, 20:00 PM",
    prize: "5 USDC",
    badges: [
      { icon: "format", label: "1v1" },
      { icon: "players", label: "118/150" },
    ],
    host: "CommunityGaming",
    about:
      "Duelos uno contra uno en un mapa de creativo, con las armas de la temporada actual. Se juega rápido, se anota cualquiera y cada victoria suma puntos para el ranking.",
    ...cover("fortnite-tournament"),
  },
  {
    id: "liga-ancestral",
    game: "Dota 2",
    title: "Liga Ancestral",
    date: "Ene 08, 19:00 PM",
    prize: "150 USDC",
    badges: [
      { icon: "mode", label: "Liga" },
      { icon: "format", label: "5v5" },
      { icon: "players", label: "40/50" },
    ],
    host: "SuraGaming",
    official: true,
    about:
      "Una liga de Dota 2 de cuatro semanas: los equipos juegan una serie por semana en modo Captains Mode y los cuatro mejores de la tabla definen el título en vivo.",
    ...cover("liga-ancestral"),
  },
  {
    id: "copa-rivals",
    game: "Marvel Rivals",
    title: "Copa Rivals",
    date: "Ene 12, 18:00 PM",
    prize: "80 USDC",
    badges: [
      { icon: "mode", label: "Eliminación" },
      { icon: "format", label: "6v6" },
      { icon: "players", label: "36/48" },
    ],
    host: "CommunityGaming",
    about:
      "Equipos de seis héroes en Convergencia y Dominación, con draft de personajes antes de cada partido. Se juega al mejor de tres y la final se transmite en el canal de Sura.",
    ...cover("copa-rivals"),
  },
  {
    id: "copa-sura-fc",
    game: "EA SPORTS FC 25",
    title: "Copa Sura FC",
    date: "Ene 15, 20:00 PM",
    prize: "60 USDC",
    badges: [
      { icon: "mode", label: "Eliminación" },
      { icon: "format", label: "1v1" },
      { icon: "players", label: "58/64" },
    ],
    host: "SuraGaming",
    official: true,
    about:
      "La copa de fútbol de la comunidad en EA SPORTS FC 25. Partidos de seis minutos por tiempo, equipos de club y alargue con penales desde los cuartos de final.",
    ...cover("copa-sura-fc"),
  },
  {
    id: "overwatch-open",
    game: "Overwatch 2",
    title: "Overwatch Open",
    date: "Ene 19, 19:30 PM",
    prize: "75 USDC",
    badges: [
      { icon: "mode", label: "Eliminación" },
      { icon: "format", label: "5v5" },
      { icon: "players", label: "25/40" },
    ],
    host: "CommunityGaming",
    about:
      "Torneo abierto de Overwatch 2 con reglas del competitivo: un tanque, dos de daño y dos de apoyo. Mapas de Control, Escolta y Empuje, y bans de héroes desde la semifinal.",
    ...cover("overwatch-open"),
  },
  {
    id: "noches-de-asedio",
    game: "Rainbow Six Siege",
    title: "Noches de Asedio",
    date: "Ene 22, 21:00 PM",
    prize: "90 USDC",
    badges: [
      { icon: "mode", label: "Eliminación" },
      { icon: "format", label: "5v5" },
      { icon: "players", label: "30/40" },
    ],
    host: "CommunityGaming",
    about:
      "Tres noches de Rainbow Six Siege al mejor de uno hasta la final, que es al mejor de tres. Atacar y defender con la misma escuadra: gana el que mejor lea la sala.",
    ...cover("noches-de-asedio"),
  },
  {
    id: "puno-de-hierro",
    game: "TEKKEN 8",
    title: "Puño de Hierro",
    date: "Ene 26, 21:30 PM",
    prize: "30 USDC",
    badges: [
      { icon: "mode", label: "Eliminación" },
      { icon: "format", label: "1v1" },
      { icon: "players", label: "22/32" },
    ],
    host: "SuraGaming",
    official: true,
    about:
      "El torneo de TEKKEN 8 de la comunidad: doble eliminación, partidas a tres rounds y la gran final al mejor de cinco. Cualquier personaje está permitido.",
    ...cover("puno-de-hierro"),
  },
];

export const TOURNAMENTS_PER_PAGE = 8;
