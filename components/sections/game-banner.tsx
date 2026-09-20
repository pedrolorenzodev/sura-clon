import Image from "next/image";

import { gamesPromo } from "@/lib/data/games";

export function GameBanner() {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-promo shadow-promo transition-shadow duration-200 hover:shadow-promo-hover has-[:focus-visible]:shadow-promo-hover motion-reduce:transition-none desktop:h-72">
      <Image
        src={gamesPromo.imageSrc}
        alt=""
        width={1920}
        height={1080}
        className="absolute left-0 top-[-24.63%] h-[207.32%] w-full max-w-none object-cover"
      />
      <span className="absolute inset-0 bg-promo-scrim-mobile desktop:bg-promo-scrim" />

      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        className="absolute inset-0 z-10 cursor-pointer rounded-xl"
      />

      <div className="pointer-events-none relative z-20 flex flex-col gap-4 p-4 desktop:absolute desktop:inset-y-0 desktop:left-10.75 desktop:w-132.5 desktop:justify-center desktop:gap-6 desktop:p-0">
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-display-xs uppercase text-foreground desktop:text-display-sm">
            {gamesPromo.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h3>
          <p className="text-xs text-foreground text-shadow-banner desktop:text-base desktop:text-shadow-none">
            {gamesPromo.body.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>

        <button
          type="button"
          className="pointer-events-auto flex h-10 cursor-pointer items-center justify-center self-start rounded-full border border-brand-vivid bg-promo-cta px-6 font-techno text-sm uppercase text-promo-foreground shadow-promo-cta transition-shadow duration-200 hover:shadow-promo-cta-hover focus-visible:shadow-promo-cta-hover motion-reduce:transition-none desktop:h-12 desktop:px-8 desktop:text-title-sm"
        >
          {gamesPromo.cta}
        </button>
      </div>
    </div>
  );
}
