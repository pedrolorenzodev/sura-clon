export type CurrentUser = {
  name: string;
  avatarSrc: string;
  levelLabel: string;
  levelBadgeSrc: string;
  streak: number;
  points: number;
};

export const currentUser: CurrentUser = {
  name: "RocketMan1989",
  avatarSrc: "/assets/home/avatar.png",
  levelLabel: "Nivel: Novato",
  levelBadgeSrc: "/assets/home/level-1.png",
  streak: 5,
  points: 473,
};

export type DailyClaim = {
  label: string;
  gameIconSrc: string;
  sparkleSrc: string;
};

export const dailyClaim: DailyClaim = {
  label: "Reclamar",
  gameIconSrc: "/assets/home/cs2-logo.png",
  sparkleSrc: "/assets/home/sparkling.png",
};
