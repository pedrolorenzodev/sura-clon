import { NavIcon } from "@/components/layout/nav-icon";
import { SectionLink } from "@/components/layout/section-link";
import { homeSections } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";

export function NavMobile({ activeId, away }: { activeId: string | null; away: boolean }) {
  const activeIndex = homeSections.findIndex((section) => section.id === activeId);

  return (
    <nav
      aria-label="Secciones del Home"
      inert={away}
      data-away={away || undefined}
      className={cn(
        "peer/bar intro-veil pointer-events-none fixed inset-x-0 bottom-nav-safe z-40 mx-auto flex max-w-mobile justify-center px-2 transition-[translate,opacity] duration-300 ease-in-out motion-reduce:transition-none desktop:hidden",
        away
          ? "nav-bar-away opacity-0 [:root:active-view-transition_&]:transition-none"
          : "delay-(--route-shutter-duration) motion-reduce:delay-0",
      )}
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
                  <SectionLink
                    sectionId={section.id}
                    aria-current={isActive ? "true" : undefined}
                    data-sfx-hover
                    data-sfx="select"
                    className="group flex size-full items-center justify-center"
                  >
                    <NavIcon
                      name={section.icon}
                      active={isActive}
                      className={cn(
                        "transition-colors duration-75 motion-reduce:transition-none motion-reduce:delay-0",
                        section.iconSize,
                        isActive
                          ? "text-primary-foreground delay-150"
                          : "text-nav-icon group-active:text-brand",
                      )}
                    />
                    <span className="sr-only">{section.label}</span>
                  </SectionLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
