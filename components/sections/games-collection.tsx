"use client";

import { useRef } from "react";

import { EmptyResults } from "@/components/sections/empty-results";
import { GameCard } from "@/components/sections/game-card";
import { Pagination } from "@/components/sections/pagination";
import { SearchField } from "@/components/sections/search-field";
import { matchesQuery, paginate } from "@/lib/collection";
import { scrollToTopIfHidden } from "@/lib/css-zoom";
import { GAMES_PER_PAGE, gamesCatalog } from "@/lib/data/games";
import { useUrlState } from "@/lib/use-url-state";

const DEFAULTS = { q: "", pagina: "1" };

export function GamesCollection({ filters, banner }: { filters: React.ReactNode; banner: React.ReactNode }) {
  const [state, setState] = useUrlState(DEFAULTS);
  const grid = useRef<HTMLUListElement>(null);

  const results = gamesCatalog.filter((game) => matchesQuery(state.q, game.title, ...game.badges));
  const { pageItems, page, pages } = paginate(results, state.pagina, GAMES_PER_PAGE);

  const goToPage = (next: number) => {
    setState({ pagina: String(next) });
    scrollToTopIfHidden(grid.current);
  };

  return (
    <div className="flex flex-col gap-6 desktop:gap-12">
      <div className="flex items-center gap-3 desktop:gap-6">
        <SearchField
          placeholder="Buscar juego"
          value={state.q}
          onChange={(q) => setState({ q, pagina: "1" })}
          className="min-w-px flex-1"
        />
        {filters}
      </div>

      {banner}

      <div className="flex flex-col gap-6">
        {pageItems.length > 0 ? (
          <ul
            ref={grid}
            className="card-grid grid scroll-mt-header-mobile gap-4 desktop:scroll-mt-header-desktop desktop:grid-cols-4 desktop:gap-6"
          >
            {pageItems.map((game) => (
              <GameCard key={game.id} game={game} largeTitle />
            ))}
          </ul>
        ) : (
          <EmptyResults>No encontramos juegos para “{state.q}”.</EmptyResults>
        )}

        {pages > 0 && (
          <Pagination
            pages={pages}
            page={page}
            onChange={goToPage}
            label="Paginación de juegos"
            compactOnMobile
            className="pt-0"
          />
        )}
      </div>
    </div>
  );
}
