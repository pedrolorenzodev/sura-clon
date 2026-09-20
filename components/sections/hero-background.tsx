"use client";

import { useState } from "react";

import { useHeroSlide } from "@/components/sections/hero-slide-context";
import { hero } from "@/lib/data/hero";
import { cn } from "@/lib/utils";

function HeroArt({
  index,
  entering,
  onArrived,
}: {
  index: number;
  entering?: boolean;
  onArrived?: () => void;
}) {
  const slide = hero.slides[index];

  return (
    <div
      style={{ "--hero-art": `url("${slide.artSrc}")` } as React.CSSProperties}
      onAnimationEnd={onArrived}
      className={cn(
        "absolute inset-0",
        slide.framing === "design"
          ? "hero-art-mobile desktop:hero-art-desktop"
          : "hero-art-cover",
        entering && "hero-art-fade",
      )}
    />
  );
}

/**
 * Fondo del hero: tres capas dentro de una caja que se desborda por debajo del
 * contenido (1024 de alto contra 826 de hero en desktop), para que la sección
 * siguiente arranque pisándola, como en el diseño.
 *
 * Es client component por una sola razón: el arte lo elige el slider. La URL
 * baja como `--hero-art` (AGENTS regla 6) y el encuadre sigue viviendo en las
 * utilities de `globals.css`.
 *
 * El encuadre no es el mismo para todos: el del Figma está medido para el arte
 * del Figma y a las otras portadas las parte, así que cada entrada declara el
 * suyo (`framing` en `lib/data/hero.ts`).
 *
 * Cuidado con dos cosas, que son frágiles a un cambio inocente:
 *
 * 1. `-z-10` funciona porque la `<section>` que la contiene NO crea contexto de
 *    apilado. Si alguien le agrega `isolate`, `z-*`, `transform` u `opacity`,
 *    el fondo pasa a pintarse ENCIMA del contenido de las secciones siguientes.
 *    Por lo mismo, ningún ancestro puede tener fondo propio.
 * 2. `overflow-hidden` va acá y nunca en la `<section>`: en la sección
 *    recortaría el desborde, que es justo lo que tiene que verse. Acá es
 *    además lo que garantiza cero scroll horizontal, porque el arte mide más
 *    que el viewport.
 *
 * La capa base sólida no es decorativa: el arte mide 101.95% del ancho del
 * contenedor de alto, así que por debajo de ~1004px de viewport no llega a
 * cubrir los 1024 y quedaría una franja sin pintar. Y en mobile el arte va al
 * 75%, o sea que deja pasar lo que tenga debajo. Es también lo que se ve
 * mientras el arte nuevo todavía no bajó.
 *
 * La atenuación de mobile vive en el contenedor y no en cada capa: durante el
 * cruce hay dos, y si cada una llevara su propio 75% el fondo se colaría entre
 * las dos.
 */
export function HeroBackground() {
  const { activeSlide } = useHeroSlide();
  const [shown, setShown] = useState(activeSlide);
  const [leaving, setLeaving] = useState<number | null>(null);

  if (activeSlide !== shown) {
    setLeaving(shown);
    setShown(activeSlide);
  }

  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-4 -z-10 h-hero-mobile overflow-hidden bg-background desktop:top-0 desktop:h-hero-desktop"
    >
      <div className="absolute inset-0 opacity-75 desktop:opacity-100">
        {leaving !== null && <HeroArt key={leaving} index={leaving} />}
        <HeroArt
          key={shown}
          index={shown}
          entering={leaving !== null}
          onArrived={() => setLeaving(null)}
        />
      </div>
      <div className="bg-hero-scrim-mobile absolute inset-0 desktop:bg-hero-scrim" />
    </div>
  );
}
