"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type RevealState = "armed" | "shown" | null;

const RevealContext = createContext<RevealState>(null);

export const useRevealState = () => useContext(RevealContext);

export function RevealList({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const [state, setState] = useState<RevealState>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let decided = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!decided) {
          decided = true;
          if (entry.isIntersecting) observer.disconnect();
          else setState("armed");
          return;
        }
        if (entry.isIntersecting) {
          setState("shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <RevealContext.Provider value={state}>
      <ul ref={ref} data-reveal={state ?? undefined} className={className}>
        {children}
      </ul>
    </RevealContext.Provider>
  );
}
