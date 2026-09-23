import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { CardSlider } from "@/components/sections/card-slider";
import { FilterChips } from "@/components/sections/filter-chips";
import { MissionCard } from "@/components/sections/mission-card";
import { MissionFeatureCard } from "@/components/sections/mission-feature-card";
import { Pagination } from "@/components/sections/pagination";
import { RouteTabs } from "@/components/sections/route-tabs";
import { allMissions, featuredMissions, missionFilters, missionTabs } from "@/lib/data/missions";

export const metadata: Metadata = {
  title: "Misiones | Sura Gaming",
  description: "Completá misiones y sumá SP en el ecosistema Sura Gaming.",
};

export default function MissionsPage() {
  return (
    <>
      <Header solid />
      <RouteShell title="Misiones">
        <RouteTabs items={missionTabs} current="todas" label="Categorías de misiones" />
        <FilterChips items={missionFilters} current="disponibles" label="Estado de las misiones" />

        <CardSlider
          labels={{ prev: "Ver misiones destacadas anteriores", next: "Ver más misiones destacadas" }}
          viewportClassName="lift-room gap-3 desktop:gap-6"
          arrowClassName="top-1/2 rounded-full bg-surface-2 shadow-arrow ring-1 ring-inset ring-muted-foreground disabled:bg-surface-3 disabled:shadow-none disabled:ring-border-dim [&_svg]:size-7 [&_svg]:stroke-1"
          arrowSides={{ left: "-left-5", right: "-right-5" }}
        >
          {featuredMissions.map((mission) => (
            <MissionFeatureCard key={mission.id} mission={mission} />
          ))}
        </CardSlider>

        <ul className="grid grid-cols-2 gap-3 desktop:grid-cols-4 desktop:gap-6">
          {allMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} compact />
          ))}
        </ul>

        <Pagination pages={5} current={1} label="Paginación de misiones" />
      </RouteShell>
    </>
  );
}
