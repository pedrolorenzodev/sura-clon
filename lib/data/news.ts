export const newsCategories = [
  { id: "todas", label: "Todas" },
  { id: "lanzamientos", label: "Lanzamientos" },
  { id: "actualizaciones", label: "Actualizaciones" },
  { id: "guias", label: "Guías" },
  { id: "esports", label: "Esports" },
  { id: "sura", label: "Sura" },
] as const;

export type NewsCategory = Exclude<(typeof newsCategories)[number]["id"], "todas">;

export const newsCategoryLabel = (id: NewsCategory) => newsCategories.find((category) => category.id === id)!.label;

export const newsIntro = {
  title: "Sura News",
  body: [
    "Todo lo que está pasando en el mundo del gaming,",
    "en un solo lugar. Noticias, leaks, updates",
    "y tendencias al instante. Si está pasando,",
    "está en Sura News.",
  ],
  cta: "ir a sura news",
};
