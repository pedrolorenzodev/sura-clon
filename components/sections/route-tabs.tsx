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
  return (
    <nav aria-label={label} className="relative">
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-border-dim" />

      <ul className="no-scrollbar relative flex overflow-x-auto">
        {items.map((tab) => {
          const isCurrent = tab.id === current;

          return (
            <li key={tab.id} className="shrink-0">
              <button
                type="button"
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "flex h-11 cursor-pointer items-center justify-center border-b-2 px-4 font-techno text-base uppercase transition-colors duration-200 motion-reduce:transition-none desktop:min-w-40 desktop:px-10",
                  isCurrent
                    ? "border-muted-foreground bg-white/5 text-foreground"
                    : "border-transparent text-border-dim hover:bg-white/3 hover:text-foreground focus-visible:bg-white/3 focus-visible:text-foreground",
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
