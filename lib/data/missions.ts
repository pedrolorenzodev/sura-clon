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

const DESCRIPTION =
  "Para completar esta misión, debes hacer clic en el botón de abajo para visitar la página requerida.";

export const missions: Mission[] = [
  {
    id: "fortnite",
    title: "Juega a Fortnite",
    description: DESCRIPTION,
    reward: "+120",
    imageSrc: "/assets/home/misiones/fortnite.webp",
  },
  {
    id: "valorant",
    title: "Completa 10 partidas de Valorant",
    description: DESCRIPTION,
    reward: "+120",
    imageSrc: "/assets/home/misiones/valorant.png",
  },
  {
    id: "assassins-creed",
    title: "Termina Assassin's Creed Syndicate",
    description: DESCRIPTION,
    reward: "+120",
    imageSrc: "/assets/home/misiones/assassins-creed.webp",
  },
  {
    id: "mario-bros",
    title: "Gana una partida de Mario Bros.",
    description: DESCRIPTION,
    reward: "+120",
    imageSrc: "/assets/home/misiones/mario.webp",
  },
  {
    id: "minecraft",
    title: "Construye tu primera base en Minecraft",
    description: DESCRIPTION,
    reward: "+120",
    imageSrc: "/assets/home/juegos/minecraft.webp",
  },
  {
    id: "wagmi-defense",
    title: "Defiende 3 oleadas en Wagmi Defense",
    description: DESCRIPTION,
    reward: "+120",
    imageSrc: "/assets/home/juegos/wagmi.webp",
  },
];

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

const ART = {
  fortnite: "/assets/home/misiones/fortnite.webp",
  valorant: "/assets/home/misiones/valorant.png",
  assassinsCreed: "/assets/home/misiones/assassins-creed.webp",
  mario: "/assets/home/misiones/mario.webp",
  minecraft: "/assets/home/juegos/minecraft.webp",
  wagmi: "/assets/home/juegos/wagmi.webp",
  codMw: "/assets/home/juegos/cod-mw.webp",
  racing: "/assets/home/juegos/racing.webp",
  valhalla: "/assets/home/juegos/ac-valhalla.png",
};

type MissionSeed = [title: string, category: MissionCategory, imageSrc: string];

const SEEDS: MissionSeed[] = [
  ["Juega a Fortnite", "eventos", ART.fortnite],
  ["Conecta tu cuenta de X", "sociales", ART.codMw],
  ["Completa tu perfil", "sura", ART.valhalla],
  ["Completa 10 partidas de Valorant", "eventos", ART.valorant],
  ["Sumá un amigo a tu clan", "sociales", ART.minecraft],
  ["Jugá tres días seguidos", "sura", ART.racing],
  ["Termina Assassin's Creed Syndicate", "eventos", ART.assassinsCreed],
  ["Compartí un logro en Instagram", "sociales", ART.fortnite],
  ["Sumá 500 SP en una semana", "sura", ART.mario],
  ["Gana una partida de Mario Bros.", "eventos", ART.mario],
  ["Conecta tu cuenta de Discord", "sociales", ART.racing],
  ["Mirá un stream de Sura", "sura", ART.valorant],
  ["Construye tu primera base en Minecraft", "eventos", ART.minecraft],
  ["Seguí a Sura en X", "sociales", ART.wagmi],
  ["Reclamá tu recompensa diaria", "sura", ART.codMw],
  ["Defiende 3 oleadas en Wagmi Defense", "eventos", ART.wagmi],
  ["Conecta tu cuenta de Instagram", "sociales", ART.valhalla],
  ["Desbloqueá tu primera medalla", "sura", ART.assassinsCreed],
  ["Sobreviví una ronda en Modern Warfare", "eventos", ART.codMw],
  ["Invitá a tres amigos a Sura", "sociales", ART.mario],
  ["Llegá al nivel Guerrero", "sura", ART.minecraft],
  ["Gana una carrera sin chocar", "eventos", ART.racing],
  ["Compartí un torneo con tu clan", "sociales", ART.valorant],
  ["Participa de un evento Sura", "sura", ART.fortnite],
];

const STATUS_CYCLE: MissionStatus[] = ["available", "completed", "available", "ended", "available", "completed"];

export const MISSIONS_PER_PAGE = 16;

export const allMissions: Mission[] = [0, 1, 2].flatMap((round) =>
  SEEDS.map(([title, category, imageSrc], index) => ({
    id: `mission-${round * SEEDS.length + index + 1}`,
    title,
    description: DESCRIPTION,
    reward: "+120",
    imageSrc,
    category,
    status: STATUS_CYCLE[(index + round * 2) % STATUS_CYCLE.length],
  })),
);

export const featuredMissions: Mission[] = [
  {
    id: "conecta-x",
    title: "Conecta tu cuenta de X",
    description:
      "Vinculá tu cuenta de X con tu perfil de Sura y sumá los puntos apenas se confirme el enlace.",
    reward: "+120",
    imageSrc: "/assets/home/juegos/cod-mw.webp",
  },
  {
    id: "conecta-instagram",
    title: "Conecta tu cuenta de Instagram",
    description:
      "Enlazá tu Instagram para desbloquear las misiones sociales y competir en los rankings de la comunidad.",
    reward: "+120",
    imageSrc: "/assets/home/misiones/fortnite.webp",
    highlighted: true,
  },
  {
    id: "conecta-discord",
    title: "Conecta tu cuenta de Discord",
    description:
      "Sumate al servidor de Sura y vinculá tu usuario para recibir los avisos de cada torneo.",
    reward: "+120",
    imageSrc: "/assets/home/juegos/racing.webp",
  },
  {
    id: "racha-siete-dias",
    title: "Sumá 7 días seguidos de racha",
    description:
      "Entrá a Sura una vez por día durante una semana. La racha se corta si te salteás un día.",
    reward: "+250",
    imageSrc: "/assets/home/juegos/ac-valhalla.png",
  },
  {
    id: "invita-amigos",
    title: "Invitá a tres amigos a Sura",
    description:
      "Compartí tu link de referido. Cada amigo que complete su perfil te suma puntos a vos también.",
    reward: "+300",
    imageSrc: "/assets/home/misiones/mario.webp",
  },
  {
    id: "primer-torneo",
    title: "Completá tu primer torneo",
    description:
      "Inscribite en cualquier evento abierto y jugá hasta el final. No hace falta ganar para cobrar.",
    reward: "+500",
    imageSrc: "/assets/home/misiones/valorant.png",
  },
];
