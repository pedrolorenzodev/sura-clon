import { MissionCard } from "@/components/sections/mission-card";
import { SectionHeader } from "@/components/sections/section-header";
import { missions } from "@/lib/data/missions";

/**
 * Sección Misiones del Home y destino del ancla `#misiones`.
 *
 * Desktop: las cuatro cards en fila, repartiendo los 1144 de la columna.
 * Mobile: las mismas cuatro en un carrusel horizontal con el ancho fijo del
 * diseño — se ve una entera y el asomo de la siguiente, que es la señal de que
 * hay más. Sin flechas: el frame desktop no las tiene y en mobile se arrastra.
 *
 * El título del frame mobile dice "eventos", que es un typo: repite el de la
 * sección de más arriba. Va "Misiones" en los dos, igual que se resolvió en
 * Leaderboard (PRD § 6).
 */
export function Misiones() {
  return (
    <section
      id="misiones"
      className="mt-section-gap-mobile scroll-mt-14 px-gutter desktop:mt-section-gap desktop:scroll-mt-header-desktop desktop:px-gutter-desktop"
    >
      <div className="mx-auto flex max-w-page flex-col gap-title-gap">
        <SectionHeader title="Misiones" />

        <ul className="no-scrollbar flex gap-3 overflow-x-auto desktop:grid desktop:grid-cols-4 desktop:gap-6 desktop:overflow-visible">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </ul>
      </div>
    </section>
  );
}
