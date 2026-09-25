import { Fragment } from "react";

import { SectionLink } from "@/components/layout/section-link";
import { HeroSlider } from "@/components/sections/hero-slider";
import { ScrambleText } from "@/components/sections/scramble-text";
import { hero } from "@/lib/data/hero";

export function HeroContent() {
  return (
    <div className="intro-veil flex flex-col gap-8 pb-6 pt-16 desktop:h-hero-content-desktop desktop:flex-row desktop:items-center desktop:gap-hero-gap desktop:pb-6 desktop:pl-gutter-desktop desktop:pt-6">
      <div className="hud-scan flex flex-col gap-6 px-gutter desktop:min-w-px desktop:flex-1 desktop:justify-center desktop:px-10">
        <div className="flex flex-col gap-3 desktop:gap-6">
          <h1 className="font-display text-display-xs uppercase text-foreground desktop:text-display-fluid">
            {hero.title}
          </h1>
          <p className="font-techno text-copy-sm uppercase text-foreground text-shadow-hero-copy desktop:text-copy">
            {hero.copy.map((segmento, i) => (
              <Fragment key={segmento.text}>
                {segmento.text}
                {i < hero.copy.length - 1 && " "}
                {segmento.breakAt === "mobile" && <br className="desktop:hidden" />}
                {segmento.breakAt === "desktop" && <br className="hidden desktop:inline" />}
              </Fragment>
            ))}
          </p>
        </div>

        <SectionLink
          sectionId={hero.cta.sectionId}
          data-sfx-hover
          data-sfx="click"
          className="wipe inline-flex h-7.5 items-center self-start rounded-pill bg-brand px-4 font-techno text-cta-sm uppercase text-black shadow-cta-mobile transition-[box-shadow,translate] duration-200 hover:wipe-on hover:shadow-cta-hover focus-visible:wipe-on focus-visible:shadow-cta-hover active:translate-y-px motion-reduce:transition-none desktop:h-11.5 desktop:min-w-45.25 desktop:justify-center desktop:px-5 desktop:text-cta desktop:shadow-cta desktop:hover:shadow-cta-hover desktop:focus-visible:shadow-cta-hover"
        >
          <ScrambleText text={hero.cta.label} />
        </SectionLink>
      </div>

      <HeroSlider />
    </div>
  );
}
