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
  imageSrc: string;
};

export const tournaments: Tournament[] = [
  {
    id: "contenders-training-center-108",
    game: "Garena Free Fire",
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
    imageSrc: "/assets/home/juegos/cod-mw.webp",
  },
  {
    id: "american-cup",
    game: "Garena Free Fire",
    title: "American Cup",
    date: "Abr 30, 14:00 PM",
    prize: "40 USDC",
    badges: [
      { icon: "mode", label: "Battle Royale" },
      { icon: "format", label: "4v4" },
      { icon: "players", label: "56/60" },
    ],
    host: "CommunityGaming",
    official: true,
    imageSrc: "/assets/home/juegos/wagmi.webp",
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
    imageSrc: "/assets/home/juegos/minecraft.webp",
  },
  {
    id: "noche-de-duelos",
    game: "Mario Kart",
    title: "Noche de Duelos",
    date: "Dic 05, 21:30 PM",
    prize: "20 USDC",
    badges: [
      { icon: "mode", label: "Eliminación" },
      { icon: "format", label: "1v1" },
      { icon: "players", label: "28/32" },
    ],
    host: "CommunityGaming",
    imageSrc: "/assets/home/juegos/mario.webp",
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
    imageSrc: "/assets/home/juegos/racing.webp",
  },
  {
    id: "contenders-training-center-110",
    game: "Garena Free Fire",
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
    imageSrc: "/assets/home/juegos/ac-valhalla.png",
  },
  {
    id: "final-de-temporada",
    game: "Wagmi Defense",
    title: "Final de Temporada",
    date: "Dic 14, 20:00 PM",
    prize: "500 USDC",
    badges: [
      { icon: "mode", label: "Eliminación" },
      { icon: "format", label: "2v2" },
      { icon: "players", label: "16/16" },
    ],
    host: "SuraGaming",
    official: true,
    imageSrc: "/assets/home/juegos/wagmi.webp",
  },
  {
    id: "torneo-relampago",
    game: "Minecraft",
    title: "Torneo Relámpago",
    date: "Dic 18, 17:00 PM",
    prize: "60 USDC",
    badges: [
      { icon: "mode", label: "Supervivencia" },
      { icon: "format", label: "4v4" },
      { icon: "players", label: "31/40" },
    ],
    host: "CommunityGaming",
    imageSrc: "/assets/home/juegos/minecraft.webp",
  },
];
