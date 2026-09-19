import Image from "next/image";

import type { EventCardData } from "@/lib/data/events";
import { cn } from "@/lib/utils";

const SURFACE = {
  gamepad: "event-surface-gamepad",
  sunset: "event-surface-sunset",
} as const;

/**
 * Personaje de cada card: una ventana recortada dentro de la card, con la
 * imagen posicionada adentro. Todo en porcentajes, que son los del Figma tal
 * cual — y como el Figma escala la card entera al 57.4%, los mismos valores
 * valen para los dos tamaños.
 *
 * `window` mide y ubica el recorte respecto de la card; `image` ubica el PNG
 * dentro del recorte. El personaje apoya en el piso de la card y se sale por
 * arriba, que es el alto mayor al 100%.
 *
 * El piso es `bottom-px` y no `bottom-0`: el borde de la card se dibuja en el
 * píxel de afuera, y con `bottom-0` el personaje lo pisaba. En el arte de la
 * card 2, que llega opaco hasta abajo, eso dejaba una franja clara sobre el
 * borde. El scrim y el tinte ya arrancaban en ese mismo píxel.
 */
const ART = {
  domino: {
    src: "/assets/home/eventos/char-domino.png",
    size: 1024,
    window: "bottom-px left-[46.85%] h-[110.31%] w-[53.15%]",
    image: "left-[-39.18%] top-[-3.74%] h-[103.74%] w-[172.16%]",
  },
  squad: {
    src: "/assets/home/eventos/char-squad.png",
    size: 924,
    /* Este arte llega hasta el borde derecho, así que respeta la esquina
       redondeada de la card. El de Domino no: su tinta muere antes. */
    window: "bottom-px left-[11.78%] h-[122.34%] w-[87.95%] rounded-br-lg desktop:rounded-br-xl",
    image: "left-[-0.95%] top-[0.06%] h-[100.56%] w-[137.4%]",
  },
} as const;

const BADGE_ICON = {
  mode: "/assets/home/eventos/badge-mode.svg",
  format: "/assets/home/eventos/badge-format.svg",
  players: "/assets/home/eventos/badge-players.svg",
} as const;

/**
 * Card de un evento.
 *
 * **El personaje se sale por arriba de la card**, que es la intención del
 * diseño: la cabeza asoma sobre el borde superior. Por eso el `<article>` mide
 * lo que mide la superficie redondeada y el arte se posiciona con un alto
 * mayor al 100% — el recorte de arriba lo hace el viewport del slider, no la
 * card (ver `events-slider.tsx`).
 *
 * El orden de apilado importa y es el del Figma: superficie → personaje →
 * scrim → texto. Si el scrim quedara debajo del personaje, el texto no se
 * leería sobre el arte claro.
 *
 * Las medidas de mobile son las de desktop al **57.4%**, que es como el Figma
 * las dibuja. Eso deja todo en fracciones (bordes de 0.287px, tipografías de
 * 4.59px), así que están normalizadas según PRD § 6 en vez de replicadas.
 */
export function EventCard({ event }: { event: EventCardData }) {
  const isBright = event.surface === "sunset";
  const art = ART[event.art];

  return (
    /* `cursor-pointer` porque la card entera va a ser un link a la pantalla del
       evento; la ruta se implementa cuando el Home esté aprobado (regla 14). */
    <article className="relative h-event-surface-mobile w-event-card-mobile shrink-0 cursor-pointer desktop:h-event-surface desktop:w-event-card">
      <div
        className={cn(
          "absolute inset-0 rounded-lg border border-brand-faint desktop:rounded-xl",
          SURFACE[event.surface],
        )}
      />

      {/* `pointer-events-none`: la parte del personaje que se sale de la card no
          tiene que ser clickeable, sólo la card. Adentro de la card los eventos
          pasan igual al `<article>`, que es quien los toma. */}
      <div className={cn("pointer-events-none absolute overflow-hidden", art.window)}>
        <Image
          src={art.src}
          alt=""
          width={art.size}
          height={art.size}
          className={cn("absolute max-w-none", art.image)}
        />
      </div>

      {/* Inset de 1px: el scrim va por dentro del borde de la card. */}
      {isBright ? (
        <div className="absolute inset-px rounded-lg bg-black/20 desktop:rounded-xl" />
      ) : null}
      <div
        className={cn(
          "absolute inset-x-px bottom-px h-26.75 rounded-b-lg desktop:h-46 desktop:rounded-b-xl",
          isBright ? "bg-event-scrim-strong" : "bg-event-scrim",
        )}
      />

      {/* El bloque de texto va anclado arriba, como el Figma: los badges de una
          card pueden ocupar dos filas y el resto no se tiene que mover. */}
      <div className="absolute inset-x-3.5 top-16.25 flex flex-col gap-2 desktop:inset-x-6 desktop:top-29.25 desktop:gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="truncate font-techno text-xs font-bold uppercase text-foreground desktop:text-card-title desktop:font-normal">
            {event.title}
          </h3>
          {/* El frame mobile no trae descripción. */}
          <p className="hidden text-2xs text-foreground desktop:block">{event.description}</p>
        </div>

        <ul className="flex flex-wrap items-center gap-1 desktop:gap-2">
          {event.badges.map((badge) => (
            <li
              key={badge.label}
              className="bg-badge flex items-center gap-0.5 rounded-xs border border-subtle-foreground px-0.75 py-0.5 desktop:gap-1 desktop:px-1.5 desktop:py-1"
            >
              <Image
                src={BADGE_ICON[badge.icon]}
                alt=""
                width={12}
                height={12}
                className="size-1.75 shrink-0 desktop:size-3"
              />
              <span className="text-3xs text-subtle-foreground">{badge.label}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-1.75 desktop:gap-3">
          {/* El Figma lo exporta como SVG con un degradé definido fuera de la
              caja de la línea: al renderizar queda el primer stop plano, que es
              #A1A1A1 al 50%. Se resuelve con el token de borde más cercano, a 4
              niveles — imperceptible a media opacidad. */}
          <div className="h-px w-full bg-border-muted/50" />
          <div className="flex items-center gap-3.5 desktop:gap-6">
            <div className="flex min-w-px flex-1 items-center gap-0.5 desktop:gap-1">
              <Image
                src="/assets/home/eventos/clock.svg"
                alt=""
                width={14}
                height={14}
                className="size-2 shrink-0 desktop:size-3.5"
              />
              <span className="truncate font-techno text-3xs uppercase text-brand desktop:text-note">
                {event.date}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-0.5 rounded-xs border border-gold px-1.25 py-0.75 desktop:gap-1 desktop:rounded-sm desktop:px-2 desktop:py-1.5">
              <Image
                src="/assets/home/eventos/trophy.png"
                alt=""
                width={18}
                height={18}
                className="size-2.5 shrink-0 desktop:size-4.5"
              />
              <span className="bg-gold-text bg-clip-text font-techno text-3xs uppercase text-transparent desktop:text-note">
                {event.prize}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
