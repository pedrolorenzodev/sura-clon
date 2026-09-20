import { MedalCard } from "@/components/sections/medal-card";
import { SectionHeader } from "@/components/sections/section-header";
import { medals } from "@/lib/data/medals";
import { cn } from "@/lib/utils";

export function Medallas({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-title-gap", className)}>
      <SectionHeader title="Medallas" action={false} />
      <ul className="grid grid-cols-3 gap-2 rounded-xl bg-surface-deep p-4 desktop:min-h-0 desktop:flex-1 desktop:grid-rows-3">
        {medals.map((medal) => (
          <MedalCard key={medal.id} medal={medal} />
        ))}
      </ul>
    </div>
  );
}
