import Link from "next/link";

import { homeSections } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";

export function NavMobile({
  activeId,
  onSelect,
  hrefBase,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
  hrefBase: string;
}) {
  const activeIndex = homeSections.findIndex((section) => section.id === activeId);

  return (
    <nav
      aria-label="Secciones del Home"
      className="pointer-events-none fixed inset-x-0 bottom-nav-safe z-40 flex justify-center px-2 desktop:hidden"
    >
      <div className="border-gradient-nav-mobile pointer-events-auto h-nav-bar w-full rounded-2xl bg-nav-glass px-2.5 shadow-bar backdrop-blur-nav">
        <div className="relative h-full">
          {activeIndex >= 0 && (
            <span
              aria-hidden
              style={
                {
                  "--nav-index": activeIndex,
                  "--nav-count": homeSections.length,
                } as React.CSSProperties
              }
              className="nav-pill-x pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center transition-transform duration-250 ease-in-out motion-reduce:transition-none"
            >
              <span className="size-12 rounded-2xl bg-brand" />
            </span>
          )}

          <ul className="relative flex h-full items-center">
            {homeSections.map((section) => {
              const isActive = section.id === activeId;

              return (
                <li key={section.id} className="h-full flex-1">
                  <Link
                    href={`${hrefBase}#${section.id}`}
                    onClick={() => onSelect(section.id)}
                    aria-current={isActive ? "true" : undefined}
                    className="group flex size-full items-center justify-center"
                  >
                    <span
                      className={cn(
                        "block shrink-0 transition-colors duration-75 motion-reduce:transition-none motion-reduce:delay-0",
                        section.icon,
                        section.iconSize,
                        isActive
                          ? "bg-primary-foreground delay-150"
                          : "bg-nav-icon group-active:bg-brand",
                      )}
                    />
                    <span className="sr-only">{section.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
