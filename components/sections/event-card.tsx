import Image from "next/image";

import { CardBrackets } from "@/components/sections/card-brackets";
import type { EventCardData } from "@/lib/data/events";
import { cn } from "@/lib/utils";

const SURFACE = {
  gamepad: "event-surface-gamepad",
  sunset: "event-surface-sunset",
} as const;

// no tocar: el piso va en bottom-px, no bottom-0; con 0 el personaje pisa el borde
const ART = {
  domino: {
    src: "/assets/home/eventos/char-domino.webp",
    size: 1024,
    window:
      "bottom-px left-[46.85%] h-[110.31%] w-[53.15%] desktop:right-0 desktop:left-auto desktop:w-auto desktop:aspect-[193.9975/321.0021]",
    image: "left-[-39.18%] top-[-3.74%] h-[103.74%] w-[172.16%]",
  },
  squad: {
    src: "/assets/home/eventos/char-squad.webp",
    size: 924,
    window:
      "bottom-px left-[11.78%] h-[122.34%] w-[87.95%] rounded-br-lg desktop:right-[0.27%] desktop:left-auto desktop:w-auto desktop:aspect-[321.0175/356.0094] desktop:rounded-br-xl",
    image: "left-[-0.95%] top-[0.06%] h-[100.56%] w-[137.4%]",
  },
} as const;

const BADGE_ICON = {
  mode: "/assets/home/eventos/badge-mode.svg",
  format: "/assets/home/eventos/badge-format.svg",
  players: "/assets/home/eventos/badge-players.svg",
} as const;

export function EventCard({ event }: { event: EventCardData }) {
  const isBright = event.surface === "sunset";
  const art = ART[event.art];

  return (
    <article
      data-sfx-hover="soft"
      data-sfx="click"
      className="group relative h-event-surface-mobile w-event-card-mobile shrink-0 cursor-pointer desktop:h-event-surface desktop:slide-third-capped">
      <div
        className={cn(
          "absolute inset-0 rounded-lg border border-brand-faint desktop:rounded-xl",
          SURFACE[event.surface],
        )}
      />

      <div className="event-art-clip pointer-events-none absolute inset-0">
        <div className={cn("absolute overflow-hidden", art.window)}>
          <Image
            src={art.src}
            alt=""
            width={art.size}
            height={art.size}
            className={cn("absolute max-w-none", art.image)}
          />
        </div>
      </div>

      {isBright ? (
        <div className="absolute inset-px rounded-lg bg-black/20 desktop:rounded-xl" />
      ) : null}
      <div className="absolute inset-x-px bottom-px top-0 flex flex-col">
        <div className="basis-14.75 desktop:basis-26.5" />
        <div
          className={cn(
            "flex flex-1 flex-col gap-2 rounded-b-lg px-3.25 py-1.5 desktop:gap-4 desktop:rounded-b-xl desktop:px-5.75 desktop:pt-2.75 desktop:pb-4",
            isBright ? "bg-event-scrim-strong" : "bg-event-scrim",
          )}
        >
          <div className="flex flex-col gap-1">
            <h3 className="truncate font-techno text-xs font-bold uppercase text-foreground desktop:text-card-title desktop:font-normal">
              {event.title}
            </h3>
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
                  src="/assets/home/eventos/trophy.webp"
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
      </div>
      <CardBrackets />
    </article>
  );
}
