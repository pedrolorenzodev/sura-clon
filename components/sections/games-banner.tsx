import Image from "next/image";

import { BorderLight } from "@/components/sections/border-light";
import { ScrambleText } from "@/components/sections/scramble-text";
import { gamesRoutePromo } from "@/lib/data/games";

export function GamesBanner() {
  return (
    <div className="border-gradient-banner group aspect-[359/478] overflow-hidden rounded-xl shadow-banner desktop:aspect-auto desktop:h-99.75">
      <Image
        src={gamesRoutePromo.imageSrcMobile}
        alt=""
        width={512}
        height={512}
        className="absolute left-[-37.88%] top-[-32.01%] h-[132.01%] w-[175.77%] max-w-none object-cover desktop:hidden"
      />
      <Image
        src={gamesRoutePromo.imageSrc}
        alt=""
        width={1920}
        height={1080}
        className="absolute left-0 top-[-10.19%] hidden h-[175.52%] w-full max-w-none object-cover desktop:block"
      />
      <span aria-hidden className="absolute inset-0 bg-banner-scrim-mobile desktop:bg-banner-scrim" />
      <BorderLight />

      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        data-sfx="click"
        className="absolute inset-0 z-10 cursor-pointer rounded-xl"
      />

      <span className="absolute left-0 top-0 z-20 flex items-center rounded-br-md bg-brand-vivid px-3 pb-1.25 pt-2 font-techno text-sm uppercase leading-3.5 text-border-done shadow-sp-badge desktop:hidden">
        {gamesRoutePromo.label}
      </span>

      <div className="pointer-events-none absolute inset-x-4 bottom-6 z-20 flex flex-col gap-6 desktop:inset-x-auto desktop:bottom-9 desktop:left-9 desktop:w-132.5">
        <span className="hidden w-fit items-center rounded-sm bg-brand-vivid px-2 py-1.5 font-techno text-xs uppercase leading-3 text-black desktop:flex">
          {gamesRoutePromo.label}
        </span>

        <div className="flex flex-col gap-2">
          <h2 className="font-display text-banner-title-sm uppercase text-foreground desktop:text-banner-title">
            {gamesRoutePromo.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="text-mission-copy text-foreground desktop:hidden">
            {gamesRoutePromo.bodyMobile}
          </p>
          <p className="hidden text-base text-foreground desktop:block">
            {gamesRoutePromo.body.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>

        <button
          type="button"
          data-sfx-hover
          data-sfx="click"
          className="pointer-events-auto flex h-13.5 w-full cursor-pointer items-center justify-center rounded-pill border border-brand-vivid bg-banner-cta px-4.5 font-techno text-title-sm uppercase text-sp-foreground wipe shadow-promo-cta transition-[box-shadow,translate] duration-200 hover:wipe-on hover:shadow-promo-cta-hover focus-visible:wipe-on focus-visible:shadow-promo-cta-hover active:translate-y-px motion-reduce:transition-none desktop:h-12 desktop:w-fit desktop:px-8"
        >
          <ScrambleText text={gamesRoutePromo.cta} />
        </button>
      </div>
    </div>
  );
}
