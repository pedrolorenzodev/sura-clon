"use client";

import { X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

import { UserAvatar } from "@/components/layout/user-avatar";
import { PODIUM_STYLE, RankMedal, type PodiumRank } from "@/components/sections/leaderboard-podium-style";
import { LevelPanel } from "@/components/sections/level-panel";
import { MedalCard } from "@/components/sections/medal-card";
import { ShareButtons } from "@/components/sections/share-buttons";
import { PlayerStats } from "@/components/sections/stat-pill";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { playerProfile, type PlayerProfile } from "@/lib/data/leaderboard";
import { useUrlState } from "@/lib/use-url-state";
import { cn } from "@/lib/utils";

const PlayerModalContext = createContext<{ open: (id: string) => void }>({ open: () => {} });

export const usePlayerModal = () => useContext(PlayerModalContext);

const DEFAULTS = { jugador: "" };

export function PlayerModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useUrlState(DEFAULTS);
  const popup = useRef<HTMLDivElement>(null);
  const [shownId, setShownId] = useState(state.jugador);
  if (state.jugador && state.jugador !== shownId) setShownId(state.jugador);

  const profile = useMemo(() => (shownId ? playerProfile(shownId) : undefined), [shownId]);
  const isOpen = Boolean(state.jugador && profile);

  const open = useCallback((id: string) => setState({ jugador: id }), [setState]);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <PlayerModalContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={(next) => !next && setState({ jugador: "" })}>
        {profile && (
          <DialogContent
            ref={popup}
            initialFocus={(type) => (type === "keyboard" ? true : popup.current)}
            className="no-scrollbar flex max-h-[calc(100dvh-var(--spacing)*8)] w-[calc(100%-var(--spacing)*8)] max-w-player-modal flex-col gap-5 overflow-y-auto overscroll-contain rounded-lg border border-border bg-surface px-4 pb-5 pt-3 desktop:px-6 desktop:pb-6 desktop:pt-4">
            <PlayerSheet profile={profile} />
          </DialogContent>
        )}
      </Dialog>
    </PlayerModalContext.Provider>
  );
}

const pad = (rank: number) => String(rank).padStart(2, "0");

const podiumRank = (rank: number) => (rank <= 3 ? (rank as PodiumRank) : null);

function PlayerSheet({ profile }: { profile: PlayerProfile }) {
  const podium = podiumRank(profile.rank);

  return (
    <>
      <div className="flex flex-col gap-1 desktop:gap-4">
        <div className="flex justify-end">
          <DialogClose
            aria-label="Cerrar"
            data-sfx="click"
            className="flex size-5 cursor-pointer items-center justify-center text-foreground transition-colors duration-200 hover:text-brand focus-visible:text-brand motion-reduce:transition-none"
          >
            <X className="size-3.5" strokeWidth={3} aria-hidden />
          </DialogClose>
        </div>

        <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-6">
          <div className="flex min-w-0 items-center gap-4 desktop:flex-1">
            {podium && <RankMedal rank={podium} className="hidden size-12 shrink-0 shadow-rank-medal desktop:block" />}

            <UserAvatar
              src={profile.avatarSrc}
              size={82}
              ringClassName={podium ? cn(PODIUM_STYLE[podium].avatarRing, "border-2") : "border border-border"}
              className="size-20.5"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="text-2xs text-gold-bright">
                  <span className="font-semibold">Puesto #{pad(profile.rank)}</span> por {profile.daysAtRank}{" "}
                  {profile.daysAtRank === 1 ? "día" : "días"}
                </p>
                <DialogTitle className="truncate text-player-name font-medium text-foreground">
                  {profile.name}
                </DialogTitle>
              </div>

              <PlayerStats
                points={profile.points}
                medals={profile.medals}
                streak={profile.streak}
                className="flex flex-wrap items-center gap-2.5 desktop:gap-3"
              />
            </div>
          </div>

          <LevelPanel
            level={profile.level}
            nextLevel={profile.nextLevel}
            points={profile.levelPoints}
            goal={profile.levelGoal}
            progress={profile.levelProgress}
            segments={{ mobile: 18, desktop: 25 }}
            className="rounded-sm bg-surface-2 p-3 desktop:flex-1 desktop:self-stretch"
          />
        </div>
      </div>

      <section className="flex flex-col gap-3 rounded-sm bg-surface-3 p-3 desktop:p-4">
        <div className="flex items-center justify-between gap-3 desktop:justify-start">
          <h3 className="text-sm font-medium text-foreground desktop:text-base">Medallas</h3>
          <span className="rounded-full border border-muted-foreground px-2 pb-0.5 pt-px text-2xs leading-4 text-muted-foreground">
            <span className="font-semibold text-foreground">{profile.unlockedMedals}</span> / {profile.medalCollection.length}
          </span>
        </div>

        <ul className="flex flex-wrap justify-center gap-y-2 medal-gap-2">
          {profile.medalCollection.map((medal) => (
            <MedalCard key={medal.id} medal={medal} variant="modal" className="medal-row-3 desktop:medal-row-5" />
          ))}
        </ul>
      </section>

      <SharePanel profile={profile} />
    </>
  );
}

function SharePanel({ profile }: { profile: PlayerProfile }) {
  return (
    <section className="flex flex-col gap-3 rounded-lg bg-surface-3 px-3 py-4 desktop:items-center desktop:gap-4 desktop:bg-transparent desktop:p-0 desktop:pb-4">
      <h3 className="text-sm font-medium text-foreground">Compartir</h3>
      <ShareButtons
        path={`/leaderboard?jugador=${profile.id}`}
        text={`Mirá el perfil de ${profile.name} en Sura Gaming`}
        className="justify-between desktop:justify-center desktop:gap-6"
      />
    </section>
  );
}
