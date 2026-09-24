export type Mission = {
  id: string;
  title: string;
  description: string;
  reward: string;
  imageSrc: string;
  completed?: boolean;
  highlighted?: boolean;
};

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

const ART = [
  "/assets/home/misiones/fortnite.webp",
  "/assets/home/misiones/valorant.png",
  "/assets/home/misiones/assassins-creed.webp",
  "/assets/home/misiones/mario.webp",
  "/assets/home/juegos/minecraft.webp",
  "/assets/home/juegos/wagmi.webp",
  "/assets/home/juegos/cod-mw.webp",
  "/assets/home/juegos/racing.webp",
];

const TITLES = [
  "Juega a Fortnite",
  "Completa 10 partidas de Valorant",
  "Termina Assassin's Creed Syndicate",
  "Gana una partida de Mario Bros.",
  "Construye tu primera base en Minecraft",
  "Defiende 3 oleadas en Wagmi Defense",
  "Sobreviví una ronda en Modern Warfare",
  "Gana una carrera sin chocar",
  "Conecta tu cuenta de X",
  "Sumá un amigo a tu clan",
  "Completa tu perfil",
  "Compartí un logro en Instagram",
  "Jugá tres días seguidos",
  "Sumá 500 SP en una semana",
  "Mirá un stream de Sura",
  "Participa de un evento Sura",
];

const DONE = new Set([4, 7, 9, 10, 13]);

export const allMissions: Mission[] = TITLES.map((title, index) => ({
  id: `mission-${index + 1}`,
  title,
  description: DESCRIPTION,
  reward: "+120",
  imageSrc: ART[index % ART.length],
  completed: DONE.has(index),
}));

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
