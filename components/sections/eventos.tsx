import Image from "next/image";

import { EventCard } from "@/components/sections/event-card";
import { EventsSlider } from "@/components/sections/events-slider";
import { events } from "@/lib/data/events";

/**
 * Sección Eventos del Home y destino del ancla `#eventos`.
 *
 * El título del Figma dice "Torneos" en desktop y "eventos" en mobile. Queda
 * **Eventos** en los dos, que es lo que se resolvió al maquetar el menú
 * (PRD § 6, deuda cerrada el 2026-09-18).
 *
 * "Ver todo" y las cards todavía no navegan: las pantallas destino no existen
 * y se implementan cuando el Home esté aprobado (AGENTS regla 14). Por eso el
 * primero es un `<button>` sin handler y no un `<a href>` — así no da 404 ni
 * ofrece "abrir en pestaña nueva" sobre una ruta que no está.
 */
export function Eventos() {
  return (
    <section
      id="eventos"
      className="scroll-mt-14 px-gutter desktop:scroll-mt-header-desktop desktop:px-gutter-desktop"
    >
      <div className="mx-auto max-w-page">
        <header className="flex items-center justify-between">
          <h2 className="font-techno text-title-sm uppercase text-foreground desktop:text-title">
            Eventos
          </h2>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1 font-techno text-2xs uppercase text-brand desktop:text-link"
          >
            Ver todo
            <Image
              src="/assets/home/eventos/arrow-right.svg"
              alt=""
              width={24}
              height={24}
              className="size-3 shrink-0 desktop:size-6"
            />
          </button>
        </header>

        <EventsSlider>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </EventsSlider>
      </div>
    </section>
  );
}
