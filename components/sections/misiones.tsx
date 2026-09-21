import { CardSlider } from "@/components/sections/card-slider";
import { MissionCard } from "@/components/sections/mission-card";
import { SectionHeader } from "@/components/sections/section-header";
import { missions } from "@/lib/data/missions";

export function Misiones() {
  return (
    <section
      id="misiones"
      className="mt-section-gap-mobile scroll-mt-header-mobile px-gutter desktop:mt-section-gap desktop:scroll-mt-header-desktop desktop:px-gutter-desktop"
    >
      <div className="mx-auto flex max-w-page flex-col gap-title-gap">
        <SectionHeader title="Misiones" href="/missions" />

        <CardSlider
          labels={{ prev: "Ver misiones anteriores", next: "Ver más misiones" }}
          className="py-3"
          viewportClassName="lift-room gap-3 desktop:gap-6"
          arrowClassName="top-1/2"
        >
          {missions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              className="w-mission-card-mobile shrink-0 desktop:w-67"
            />
          ))}
        </CardSlider>
      </div>
    </section>
  );
}
