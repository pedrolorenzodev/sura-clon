import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { CardSlider } from "@/components/sections/card-slider";
import { MissionFeatureCard } from "@/components/sections/mission-feature-card";
import { MissionsCollection } from "@/components/sections/missions-collection";
import { featuredMissions } from "@/lib/data/missions";

export const metadata: Metadata = {
  title: "Misiones | Sura Gaming",
  description: "Completá misiones y sumá SP en el ecosistema Sura Gaming.",
};

export default function MissionsPage() {
  return (
    <>
      <Header solid back />
      <RouteShell title="Misiones">
        <MissionsCollection
          featured={
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
          }
        />
      </RouteShell>
    </>
  );
}
