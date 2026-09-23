import Image from "next/image";

import { CardLink } from "@/components/layout/card-link";
import type { Mission } from "@/lib/data/missions";
import { detailHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function MissionFeatureCard({ mission }: { mission: Mission }) {
  const highlighted = mission.highlighted;

  return (
    <li className="flex w-mission-card-mobile shrink-0 desktop:slide-third">
      <CardLink
        href={detailHref("missions", mission.id)}
        className={cn(
          "group flex aspect-[261.456/245.787] w-full flex-col justify-end gap-3 rounded-xl px-4 pb-6 pt-4 shadow-mission-card ring-1 ring-inset transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:-translate-y-0.5 focus-visible:shadow-card-hover motion-reduce:transition-none desktop:aspect-[399/414] desktop:gap-6 desktop:px-6 desktop:pb-10 desktop:pt-6",
          highlighted
            ? "bg-mission-highlight ring-brand"
            : "bg-surface-2 ring-border hover:ring-border-muted/60 focus-visible:ring-border-muted/60",
        )}
      >
        <div
          className={cn(
            "relative min-h-px w-full flex-1 overflow-hidden rounded-md ring-1 ring-inset",
            highlighted ? "ring-brand" : "ring-border-muted/50",
          )}
        >
          <Image
            src={mission.imageSrc}
            alt=""
            width={1920}
            height={1080}
            className="size-full object-cover transition-transform duration-250 ease-reveal group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
          />

          <div className="bg-sp-badge absolute left-0 top-0 flex items-center gap-px overflow-hidden rounded-br-md rounded-tl-[5px] border-b border-r border-brand px-1.5 pb-1.25 pt-1.5 shadow-sp-badge desktop:px-2 desktop:pb-1.5 desktop:pt-2">
            <span className="pt-0.5 text-center font-techno text-reward uppercase text-sp-foreground desktop:text-reward-lg">
              {mission.reward}
            </span>
            <span className="relative block aspect-[17.455/16] h-4 shrink-0 overflow-hidden desktop:h-5">
              <Image
                src="/assets/home/sp-coin.png"
                alt=""
                width={2084}
                height={2084}
                className="absolute left-0 top-[-4.55%] h-[109.09%] w-full max-w-none"
              />
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <h3 className="truncate font-techno text-sm uppercase text-foreground desktop:text-card-title">
            {mission.title}
          </h3>
          <p className="line-clamp-2 text-2xs text-foreground desktop:text-mission-copy">
            {mission.description}
          </p>
        </div>
      </CardLink>
    </li>
  );
}
