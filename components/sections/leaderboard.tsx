import { LeaderboardPodiumDesktop } from "@/components/sections/leaderboard-podium-desktop";
import { LeaderboardPodiumMobile } from "@/components/sections/leaderboard-podium-mobile";
import { LeaderboardRow } from "@/components/sections/leaderboard-row";
import { Medallas } from "@/components/sections/medallas";
import { RevealList } from "@/components/sections/reveal-list";
import { SectionHeader } from "@/components/sections/section-header";
import { leaderboardRows, podium } from "@/lib/data/leaderboard";
import { detailHref } from "@/lib/routes";

export function Leaderboard() {
  return (
    <section
      id="leaderboard"
      /* no tocar: overflow-x-clip evita el scroll lateral en los anchos sin diseño */
      className="mt-section-gap-mobile scroll-mt-header-mobile overflow-x-clip px-gutter desktop:mt-section-gap desktop:scroll-mt-header-desktop desktop:px-gutter-desktop"
    >
      <div className="mx-auto max-w-page">
        <div className="flex flex-col gap-section-gap-mobile desktop:h-leaderboard-row desktop:flex-row desktop:gap-leaderboard-gap-share">
          <div className="flex flex-col gap-title-gap desktop:w-leaderboard-share">
            <SectionHeader title="Leaderboard" href="/leaderboard" />

            <div className="flex flex-col gap-6 desktop:flex-1 desktop:gap-3">
              <LeaderboardPodiumDesktop className="hidden desktop:flex" />
              <LeaderboardPodiumMobile entries={podium} className="desktop:hidden" />

              <RevealList className="flex flex-col gap-2 desktop:flex-1">
                {leaderboardRows.map((entry, index) => (
                  <LeaderboardRow
                    key={entry.id}
                    href={detailHref("profile", entry.id)}
                    rank={String(entry.rank).padStart(2, "0")}
                    name={entry.name}
                    levelLabel={entry.levelLabel}
                    points={entry.points}
                    avatarSrc={entry.avatarSrc}
                    elastic
                    revealIndex={index}
                    className={index === leaderboardRows.length - 1 ? "hidden desktop:flex" : undefined}
                  />
                ))}
              </RevealList>
            </div>
          </div>

          <Medallas className="desktop:flex-1" />
        </div>
      </div>
    </section>
  );
}
