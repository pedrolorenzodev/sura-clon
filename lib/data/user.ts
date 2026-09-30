export type CurrentUser = {
  name: string;
  avatarSrc: string;
  levelLabel: string;
  levelBadgeSrc: string;
  streak: number;
  points: number;
};

export const currentUser: CurrentUser = {
  name: "Cerdo_Capitalista",
  avatarSrc: "/assets/home/avatar.png",
  levelLabel: "Nivel: Novato",
  levelBadgeSrc: "/assets/home/level-1.webp",
  streak: 5,
  points: 473,
};

export type DailyClaim = {
  label: string;
  reward: number;
  gameIconSrc: string;
  sparkleSrc: string;
};

export const dailyClaim: DailyClaim = {
  label: "Reclamar",
  reward: 50,
  gameIconSrc: "/assets/home/claim-chest.webp",
  sparkleSrc: "/assets/home/sparkling.webp",
};
