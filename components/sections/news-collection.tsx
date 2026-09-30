"use client";

import { FlipList } from "@/components/sections/flip-list";
import { NewsCard } from "@/components/sections/news-card";
import { NewsFeature } from "@/components/sections/news-feature";
import { RouteTabs } from "@/components/sections/route-tabs";
import { news, newsCategories } from "@/lib/data/news";
import { useUrlState } from "@/lib/use-url-state";

const DEFAULTS = { categoria: "todas" };

export function NewsCollection() {
  const [state, setState] = useUrlState(DEFAULTS);
  const category = newsCategories.some((item) => item.id === state.categoria) ? state.categoria : "todas";
  const items = category === "todas" ? news : news.filter((item) => item.category === category);

  return (
    <div className="flex flex-col gap-6 desktop:gap-10">
      <RouteTabs
        items={[...newsCategories]}
        value={category}
        onChange={(categoria) => setState({ categoria })}
        label="Categorías de noticias"
      />

      <FlipList
        keys={items.map((item) => item.id)}
        className="card-grid grid content-start gap-4 desktop:grid-cols-4 desktop:gap-6"
      >
        {items.map((item, index) =>
          index === 0 ? (
            <li key={item.id} className="col-span-full">
              <NewsFeature item={item} />
            </li>
          ) : (
            <li key={item.id} className="flex">
              <NewsCard item={item} fluid />
            </li>
          ),
        )}
      </FlipList>
    </div>
  );
}
