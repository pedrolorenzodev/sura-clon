"use client";

import { useEffect, useState } from "react";

import { notFoundCopy } from "@/lib/data/not-found";
import { dispatchLost, isAppReady, prefersReducedMotion, readMs } from "@/lib/motion";
import { cn } from "@/lib/utils";

const BLACK_AT = 0.68;

export function LostArrival({ className, children }: { className: string; children: React.ReactNode }) {
  const [fresh] = useState(() => !isAppReady());
  const [covering, setCovering] = useState(fresh);

  useEffect(() => {
    if (!fresh) return;
    const duration = readMs("--lost-arrival-duration");
    const reduced = prefersReducedMotion();
    const frame = reduced
      ? 0
      : requestAnimationFrame(() => {
          const running = document.querySelector(".lost-arrival")?.getAnimations()[0]?.currentTime;
          dispatchLost({ duration, blackAt: duration * BLACK_AT, elapsed: typeof running === "number" ? running : 0 });
        });
    const timer = window.setTimeout(() => setCovering(false), reduced ? 0 : duration);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [fresh]);

  return (
    <>
      {covering && (
        <div aria-hidden className="lost-arrival">
          <span className="lost-tear absolute -inset-x-[4%] h-[6%] border-y border-white/12 bg-white/6" />
          <span className="lost-hud absolute left-4 top-4 flex items-center gap-2 rounded-md border border-border bg-black/60 px-3 py-2 font-techno text-sm uppercase text-foreground desktop:left-10 desktop:top-8">
            <i className="lost-hud-dot size-2 rounded-full bg-danger" />
            {notFoundCopy.signalLost}
          </span>
          <span className="lost-black absolute inset-0 bg-black" />
        </div>
      )}
      <main className={cn(className, fresh && "lost-lead")}>{children}</main>
    </>
  );
}
