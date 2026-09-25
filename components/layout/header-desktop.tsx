import Image from "next/image";

import { ClaimButton } from "@/components/layout/claim-button";
import { PointsValue } from "@/components/layout/points-value";
import { SectionLink } from "@/components/layout/section-link";
import { UserAvatar } from "@/components/layout/user-avatar";
import { currentUser } from "@/lib/data/user";
import { cn } from "@/lib/utils";

function Counter({ iconSrc, value }: { iconSrc: string; value: React.ReactNode }) {
  return (
    <div className="flex w-29 items-center gap-2 rounded-lg bg-surface-2 py-1 pl-2 pr-1">
      <Image src={iconSrc} alt="" width={28} height={28} className="size-7 shrink-0" />
      <div className="flex min-w-px flex-1 items-center justify-center rounded-md bg-surface-3 px-2 py-1">
        <p className="font-techno text-base uppercase text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

export function HeaderDesktop({ className }: { className?: string }) {
  return (
    <div className={cn("items-center justify-between px-10 py-6", className)}>

      <SectionLink sectionId="home" className="flex">
        <Image
          src="/assets/home/logo-sura.svg"
          alt="Sura Gaming"
          width={164}
          height={40}
          className="h-10 w-41"
          priority
        />
      </SectionLink>

      <div className="flex items-center gap-3 rounded-xl bg-surface p-2">

        <ClaimButton />

        <Counter iconSrc="/assets/home/fire.png" value={currentUser.streak} />
        <Counter iconSrc="/assets/home/sp-coin.webp" value={<PointsValue />} />

        <button
          type="button"
          className="group relative flex cursor-pointer items-center gap-3 pr-3 text-left"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-y-1 -left-2 right-0 rounded-lg bg-surface-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
          />
          <UserAvatar src={currentUser.avatarSrc} />
          <div className="relative flex flex-col justify-center gap-0.5">
            <p className="text-ui font-semibold text-foreground">{currentUser.name}</p>
            <div className="flex items-center gap-1">
              <Image
                src={currentUser.levelBadgeSrc}
                alt=""
                width={20}
                height={20}
                className="size-5 drop-shadow-badge"
              />
              <p className="text-xs font-semibold leading-5 text-brand">
                {currentUser.levelLabel}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
