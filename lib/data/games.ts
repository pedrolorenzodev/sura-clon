export const gameFacets = [
  {
    id: "genero",
    label: "Género",
    options: [
      { id: "accion", label: "Acción" },
      { id: "aventura", label: "Aventura" },
      { id: "casual", label: "Casual" },
      { id: "estrategia", label: "Estrategia" },
      { id: "rpg", label: "RPG" },
    ],
  },
  {
    id: "plataforma",
    label: "Plataforma",
    options: [
      { id: "pc", label: "PC" },
      { id: "consola", label: "Consola" },
      { id: "mobile", label: "Mobile" },
      { id: "web", label: "Web" },
    ],
  },
  {
    id: "estado",
    label: "Estado",
    options: [
      { id: "disponible", label: "Disponible" },
      { id: "beta", label: "Beta" },
      { id: "proximamente", label: "Próximamente" },
    ],
  },
  {
    id: "redes",
    label: "Redes",
    options: [
      { id: "discord", label: "Discord" },
      { id: "x", label: "X" },
      { id: "instagram", label: "Instagram" },
      { id: "youtube", label: "YouTube" },
      { id: "twitch", label: "Twitch" },
      { id: "tiktok", label: "TikTok" },
    ],
  },
] as const;

export type GameFacetId = (typeof gameFacets)[number]["id"];

export type GameFacetValues = { [K in GameFacetId]: string[] };

export const facetLabel = (facet: GameFacetId, option: string) =>
  gameFacets.find((item) => item.id === facet)!.options.find((item) => item.id === option)!.label;

export type Game = {
  id: string;
  title: string;
  badges: string[];
  imageSrc: string;
  imageClass?: string;
  heroSrc?: string;
  about?: string;
  facets?: GameFacetValues;
};

const catalogArt = (id: string) => ({
  imageSrc: `/assets/games/catalog/${id}.webp`,
  heroSrc: `/assets/games/catalog/${id}-hero.webp`,
});

export const gamesCatalog: Game[] = [
  {
    id: "tekken-8",
    ...catalogArt("tekken-8"),
    title: "TEKKEN 8",
    badges: ["Pelea", "1v1"],
    about:
      "TEKKEN 8 cierra la saga de los Mishima con el sistema Heat, que premia jugar agresivo. Treinta y dos luchadores, escenarios que se rompen y un modo Arcade Quest para aprender antes de entrar al online.",
    facets: { genero: ["accion"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["youtube", "twitch", "x"] },
  },
  {
    id: "marvel-rivals",
    ...catalogArt("marvel-rivals"),
    title: "Marvel Rivals",
    badges: ["Hero Shooter", "Free-To-Play"],
    about:
      "Marvel Rivals es un hero shooter 6v6 con más de treinta personajes del universo Marvel y escenarios que se destruyen en plena partida. Armá combos de equipo y subí de rango en las temporadas competitivas.",
    facets: { genero: ["accion"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["x", "youtube", "twitch"] },
  },
  {
    id: "hollow-knight-silksong",
    ...catalogArt("hollow-knight-silksong"),
    title: "Hollow Knight: Silksong",
    badges: ["Metroidvania", "Un jugador"],
    about:
      "En Silksong jugás como Hornet, princesa y protectora de Hallownest, en un reino nuevo hecho de seda y canción. Más de 150 enemigos, jefes que no perdonan y un mapa que se abre a medida que ganás habilidades.",
    facets: { genero: ["aventura"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["x", "youtube"] },
  },
  {
    id: "baldurs-gate-3",
    ...catalogArt("baldurs-gate-3"),
    title: "Baldur's Gate 3",
    badges: ["Por turnos", "Cooperativo"],
    about:
      "Baldur's Gate 3 es el RPG de Larian basado en Dungeons & Dragons: armás tu grupo, decidís cada conversación y cada tirada de dados cambia la historia. Se juega solo o en cooperativo con hasta cuatro amigos.",
    facets: { genero: ["rpg"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["x", "youtube", "instagram"] },
  },
  {
    id: "fall-guys",
    ...catalogArt("fall-guys"),
    title: "Fall Guys",
    badges: ["Party Game", "Free-To-Play"],
    about:
      "Fall Guys es un party game de rondas eliminatorias: sesenta jugadores, obstáculos absurdos y una sola corona al final. Partidas cortas, ideales para sumar puntos entre torneo y torneo.",
    facets: { genero: ["casual"], plataforma: ["pc", "consola", "mobile"], estado: ["disponible"], redes: ["tiktok", "instagram", "x"] },
  },
  {
    id: "counter-strike-2",
    ...catalogArt("counter-strike-2"),
    title: "Counter-Strike 2",
    badges: ["Shooter táctico", "5v5"],
    about:
      "Counter-Strike 2 lleva el shooter táctico más jugado del mundo a Source 2: granadas de humo dinámicas, mapas rehechos y servidores con subtick. Es el juego de los torneos semanales de la comunidad.",
    facets: { genero: ["accion"], plataforma: ["pc"], estado: ["disponible"], redes: ["discord", "twitch", "x"] },
  },
  {
    id: "league-of-legends",
    ...catalogArt("league-of-legends"),
    title: "League of Legends",
    badges: ["MOBA", "5v5"],
    about:
      "League of Legends es el MOBA de Riot: dos equipos de cinco campeones pelean por destruir el Nexo enemigo en la Grieta del Invocador. Más de 170 campeones, una temporada competitiva cada año y la escena de esports más grande del mundo.",
    facets: { genero: ["estrategia", "accion"], plataforma: ["pc"], estado: ["disponible"], redes: ["youtube", "x", "twitch"] },
  },
  {
    id: "clair-obscur-expedition-33",
    ...catalogArt("clair-obscur-expedition-33"),
    title: "Clair Obscur: Expedition 33",
    badges: ["Por turnos", "Un jugador"],
    about:
      "Clair Obscur: Expedition 33 es un RPG por turnos con reflejos en tiempo real: esquivás y contraatacás en cada golpe. Liderás la expedición que sale a destruir a la Pintora antes de que vuelva a borrar a tu gente.",
    facets: { genero: ["rpg"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["x", "youtube"] },
  },
  {
    id: "apex-legends",
    ...catalogArt("apex-legends"),
    title: "Apex Legends",
    badges: ["Battle Royale", "Free-To-Play"],
    about:
      "Apex Legends es un battle royale por escuadras donde cada leyenda tiene habilidades propias. Movilidad rápida, peleas en equipo y una temporada nueva cada tres meses con mapas y armas.",
    facets: { genero: ["accion"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["x", "twitch", "youtube"] },
  },
  {
    id: "hades-ii",
    ...catalogArt("hades-ii"),
    title: "Hades II",
    badges: ["Roguelike", "Un jugador"],
    about:
      "En Hades II sos Melinoë, princesa del Inframundo, y tenés que derrotar al Titán del Tiempo. Cada intento es distinto: bendiciones de los dioses, armas nuevas y conjuros que se combinan de mil formas.",
    facets: { genero: ["accion", "rpg"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["x", "youtube"] },
  },
  {
    id: "street-fighter-6",
    ...catalogArt("street-fighter-6"),
    title: "Street Fighter 6",
    badges: ["Pelea", "1v1"],
    about:
      "Street Fighter 6 suma el sistema Drive y controles modernos para que cualquiera pueda entrar al competitivo. Es el juego de las Noches de Duelos: se juega a dos de tres y el ganador sigue en la mesa.",
    facets: { genero: ["accion"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["twitch", "youtube", "x"] },
  },
  {
    id: "age-of-empires-iv",
    ...catalogArt("age-of-empires-iv"),
    title: "Age of Empires IV",
    badges: ["Tiempo real", "Multijugador"],
    about:
      "Age of Empires IV es estrategia en tiempo real clásica: juntás recursos, avanzás de edad y llevás tu civilización a la guerra. Dieciséis civilizaciones, cada una con unidades y maravillas propias.",
    facets: { genero: ["estrategia"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["youtube", "discord"] },
  },
  {
    id: "palworld",
    ...catalogArt("palworld"),
    title: "Palworld",
    badges: ["Supervivencia", "Cooperativo"],
    about:
      "Palworld mezcla supervivencia, crafteo y criaturas: capturás Pals, los ponés a trabajar en tu base y salís a explorar con ellos. Se juega solo o con hasta 32 jugadores en un servidor propio.",
    facets: { genero: ["aventura"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["x", "discord", "tiktok"] },
  },
  {
    id: "split-fiction",
    ...catalogArt("split-fiction"),
    title: "Split Fiction",
    badges: ["Cooperativo", "Pantalla dividida"],
    about:
      "Split Fiction es una aventura sólo para dos: Mio y Zoe quedan atrapadas en sus propias historias, una de ciencia ficción y otra de fantasía. Cada nivel cambia las reglas y ninguno se puede pasar solo.",
    facets: { genero: ["aventura"], plataforma: ["pc", "consola"], estado: ["proximamente"], redes: ["instagram", "youtube"] },
  },
  {
    id: "the-finals",
    ...catalogArt("the-finals"),
    title: "THE FINALS",
    badges: ["Shooter", "Free-To-Play"],
    about:
      "THE FINALS es un shooter por equipos en un game show virtual donde todo el escenario se puede romper. Tirás una pared, abrís un piso o volás el edificio entero para llegar primero a la bóveda.",
    facets: { genero: ["accion"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["x", "twitch"] },
  },
  {
    id: "rematch",
    ...catalogArt("rematch"),
    title: "REMATCH",
    badges: ["Fútbol", "5v5"],
    about:
      "REMATCH es fútbol arcade en tercera persona: controlás a un solo jugador, sin faltas ni fuera de juego, en partidos de cinco contra cinco. Pases, gambetas y atajadas dependen sólo de tu habilidad.",
    facets: { genero: ["casual"], plataforma: ["pc", "consola"], estado: ["beta"], redes: ["tiktok", "instagram", "x"] },
  },
  {
    id: "monster-hunter-wilds",
    ...catalogArt("monster-hunter-wilds"),
    title: "Monster Hunter Wilds",
    badges: ["Caza", "Cooperativo"],
    about:
      "Monster Hunter Wilds te manda a las Tierras Prohibidas, un mundo abierto con clima que cambia y monstruos que migran. Salís de caza solo o con tres amigos, y con cada presa forjás equipo más fuerte.",
    facets: { genero: ["rpg", "accion"], plataforma: ["pc", "consola"], estado: ["proximamente"], redes: ["youtube", "x"] },
  },
  {
    id: "black-myth-wukong",
    ...catalogArt("black-myth-wukong"),
    title: "Black Myth: Wukong",
    badges: ["Soulslike", "Un jugador"],
    about:
      "Black Myth: Wukong es un RPG de acción basado en Viaje al Oeste: sos el Destinado y peleás contra criaturas de la mitología china. Transformaciones, hechizos y jefes que te obligan a aprender cada movimiento.",
    facets: { genero: ["accion", "aventura"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["youtube", "instagram"] },
  },
  {
    id: "helldivers-2",
    ...catalogArt("helldivers-2"),
    title: "Helldivers 2",
    badges: ["Cooperativo", "Shooter"],
    about:
      "En Helldivers 2 formás un escuadrón de cuatro para llevar la democracia gestionada a la galaxia. Fuego amigo siempre activo, estratagemas desde la órbita y una guerra que la comunidad gana o pierde junta.",
    facets: { genero: ["accion"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["discord", "x", "tiktok"] },
  },
  {
    id: "dota-2",
    ...catalogArt("dota-2"),
    title: "Dota 2",
    badges: ["MOBA", "Free-To-Play"],
    about:
      "Dota 2 es el MOBA de Valve: dos equipos de cinco, más de cien héroes y un mapa que se decide torre por torre. Cada parche cambia el meta, y siempre hay una estrategia nueva para probar.",
    facets: { genero: ["estrategia"], plataforma: ["pc"], estado: ["disponible"], redes: ["twitch", "youtube"] },
  },
  {
    id: "among-us",
    ...catalogArt("among-us"),
    title: "Among Us",
    badges: ["Party Game", "Deducción"],
    about:
      "En Among Us la tripulación hace tareas mientras los impostores sabotean la nave. Se juega hablando: sospechás, acusás y votás a quién tirar por la escotilla antes de que sea tarde.",
    facets: { genero: ["casual"], plataforma: ["pc", "consola", "mobile"], estado: ["disponible"], redes: ["tiktok", "discord"] },
  },
  {
    id: "civilization-vii",
    ...catalogArt("civilization-vii"),
    title: "Civilization VII",
    badges: ["Por turnos", "4X"],
    about:
      "Civilization VII divide la historia en tres eras y te deja cambiar de civilización al pasar de una a otra. Fundás ciudades, negociás con líderes históricos y elegís cómo ganar: ciencia, cultura, economía o guerra.",
    facets: { genero: ["estrategia"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["x", "youtube"] },
  },
  {
    id: "rocket-league",
    ...catalogArt("rocket-league"),
    title: "Rocket League",
    badges: ["Fútbol con autos", "Free-To-Play"],
    about:
      "Rocket League es fútbol con autos cohete: saltás, volás y le pegás a una pelota gigante en partidos de cinco minutos. Fácil de entender y muy difícil de dominar, ideal para ligas por equipos.",
    facets: { genero: ["casual"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["twitch", "tiktok", "x"] },
  },
  {
    id: "overwatch-2",
    ...catalogArt("overwatch-2"),
    title: "Overwatch 2",
    badges: ["Hero Shooter", "5v5"],
    about:
      "Overwatch 2 es un shooter por equipos de cinco donde cada héroe cumple un rol: tanque, daño o apoyo. Temporadas cada nueve semanas, con héroes, mapas y modos que se suman al competitivo.",
    facets: { genero: ["accion"], plataforma: ["pc", "consola"], estado: ["disponible"], redes: ["x", "youtube", "twitch"] },
  },
];

export const games: Game[] = gamesCatalog.slice(0, 8);

export const gamesPromo = {
  title: ["Juega y viaja al", "Mundial FIFA 2026"],
  body: ["Para completar esta misión, debes hacer clic en", "el botón de abajo para visitar la página requerida."],
  cta: "Jugar ahora",
  imageSrc: "/assets/home/juegos/banner.webp",
};

export const GAMES_PER_PAGE = 12;

export const gamesRoutePromo = {
  ...gamesPromo,
  label: "¡Novedad!",
  bodyMobile:
    "Para completar esta misión, debes hacer clic en el botón de abajo para visitar la página requerida.",
  imageSrcMobile: "/assets/games/banner-mobile.webp",
};
