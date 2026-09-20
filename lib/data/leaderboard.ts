export type LeaderboardEntry = {
  id: string;
  rank: number;
  name: string;
  levelLabel: string;
  points: string;
  avatarSrc: string;
};

export const leaderboard: LeaderboardEntry[] = [
  {
    id: "desenfrenado",
    rank: 1,
    name: "DesenfrenadO_",
    levelLabel: "Nivel: Leyenda",
    points: "7.015",
    avatarSrc: "/assets/home/leaderboard/avatar-1.png",
  },
  {
    id: "bretasnft",
    rank: 2,
    name: "BretasNFT",
    levelLabel: "Nivel: Guerrero",
    points: "6.890",
    avatarSrc: "/assets/home/leaderboard/avatar-2.png",
  },
  {
    id: "saboomafoo",
    rank: 3,
    name: "SabooMafoo",
    levelLabel: "Nivel: Héroe",
    points: "6.755",
    avatarSrc: "/assets/home/leaderboard/avatar-3.png",
  },
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `usuario-${i + 4}`,
    rank: i + 4,
    name: "NombreUsuario",
    levelLabel: "Nivel: Leyenda",
    points: "473",
    avatarSrc: "/assets/home/leaderboard/avatar-row.png",
  })),
];

export const podium = leaderboard.slice(0, 3);

export const leaderboardRows = leaderboard.slice(3);
