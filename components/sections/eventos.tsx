import { EventCard } from "@/components/sections/event-card";
import { CardSlider } from "@/components/sections/card-slider";
import { SectionHeader } from "@/components/sections/section-header";
import { events } from "@/lib/data/events";

/**
 * Sección Eventos del Home y destino del ancla `#eventos`.
 *
 * El título del Figma dice "Torneos" en desktop y "eventos" en mobile. Queda
 * **Eventos** en los dos, que es lo que se resolvió al maquetar el menú
 * (PRD § 6, deuda cerrada el 2026-09-18).
 */
export function Eventos() {
  return (
    <section
      id="eventos"
      className="scroll-mt-14 px-gutter desktop:scroll-mt-header-desktop desktop:px-gutter-desktop"
    >
      <div className="mx-auto max-w-page">
        <SectionHeader title="Eventos" />

        <CardSlider
          step={{ mobile: 210 + 24, desktop: 365 + 24 }}
          labels={{ prev: "Ver eventos anteriores", next: "Ver más eventos" }}
          viewportClassName="gap-6 pb-px pt-4.25 desktop:pb-0.5 desktop:pt-7"
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
