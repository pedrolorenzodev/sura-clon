import { cn } from "@/lib/utils";

import { missionTabs } from "@/lib/data/missions";

export function MissionTabs({ current }: { current: string }) {
  return (
    <nav aria-label="Categorías de misiones" className="relative">
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-border-dim" />

      <ul className="no-scrollbar relative flex overflow-x-auto">
        {missionTabs.map((tab) => {
          const isCurrent = tab.id === current;

          return (
            <li key={tab.id} className="shrink-0">
              <button
                type="button"
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "flex h-11 cursor-pointer items-center justify-center border-b-2 px-4 font-techno text-base uppercase transition-colors duration-200 motion-reduce:transition-none desktop:w-40 desktop:px-10",
                  isCurrent
                    ? "border-muted-foreground bg-white/5 text-foreground"
                    : "border-transparent text-border-dim hover:text-muted-foreground focus-visible:text-muted-foreground",
                )}
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
