import { getTournamentDetail, type TournamentDetail } from "@/lib/data/tournament-detail";

export type EventCardData = Pick<TournamentDetail, "title" | "date" | "prize" | "badges"> & {
  id: string;
  tournamentId: string;
  description: string;
  surface: "gamepad" | "sunset";
  art: "domino" | "squad";
};

const DESCRIPTION =
  "Para completar esta misión, debes hacer clic en el botón de abajo para visitar la página requerida.";

const EVENTS: Omit<EventCardData, "title" | "date" | "prize" | "badges">[] = [
  { id: "valorant-champions-tour", tournamentId: "valorant-champions-tour", description: DESCRIPTION, surface: "gamepad", art: "domino" },
  { id: "fortnite-tournament", tournamentId: "fortnite-tournament", description: DESCRIPTION, surface: "sunset", art: "squad" },
  { id: "copa-latam", tournamentId: "copa-latam-sura", description: DESCRIPTION, surface: "gamepad", art: "domino" },
  { id: "noche-de-duelos", tournamentId: "noche-de-duelos", description: DESCRIPTION, surface: "sunset", art: "squad" },
  { id: "clasificatorio-abierto", tournamentId: "clasificatorio-abierto", description: DESCRIPTION, surface: "gamepad", art: "domino" },
  { id: "final-de-temporada", tournamentId: "final-de-temporada", description: DESCRIPTION, surface: "sunset", art: "squad" },
];

export const events: EventCardData[] = EVENTS.map((event) => {
  const tournament = getTournamentDetail(event.tournamentId);
  if (!tournament) throw new Error(`Unknown tournament: ${event.tournamentId}`);
  const { title, date, prize, badges } = tournament;
  return { ...event, title, date, prize, badges };
});
