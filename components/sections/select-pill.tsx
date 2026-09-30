import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export function SelectPill({ label, className }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-40.5 cursor-pointer items-center justify-between rounded-pill bg-surface-2 px-4 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:text-foreground motion-reduce:transition-none",
        className,
      )}
    >
      {label}
      <ChevronDown className="size-4 shrink-0" aria-hidden />
    </button>
  );
}
