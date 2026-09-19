import Image from "next/image";

/**
 * Título de sección + link "Ver todo", el par que el diseño repite en cada
 * sección del Home. Salió de `eventos.tsx` al maquetar Leaderboard, que lo trae
 * idéntico clase por clase en los dos tamaños.
 *
 * "Ver todo" todavía no navega: las pantallas destino no existen y se
 * implementan cuando el Home esté aprobado (AGENTS regla 14). Por eso es un
 * `<button>` sin handler y no un `<a href>` — así no da 404 ni ofrece "abrir en
 * pestaña nueva" sobre una ruta que no está.
 */
export function SectionHeader({
  title,
  action = true,
}: {
  title: string;
  /** Medallas no lleva "Ver todo": el Figma tiene el botón, pero oculto. */
  action?: boolean;
}) {
  return (
    <header className="flex items-center justify-between">
      <h2 className="font-techno text-title-sm uppercase text-foreground desktop:text-title">
        {title}
      </h2>
      {action && (
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1 font-techno text-2xs uppercase text-brand desktop:text-link"
        >
          Ver todo
          <Image
            src="/assets/home/arrow-right.svg"
            alt=""
            width={24}
            height={24}
            className="size-3 shrink-0 desktop:size-6"
          />
        </button>
      )}
    </header>
  );
}
