export const readMsOf = (element: Element, name: string) => {
  const raw = getComputedStyle(element).getPropertyValue(name).trim();
  if (!raw) return 0;
  const value = Number.parseFloat(raw);
  return raw.endsWith("ms") ? value : value * 1000;
};

export const readMs = (name: string) => readMsOf(document.documentElement, name);

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

let appReady = false;

export const markAppReady = () => {
  appReady = true;
};

export const isAppReady = () => appReady;

export const TRAVERSE_EVENT = "sura:traverse";

export type TraverseDetail = { back: boolean };

export const dispatchTraverse = (back: boolean) =>
  window.dispatchEvent(new CustomEvent<TraverseDetail>(TRAVERSE_EVENT, { detail: { back } }));

export const LOST_EVENT = "sura:lost";

export type LostDetail = { duration: number; blackAt: number; elapsed: number };

export const dispatchLost = (detail: LostDetail) => window.dispatchEvent(new CustomEvent<LostDetail>(LOST_EVENT, { detail }));
