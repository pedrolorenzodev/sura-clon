import { EventCard } from "@/components/sections/event-card";
import { CardSlider } from "@/components/sections/card-slider";
import { SectionHeader } from "@/components/sections/section-header";
import { events } from "@/lib/data/events";

export function Eventos() {
  return (
    <section
      id="eventos"
      className="scroll-mt-header-mobile px-gutter desktop:scroll-mt-header-desktop desktop:px-gutter-desktop"
    >
      <div className="mx-auto max-w-page">
        <SectionHeader title="Eventos" href="/tournaments" />

        {/* no tocar: pb-2 con su -mb es aire para los corchetes del hover, no espaciado */}
        <CardSlider
          labels={{ prev: "Ver eventos anteriores", next: "Ver más eventos" }}
          viewportClassName="gap-6 -mb-1.75 pb-2 pt-4.25 desktop:-mb-1.5 desktop:pb-2 desktop:pt-7"
          arrowClassName="top-50.5"
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </CardSlider>
      </div>
    </section>
  );
}
