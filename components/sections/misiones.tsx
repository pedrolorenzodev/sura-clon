import { CardSlider } from "@/components/sections/card-slider";
import { MissionCard } from "@/components/sections/mission-card";
import { SectionHeader } from "@/components/sections/section-header";
import { missions } from "@/lib/data/missions";

/**
 * Sección Misiones del Home y destino del ancla `#misiones`.
 *
 * Son seis cards en un carrusel, con el mismo componente que Eventos (usuario,
 * 2026-09-20). El Figma pone cuatro fijas en desktop, repartiendo los 1144 de
 * la columna; con seis la fila ya no entra, así que las cards pasan a ancho
 * fijo —los mismos 268 del diseño— y las dos que sobran se alcanzan con las
 * flechas. En mobile no cambia nada: ya era un carrusel de ancho fijo.
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

        <CardSlider
          step={{ mobile: 261 + 12, desktop: 268 + 24 }}
          labels={{ prev: "Ver misiones anteriores", next: "Ver más misiones" }}
          viewportClassName="gap-3 py-3 desktop:gap-6"
          arrowClassName="top-1/2"
        >
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </CardSlider>
      </div>
    </section>
  );
}
