export type NewsItem = {
  id: string;
  title: string;
  imageSrc: string;
  readTime: string;
  date: string;
};

export const news: NewsItem[] = [
  {
    id: "elden-ring",
    title: "Elden Ring: Shadow of the Erdtree Expansion Gets Official Release Dateerint",
    imageSrc: "/assets/home/news/elden-ring.png",
    readTime: "5 min",
    date: "30/03/25",
  },
  {
    id: "guild-of-guardians",
    title: "Top 3 Guild of Guardians characters highlights",
    imageSrc: "/assets/home/news/guild-of-guardians.png",
    readTime: "5 min",
    date: "20/03/25",
  },
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077: Phantom Liberty - The Expansion That Redeems Night City",
    imageSrc: "/assets/home/news/cyberpunk.png",
    readTime: "5 min",
    date: "20/03/25",
  },
];

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
