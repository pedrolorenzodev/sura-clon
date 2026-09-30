import type Lenis from "lenis";

import { cssZoom } from "@/lib/css-zoom";

let instance: Lenis | null = null;

export const setSmoothScroll = (lenis: Lenis | null) => {
  instance = lenis;
};

export function scrollInstant(top: number) {
  if (instance) {
    instance.resize();
    instance.scrollTo(top, { immediate: true, force: true });
  }
  else window.scrollTo({ top, behavior: "instant" });
}

export function scrollSmooth(top: number) {
  if (instance) instance.scrollTo(top);
  else window.scrollTo({ top });
}

const anchorTop = (element: Element, margin: number) =>
  element.getBoundingClientRect().top + window.scrollY - margin * cssZoom(element);

export function scrollToElement(element: Element, { instant = false } = {}) {
  const margin = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
  const top = anchorTop(element, margin);
  if (instant) scrollInstant(top);
  else scrollSmooth(top);
}

export function scrollToTopIfHidden(element: Element | null) {
  if (!element) return;
  const margin = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
  if (element.getBoundingClientRect().top / cssZoom(element) < margin) {
    scrollToElement(element);
  }
}
