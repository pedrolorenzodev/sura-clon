import Image from "next/image";

export function SectionHeader({
  title,
  action = true,
}: {
  title: string;
  action?: boolean;
}) {
  return (
    <header className="flex items-center justify-between">
      <h2 className="font-techno text-title-sm uppercase text-foreground desktop:text-title">
        {title}
      </h2>
      {action && (
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1 font-techno text-2xs uppercase text-brand transition-[filter] duration-200 hover:drop-shadow-link-hover focus-visible:drop-shadow-link-hover motion-reduce:transition-none desktop:text-link"
        >
          Ver todo
          <Image
            src="/assets/home/arrow-right.svg"
            alt=""
            width={24}
            height={24}
            className="size-3 shrink-0 desktop:size-6"
          />
        </button>
      )}
    </header>
  );
}
