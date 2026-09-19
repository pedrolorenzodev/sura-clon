/** Data del usuario logueado. Fase 1: hardcodeada (AGENTS regla 9). */

export type CurrentUser = {
  name: string;
  avatarSrc: string;
  /** Texto del nivel, tal cual lo muestra el diseño. */
  levelLabel: string;
  levelBadgeSrc: string;
  /** Racha de días consecutivos. */
  streak: number;
  /** Sura Points. */
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

/** Recompensa diaria reclamable que vive en el header desktop. */
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
