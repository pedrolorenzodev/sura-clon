import { MedalCard } from "@/components/sections/medal-card";
import { SectionHeader } from "@/components/sections/section-header";
import { medals } from "@/lib/data/medals";
import { cn } from "@/lib/utils";

/**
 * Medallas. En desktop es la columna derecha de la fila del Leaderboard (367 de
 * ancho, gap 120) y por eso vive dentro de su `<section id="leaderboard">`: es
 * la misma fila del diseño y no tiene ancla propia en el menú.
 *
 * **El frame mobile no existe**: el rediseño no lo dibujó y la adaptación es
 * nuestra (decisión del usuario, 2026-09-19, desvío consciente de la regla 2).
 * La grilla de 3 × 3 se sostiene tal cual — 3 celdas de 106 + 2 gaps de 8 = 334
 * entran en los 342 de ancho útil de mobile —, así que lo único que cambia es
 * que las celdas pasan de 106 a ~98 y todo lo de adentro escala con ellas.
 *
 * El título no lleva "Ver todo": el Figma tiene el botón, pero oculto.
 */
export function Medallas({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-title-gap", className)}>
      <SectionHeader title="Medallas" action={false} />
      {/* En desktop el panel toma el alto que le deja la fila (486 − 32 del
          título − 16 de gap = 438) y `grid-rows-3` reparte las tres filas en los
          130 exactos del Figma. En mobile no hay alto que repartir: las filas
          las define el contenido. */}
      <ul className="grid grid-cols-3 gap-2 rounded-xl bg-surface-deep p-4 desktop:min-h-0 desktop:flex-1 desktop:grid-rows-3">
        {medals.map((medal) => (
          <MedalCard key={medal.id} medal={medal} />
        ))}
      </ul>
    </div>
  );
}
