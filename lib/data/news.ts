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
    title: "Elden Ring: Shadow of the Erdtree Expansion Gets Official Release Date",
    imageSrc: "/assets/news/elden-ring.webp",
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
    imageSrc: "/assets/news/cyberpunk-2077.webp",
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
    imageSrc: "/assets/news/warzone-temporada-3.webp",
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
    id: "monster-hunter-wilds-actualizacion",
    title: "Monster Hunter Wilds suma un monstruo nuevo gratis",
    imageSrc: "/assets/news/monster-hunter-wilds-actualizacion.webp",
    readTime: "6 min",
    date: "15/03/25",
    category: "actualizaciones",
    body: [
      p("Capcom publicó la primera actualización gratuita de Monster Hunter Wilds: un monstruo nuevo, una zona de caza ampliada y un evento por tiempo limitado."),
      h("Qué trae"),
      p("El monstruo llega con su propio set de armadura y armas nuevas para las catorce clases. La actualización también ajusta la dificultad de las cacerías en grupo."),
      p("En Sura, la misión de caza de esta semana suma el doble de puntos si el objetivo es el monstruo nuevo."),
    ],
  },
  {
    id: "liga-ancestral-inscripciones",
    title: "La Liga Ancestral de Dota 2 abre inscripciones en Sura",
    imageSrc: "/assets/news/liga-ancestral-inscripciones.webp",
    readTime: "3 min",
    date: "12/03/25",
    category: "sura",
    body: [
      p("Sura lanza la Liga Ancestral, su primera liga de Dota 2: cuatro semanas de series en Captains Mode y una final en vivo con casteo en español."),
      h("Cómo participar"),
      p("Los equipos se inscriben desde Eventos, con un capitán y cinco titulares. Cada serie suma Sura Points aunque no ganes, y los primeros puestos se llevan premios en USDC."),
      quote("Es la liga más grande que armamos con la comunidad."),
    ],
  },
  {
    id: "marvel-rivals-temporada",
    title: "Marvel Rivals: los héroes que llegan en la nueva temporada",
    imageSrc: "/assets/news/marvel-rivals-temporada.webp",
    readTime: "4 min",
    date: "10/03/25",
    category: "lanzamientos",
    body: [
      p("NetEase presentó la nueva temporada de Marvel Rivals, con dos héroes nuevos, un mapa y cambios en el sistema de rangos."),
      h("Los recién llegados"),
      p("Los dos héroes nuevos cubren roles que el plantel tenía flojos: uno de apoyo con curación a distancia y un vanguardia que protege a todo el equipo con escudos."),
      p("La Copa Rivals de Sura se juega con la temporada nueva, así que conviene practicar con los héroes antes de la inscripción."),
    ],
  },
  {
    id: "ligas-rocket-league",
    title: "Las mejores ligas de Rocket League para arrancar",
    imageSrc: "/assets/news/ligas-rocket-league.webp",
    readTime: "7 min",
    date: "08/03/25",
    category: "esports",
    body: [
      p("Rocket League es una de las puertas de entrada más amables a los esports: los partidos duran cinco minutos, hay rangos para todos los niveles y se juega gratis."),
      h("Por dónde empezar"),
      p("Conviene arrancar por una liga con división de principiantes y horarios fijos. Así se entrena siempre contra los mismos rivales y se nota el progreso."),
      p("En Sura hay dos ligas abiertas este mes, las dos con inscripción gratis y partidos de tres contra tres."),
    ],
  },
  {
    id: "mundial-fifa-2026-mini-juego",
    title: "El Mundial FIFA 2026 llega a Sura con un mini-juego",
    imageSrc: "/assets/news/mundial-fifa-2026-mini-juego.webp",
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
    imageSrc: "/assets/news/valorant-champions-equipos.webp",
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
    id: "ac-shadows-consejos",
    title: "Assassin's Creed Shadows: cinco consejos para empezar",
    imageSrc: "/assets/news/ac-shadows-consejos.webp",
    readTime: "5 min",
    date: "28/02/25",
    category: "guias",
    body: [
      p("Shadows es un juego largo y alterna entre dos protagonistas, Naoe y Yasuke. Las primeras horas definen mucho de cómo se disfruta el resto, y estos consejos ayudan a arrancar bien."),
      h("Lo primero"),
      p("Usá a Naoe para las misiones de infiltración y a Yasuke para los combates abiertos: cada uno tiene su propio árbol de habilidades y conviene mejorarlos por separado."),
      p("Y no ignores el escondite: mejorarlo desde temprano desbloquea aliados y bonificaciones que después hacen todo más fácil."),
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
