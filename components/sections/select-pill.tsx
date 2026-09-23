import { ChevronDown } from "lucide-react";

export function SelectPill({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-10 w-40.5 cursor-pointer items-center justify-between rounded-pill bg-surface-2 px-4 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:text-foreground motion-reduce:transition-none"
    >
      {label}
      <ChevronDown className="size-4 shrink-0" aria-hidden />
    </button>
  );
}
