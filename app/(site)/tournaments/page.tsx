import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { Pagination } from "@/components/sections/pagination";
import { TournamentCard } from "@/components/sections/tournament-card";
import { TournamentsSearch } from "@/components/sections/tournaments-search";
import { tournaments } from "@/lib/data/tournaments";

export const metadata: Metadata = {
  title: "Eventos | Sura Gaming",
  description: "Todos los eventos y torneos del ecosistema Sura Gaming.",
};

export default function TournamentsPage() {
  return (
    <>
      <Header solid />
      <RouteShell title="Eventos">
        <TournamentsSearch />

        <ul className="grid grid-cols-1 gap-6 desktop:grid-cols-4">
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </ul>

        <Pagination pages={3} current={1} label="Paginación de eventos" />
      </RouteShell>
    </>
  );
}
