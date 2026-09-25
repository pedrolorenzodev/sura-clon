import Image from "next/image";

import { CardLink } from "@/components/layout/card-link";
import { CardBrackets } from "@/components/sections/card-brackets";
import type { Mission } from "@/lib/data/missions";
import { detailHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function MissionCard({
  mission,
  className,
  compact,
}: {
  mission: Mission;
  className?: string;
  compact?: boolean;
}) {
  const done = mission.completed;

  return (
    <li className={cn("flex", className)}>
      <CardLink
        href={detailHref("missions", mission.id)}
        className={cn(
          "group relative flex w-full flex-col rounded-lg transition-[translate,box-shadow,scale] duration-200 ease-reveal hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:-translate-y-0.5 focus-visible:shadow-card-hover active:scale-98 motion-reduce:transition-none",
          compact
            ? "gap-2 p-2 desktop:gap-4 desktop:px-4 desktop:pb-6 desktop:pt-4"
            : "gap-4 px-4 pb-6 pt-4",
          done
            ? "bg-surface-done ring-1 ring-inset ring-border-done"
            : "bg-surface shadow-mission-card ring-1 ring-inset ring-border hover:ring-border-muted/60 focus-visible:ring-border-muted/60",
        )}
      >
        <div
          className={cn(
            "relative aspect-[229.456/128] w-full overflow-hidden rounded-sm",
            done && "border-gradient-done",
          )}
        >
          <Image
            src={mission.imageSrc}
            alt=""
            width={1920}
            height={1080}
            className="size-full object-cover transition-transform duration-250 ease-reveal group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
          />

          {done && <span aria-hidden className="bg-mission-done absolute inset-0" />}

          <div
            className={cn(
              "absolute left-0 top-0 flex items-center gap-px overflow-hidden rounded-br-sm rounded-tl-[3px] px-1.5 pb-1.25 pt-1.5",
              done
                ? "bg-surface-done border-b border-r border-border-done text-brand"
                : "bg-sp-badge border-b border-r border-brand text-sp-foreground shadow-sp-badge",
            )}
          >
            <span className="pt-0.5 text-center font-techno text-reward uppercase">
              {mission.reward}
            </span>
            <span className="relative block h-4 w-[17.455px] shrink-0 overflow-hidden">
              <Image
                src="/assets/home/sp-coin.webp"
                alt=""
                width={2084}
                height={2084}
                className="absolute left-0 top-[-4.55%] h-[109.09%] w-full max-w-none"
              />
            </span>
          </div>

          {done && (
            <span className="bg-mission-check absolute left-1/2 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand desktop:size-13.5">
              <Image
                src="/assets/missions/check.svg"
                alt=""
                width={23}
                height={16}
                className="w-3.5 desktop:w-5.75"
              />
              <span className="sr-only">Completada</span>
            </span>
          )}
        </div>

        <div className={cn("flex flex-col", compact ? "desktop:gap-2" : "gap-2")}>
          <h3
            className={cn(
              "h-4.5 truncate font-techno uppercase",
              compact ? "text-xs desktop:text-sm" : "text-sm",
              done ? "text-muted-foreground/67" : "text-foreground",
            )}
          >
            {mission.title}
          </h3>
          <p
            className={cn(
              "text-2xs",
              done ? "text-muted-foreground/67" : "text-muted-foreground",
              compact && "line-clamp-2 desktop:line-clamp-none",
            )}
          >
            {mission.description}
          </p>
        </div>
        <CardBrackets />
      </CardLink>
    </li>
  );
}
