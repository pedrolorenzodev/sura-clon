export type Mission = {
  id: string;
  title: string;
  description: string;
  reward: string;
  imageSrc: string;
};

const DESCRIPTION =
  "Para completar esta misión, debes hacer clic en el botón de abajo para visitar la página requerida.";

export const missions: Mission[] = [
  {
    id: "fortnite",
    title: "Juega a Fortnite",
    description: DESCRIPTION,
    reward: "+120",
    imageSrc: "/assets/home/misiones/fortnite.png",
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
    imageSrc: "/assets/home/misiones/assassins-creed.png",
  },
  {
    id: "mario-bros",
    title: "Gana una partida de Mario Bros.",
    description: DESCRIPTION,
    reward: "+120",
    imageSrc: "/assets/home/misiones/mario.png",
  },
  {
    id: "minecraft",
    title: "Construye tu primera base en Minecraft",
    description: DESCRIPTION,
    reward: "+120",
    imageSrc: "/assets/home/juegos/minecraft.png",
  },
  {
    id: "wagmi-defense",
    title: "Defiende 3 oleadas en Wagmi Defense",
    description: DESCRIPTION,
    reward: "+120",
    imageSrc: "/assets/home/juegos/wagmi.png",
  },
];
