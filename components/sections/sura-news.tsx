import Image from "next/image";

import { NewsCard } from "@/components/sections/news-card";
import { NewsCardWide } from "@/components/sections/news-card-wide";
import { SectionHeader } from "@/components/sections/section-header";
import { news, newsIntro } from "@/lib/data/news";

export function SuraNews() {
  return (
    <section
      id="sura-news"
      className="mt-section-gap-mobile scroll-mt-14 overflow-x-clip px-gutter desktop:mt-section-gap desktop:scroll-mt-header-desktop desktop:bg-surface-deep desktop:px-gutter-desktop desktop:py-24"
    >
      <div className="flex flex-col gap-title-gap desktop:hidden">
        <SectionHeader title={newsIntro.title} />
        <ul className="no-scrollbar flex gap-3 overflow-x-auto">
          {news.map((item) => (
            <li key={item.id} className="flex">
              <NewsCard item={item} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto hidden max-w-page items-center gap-6 desktop:flex">
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-display-sm uppercase text-foreground">
              {newsIntro.title}
            </h2>
            <p className="font-techno text-news-copy uppercase text-muted-foreground">
              {newsIntro.body.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < newsIntro.body.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>

          <button
            type="button"
            className="flex cursor-pointer items-center gap-1 self-start font-techno text-link uppercase text-brand"
          >
            {newsIntro.cta}
            <Image
              src="/assets/home/arrow-right.svg"
              alt=""
              width={24}
              height={24}
              className="size-6 shrink-0"
            />
          </button>
        </div>

        <ul className="flex shrink-0 items-stretch gap-3">
          <li className="flex">
            <NewsCard item={news[0]} />
          </li>
          <li className="flex flex-col gap-3">
            <div className="flex-1">
              <NewsCardWide item={news[1]} />
            </div>
            <div className="flex-1">
              <NewsCardWide item={news[2]} />
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
