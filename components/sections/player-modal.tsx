"use client";

import { Check, X } from "lucide-react";
import Image from "next/image";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

import { UserAvatar } from "@/components/layout/user-avatar";
import { PODIUM_STYLE, RankMedal, type PodiumRank } from "@/components/sections/leaderboard-podium-style";
import { LevelPanel } from "@/components/sections/level-panel";
import { MedalCard } from "@/components/sections/medal-card";
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

const SHARE_ICON = "flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-surface-2 transition-[translate,box-shadow,scale] duration-200 ease-reveal hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:-translate-y-0.5 focus-visible:shadow-card-hover active:scale-95 motion-reduce:transition-none";

function SharePanel({ profile }: { profile: PlayerProfile }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = () => `${window.location.origin}/leaderboard?jugador=${profile.id}`;
  const shareText = `Mirá el perfil de ${profile.name} en Sura Gaming`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: shareText, url: shareUrl() }).catch(() => {});
      return;
    }
    await copyLink();
  };

  const openShare = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <section className="flex flex-col gap-3 rounded-lg bg-surface-3 px-3 py-4 desktop:items-center desktop:gap-4 desktop:bg-transparent desktop:p-0 desktop:pb-4">
      <h3 className="text-sm font-medium text-foreground">Compartir</h3>

      <ul className="flex items-center justify-between desktop:justify-center desktop:gap-6">
        <li>
          <button type="button" onClick={nativeShare} aria-label="Compartir en Instagram" data-sfx-hover data-sfx="click" className={SHARE_ICON}>
            <Image src="/assets/leaderboard/modal/share-instagram.svg" alt="" width={48} height={48} className="size-12" />
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => openShare(`https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl())}`)}
            aria-label="Compartir en X"
            data-sfx-hover
            data-sfx="click"
            className={SHARE_ICON}
          >
            <Image src="/assets/leaderboard/modal/share-x.svg" alt="" width={22} height={20} className="h-5 w-auto" />
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl())}`)}
            aria-label="Compartir en Facebook"
            data-sfx-hover
            data-sfx="click"
            className={SHARE_ICON}
          >
            <Image src="/assets/leaderboard/modal/share-facebook.webp" alt="" width={40} height={40} className="size-5" />
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => openShare(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl()}`)}`)}
            aria-label="Compartir en WhatsApp"
            data-sfx-hover
            data-sfx="click"
            className={SHARE_ICON}
          >
            <Image src="/assets/leaderboard/modal/share-whatsapp.svg" alt="" width={48} height={48} className="size-12" />
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={copyLink}
            aria-label={copied ? "Link copiado" : "Copiar link"}
            data-sfx-hover
            data-sfx="click"
            className={SHARE_ICON}
          >
            {copied ? (
              <Check className="size-5 text-brand" strokeWidth={2.5} aria-hidden />
            ) : (
              <Image src="/assets/leaderboard/modal/share-link.svg" alt="" width={20} height={20} className="size-5" />
            )}
          </button>
        </li>
      </ul>
    </section>
  );
}
