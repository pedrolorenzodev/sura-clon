import Image from "next/image";

import { cn } from "@/lib/utils";

export function UserAvatar({
  src,
  size = 40,
  ringClassName = "border-2 border-brand",
  className,
  children,
}: {
  src: string;
  size?: number;
  ringClassName?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative size-10 shrink-0", className)}>
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className="size-full rounded-full object-cover"
      />
      <span className={cn("pointer-events-none absolute inset-0 rounded-full", ringClassName)} />
      {children}
    </div>
  );
}
