import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { FilterChips } from "@/components/sections/filter-chips";
import { LeaderboardPodiumMobile } from "@/components/sections/leaderboard-podium-mobile";
import { LeaderboardRow } from "@/components/sections/leaderboard-row";
import { Pagination } from "@/components/sections/pagination";
import { RouteTabs } from "@/components/sections/route-tabs";
import { SearchField } from "@/components/sections/search-field";
import { StandingsPodium } from "@/components/sections/standings-podium";
import { StandingsRow } from "@/components/sections/standings-row";
import { StandingsTable } from "@/components/sections/standings-table";
import {
  leaderboardRanges,
  leaderboardTabs,
  levels,
  myStanding,
  standings,
} from "@/lib/data/leaderboard";
import { detailHref } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Leaderboard | Sura Gaming",
  description: "La tabla de posiciones del ecosistema Sura Gaming.",
};

export default function LeaderboardPage() {
  return (
    <>
      <Header solid />
      <RouteShell title="Leaderboard">
        <RouteTabs
          items={leaderboardTabs}
          current="sura-points"
          label="Categorías del leaderboard"
        />

        <div className="flex flex-col gap-6 desktop:grid desktop:grid-cols-2">
          <FilterChips
            items={leaderboardRanges}
            current="historico"
            label="Rango del leaderboard"
            className="min-w-0"
          />
          <SearchField placeholder="Buscar competidor" className="min-w-0" />
        </div>

        <StandingsPodium className="hidden desktop:flex" />
        <LeaderboardPodiumMobile entries={standings.slice(0, 3)} className="desktop:hidden" />

        <StandingsTable />

        <Pagination
          pages={5}
          current={1}
          label="Paginación del leaderboard"
          compactOnMobile
          className="pt-0"
        />

        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground desktop:hidden">Tu posición:</p>

          <ul className="hidden flex-col desktop:flex">
            <StandingsRow entry={myStanding} />
          </ul>

          <ul className="flex flex-col desktop:hidden">
            <LeaderboardRow
              href={detailHref("profile", myStanding.id)}
              rank={myStanding.rank}
              name={myStanding.name}
              levelLabel={`Nivel: ${levels[myStanding.level].label}`}
              points={myStanding.points}
              avatarSrc={myStanding.avatarSrc}
              tone={myStanding.tone}
            />
          </ul>
        </div>
      </RouteShell>
    </>
  );
}
