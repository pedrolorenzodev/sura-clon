/** Sección Leaderboard del Home. Fase 1: hardcodeada (AGENTS regla 9). */

export type LeaderboardEntry = {
  id: string;
  /** 1 a 8. El "04" con cero a la izquierda lo compone la fila, no la data. */
  rank: number;
  name: string;
  /** Texto del nivel tal cual lo muestra el diseño. */
  levelLabel: string;
  /**
   * Puntaje ya formateado como lo muestra el diseño ("7.015"). Va como string
   * igual que `date` en `events.ts`: formatear en runtime arriesga un desajuste
   * de hidratación por locale y no aporta nada en Fase 1.
   */
  points: string;
  avatarSrc: string;
};

/**
 * Los ocho puestos que muestra el Home. El corte entre podio y tabla lo hace el
 * layout (`slice`), no la data: es la misma entidad con dos presentaciones.
 *
 * Los frames traen usuarios y puntajes distintos en cada tamaño — mobile dice
 * KoibitoSura / Madness9891 / Gasstiel con otros valores. Se unifica en los de
 * desktop, que es la prioridad del proyecto (PRD § 6, deuda).
 *
 * De la cuarta para abajo el diseño repite "NombreUsuario", el mismo nivel, el
 * mismo puntaje y la misma foto: es placeholder y se replica tal cual, igual
 * que las cards repetidas de Eventos.
 */
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

/** Los tres del podio. */
export const podium = leaderboard.slice(0, 3);

/**
 * El resto. Desktop muestra los cinco (puestos 04 a 08) y mobile los primeros
 * cuatro: la quinta fila se oculta con `hidden desktop:flex`, sin JS.
 */
export const leaderboardRows = leaderboard.slice(3);
