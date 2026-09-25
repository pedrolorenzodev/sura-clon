import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { Pagination } from "@/components/sections/pagination";
import { TournamentCard } from "@/components/sections/tournament-card";
import { SearchField } from "@/components/sections/search-field";
import { tournaments } from "@/lib/data/tournaments";

export const metadata: Metadata = {
  title: "Eventos | Sura Gaming",
  description: "Todos los eventos y torneos del ecosistema Sura Gaming.",
};

export default function TournamentsPage() {
  return (
    <>
      <Header solid back />
      <RouteShell title="Eventos">
        <SearchField
          placeholder="Buscar evento"
          className="gap-1.5 bg-surface-2 px-4 py-2.5 ring-1 ring-inset ring-border-muted/25 focus-within:ring-border-light desktop:max-w-1/2 desktop:gap-1.5 desktop:py-2"
          inputClassName="desktop:text-base"
        />

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
