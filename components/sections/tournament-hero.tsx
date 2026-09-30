import Image from "next/image";

import { JoinPanel } from "@/components/sections/join-panel";
import { TitleSweep } from "@/components/sections/title-sweep";
import { TOURNAMENT_BADGE_ICON } from "@/components/sections/tournament-card";
import type { TournamentDetail } from "@/lib/data/tournament-detail";

export function TournamentHero({ tournament }: { tournament: TournamentDetail }) {
  return (
    <section className="flex flex-col gap-10 pt-40 desktop:flex-row desktop:items-start desktop:gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <h1 className="font-display text-banner-title-sm uppercase text-foreground desktop:text-game-hero">
          <TitleSweep onArrival>{tournament.title}</TitleSweep>
        </h1>

        <div className="flex flex-wrap items-center gap-6">
          <span className="flex items-center gap-2">
            <Image src="/assets/home/eventos/clock.svg" alt="" width={14} height={14} className="size-3.5 shrink-0" />
            <span className="font-techno text-base uppercase text-brand">{tournament.date}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 rounded-sm border border-gold p-2">
            <Image src="/assets/home/eventos/trophy.webp" alt="" width={18} height={18} className="size-4.5 shrink-0" />
            <span className="bg-gold-text bg-clip-text font-techno text-base uppercase text-transparent">
              {tournament.prize}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <ul className="flex flex-wrap items-center gap-2">
            {tournament.badges.map((badge) => (
              <li
                key={badge.label}
                className="bg-badge flex items-center gap-1 rounded-xs border border-subtle-foreground px-2 py-1.5"
              >
                <Image src={TOURNAMENT_BADGE_ICON[badge.icon]} alt="" width={12} height={12} className="size-3 shrink-0" />
                <span className="text-2xs leading-2.5 text-subtle-foreground">{badge.label}</span>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-1.5 text-xs leading-5">
            <span className="text-foreground/60">Hosted by</span>
            <span className="font-medium text-foreground">{tournament.host}</span>
          </p>
        </div>
      </div>

      <JoinPanel tournament={tournament} className="w-full shrink-0 desktop:w-67" />
    </section>
  );
}
