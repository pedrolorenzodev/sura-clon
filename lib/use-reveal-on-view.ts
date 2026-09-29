"use client";

import { useEffect, useState } from "react";

import { prefersReducedMotion } from "@/lib/motion";

export type RevealState = "armed" | "shown" | "entered" | null;

export type RevealMode = "view" | "load" | "mount" | "off";

const INITIAL: Record<RevealMode, RevealState> = { view: null, load: "shown", mount: "shown", off: null };

export function useRevealOnView(ref: React.RefObject<Element | null>, mode: RevealMode = "view") {
  const [state, setState] = useState<RevealState>(INITIAL[mode]);

  useEffect(() => {
    const el = ref.current;
    if (!el || (mode !== "view" && mode !== "load") || prefersReducedMotion()) return;

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
          setState(mode === "load" ? "entered" : "shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, mode]);

  return state;
}
