import Image from "next/image";

import { BackButton } from "@/components/layout/back-button";
import { PointsValue } from "@/components/layout/points-value";
import { UserAvatar } from "@/components/layout/user-avatar";
import { currentUser } from "@/lib/data/user";
import { cn } from "@/lib/utils";

function Counter({
  iconSrc,
  value,
  fixedWidth,
}: {
  iconSrc: string;
  value: React.ReactNode;
  fixedWidth?: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-surface-2 px-2 py-1 ring-1 ring-inset ring-border-muted/25">
      <Image src={iconSrc} alt="" width={24} height={24} className="size-6 shrink-0" />
      <div className="flex items-center justify-center py-1">
        <p
          className={cn(
            "font-techno text-base uppercase text-foreground",
            fixedWidth && "w-6 text-center",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export function HeaderMobile({ back, className }: { back?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "items-center bg-white/1 px-4 py-2 transition-[background-color,backdrop-filter] duration-200 group-data-scrolled/header:bg-background/60 group-data-scrolled/header:backdrop-blur-nav motion-reduce:transition-none",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex min-w-0 items-center gap-2 pr-3">
          {back && <BackButton />}
          <UserAvatar src={currentUser.avatarSrc} />
          <p className="truncate text-sm font-semibold text-foreground">{currentUser.name}</p>
        </div>

        <div className="flex items-center gap-2">
          <Counter iconSrc="/assets/home/fire.png" value={currentUser.streak} fixedWidth />
          <Counter iconSrc="/assets/home/sp-coin.webp" value={<PointsValue />} />
        </div>
      </div>
    </div>
  );
}
