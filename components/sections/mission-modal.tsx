"use client";

import { Check, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  missionById,
  missionCopy,
  missionSteps,
  rewardPoints,
  type Mission,
  type MissionStatus,
} from "@/lib/data/missions";
import { claimReward, startTask, useDailyClaim } from "@/lib/use-daily-claim";
import { useUrlState } from "@/lib/use-url-state";
import { cn } from "@/lib/utils";

const MissionModalContext = createContext<{ open: (id: string) => void }>({ open: () => {} });

const DEFAULTS = { mision: "" };

export const missionRewardId = (id: string) => `mission:${id}`;

export function useMissionStatus(mission: Mission): MissionStatus | undefined {
  const { rewards } = useDailyClaim();
  return rewards.includes(missionRewardId(mission.id)) ? "completed" : mission.status;
}

export function MissionModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useUrlState(DEFAULTS);
  const popup = useRef<HTMLDivElement>(null);
  const [shownId, setShownId] = useState(state.mision);
  if (state.mision && state.mision !== shownId) setShownId(state.mision);

  const mission = shownId ? missionById.get(shownId) : undefined;
  const isOpen = Boolean(state.mision && mission);

  const open = useCallback((id: string) => setState({ mision: id }), [setState]);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <MissionModalContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={(next) => !next && setState({ mision: "" })}>
        {mission && (
          <DialogContent
            ref={popup}
            initialFocus={(type) => (type === "keyboard" ? true : popup.current)}
            className="no-scrollbar left-0 top-0 flex h-dvh w-full translate-x-0 translate-y-0 flex-col overflow-y-auto overscroll-contain bg-background desktop:left-1/2 desktop:top-1/2 desktop:h-auto desktop:max-h-[calc(100dvh-var(--spacing)*8)] desktop:max-w-mission-modal desktop:-translate-x-1/2 desktop:-translate-y-1/2 desktop:rounded-3xl desktop:border desktop:border-border desktop:shadow-mission-modal"
          >
            <MissionSheet mission={mission} />
          </DialogContent>
        )}
      </Dialog>
    </MissionModalContext.Provider>
  );
}

export function MissionLink({
  mission,
  className,
  children,
}: {
  mission: Mission;
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useContext(MissionModalContext);

  return (
    <button
      type="button"
      onClick={() => open(mission.id)}
      aria-label={`Ver la misión ${mission.title}`}
      aria-haspopup="dialog"
      data-sfx-hover="soft"
      data-sfx="click"
      className={cn("cursor-pointer text-left", className)}
    >
      {children}
    </button>
  );
}

function MissionSheet({ mission }: { mission: Mission }) {
  const { started } = useDailyClaim();
  const status = useMissionStatus(mission);
  const isStarted = started.includes(missionRewardId(mission.id));

  return (
    <>
      <div className="relative aspect-[2/1] w-full shrink-0 overflow-hidden desktop:aspect-[450/215]">
        <Image src={mission.imageSrc} alt="" fill sizes="(min-width: 768px) 611px, 100vw" className="object-cover object-top" />
        <DialogClose
          aria-label="Volver"
          data-sfx="click"
          className="absolute left-4 top-2 flex size-9 cursor-pointer items-center justify-center rounded-lg bg-surface-2 text-muted-foreground shadow-segment transition-colors duration-200 hover:text-brand focus-visible:text-brand motion-reduce:transition-none desktop:hidden"
        >
          <ChevronLeft className="size-5" strokeWidth={1.5} aria-hidden />
        </DialogClose>
      </div>

      <div className="flex flex-1 flex-col gap-8 px-6 pb-14 pt-8 desktop:items-center desktop:p-10">
        <div className="flex flex-col gap-3 desktop:gap-1 desktop:text-center">
          <DialogTitle className="font-techno text-mission-title-sm uppercase text-foreground desktop:text-mission-title">
            {mission.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground desktop:text-base desktop:leading-5">
            <span className="desktop:hidden">{missionCopy.subtitleMobile}</span>
            <span className="hidden desktop:inline">{missionCopy.subtitle}</span>
          </p>
        </div>

        <div className="flex w-full items-center justify-center gap-6 rounded-2xl bg-background py-4 shadow-reward-box ring-1 ring-inset ring-brand desktop:w-mission-box">
          <span className="pt-0.5 font-techno text-base uppercase text-foreground">{missionCopy.rewardLabel}</span>
          <span className="flex items-center gap-1.5">
            <span className="pt-1 font-techno text-reward-xl uppercase text-brand">{mission.reward}</span>
            <span className="relative block aspect-[17.455/16] h-8 shrink-0 overflow-hidden">
              <Image
                src="/assets/home/sp-coin.webp"
                alt=""
                width={59}
                height={59}
                className="absolute left-0 top-[-4.55%] h-[109.09%] w-full max-w-none"
              />
            </span>
          </span>
        </div>

        <div className="flex w-full flex-1 flex-col gap-3 px-2 desktop:pb-3">
          <h3 className="font-techno text-title-sm uppercase text-foreground">{missionCopy.stepsTitle}</h3>
          <ol className="flex list-decimal flex-col gap-4.5 ps-4.5 text-xs leading-4.5 text-muted-foreground">
            {missionSteps(mission).map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <MissionCta mission={mission} status={status} started={isStarted} />
      </div>
    </>
  );
}

const CTA = "flex h-11.5 w-full items-center justify-center gap-2 rounded-pill px-4.5 pt-0.5 font-techno text-base uppercase desktop:w-mission-box";

function MissionCta({ mission, status, started }: { mission: Mission; status?: MissionStatus; started: boolean }) {
  if (status === "completed" || status === "ended") {
    return (
      <span className={cn(CTA, "bg-surface-2 text-muted-foreground")} aria-disabled>
        {status === "completed" && <Check className="size-4 text-brand" strokeWidth={2.5} aria-hidden />}
        {status === "completed" ? missionCopy.completed : missionCopy.ended}
      </span>
    );
  }

  const claim = () => claimReward(missionRewardId(mission.id), rewardPoints(mission));

  return (
    <button
      type="button"
      onClick={started ? claim : () => startTask(missionRewardId(mission.id))}
      data-sfx-hover
      data-sfx={started ? "claim" : "click"}
      className={cn(
        CTA,
        "wipe cursor-pointer bg-brand text-black shadow-mission-cta transition-[box-shadow,translate] duration-200 hover:wipe-on hover:shadow-cta-hover focus-visible:wipe-on focus-visible:shadow-cta-hover active:translate-y-px motion-reduce:transition-none",
      )}
    >
      {started ? `${missionCopy.claim} ${mission.reward}` : missionCopy.play}
    </button>
  );
}
