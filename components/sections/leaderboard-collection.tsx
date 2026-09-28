"use client";

import { useRef } from "react";

import { EmptyResults } from "@/components/sections/empty-results";
import { FilterChips } from "@/components/sections/filter-chips";
import { LeaderboardPodiumMobile } from "@/components/sections/leaderboard-podium-mobile";
import { LeaderboardRow } from "@/components/sections/leaderboard-row";
import { Pagination } from "@/components/sections/pagination";
import { RouteTabs } from "@/components/sections/route-tabs";
import { SearchField } from "@/components/sections/search-field";
import { StandingsPodium } from "@/components/sections/standings-podium";
import { StandingsRow } from "@/components/sections/standings-row";
import { StandingsTable } from "@/components/sections/standings-table";
import { SEARCH_SETTLE_MS, matchesQuery, paginate } from "@/lib/collection";
import { scrollToTopIfHidden } from "@/lib/css-zoom";
import {
  LEADERBOARD_METRIC_ICON,
  STANDINGS_PER_PAGE,
  leaderboardRanges,
  leaderboardTabs,
  levels,
  rankStandings,
  type LeaderboardMetric,
  type LeaderboardRange,
} from "@/lib/data/leaderboard";
import { detailHref } from "@/lib/routes";
import { useSettledValue } from "@/lib/use-settled-value";
import { useUrlState } from "@/lib/use-url-state";

const DEFAULTS = { metrica: "sura-points", rango: "historico", q: "", pagina: "1" };

const isMetric = (value: string): value is LeaderboardMetric => leaderboardTabs.some((tab) => tab.id === value);
const isRange = (value: string): value is LeaderboardRange => leaderboardRanges.some((range) => range.id === value);

export function LeaderboardCollection() {
  const [state, setState] = useUrlState(DEFAULTS);
  const table = useRef<HTMLDivElement>(null);

  const metric = isMetric(state.metrica) ? state.metrica : "sura-points";
  const range = isRange(state.rango) ? state.rango : "historico";
  const iconSrc = LEADERBOARD_METRIC_ICON[metric];

  const { standings, me } = rankStandings(metric, range);
  const podium = standings.slice(0, 3);
  const query = useSettledValue(state.q, SEARCH_SETTLE_MS);
  const results = standings.filter((entry) => matchesQuery(query, entry.name));
  const { pageItems, page, pages } = paginate(results, state.pagina, STANDINGS_PER_PAGE);

  const goToPage = (next: number) => {
    setState({ pagina: String(next) });
    scrollToTopIfHidden(table.current);
  };

  return (
    <>
      <RouteTabs
        items={leaderboardTabs}
        value={metric}
        onChange={(metrica) => setState({ metrica, pagina: "1" })}
        label="Categorías del leaderboard"
      />

      <div className="flex flex-col gap-6 desktop:grid desktop:grid-cols-2">
        <FilterChips
          items={leaderboardRanges}
          value={range}
          onChange={(rango) => setState({ rango, pagina: "1" })}
          label="Rango del leaderboard"
          className="min-w-0"
        />
        <SearchField
          placeholder="Buscar competidor"
          value={state.q}
          onChange={(q) => setState({ q, pagina: "1" })}
          className="min-w-0"
        />
      </div>

      <StandingsPodium entries={podium} iconSrc={iconSrc} className="hidden desktop:block" />
      <LeaderboardPodiumMobile
        entries={podium.map((entry) => ({ ...entry, points: entry.score }))}
        iconSrc={iconSrc}
        className="desktop:hidden"
      />

      <div ref={table} className="scroll-mt-header-mobile desktop:scroll-mt-header-desktop">
        <StandingsTable
          entries={pageItems}
          iconSrc={iconSrc}
          empty={<EmptyResults>No encontramos competidores para “{query}”.</EmptyResults>}
        />
      </div>

      <Pagination
        pages={Math.max(pages, 1)}
        page={page}
        onChange={goToPage}
        label="Paginación del leaderboard"
        compactOnMobile
        empty={pages === 0}
        className="pt-0"
      />

      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground desktop:hidden">Tu posición:</p>

        <ul className="hidden flex-col desktop:flex">
          <StandingsRow entry={me} />
        </ul>

        <ul className="flex flex-col desktop:hidden">
          <LeaderboardRow
            href={detailHref("profile", me.id)}
            rank={me.rank}
            name={me.name}
            levelLabel={`Nivel: ${levels[me.level].label}`}
            points={me.score}
            iconSrc={iconSrc}
            avatarSrc={me.avatarSrc}
            tone={me.tone}
          />
        </ul>
      </div>
    </>
  );
}
