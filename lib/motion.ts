export const readMs = (name: string) => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = Number.parseFloat(raw);
  return raw.endsWith("ms") ? value : value * 1000;
};

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

let appReady = false;

export const markAppReady = () => {
  appReady = true;
};

export const isAppReady = () => appReady;
