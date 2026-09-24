"use client";

import { useEffect, useRef, useState } from "react";

type RevealState = "armed" | "shown";

export function RevealList({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const [state, setState] = useState<RevealState | null>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;

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
    <ul ref={ref} data-reveal={state ?? undefined} className={className}>
      {children}
    </ul>
  );
}
