export type CopySegment = {
  text: string;
  breakAt?: "mobile" | "desktop";
};

export type HeroLoopSource = {
  src: string;
  type: string;
};

export type HeroLoopVariant = {
  poster: { avif: string; webp: string };
  sources: HeroLoopSource[];
};

export type HeroLoop = {
  mobile: HeroLoopVariant;
  desktop: HeroLoopVariant;
};

export type HeroSlide = {
  game: string;
  thumbnailSrc: string;
} & ({ framing: "loop"; loop: HeroLoop } | { framing: "cover"; artSrc: string });

export type Hero = {
  title: string;
  copy: CopySegment[];
  cta: { label: string; sectionId: string };
  slides: HeroSlide[];
  activeSlide: number;
  autoplayMs: number | null;
};

export const hero: Hero = {
  title: "Bienvenidos a la comunidad de sura",
  copy: [
    { text: "Unite a Sura, desbloqueá niveles", breakAt: "mobile" },
    { text: "completando", breakAt: "desktop" },
    { text: "misiones. Recolectá", breakAt: "mobile" },
    { text: "recompensas y ganá dinero jugando" },
  ],
  cta: { label: "COMENZAR AHORA", sectionId: "eventos" },
  slides: [
    {
      game: "Valorant",
      thumbnailSrc: "/assets/home/hero-art-thumb.jpg",
      framing: "loop",
      loop: {
        mobile: {
          poster: {
            avif: "/assets/home/hero-loop/mobile-poster.avif",
            webp: "/assets/home/hero-loop/mobile-poster.webp",
          },
          sources: [
            { src: "/assets/home/hero-loop/mobile-av1.mp4", type: 'video/mp4; codecs="av01.0.08M.08"' },
            { src: "/assets/home/hero-loop/mobile-h264.mp4", type: "video/mp4" },
          ],
        },
        desktop: {
          poster: {
            avif: "/assets/home/hero-loop/desktop-poster.avif",
            webp: "/assets/home/hero-loop/desktop-poster.webp",
          },
          sources: [
            { src: "/assets/home/hero-loop/desktop-av1.mp4", type: 'video/mp4; codecs="av01.0.08M.08"' },
            { src: "/assets/home/hero-loop/desktop-h264.mp4", type: "video/mp4" },
          ],
        },
      },
    },
    {
      game: "Fortnite",
      thumbnailSrc: "/assets/home/slider/fortnite-thumb.jpg",
      artSrc: "/assets/home/slider/fortnite@2x.webp",
      framing: "cover",
    },
    {
      game: "Call of Duty: Black Ops 6",
      thumbnailSrc: "/assets/home/slider/black-ops-6-thumb.jpg",
      artSrc: "/assets/home/slider/black-ops-6@2x.webp",
      framing: "cover",
    },
    {
      game: "Call of Duty: Modern Warfare III",
      thumbnailSrc: "/assets/home/slider/modern-warfare-3-thumb.jpg",
      artSrc: "/assets/home/slider/modern-warfare-3@2x.webp",
      framing: "cover",
    },
  ],
  activeSlide: 0,
  // TODO: volver a 3000 cuando el carrusel del hero deba avanzar solo otra vez
  autoplayMs: null,
};
