"use client";

import { createContext, useContext, useRef } from "react";

import { useFlipList } from "@/lib/use-flip-list";
import { useRevealOnView, type RevealState } from "@/lib/use-reveal-on-view";
import { cn } from "@/lib/utils";

const RevealContext = createContext<RevealState>(null);

export const useRevealState = () => useContext(RevealContext);

export function RevealList({
  className,
  flipKeys,
  wrapperClassName,
  children,
}: {
  className?: string;
  flipKeys?: string[];
  wrapperClassName?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const ghosts = useRef<HTMLDivElement>(null);
  const state = useRevealOnView(ref);
  useFlipList(ref, ghosts, flipKeys ?? []);

  const list = (
    <ul ref={ref} data-reveal={state ?? undefined} className={className}>
      {children}
    </ul>
  );

  return (
    <RevealContext.Provider value={state}>
      {flipKeys ? (
        <div className={cn("relative", wrapperClassName)}>
          {list}
          <div ref={ghosts} aria-hidden data-flip-ghosts className="pointer-events-none absolute inset-0 **:animate-none" />
        </div>
      ) : (
        list
      )}
    </RevealContext.Provider>
  );
}
