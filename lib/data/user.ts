export const HEADER_LEVEL_BADGE_SRC = "/assets/home/level-1.webp";

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
