import { newsCategoryLabel, type NewsCategory } from "@/lib/data/news";

export function NewsCategoryBadge({ category }: { category: NewsCategory }) {
  return (
    <span className="self-start rounded-xs border border-brand px-1.5 py-0.75 font-techno text-2xs uppercase leading-2.5 text-brand">
      {newsCategoryLabel(category)}
    </span>
  );
}
