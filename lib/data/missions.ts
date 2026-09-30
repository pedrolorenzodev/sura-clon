export type Mission = {
  id: string;
  title: string;
  description: string;
  reward: string;
  imageSrc: string;
  status?: MissionStatus;
  category?: MissionCategory;
  highlighted?: boolean;
};

export type MissionStatus = "available" | "completed" | "ended";

export type MissionCategory = "sociales" | "sura" | "eventos";

export type MissionOption = {
  id: string;
  label: string;
};

export const missionTabs: MissionOption[] = [
  { id: "todas", label: "Todas" },
  { id: "sociales", label: "Sociales" },
  { id: "sura", label: "Sura" },
  { id: "eventos", label: "Eventos" },
];

export const missionFilters: MissionOption[] = [
  { id: "disponibles", label: "Disponibles" },
  { id: "completadas", label: "Completadas" },
  { id: "finalizadas", label: "Finalizadas" },
  { id: "todas", label: "Todas" },
];

export const MISSION_FILTER_STATUS: Record<string, MissionStatus | undefined> = {
  disponibles: "available",
  completadas: "completed",
  finalizadas: "ended",
};

export const MISSIONS_PER_PAGE = 16;

export const allMissions: Mission[] = [
  {
    id: "gana-partida-fortnite",
    title: "Ganá una partida de Fortnite",
    description: "Terminá primero en cualquier modo de Battle Royale. Vale solo, en dúo o en escuadra.",
    reward: "+200",
    imageSrc: "/assets/missions/covers/gana-partida-fortnite.webp",
    category: "eventos",
    status: "available",
  },
  {
    id: "partidas-valorant",
    title: "Jugá 10 partidas de Valorant",
    description: "Jugá diez partidas de Competitivo o No clasificatorio. No hace falta ganarlas, sólo terminarlas.",
    reward: "+150",
    imageSrc: "/assets/missions/covers/partidas-valorant.webp",
    category: "eventos",
    status: "available",
  },
  {
    id: "top-10-pubg",
    title: "Llegá al top 10 en PUBG",
    description: "Sobreviví hasta que queden diez escuadras en pie en Erangel, Miramar o Taego.",
    reward: "+150",
    imageSrc: "/assets/missions/covers/top-10-pubg.webp",
    category: "eventos",
    status: "available",
  },
  {
    id: "duelos-street-fighter-6",
    title: "Ganá 3 duelos en SF6",
    description: "Ganá tres combates de Street Fighter 6 en partidas clasificatorias o en el Battle Hub, con cualquier personaje.",
    reward: "+150",
    imageSrc: "/assets/missions/covers/duelos-street-fighter-6.webp",
    category: "eventos",
    status: "available",
  },
  {
    id: "jefe-silksong",
    title: "Derrotá un jefe en Silksong",
    description: "Vencé a cualquiera de los jefes de Pharloom en Hollow Knight: Silksong. Si ya los pasaste todos, vale volver a pelear uno.",
    reward: "+200",
    imageSrc: "/assets/missions/covers/jefe-silksong.webp",
    category: "eventos",
    status: "available",
  },
  {
    id: "acto-baldurs-gate-3",
    title: "Terminá el acto 1 de BG3",
    description: "Llegá al final del acto 1 de Baldur's Gate 3 con tu grupo. Cuenta tanto la partida solo como la cooperativa.",
    reward: "+300",
    imageSrc: "/assets/missions/covers/acto-baldurs-gate-3.webp",
    category: "eventos",
    status: "available",
  },
  {
    id: "oleadas-helldivers-2",
    title: "Salvá la galaxia en Helldivers 2",
    description: "Terminá las tres misiones de una operación en cualquier dificultad, con tu escuadra o con desconocidos.",
    reward: "+200",
    imageSrc: "/assets/missions/covers/oleadas-helldivers-2.webp",
    category: "eventos",
    status: "available",
  },
  {
    id: "caza-monster-hunter-wilds",
    title: "Cazá un monstruo en MH Wilds",
    description: "Completá una caza o captura contra un monstruo grande de las Tierras Prohibidas en Monster Hunter Wilds.",
    reward: "+200",
    imageSrc: "/assets/missions/covers/caza-monster-hunter-wilds.webp",
    category: "eventos",
    status: "completed",
  },
  {
    id: "goles-rocket-league",
    title: "Meté 3 goles en Rocket League",
    description: "Convertí tres goles en partidas online, en una sola sesión o repartidos en varias.",
    reward: "+120",
    imageSrc: "/assets/missions/covers/goles-rocket-league.webp",
    category: "eventos",
    status: "available",
  },
  {
    id: "victoria-marvel-rivals",
    title: "Ganá una partida de Marvel Rivals",
    description: "Ganá una partida rápida o competitiva con cualquier héroe. Los modos de práctica no cuentan.",
    reward: "+150",
    imageSrc: "/assets/missions/covers/victoria-marvel-rivals.webp",
    category: "eventos",
    status: "ended",
  },
  {
    id: "zona-final-apex",
    title: "Llegá al último anillo en Apex",
    description: "Mantené vivo a tu escuadrón hasta el último cierre del anillo en cualquier mapa de la rotación.",
    reward: "+150",
    imageSrc: "/assets/missions/covers/zona-final-apex.webp",
    category: "eventos",
    status: "available",
  },
  {
    id: "clasificatorias-cs2",
    title: "Jugá 5 partidas de Premier en CS2",
    description: "Completá cinco partidas del modo Premier. Si abandonás una, no suma para la misión.",
    reward: "+150",
    imageSrc: "/assets/missions/covers/clasificatorias-cs2.webp",
    category: "eventos",
    status: "completed",
  },
  {
    id: "conecta-twitch",
    title: "Conectá tu cuenta de Twitch",
    description: "Vinculá Twitch con tu perfil para que tus streams aparezcan en la sección de la comunidad.",
    reward: "+100",
    imageSrc: "/assets/missions/covers/conecta-twitch.webp",
    category: "sociales",
    status: "available",
  },
  {
    id: "sigue-tiktok",
    title: "Seguí a Sura en TikTok",
    description: "Seguí la cuenta oficial de Sura Gaming en TikTok y enterate primero de cada torneo.",
    reward: "+80",
    imageSrc: "/assets/missions/covers/sigue-tiktok.webp",
    category: "sociales",
    status: "completed",
  },
  {
    id: "logro-instagram",
    title: "Compartí un logro en Instagram",
    description: "Subí una historia con una de tus medallas y etiquetá a Sura Gaming para validar la misión.",
    reward: "+100",
    imageSrc: "/assets/missions/covers/logro-instagram.webp",
    category: "sociales",
    status: "available",
  },
  {
    id: "amigo-clan",
    title: "Sumá un amigo a tu clan",
    description: "Invitá a alguien a tu clan desde el perfil. La misión se completa cuando acepta la invitación.",
    reward: "+120",
    imageSrc: "/assets/missions/covers/amigo-clan.webp",
    category: "sociales",
    status: "ended",
  },
  {
    id: "reacciona-discord",
    title: "Reaccioná a un anuncio en Discord",
    description: "Entrá al canal de anuncios del servidor de Sura y dejá una reacción en el último posteo.",
    reward: "+80",
    imageSrc: "/assets/missions/covers/reacciona-discord.webp",
    category: "sociales",
    status: "available",
  },
  {
    id: "sigue-x",
    title: "Seguí a Sura en X",
    description: "Seguí la cuenta oficial de Sura Gaming en X para recibir los resultados de cada evento.",
    reward: "+80",
    imageSrc: "/assets/missions/covers/sigue-x.webp",
    category: "sociales",
    status: "completed",
  },
  {
    id: "comparte-torneo",
    title: "Compartí un torneo con tu clan",
    description: "Mandá el link de cualquier evento abierto al chat de tu clan desde el botón Compartir.",
    reward: "+100",
    imageSrc: "/assets/missions/covers/comparte-torneo.webp",
    category: "sociales",
    status: "available",
  },
  {
    id: "invita-torneo",
    title: "Invitá a un amigo a un torneo",
    description: "Tu amigo tiene que inscribirse con tu link en un evento que todavía tenga cupo.",
    reward: "+150",
    imageSrc: "/assets/missions/covers/invita-torneo.webp",
    category: "sociales",
    status: "completed",
  },
  {
    id: "comenta-youtube",
    title: "Comentá un video de Sura",
    description: "Dejá un comentario en el último video del canal de YouTube de Sura Gaming con tu usuario de la app.",
    reward: "+80",
    imageSrc: "/assets/missions/covers/comenta-youtube.webp",
    category: "sociales",
    status: "available",
  },
  {
    id: "encuesta-semanal",
    title: "Votá la encuesta de la comunidad",
    description: "Cada semana la comunidad elige el juego del próximo torneo. Votá antes del domingo.",
    reward: "+50",
    imageSrc: "/assets/missions/covers/encuesta-semanal.webp",
    category: "sociales",
    status: "ended",
  },
  {
    id: "completa-perfil",
    title: "Completá tu perfil",
    description: "Cargá tu nombre, apellido, fecha de nacimiento y país desde Mi Perfil.",
    reward: "+120",
    imageSrc: "/assets/missions/covers/completa-perfil.webp",
    category: "sura",
    status: "available",
  },
  {
    id: "tres-dias-seguidos",
    title: "Jugá tres días seguidos",
    description: "Entrá a Sura y jugá al menos una partida durante tres días consecutivos.",
    reward: "+100",
    imageSrc: "/assets/missions/covers/tres-dias-seguidos.webp",
    category: "sura",
    status: "completed",
  },
  {
    id: "suma-500-sp",
    title: "Sumá 500 SP en una semana",
    description: "Juntá quinientos Sura Points entre misiones, torneos y recompensas diarias en siete días.",
    reward: "+200",
    imageSrc: "/assets/missions/covers/suma-500-sp.webp",
    category: "sura",
    status: "available",
  },
  {
    id: "recompensa-diaria",
    title: "Reclamá tu recompensa diaria",
    description: "Tocá Reclamar en el header para sumar los puntos del día. Se renueva cada 24 horas.",
    reward: "+50",
    imageSrc: "/assets/missions/covers/recompensa-diaria.webp",
    category: "sura",
    status: "completed",
  },
  {
    id: "primera-medalla",
    title: "Desbloqueá tu primera medalla",
    description: "Completá el objetivo de cualquier medalla. Las que te faltan están en tu perfil, en Logros.",
    reward: "+150",
    imageSrc: "/assets/missions/covers/primera-medalla.webp",
    category: "sura",
    status: "available",
  },
  {
    id: "nivel-guerrero",
    title: "Llegá al nivel Guerrero",
    description: "Sumá diez mil Sura Points para pasar de Novato a Guerrero y desbloquear nuevas recompensas.",
    reward: "+300",
    imageSrc: "/assets/missions/covers/nivel-guerrero.webp",
    category: "sura",
    status: "ended",
  },
  {
    id: "mira-stream",
    title: "Mirá un stream de Sura",
    description: "Conectate a una transmisión en vivo de Sura durante al menos quince minutos.",
    reward: "+80",
    imageSrc: "/assets/missions/covers/mira-stream.webp",
    category: "sura",
    status: "available",
  },
  {
    id: "participa-evento",
    title: "Participá de un evento Sura",
    description: "Inscribite en cualquier evento organizado por SuraGaming y jugá tu primera partida.",
    reward: "+200",
    imageSrc: "/assets/missions/covers/participa-evento.webp",
    category: "sura",
    status: "completed",
  },
  {
    id: "lee-sura-news",
    title: "Leé una nota de Sura News",
    description: "Abrí cualquier nota de Sura News y leela hasta el final.",
    reward: "+50",
    imageSrc: "/assets/missions/covers/lee-sura-news.webp",
    category: "sura",
    status: "available",
  },
  {
    id: "juego-nuevo",
    title: "Probá un juego nuevo del catálogo",
    description: "Jugá una partida de un juego del catálogo que todavía no hayas probado.",
    reward: "+100",
    imageSrc: "/assets/missions/covers/juego-nuevo.webp",
    category: "sura",
    status: "completed",
  },
];

export const featuredMissions: Mission[] = [
  {
    id: "conecta-x",
    title: "Conecta tu cuenta de X",
    description:
      "Vinculá tu cuenta de X con tu perfil de Sura y sumá los puntos apenas se confirme el enlace.",
    reward: "+120",
    imageSrc: "/assets/missions/covers/conecta-x.webp",
  },
  {
    id: "conecta-instagram",
    title: "Conecta tu cuenta de Instagram",
    description:
      "Enlazá tu Instagram para desbloquear las misiones sociales y competir en los rankings de la comunidad.",
    reward: "+120",
    imageSrc: "/assets/missions/covers/conecta-instagram.webp",
    highlighted: true,
  },
  {
    id: "conecta-discord",
    title: "Conecta tu cuenta de Discord",
    description:
      "Sumate al servidor de Sura y vinculá tu usuario para recibir los avisos de cada torneo.",
    reward: "+120",
    imageSrc: "/assets/missions/covers/conecta-discord.webp",
  },
  {
    id: "racha-siete-dias",
    title: "Sumá 7 días seguidos de racha",
    description:
      "Entrá a Sura una vez por día durante una semana. La racha se corta si te salteás un día.",
    reward: "+250",
    imageSrc: "/assets/missions/covers/racha-siete-dias.webp",
  },
  {
    id: "invita-amigos",
    title: "Invitá a tres amigos a Sura",
    description:
      "Compartí tu link de referido. Cada amigo que complete su perfil te suma puntos a vos también.",
    reward: "+300",
    imageSrc: "/assets/missions/covers/invita-amigos.webp",
  },
  {
    id: "primer-torneo",
    title: "Completá tu primer torneo",
    description:
      "Inscribite en cualquier evento abierto y jugá hasta el final. No hace falta ganar para cobrar.",
    reward: "+500",
    imageSrc: "/assets/missions/covers/primer-torneo.webp",
  },
];

export const missions: Mission[] = [
  "gana-partida-fortnite",
  "partidas-valorant",
  "jefe-silksong",
  "duelos-street-fighter-6",
  "acto-baldurs-gate-3",
  "goles-rocket-league",
].map((id) => allMissions.find((mission) => mission.id === id)!);

const FEATURED_CATEGORY: Record<string, MissionCategory> = {
  "conecta-x": "sociales",
  "conecta-instagram": "sociales",
  "conecta-discord": "sociales",
  "racha-siete-dias": "sura",
  "invita-amigos": "sociales",
  "primer-torneo": "eventos",
};

export const missionById = new Map<string, Mission>(
  [
    ...featuredMissions.map((mission) => ({ ...mission, category: FEATURED_CATEGORY[mission.id] ?? "sura" })),
    ...allMissions,
  ].map((mission) => [mission.id, mission]),
);

const STEPS: Record<MissionCategory, (title: string) => string[]> = {
  eventos: (title) => [
    `${title}.`,
    "Cuando lo logres, sacá una captura donde se vea el resultado.",
    "Volvé a esta misión y subí la captura.",
    "Tocá Reclamar y listo, los puntos se suman a tu cuenta.",
  ],
  sociales: (title) => [
    `${title} desde el botón de abajo.`,
    "Aceptá el permiso para que Sura pueda validar la misión.",
    "Volvé a esta misión: se valida sola en unos minutos.",
    "Tocá Reclamar y listo, los puntos se suman a tu cuenta.",
  ],
  sura: (title) => [
    `${title} desde tu cuenta de Sura.`,
    "Seguí el avance desde tu perfil.",
    "Cuando la misión figure como lista, volvé acá.",
    "Tocá Reclamar y listo, los puntos se suman a tu cuenta.",
  ],
};

export const missionSteps = (mission: Mission) => STEPS[mission.category ?? "sura"](mission.title);

export const missionCopy = {
  subtitle: "Completa la misión y obtén los puntos:",
  subtitleMobile: "Completa la misión y obtén los puntos que te mostramos a continuación:",
  rewardLabel: "Conseguirás:",
  stepsTitle: "Pasos a seguir",
  play: "Jugar ahora",
  claim: "Reclamar",
  completed: "Completada",
  ended: "Finalizada",
};

export const rewardPoints = (mission: Mission) => Number(mission.reward.replace(/\D/g, ""));
