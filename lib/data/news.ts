export const newsCategories = [
  { id: "todas", label: "Todas" },
  { id: "lanzamientos", label: "Lanzamientos" },
  { id: "actualizaciones", label: "Actualizaciones" },
  { id: "guias", label: "Guías" },
  { id: "esports", label: "Esports" },
  { id: "sura", label: "Sura" },
] as const;

export type NewsCategory = Exclude<(typeof newsCategories)[number]["id"], "todas">;

export type NewsBlock = { type: "p" | "h" | "quote"; text: string };

export type NewsItem = {
  id: string;
  title: string;
  imageSrc: string;
  readTime: string;
  date: string;
  category: NewsCategory;
  body: NewsBlock[];
};

const p = (text: string): NewsBlock => ({ type: "p", text });
const h = (text: string): NewsBlock => ({ type: "h", text });
const quote = (text: string): NewsBlock => ({ type: "quote", text });

export const news: NewsItem[] = [
  {
    id: "elden-ring",
    title: "Elden Ring: Shadow of the Erdtree Expansion Gets Official Release Dateerint",
    imageSrc: "/assets/home/news/elden-ring.webp",
    readTime: "5 min",
    date: "30/03/25",
    category: "lanzamientos",
    body: [
      p("FromSoftware confirmó la fecha de lanzamiento de Shadow of the Erdtree, la expansión más grande que hizo el estudio. Llega a PC, PlayStation y Xbox, y se juega después de derrotar a Mohg, Señor de la Sangre."),
      h("Qué trae la expansión"),
      p("La Tierra de las Sombras suma un mapa nuevo, armas, hechizos y jefes. El tráiler mostró a Messmer el Empalador, uno de los semidioses de los que el juego base sólo hablaba."),
      quote("Es la expansión más grande que hicimos."),
      p("Para la comunidad de Sura, la expansión llega con un evento propio: tres noches de speedrun con premios en USDC. La inscripción abre la semana del lanzamiento."),
    ],
  },
  {
    id: "guild-of-guardians",
    title: "Top 3 Guild of Guardians characters highlights",
    imageSrc: "/assets/home/news/guild-of-guardians.webp",
    readTime: "5 min",
    date: "20/03/25",
    category: "guias",
    body: [
      p("Guild of Guardians tiene más de cien héroes, y elegir con cuáles armar el equipo es la mitad del juego. Estos son los tres que más se repiten entre los mejores jugadores de la comunidad."),
      h("Por qué estos tres"),
      p("Los tres cubren un rol distinto: uno aguanta el daño, otro lo reparte y el tercero cura. Juntos funcionan en casi todas las mazmorras sin tener que cambiar de estrategia."),
      p("Si recién empezás, conviene subir de nivel primero al que cura: es el que más partidas salva cuando el equipo todavía es débil."),
    ],
  },
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077: Phantom Liberty - The Expansion That Redeems Night City",
    imageSrc: "/assets/home/news/cyberpunk.png",
    readTime: "5 min",
    date: "20/03/25",
    category: "actualizaciones",
    body: [
      p("Phantom Liberty llegó junto con la actualización 2.0, que rehízo el árbol de habilidades, la policía y los combates en vehículo. Para muchos jugadores, es el Cyberpunk 2077 que se prometió en el lanzamiento."),
      h("Dogtown"),
      p("La expansión transcurre en Dogtown, un distrito nuevo con su propia historia de espionaje. Se puede jugar en cualquier momento de la partida, sin terminar la campaña principal."),
      quote("Night City por fin se siente viva."),
      p("La actualización es gratis para todos los que tienen el juego base; la expansión se compra aparte."),
    ],
  },
  {
    id: "warzone-temporada-3",
    title: "Warzone suma un mapa nuevo para la temporada 3",
    imageSrc: "/assets/home/juegos/cod-mw.webp",
    readTime: "4 min",
    date: "18/03/25",
    category: "actualizaciones",
    body: [
      p("La temporada 3 de Warzone llega con un mapa nuevo, más chico que los anteriores y pensado para partidas cortas de 50 jugadores."),
      h("Qué cambia"),
      p("Vuelven los contratos de recompensa y se ajustan las armas más usadas de la temporada pasada. El pase de batalla suma dos operadores nuevos."),
      p("En Sura, el primer torneo en el mapa nuevo abre su inscripción esta semana."),
    ],
  },
  {
    id: "minecraft-live",
    title: "Minecraft Live: todo lo que se anunció",
    imageSrc: "/assets/home/juegos/minecraft.webp",
    readTime: "6 min",
    date: "15/03/25",
    category: "lanzamientos",
    body: [
      p("Mojang mostró en Minecraft Live las novedades de las próximas actualizaciones: un bioma nuevo, criaturas y cambios en el sistema de encantamientos."),
      h("Lo más esperado"),
      p("La comunidad votó la criatura que se va a sumar al juego. Las otras dos candidatas quedan, como siempre, para una próxima votación."),
      p("Las novedades se pueden probar antes en las versiones de prueba, tanto en Java como en Bedrock."),
    ],
  },
  {
    id: "wagmi-torneo-temporada",
    title: "Wagmi Defense abre su torneo de temporada en Sura",
    imageSrc: "/assets/home/juegos/wagmi.webp",
    readTime: "3 min",
    date: "12/03/25",
    category: "sura",
    body: [
      p("Wagmi Defense estrena su torneo de temporada dentro de Sura: cuatro semanas de partidas clasificatorias y una final en vivo."),
      h("Cómo participar"),
      p("La inscripción se hace desde Eventos. Cada partida suma Sura Points aunque no pases de ronda, y los primeros puestos se llevan premios en USDC."),
      quote("Es el torneo más grande que hicimos con un juego de la comunidad."),
    ],
  },
  {
    id: "mario-kart-pistas",
    title: "Mario Kart: las pistas que vuelven",
    imageSrc: "/assets/home/juegos/mario.webp",
    readTime: "4 min",
    date: "10/03/25",
    category: "lanzamientos",
    body: [
      p("Nintendo confirmó la lista de pistas clásicas que vuelven renovadas en la próxima entrega de Mario Kart."),
      h("Las favoritas"),
      p("Entre las confirmadas están algunas de las más pedidas por la comunidad, con atajos nuevos y cambios de clima durante la carrera."),
      p("Sura va a tener una liga semanal apenas salga el juego."),
    ],
  },
  {
    id: "ligas-de-carreras",
    title: "Las mejores ligas de carreras para arrancar",
    imageSrc: "/assets/home/juegos/racing.webp",
    readTime: "7 min",
    date: "08/03/25",
    category: "esports",
    body: [
      p("Las ligas de carreras son una de las puertas de entrada más amables a los esports: hay categorías para todos los niveles y la mayoría se juega online."),
      h("Por dónde empezar"),
      p("Conviene arrancar por una liga con categoría de principiantes y horarios fijos. Así se entrena siempre contra los mismos rivales y se nota el progreso."),
      p("En Sura hay dos ligas abiertas este mes, las dos con inscripción gratis."),
    ],
  },
  {
    id: "mundial-fifa-2026-mini-juego",
    title: "El Mundial FIFA 2026 llega a Sura con un mini-juego",
    imageSrc: "/assets/home/juegos/banner.webp",
    readTime: "3 min",
    date: "05/03/25",
    category: "sura",
    body: [
      p("Sura suma un mini-juego de fútbol para acompañar el Mundial FIFA 2026. Cada partido ganado suma Sura Points y entradas a un sorteo."),
      h("El premio"),
      p("Entre los que jueguen durante el torneo se sortea un viaje para ver un partido del Mundial. Cuantas más partidas, más chances."),
    ],
  },
  {
    id: "valorant-champions-equipos",
    title: "Valorant Champions Tour: los equipos a seguir",
    imageSrc: "/assets/home/hero-loop/desktop-poster.webp",
    readTime: "6 min",
    date: "02/03/25",
    category: "esports",
    body: [
      p("Arranca una nueva temporada del Valorant Champions Tour y la región latinoamericana llega con varios equipos que pelean por un lugar en el torneo internacional."),
      h("A quién mirar"),
      p("Los equipos que mejor terminaron el año pasado mantuvieron a sus jugadores clave, y hay dos proyectos nuevos que armaron sus planteles con talento de la escena competitiva regional."),
      p("Los partidos se pueden seguir en vivo, y en Sura hay un evento de predicciones con premios para cada jornada."),
    ],
  },
  {
    id: "ac-valhalla-consejos",
    title: "Assassin's Creed Valhalla: cinco consejos para empezar",
    imageSrc: "/assets/home/juegos/ac-valhalla.png",
    readTime: "5 min",
    date: "28/02/25",
    category: "guias",
    body: [
      p("Valhalla es un juego largo, y las primeras horas definen mucho de cómo se disfruta el resto. Estos cinco consejos ayudan a arrancar bien."),
      h("Lo primero"),
      p("Explorá antes de avanzar con la historia: los recursos del principio sirven para mejorar el asentamiento, y un buen asentamiento hace todo más fácil después."),
      p("Y no ignores las misiones del mundo: dan poco al principio, pero algunas desbloquean habilidades que cambian el combate."),
    ],
  },
];

export const getNewsItem = (id: string) => news.find((item) => item.id === id);

export const newsCategoryLabel = (id: NewsCategory) => newsCategories.find((category) => category.id === id)!.label;

export const relatedNews = (item: NewsItem) =>
  [...news.filter((other) => other.id !== item.id && other.category === item.category), ...news.filter((other) => other.id !== item.id && other.category !== item.category)].slice(0, 3);

export const newsIntro = {
  title: "Sura News",
  body: [
    "Todo lo que está pasando en el mundo del gaming,",
    "en un solo lugar. Noticias, leaks, updates",
    "y tendencias al instante. Si está pasando,",
    "está en Sura News.",
  ],
  cta: "ir a sura news",
};
