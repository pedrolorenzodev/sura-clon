import { getTournamentDetail, type TournamentDetail } from "@/lib/data/tournament-detail";

export type EventCardData = Pick<TournamentDetail, "title" | "date" | "prize" | "badges"> & {
  id: string;
  tournamentId: string;
  description: string;
  surface: "gamepad" | "sunset" | "dota" | "valorant" | "fortnite" | "lol";
  art: "domino" | "squad" | "juggernaut" | "reyna" | "omega" | "yone";
};

const EVENTS: Omit<EventCardData, "title" | "date" | "prize" | "badges">[] = [
  {
    id: "valorant-champions-tour",
    tournamentId: "valorant-champions-tour",
    description: "Doce equipos, grupos a una partida y playoffs en Sunset y Haven. Los dos primeros se llevan el premio.",
    surface: "gamepad",
    art: "domino",
  },
  {
    id: "fortnite-tournament",
    tournamentId: "fortnite-tournament",
    description: "Duelos uno contra uno con las armas de la temporada. Cada victoria suma puntos para el ranking.",
    surface: "sunset",
    art: "squad",
  },
  {
    id: "liga-ancestral",
    tournamentId: "liga-ancestral",
    description: "Cuatro semanas de Dota 2 en Captains Mode. Los cuatro mejores de la tabla juegan la final en vivo.",
    surface: "dota",
    art: "juggernaut",
  },
  {
    id: "copa-latam",
    tournamentId: "copa-latam-sura",
    description: "La copa regional de Valorant: eliminación directa al mejor de tres y final en Ascent.",
    surface: "valorant",
    art: "reyna",
  },
  {
    id: "contenders-training-center-110",
    tournamentId: "contenders-training-center-110",
    description: "Escuadras de cuatro con construcción activada. Tres partidas para sumar antes del corte.",
    surface: "fortnite",
    art: "omega",
  },
  {
    id: "final-de-temporada",
    tournamentId: "final-de-temporada",
    description: "Los dieciséis mejores equipos de la liga de League of Legends se cruzan por el premio más grande del año.",
    surface: "lol",
    art: "yone",
  },
];

export const events: EventCardData[] = EVENTS.map((event) => {
  const tournament = getTournamentDetail(event.tournamentId);
  if (!tournament) throw new Error(`Unknown tournament: ${event.tournamentId}`);
  const { title, date, prize, badges } = tournament;
  return { ...event, title, date, prize, badges };
});
