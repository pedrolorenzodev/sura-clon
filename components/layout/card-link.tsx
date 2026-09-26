import Link from "next/link";

import { cn } from "@/lib/utils";

export function CardLink({
  href,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  href: string | null;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  if (!href)
    return (
      <div data-sfx-hover="soft" data-sfx="click" className={cn("cursor-pointer", className)}>
        {children}
      </div>
    );

  return (
    <Link href={href} prefetch={false} aria-label={ariaLabel} data-sfx-hover="soft" className={className}>
      {children}
    </Link>
  );
}
