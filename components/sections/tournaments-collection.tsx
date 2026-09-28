"use client";

import { useRef } from "react";

import { EmptyResults } from "@/components/sections/empty-results";
import { Pagination } from "@/components/sections/pagination";
import { SearchField } from "@/components/sections/search-field";
import { TournamentCard } from "@/components/sections/tournament-card";
import { matchesQuery, paginate } from "@/lib/collection";
import { scrollToTopIfHidden } from "@/lib/css-zoom";
import { TOURNAMENTS_PER_PAGE, tournaments } from "@/lib/data/tournaments";
import { useUrlState } from "@/lib/use-url-state";

const DEFAULTS = { q: "", pagina: "1" };

export function TournamentsCollection() {
  const [state, setState] = useUrlState(DEFAULTS);
  const grid = useRef<HTMLUListElement>(null);

  const results = tournaments.filter((tournament) =>
    matchesQuery(state.q, tournament.title, tournament.game, tournament.host),
  );
  const { pageItems, page, pages } = paginate(results, state.pagina, TOURNAMENTS_PER_PAGE);

  const goToPage = (next: number) => {
    setState({ pagina: String(next) });
    scrollToTopIfHidden(grid.current);
  };

  return (
    <>
      <SearchField
        placeholder="Buscar evento"
        value={state.q}
        onChange={(q) => setState({ q, pagina: "1" })}
        className="gap-1.5 bg-surface-2 px-4 py-2.5 ring-1 ring-inset ring-border-muted/25 focus-within:ring-border-light desktop:max-w-1/2 desktop:gap-1.5 desktop:py-2"
        inputClassName="desktop:text-base"
      />

      {pageItems.length > 0 ? (
        <ul
          ref={grid}
          className="card-grid-wide grid scroll-mt-header-mobile gap-6 desktop:scroll-mt-header-desktop desktop:grid-cols-4"
        >
          {pageItems.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </ul>
      ) : (
        <EmptyResults>No encontramos eventos para “{state.q}”.</EmptyResults>
      )}

      {pages > 0 && <Pagination pages={pages} page={page} onChange={goToPage} label="Paginación de eventos" />}
    </>
  );
}
