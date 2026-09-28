export function cssZoom(element: Element) {
  const native = (element as Element & { currentCSSZoom?: number }).currentCSSZoom;
  if (native !== undefined) return native;
  const layout = element instanceof HTMLElement ? element.offsetWidth : 0;
  return layout > 0 ? element.getBoundingClientRect().width / layout : 1;
}

export const layoutWidth = (element: Element) =>
  element.getBoundingClientRect().width / cssZoom(element);

export function scrollToTopIfHidden(element: Element | null) {
  if (!element) return;
  const margin = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
  if (element.getBoundingClientRect().top / cssZoom(element) < margin) {
    element.scrollIntoView({ block: "start" });
  }
}
