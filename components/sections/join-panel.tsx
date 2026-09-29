"use client";

import { useEffect, useState } from "react";

import { BrandCta } from "@/components/sections/brand-cta";
import type { TournamentDetail } from "@/lib/data/tournament-detail";
import { toggleTournamentJoin, useTournamentJoined } from "@/lib/use-tournament-join";
import { cn } from "@/lib/utils";

const pad = (value: number) => String(value).padStart(2, "0");

const formatCountdown = (seconds: number) =>
  `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const deadline = Date.now() + initialSeconds * 1000;
    const id = setInterval(() => setSeconds(Math.max(0, Math.round((deadline - Date.now()) / 1000))), 1000);
    return () => clearInterval(id);
  }, [initialSeconds]);

  return seconds;
}

export function JoinPanel({ tournament, className }: { tournament: TournamentDetail; className?: string }) {
  const seconds = useCountdown(tournament.startsInSeconds);
  const joined = useTournamentJoined(tournament.id);
  const toggle = () => toggleTournamentJoin(tournament.id);
  const count = tournament.joined + (joined ? 1 : 0);
  const full = !joined && tournament.joined >= tournament.capacity;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-surface-3 p-6 shadow-nav">
        <div className="flex w-full flex-col items-center text-center">
          <p className="font-techno text-base uppercase text-foreground">Comienza en:</p>
          <p role="timer" aria-label={`Comienza en ${formatCountdown(seconds)}`} className="font-techno text-countdown tabular-nums text-foreground">
            {formatCountdown(seconds)}
          </p>
        </div>

        {joined ? (
          <button
            type="button"
            onClick={toggle}
            data-sfx="click"
            className="group/joined flex h-10 w-full cursor-pointer items-center justify-center rounded-pill border border-brand-vivid font-techno text-sm uppercase text-brand-vivid transition-colors duration-200 hover:border-border-muted hover:text-muted-foreground focus-visible:border-border-muted focus-visible:text-muted-foreground motion-reduce:transition-none"
          >
            <span className="group-hover/joined:hidden group-focus-visible/joined:hidden">Inscripto</span>
            <span className="hidden group-hover/joined:inline group-focus-visible/joined:inline">Salir del evento</span>
          </button>
        ) : (
          <BrandCta
            label={full ? "Cupo completo" : "Unirse"}
            onClick={toggle}
            disabled={full}
            className="flex h-10 w-full disabled:cursor-default disabled:opacity-50"
            labelClassName="text-sm"
          />
        )}
      </div>

      <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface-3 py-3 pl-4 pr-3 shadow-nav">
        <p className="font-techno text-xs uppercase text-foreground">Participantes inscriptos:</p>
        <p className="flex w-full items-center justify-center rounded-sm bg-black/30 px-3 pb-1 pt-1.5 font-techno text-page-title">
          <span className="text-foreground">{count}</span>
          <span className="text-border-dim">/{tournament.capacity}</span>
        </p>
      </div>
    </div>
  );
}
