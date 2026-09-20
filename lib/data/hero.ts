export type CopySegment = {
  text: string;
  breakAt?: "mobile" | "desktop";
};

export type HeroSlide = {
  game: string;
  thumbnailSrc: string;
  artSrc: string;
  framing: "design" | "cover";
};

export type Hero = {
  title: string;
  copy: CopySegment[];
  cta: { label: string; href: string };
  slides: HeroSlide[];
  activeSlide: number;
  autoplayMs: number;
};

export const hero: Hero = {
  title: "Bienvenidos a la comunidad de sura",
  copy: [
    { text: "Unite a Sura, desbloqueá niveles", breakAt: "mobile" },
    { text: "completando", breakAt: "desktop" },
    { text: "misiones. Recolectá", breakAt: "mobile" },
    { text: "recompensas y ganá dinero jugando" },
  ],
  cta: { label: "COMENZAR AHORA", href: "#eventos" },
  slides: [
    {
      game: "Valorant",
      thumbnailSrc: "/assets/home/hero-art.jpg",
      artSrc: "/assets/home/hero-art@2x.jpg",
      framing: "design",
    },
    {
      game: "Fortnite",
      thumbnailSrc: "/assets/home/slider/fortnite.png",
      artSrc: "/assets/home/slider/fortnite@2x.jpg",
      framing: "cover",
    },
    {
      game: "Call of Duty: Black Ops 6",
      thumbnailSrc: "/assets/home/slider/black-ops-6.png",
      artSrc: "/assets/home/slider/black-ops-6@2x.jpg",
      framing: "cover",
    },
    {
      game: "Call of Duty: Modern Warfare III",
      thumbnailSrc: "/assets/home/slider/modern-warfare-3.png",
      artSrc: "/assets/home/slider/modern-warfare-3@2x.jpg",
      framing: "cover",
    },
  ],
  activeSlide: 0,
  autoplayMs: 3000,
};
