"use client";

import { useRef } from "react";

import { EMPTY_RESULTS_KEY, EmptyResults } from "@/components/sections/empty-results";
import { FilterChips } from "@/components/sections/filter-chips";
import { FlipList } from "@/components/sections/flip-list";
import { MissionCard } from "@/components/sections/mission-card";
import { missionRewardId } from "@/components/sections/mission-modal";
import { Pagination } from "@/components/sections/pagination";
import { RouteTabs } from "@/components/sections/route-tabs";
import { paginate } from "@/lib/collection";
import { scrollToTopIfHidden } from "@/lib/css-zoom";
import {
  MISSION_FILTER_STATUS,
  MISSIONS_PER_PAGE,
  allMissions,
  missionFilters,
  missionTabs,
} from "@/lib/data/missions";
import { useDailyClaim } from "@/lib/use-daily-claim";
import { useUrlState } from "@/lib/use-url-state";

const DEFAULTS = { categoria: "todas", estado: "disponibles", pagina: "1" };

export function MissionsCollection({ featured }: { featured: React.ReactNode }) {
  const [state, setState] = useUrlState(DEFAULTS);
  const grid = useRef<HTMLUListElement>(null);

  const { rewards } = useDailyClaim();
  const status = MISSION_FILTER_STATUS[state.estado];
  const results = allMissions
    .map((mission) => (rewards.includes(missionRewardId(mission.id)) ? { ...mission, status: "completed" as const } : mission))
    .filter(
    (mission) =>
      (state.categoria === "todas" || mission.category === state.categoria) &&
      (!status || mission.status === status),
  );
  const { pageItems, page, pages } = paginate(results, state.pagina, MISSIONS_PER_PAGE);

  const goToPage = (next: number) => {
    setState({ pagina: String(next) });
    scrollToTopIfHidden(grid.current);
  };

  return (
    <>
      <RouteTabs
        items={missionTabs}
        value={state.categoria}
        onChange={(categoria) => setState({ categoria, pagina: "1" })}
        label="Categorías de misiones"
      />
      <FilterChips
        items={missionFilters}
        value={state.estado}
        onChange={(estado) => setState({ estado, pagina: "1" })}
        label="Estado de las misiones"
      />

      {featured}

      <FlipList
        listRef={grid}
        keys={pageItems.length ? pageItems.map((mission) => mission.id) : [EMPTY_RESULTS_KEY]}
        className="card-grid grid scroll-mt-header-mobile content-start gap-3 desktop:scroll-mt-header-desktop desktop:grid-cols-4 desktop:gap-6"
      >
        {pageItems.length ? (
          pageItems.map((mission) => <MissionCard key={mission.id} mission={mission} compact />)
        ) : (
          <EmptyResults>No hay misiones con estos filtros.</EmptyResults>
        )}
      </FlipList>

      <Pagination
        pages={Math.max(pages, 1)}
        page={page}
        onChange={goToPage}
        label="Paginación de misiones"
        empty={pages === 0}
      />
    </>
  );
}
