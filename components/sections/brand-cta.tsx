import { ScrambleText } from "@/components/sections/scramble-text";
import { cn } from "@/lib/utils";

export function BrandCta({
  label,
  className,
  labelClassName = "text-title-sm",
  ...props
}: React.ComponentProps<"button"> & { label: string; labelClassName?: string }) {
  return (
    <button
      type="button"
      data-sfx-hover
      data-sfx="click"
      className={cn(
        "cursor-pointer items-center justify-center rounded-pill border border-brand-vivid bg-banner-cta px-4.5 font-techno uppercase text-sp-foreground wipe shadow-promo-cta transition-[box-shadow,translate] duration-200 hover:wipe-on hover:shadow-promo-cta-hover focus-visible:wipe-on focus-visible:shadow-promo-cta-hover active:translate-y-px motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <span className={labelClassName}>
        <ScrambleText text={label} />
      </span>
    </button>
  );
}
