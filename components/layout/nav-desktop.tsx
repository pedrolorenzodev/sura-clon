import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { homeSections } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";

export function NavDesktop({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const activeIndex = homeSections.findIndex((section) => section.id === activeId);

  return (
    <nav
      aria-label="Secciones del Home"
      className="pointer-events-none fixed left-0 top-header-desktop z-40 hidden h-hero-content-desktop w-gutter-desktop items-center px-11 desktop:flex"
    >
      <TooltipProvider>
        <div className="pointer-events-auto border-gradient-nav-desktop rounded-2xl bg-nav-glass py-2 shadow-nav backdrop-blur-nav">
          <div className="relative">
            <span
              aria-hidden
              style={{ "--nav-index": activeIndex } as React.CSSProperties}
              className="nav-pill-y pointer-events-none absolute inset-x-0 top-0 flex h-10.5 items-center justify-center transition-transform duration-250 ease-in-out motion-reduce:transition-none"
            >
              <span className="h-10.5 w-11.5 rounded-xl bg-brand" />
            </span>

            <ul className="relative flex flex-col items-center gap-0.5">
              {homeSections.map((section) => {
                const isActive = section.id === activeId;

                return (
                  <li key={section.id} className="h-10.5 w-15">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <a
                            href={`#${section.id}`}
                            onClick={() => onSelect(section.id)}
                            aria-current={isActive ? "true" : undefined}
                            className="group flex size-full items-center justify-center"
                          />
                        }
                      >

                        <span
                          className={cn(
                            "block shrink-0 transition-colors duration-75 motion-reduce:transition-none motion-reduce:delay-0",
                            section.icon,
                            section.iconSize,
                            isActive
                              ? "bg-primary-foreground delay-150"
                              : "bg-foreground group-hover:bg-brand group-focus-visible:bg-brand",
                          )}
                        />
                        <span className="sr-only">{section.label}</span>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={12}>
                        {section.label}
                      </TooltipContent>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </TooltipProvider>
    </nav>
  );
}
