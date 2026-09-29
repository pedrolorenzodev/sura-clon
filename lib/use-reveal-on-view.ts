"use client";

import { useEffect, useState } from "react";

import { prefersReducedMotion } from "@/lib/motion";

export type RevealState = "armed" | "shown" | "entered" | null;

export function useRevealOnView(ref: React.RefObject<Element | null>, { onLoad = false } = {}) {
  const [state, setState] = useState<RevealState>(onLoad ? "shown" : null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

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
          setState(onLoad ? "entered" : "shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, onLoad]);

  return state;
}
