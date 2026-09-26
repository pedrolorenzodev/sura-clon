import { hero, type HeroLoopVariant } from "@/lib/data/hero";

type PosterSource = { type: string; srcset: string };

const decoded = new Map<string, Promise<void>>();
const listeners = new Set<(index: number) => void>();

const isDesktop = () => {
  const width = getComputedStyle(document.documentElement).getPropertyValue("--breakpoint-desktop").trim();
  return window.matchMedia(`(min-width: ${width})`).matches;
};

const densities = (base: string, hiDpi?: string) => (hiDpi ? `${base} 1x, ${hiDpi} 2x` : base);

function posterSources(variant: HeroLoopVariant, hiDpi?: HeroLoopVariant): PosterSource[] {
  return [
    { type: "image/avif", srcset: densities(variant.poster.avif, hiDpi?.poster.avif) },
    { type: "image/webp", srcset: densities(variant.poster.webp, hiDpi?.poster.webp) },
  ];
}

function decodePicture(sources: PosterSource[], fallback: string) {
  const picture = document.createElement("picture");
  for (const { type, srcset } of sources) {
    const source = document.createElement("source");
    source.type = type;
    source.srcset = srcset;
    picture.append(source);
  }
  const image = document.createElement("img");
  image.decoding = "async";
  image.fetchPriority = "high";
  picture.append(image);
  image.src = fallback;
  return image.decode().catch(() => {});
}

export function warmSlide(index: number): Promise<void> {
  const desktop = isDesktop();
  const key = `${index}:${desktop ? "desktop" : "mobile"}`;
  const pending = decoded.get(key);
  if (pending) return pending;

  const slide = hero.slides[index];
  let job: Promise<void>;
  if (slide.framing === "cover") {
    job = decodePicture([], slide.artSrc);
  } else {
    const variant = desktop ? slide.loop.desktop : slide.loop.mobile;
    const hiDpi = desktop ? slide.loop.desktopHiDpi : undefined;
    job = decodePicture(posterSources(variant, hiDpi), variant.poster.webp);
  }
  decoded.set(key, job);
  return job;
}

export function requestSlide(index: number) {
  void warmSlide(index);
  listeners.forEach((listener) => listener(index));
}

export function subscribeSlideRequests(listener: (index: number) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
