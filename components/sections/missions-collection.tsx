"use client";

import { useRef } from "react";

import { EmptyResults } from "@/components/sections/empty-results";
import { FilterChips } from "@/components/sections/filter-chips";
import { MissionCard } from "@/components/sections/mission-card";
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
import { useUrlState } from "@/lib/use-url-state";

const DEFAULTS = { categoria: "todas", estado: "disponibles", pagina: "1" };

export function MissionsCollection({ featured }: { featured: React.ReactNode }) {
  const [state, setState] = useUrlState(DEFAULTS);
  const grid = useRef<HTMLUListElement>(null);

  const status = MISSION_FILTER_STATUS[state.estado];
  const results = allMissions.filter(
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

      {pageItems.length > 0 ? (
        <ul
          ref={grid}
          className="card-grid grid scroll-mt-header-mobile gap-3 desktop:scroll-mt-header-desktop desktop:grid-cols-4 desktop:gap-6"
        >
          {pageItems.map((mission) => (
            <MissionCard key={mission.id} mission={mission} compact />
          ))}
        </ul>
      ) : (
        <EmptyResults>No hay misiones con estos filtros.</EmptyResults>
      )}

      {pages > 0 && <Pagination pages={pages} page={page} onChange={goToPage} label="Paginación de misiones" />}
    </>
  );
}
