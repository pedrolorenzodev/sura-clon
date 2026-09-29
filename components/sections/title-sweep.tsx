"use client";

import { useEffect, useRef, useState } from "react";

import { isAppReady, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Phase = "idle" | "scroll" | "load" | "route" | "done";

const initialPhase = (onArrival?: boolean): Phase => {
  if (!onArrival) return "idle";
  if (!isAppReady()) return "load";
  return prefersReducedMotion() ? "idle" : "route";
};

export function TitleSweep({ onArrival, children }: { onArrival?: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<Phase>(() => initialPhase(onArrival));

  useEffect(() => {
    const el = ref.current;
    if (onArrival || !el || prefersReducedMotion()) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.top < window.innerHeight) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setPhase("scroll");
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onArrival]);

  return (
    <span
      ref={ref}
      onAnimationEnd={() => setPhase("done")}
      className={cn(phase !== "idle" && phase !== "done" && "title-sweep", phase === "route" && "title-sweep-after-route")}
    >
      {children}
    </span>
  );
}
