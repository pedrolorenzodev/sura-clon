import Image from "next/image";
import Link from "next/link";

import type { Mission } from "@/lib/data/missions";

export function MissionCard({ mission }: { mission: Mission }) {
  return (
    <li className="flex w-mission-card-mobile shrink-0 desktop:w-67">
      <Link
        href={`/missions/${mission.id}`}
        prefetch={false}
        className="group flex w-full flex-col gap-4 rounded-lg bg-surface px-4 pb-6 pt-4 shadow-mission-card ring-1 ring-inset ring-border transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:ring-border-muted/60 focus-visible:-translate-y-0.5 focus-visible:shadow-card-hover focus-visible:ring-border-muted/60 motion-reduce:transition-none"
      >
        <div className="relative aspect-[229.456/128] w-full overflow-hidden rounded-sm ring-1 ring-inset ring-border-muted/50">
          <Image
            src={mission.imageSrc}
            alt=""
            width={1920}
            height={1080}
            className="size-full object-cover transition-transform duration-250 ease-reveal group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
          />

          <div className="absolute left-0 top-0 flex items-center gap-px overflow-hidden rounded-br-sm rounded-tl-[3px] border-b border-r border-brand bg-sp-badge px-1.5 pb-1.25 pt-1.5 shadow-sp-badge">
            <span className="pt-0.5 text-center font-techno text-reward uppercase text-sp-foreground">
              {mission.reward}
            </span>
            <span className="relative block h-4 w-[17.455px] shrink-0 overflow-hidden">
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

        <div className="flex flex-col gap-2">
          <h3 className="h-4.5 truncate font-techno text-sm uppercase text-foreground">
            {mission.title}
          </h3>
          <p className="text-2xs text-muted-foreground">
            {mission.description}
          </p>
        </div>
      </Link>
    </li>
  );
}
