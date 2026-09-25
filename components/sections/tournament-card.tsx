import Image from "next/image";

import { CardLink } from "@/components/layout/card-link";
import type { Tournament } from "@/lib/data/tournaments";
import { detailHref } from "@/lib/routes";

const BADGE_ICON = {
  mode: "/assets/home/eventos/badge-mode.svg",
  format: "/assets/home/eventos/badge-format.svg",
  players: "/assets/home/eventos/badge-players.svg",
} as const;

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  return (
    <li className="flex">
      <CardLink
        href={detailHref("tournaments", tournament.id)}
        className="group flex w-full flex-col gap-3 rounded-lg bg-surface px-4 pb-4 pt-2.5 shadow-mission-card ring-1 ring-inset ring-border transition-[translate,box-shadow,scale] duration-200 ease-reveal hover:-translate-y-0.5 hover:shadow-card-hover hover:ring-border-muted/60 focus-visible:-translate-y-0.5 focus-visible:shadow-card-hover focus-visible:ring-border-muted/60 active:scale-98 motion-reduce:transition-none desktop:gap-3.5 desktop:px-6 desktop:py-5"
      >
        <div className="relative aspect-[334/178] w-full shrink-0 overflow-hidden rounded-sm desktop:aspect-[257/199]">
          <Image
            src={tournament.imageSrc}
            alt=""
            width={1920}
            height={1080}
            className="size-full object-cover transition-transform duration-250 ease-reveal group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
          />

          {tournament.official && (
            <span className="absolute right-0 top-0 flex items-center justify-center rounded-bl-sm rounded-tr-[3px] bg-brand px-3 py-1.75">
              <Image
                src="/assets/tournaments/sura-mark.svg"
                alt="Evento oficial de Sura"
                width={34}
                height={21}
                className="h-5.25 w-8.5"
              />
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <p className="truncate text-xs font-semibold text-muted-foreground">{tournament.game}</p>

          <h3 className="flex items-center font-techno text-base uppercase text-foreground desktop:h-14 desktop:text-card-title">
            <span className="line-clamp-2">{tournament.title}</span>
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-techno text-note uppercase text-brand">{tournament.date}</span>
            <span className="flex shrink-0 items-center gap-1 rounded-xs border border-gold px-2 py-1">
              <Image
                src="/assets/home/eventos/trophy.webp"
                alt=""
                width={18}
                height={18}
                className="size-3.5 shrink-0"
              />
              <span className="bg-gold-text bg-clip-text font-techno text-note uppercase text-transparent">
                {tournament.prize}
              </span>
            </span>
          </div>

          <ul className="flex flex-wrap items-center gap-1.5">
            {tournament.badges.map((badge) => (
              <li
                key={badge.label}
                className="bg-badge flex items-center gap-1 rounded-xs border border-subtle-foreground px-1.5 py-1"
              >
                <Image
                  src={BADGE_ICON[badge.icon]}
                  alt=""
                  width={12}
                  height={12}
                  className="size-3 shrink-0"
                />
                <span className="text-2xs text-subtle-foreground">{badge.label}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-muted-foreground">Hosted by</p>
            <p className="truncate text-xs font-semibold text-foreground">{tournament.host}</p>
          </div>
        </div>
      </CardLink>
    </li>
  );
}
