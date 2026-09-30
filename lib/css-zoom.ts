export function cssZoom(element: Element) {
  const native = (element as Element & { currentCSSZoom?: number }).currentCSSZoom;
  if (native !== undefined) return native;
  const layout = element instanceof HTMLElement ? element.offsetWidth : 0;
  return layout > 0 ? element.getBoundingClientRect().width / layout : 1;
}

export const layoutWidth = (element: Element) =>
  element.getBoundingClientRect().width / cssZoom(element);
