import Image from "next/image";

import { UserAvatar } from "@/components/layout/user-avatar";
import { currentUser } from "@/lib/data/user";
import { cn } from "@/lib/utils";

function Counter({
  iconSrc,
  value,
  fixedWidth,
}: {
  iconSrc: string;
  value: number;
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

export function HeaderMobile({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "items-center bg-white/1 px-4 py-2 transition-[background-color,backdrop-filter] duration-200 group-data-scrolled:bg-background/60 group-data-scrolled:backdrop-blur-nav motion-reduce:transition-none",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 pr-3">
          <UserAvatar src={currentUser.avatarSrc} />
          <p className="text-sm font-semibold text-foreground">{currentUser.name}</p>
        </div>

        <div className="flex items-center gap-2">
          <Counter iconSrc="/assets/home/fire.png" value={currentUser.streak} fixedWidth />
          <Counter iconSrc="/assets/home/sp-coin.webp" value={currentUser.points} />
        </div>
      </div>
    </div>
  );
}
