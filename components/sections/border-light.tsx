"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function BorderLight({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const light = ref.current;
    const host = light?.parentElement;
    if (!light || !host) return;

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      light.style.setProperty("--light-x", `${event.clientX - rect.left}px`);
      light.style.setProperty("--light-y", `${event.clientY - rect.top}px`);
      setLit(true);
    };
    const leave = () => setLit(false);

    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <span ref={ref} aria-hidden data-lit={lit || undefined} className={cn("border-light", className)} />;
}
