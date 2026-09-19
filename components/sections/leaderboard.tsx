import { LeaderboardPodiumDesktop } from "@/components/sections/leaderboard-podium-desktop";
import { LeaderboardPodiumMobile } from "@/components/sections/leaderboard-podium-mobile";
import { Medallas } from "@/components/sections/medallas";
import { LeaderboardRow } from "@/components/sections/leaderboard-row";
import { SectionHeader } from "@/components/sections/section-header";
import { leaderboardRows } from "@/lib/data/leaderboard";

/**
 * Sección Leaderboard del Home y destino del ancla `#leaderboard`.
 *
 * En desktop es la **columna izquierda de una fila de dos**: a su derecha va
 * Medallas (367px, gap 120), que es el bloque siguiente. 657 + 120 + 367 = 1144,
 * o sea la columna de contenido entera.
 *
 * El alto de 486 vive en la **fila** y no en la columna: así Medallas lo hereda
 * del `items-stretch` sin declararlo, y acá adentro el reparto queda
 * determinado — 32 del título + 16 de gap + 97 del podio + 12 + 329 de tabla.
 * Esos 329 son los que las cinco filas se reparten con `flex-1`; el 59,4 del
 * Figma es el resultado de esa división, no una medida que se escriba.
 *
 * En mobile la fila no es flex ni tiene alto: todo apila, los `desktop:flex-1`
 * quedan afuera y cada fila mide sus 56 naturales.
 *
 * `overflow-x-clip` acota la franja sin diseño: entre 391 y ~860px la columna
 * fija de 657 más el gap de 120 y el mínimo de Medallas suman 960 y empujaban
 * la página entera de costado. El PRD § 4 acepta que esa franja se recorte —
 * pasa lo mismo con el header y con el hero—, pero no que scrollee. `clip`
 * recorta sólo en X.
 *
 * La separación con Eventos es la primera del proyecto: 80 en desktop, que es
 * lo que da el Figma, y 40 en mobile, que no tiene frame compuesto y lo definió
 * el usuario (PRD § 6).
 */
export function Leaderboard() {
  return (
    <section
      id="leaderboard"
      className="mt-section-gap-mobile scroll-mt-14 overflow-x-clip px-gutter desktop:mt-section-gap desktop:scroll-mt-header-desktop desktop:px-gutter-desktop"
    >
      <div className="mx-auto max-w-page">
        <div className="flex flex-col gap-section-gap-mobile desktop:h-leaderboard-row desktop:flex-row desktop:gap-30">
          <div className="flex flex-col gap-title-gap desktop:w-leaderboard-col">
            <SectionHeader title="Leaderboard" />

            <div className="flex flex-col gap-6 desktop:flex-1 desktop:gap-3">
              <LeaderboardPodiumDesktop className="hidden desktop:flex" />
              <LeaderboardPodiumMobile className="desktop:hidden" />

              <ul className="flex flex-col gap-2 desktop:flex-1">
                {leaderboardRows.map((entry, index) => (
                  /* La quinta fila sólo existe en desktop: el frame mobile
                     corta en el puesto 07. */
                  <LeaderboardRow
                    key={entry.id}
                    entry={entry}
                    className={index === leaderboardRows.length - 1 ? "hidden desktop:flex" : undefined}
                  />
                ))}
              </ul>
            </div>
          </div>

          <Medallas className="desktop:flex-1" />
        </div>
      </div>
    </section>
  );
}
