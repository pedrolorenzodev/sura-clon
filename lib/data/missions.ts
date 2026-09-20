/** Sección Misiones del Home. Fase 1: hardcodeada (AGENTS regla 9). */

export type Mission = {
  id: string;
  /** Título de la misión, tal cual el diseño. */
  title: string;
  description: string;
  /** Sura Points que paga, ya formateado como lo muestra el badge. */
  reward: string;
  /** Portada del juego. */
  imageSrc: string;
};

/**
 * Seis misiones. El Figma trae cuatro; las dos últimas las agregó el usuario
 * (2026-09-20) para que el carrusel tenga recorrido, y toman su portada de la
 * sección Juegos. Reusarlas acá no es repetir arte: en una misión la portada
 * **identifica el juego**, así que encontrar Minecraft en el catálogo y en una
 * misión es coherente. La card las recorta a 229.456/128 y las dos originales
 * son 16:9, o sea que entran sin recorte visible.
 *
 * El frame mobile repite "Conecta tu cuenta de X" en sus tres cards, que es
 * placeholder: se unifica en las de desktop, con el mismo criterio que el podio
 * del Leaderboard (PRD § 6, deuda).
 *
 * La descripción es la misma en las cuatro, y así está en el diseño — es el
 * mismo texto que ya aparecía en las cards de Eventos.
 */
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
