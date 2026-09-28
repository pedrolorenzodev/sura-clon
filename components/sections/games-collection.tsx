"use client";

import { useRef } from "react";

import { EMPTY_RESULTS_KEY, EmptyResults } from "@/components/sections/empty-results";
import { FlipList } from "@/components/sections/flip-list";
import { GameCard } from "@/components/sections/game-card";
import { Pagination } from "@/components/sections/pagination";
import { SearchField } from "@/components/sections/search-field";
import { SEARCH_SETTLE_MS, matchesQuery, paginate } from "@/lib/collection";
import { scrollToTopIfHidden } from "@/lib/css-zoom";
import { GAMES_PER_PAGE, gamesCatalog } from "@/lib/data/games";
import { useSettledValue } from "@/lib/use-settled-value";
import { useUrlState } from "@/lib/use-url-state";

const DEFAULTS = { q: "", pagina: "1" };

export function GamesCollection({ filters, banner }: { filters: React.ReactNode; banner: React.ReactNode }) {
  const [state, setState] = useUrlState(DEFAULTS);
  const grid = useRef<HTMLUListElement>(null);

  const query = useSettledValue(state.q, SEARCH_SETTLE_MS);
  const results = gamesCatalog.filter((game) => matchesQuery(query, game.title, ...game.badges));
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
        <FlipList
          listRef={grid}
          keys={pageItems.length ? pageItems.map((game) => game.id) : [EMPTY_RESULTS_KEY]}
          className="card-grid grid scroll-mt-header-mobile content-start gap-4 desktop:scroll-mt-header-desktop desktop:grid-cols-4 desktop:gap-6"
        >
          {pageItems.length ? (
            pageItems.map((game) => <GameCard key={game.id} game={game} largeTitle />)
          ) : (
            <EmptyResults>No encontramos juegos para “{query}”.</EmptyResults>
          )}
        </FlipList>

        <Pagination
          pages={Math.max(pages, 1)}
          page={page}
          onChange={goToPage}
          label="Paginación de juegos"
          compactOnMobile
          empty={pages === 0}
          className="pt-0"
        />
      </div>
    </div>
  );
}
