"use client";

import { useRef } from "react";

import { EMPTY_RESULTS_KEY, EmptyResults } from "@/components/sections/empty-results";
import { FlipList } from "@/components/sections/flip-list";
import { GameCard } from "@/components/sections/game-card";
import { GameActiveFilters, GameFiltersDesktop, GameFiltersSheet } from "@/components/sections/game-filters";
import { Pagination } from "@/components/sections/pagination";
import { SearchField } from "@/components/sections/search-field";
import { SEARCH_SETTLE_MS, matchesQuery, paginate } from "@/lib/collection";
import { scrollToTopIfHidden } from "@/lib/css-zoom";
import { GAMES_PER_PAGE, gameFacets, gamesCatalog, type GameFacetId, type GameFacetValues } from "@/lib/data/games";
import { useSettledValue } from "@/lib/use-settled-value";
import { useUrlState } from "@/lib/use-url-state";

const DEFAULTS = { q: "", pagina: "1", genero: "", plataforma: "", estado: "", redes: "" };

const NO_FILTERS = { genero: "", plataforma: "", estado: "", redes: "" };

const parseFacets = (state: typeof DEFAULTS) =>
  Object.fromEntries(
    gameFacets.map((facet) => [
      facet.id,
      state[facet.id].split(",").filter((id) => facet.options.some((option) => option.id === id)),
    ]),
  ) as GameFacetValues;

export function GamesCollection({ banner }: { banner: React.ReactNode }) {
  const [state, setState] = useUrlState(DEFAULTS);
  const grid = useRef<HTMLUListElement>(null);

  const values = parseFacets(state);
  const filtering = gameFacets.some((facet) => values[facet.id].length > 0);
  const query = useSettledValue(state.q, SEARCH_SETTLE_MS);
  const results = gamesCatalog.filter(
    (game) =>
      matchesQuery(query, game.title, ...game.badges) &&
      gameFacets.every((facet) => !values[facet.id].length || values[facet.id].some((id) => game.facets?.[facet.id].includes(id))),
  );

  const setFacet = (facet: GameFacetId, next: string[]) => setState({ [facet]: next.join(","), pagina: "1" });
  const toggle = (facet: GameFacetId, option: string) =>
    setFacet(facet, values[facet].includes(option) ? values[facet].filter((id) => id !== option) : [...values[facet], option]);
  const clearAll = () => setState({ ...NO_FILTERS, pagina: "1" });
  const filterProps = { values, onToggle: toggle, onClearAll: clearAll };
  const { pageItems, page, pages } = paginate(results, state.pagina, GAMES_PER_PAGE);

  const goToPage = (next: number) => {
    setState({ pagina: String(next) });
    scrollToTopIfHidden(grid.current);
  };

  return (
    <div className="flex flex-col gap-6 desktop:gap-12">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 desktop:gap-6">
          <SearchField
            placeholder="Buscar juego"
            value={state.q}
            onChange={(q) => setState({ q, pagina: "1" })}
            className="min-w-px flex-1"
          />
          <GameFiltersSheet {...filterProps} resultsCount={results.length} />
          <GameFiltersDesktop values={values} onToggle={toggle} onClearFacet={(facet) => setFacet(facet, [])} />
        </div>
        <GameActiveFilters {...filterProps} />
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
            <EmptyResults
              onClear={() => setState({ ...NO_FILTERS, q: "", pagina: "1" })}
              clearLabel={filtering ? "Limpiar filtros" : undefined}
            >
              {filtering ? "No hay juegos con estos filtros." : <>No encontramos juegos para “{query}”.</>}
            </EmptyResults>
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
