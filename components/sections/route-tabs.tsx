"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { ScrambleText } from "@/components/sections/scramble-text";
import { cn } from "@/lib/utils";

type TabOption = { id: string; label: string };

export function RouteTabs({
  items,
  current,
  label,
}: {
  items: TabOption[];
  current: string;
  label: string;
}) {
  const [selected, setSelected] = useState(current);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);
  const tabs = useRef(new Map<string, HTMLButtonElement>());

  useLayoutEffect(() => {
    const tab = tabs.current.get(selected);
    if (!tab) return;
    const measure = () => setIndicator({ x: tab.offsetLeft, w: tab.offsetWidth });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(tab);
    return () => observer.disconnect();
  }, [selected]);

  return (
    <nav aria-label={label} className="relative">
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-border-dim" />

      <ul className="no-scrollbar relative flex overflow-x-auto overscroll-x-none">
        {items.map((tab) => {
          const isCurrent = tab.id === selected;

          return (
            <li key={tab.id} className="shrink-0">
              <button
                ref={(node) => {
                  if (node) tabs.current.set(tab.id, node);
                  else tabs.current.delete(tab.id);
                }}
                type="button"
                onClick={() => setSelected(tab.id)}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "flex h-11 cursor-pointer items-center justify-center border-b-2 px-4 font-techno text-base uppercase transition-colors duration-200 motion-reduce:transition-none desktop:min-w-40 desktop:px-10",
                  isCurrent
                    ? cn("bg-white/5 text-foreground", indicator ? "border-transparent" : "border-muted-foreground")
                    : "border-transparent text-border-dim hover:bg-white/3 hover:text-foreground focus-visible:bg-white/3 focus-visible:text-foreground active:bg-white/3",
                )}
              >
                <ScrambleText text={tab.label} />
              </button>
            </li>
          );
        })}

        {indicator && (
          <li
            aria-hidden
            style={{ "--tab-x": `${indicator.x}px`, "--tab-w": `${indicator.w}px` } as React.CSSProperties}
            className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-(--tab-w) translate-x-(--tab-x) bg-muted-foreground transition-[translate,width] duration-250 ease-in-out motion-reduce:transition-none"
          />
        )}
      </ul>
    </nav>
  );
}
