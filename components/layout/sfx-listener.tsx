"use client";

import { useEffect } from "react";

import { isSfxSlot, sfxConfig, type SfxSlot } from "@/lib/data/sfx";
import { LOST_EVENT, prefersReducedMotion, TRAVERSE_EVENT, type TraverseDetail } from "@/lib/motion";
import { attachSfx, playSfx, toggleSfx } from "@/lib/sfx";

const HOVER_SELECTOR = "[data-sfx-hover]";
const CLICK_SELECTOR = "[data-sfx]";
const EDITABLE_SELECTOR = "input, textarea, select, [contenteditable]:not([contenteditable='false'])";

const isUnavailable = (element: Element) =>
  element.matches(":disabled") || element.getAttribute("aria-disabled") === "true";

const isCurrent = (element: Element) => {
  const current = element.getAttribute("aria-current");
  return current !== null && current !== "false";
};

const isSelected = (element: Element) =>
  isCurrent(element) ||
  element.getAttribute("aria-selected") === "true" ||
  element.getAttribute("aria-pressed") === "true";

const matchesFocusVisible = (element: Element) => {
  try {
    return element.matches(":focus-visible");
  } catch {
    return false;
  }
};

function hoverTarget(target: EventTarget | null, from: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  const element = target.closest(HOVER_SELECTOR);
  if (!element) return null;
  if (from instanceof Node && element.contains(from)) return null;
  if (isCurrent(element) || isUnavailable(element)) return null;
  return element;
}

const playHover = (element: Element) =>
  playSfx("hover", { gain: element.getAttribute("data-sfx-hover") === "soft" ? sfxConfig.softHoverGain : 1 });

const KEYBOARD_FOCUS_WINDOW_MS = 600;
const SHUTTER_PSEUDO = "::view-transition-group(route-shutter)";

const isTransitioning = () => {
  try {
    return document.documentElement.matches(":active-view-transition");
  } catch {
    return false;
  }
};

const findShutter = () =>
  document.documentElement
    .getAnimations({ subtree: true })
    .find((animation) => (animation.effect as KeyframeEffect | null)?.pseudoElement === SHUTTER_PSEUDO);

const elapsedSeconds = (animation: Animation) => {
  const time = animation.currentTime;
  return typeof time === "number" ? time / 1000 : 0;
};

let routeSwapWait = 0;

function playOnRouteSwap(slot: SfxSlot) {
  cancelAnimationFrame(routeSwapWait);
  if (prefersReducedMotion() || !("startViewTransition" in document)) {
    playSfx(slot);
    return;
  }
  const fromPath = window.location.pathname;
  const startedAt = performance.now();
  const check = () => {
    const shutter = findShutter();
    if (shutter) {
      playSfx(slot, { offset: elapsedSeconds(shutter) });
      return;
    }
    if (window.location.pathname !== fromPath && !isTransitioning()) {
      playSfx(slot);
      return;
    }
    if (performance.now() - startedAt < sfxConfig.routeSwapWaitMs) routeSwapWait = requestAnimationFrame(check);
  };
  routeSwapWait = requestAnimationFrame(check);
}

// TODO(sfx): poner acá el slot del sonido de la llegada a la 404 cuando exista en lib/data/sfx.ts
const LOST_SLOT = null as SfxSlot | null;

const playClick = (slot: SfxSlot) => (slot === "route" || slot === "back" ? playOnRouteSwap(slot) : playSfx(slot));

function linkSlot(event: MouseEvent, target: Element): SfxSlot | "silent" | null {
  const anchor = target.closest("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return "silent";
  if (anchor.hasAttribute("download")) return "silent";
  if (anchor.target && anchor.target !== "_self") return "silent";

  let destination: URL;
  try {
    destination = new URL(anchor.href, window.location.href);
  } catch {
    return "silent";
  }
  if (destination.origin !== window.location.origin) return "silent";
  if (destination.pathname === window.location.pathname) return null;
  const declared = anchor.getAttribute("data-sfx");
  if (declared === "back" || declared === "route") return declared;
  return destination.pathname === "/" ? "back" : "route";
}

function declaredSlot(target: Element): SfxSlot | null {
  const element = target.closest(CLICK_SELECTOR);
  if (!element) return null;
  const slot = element.getAttribute("data-sfx");
  if (!isSfxSlot(slot)) return null;
  if (isUnavailable(element) || isSelected(element)) return null;
  return slot;
}

function isEditable(event: KeyboardEvent) {
  const target = event.composedPath()[0] ?? event.target;
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || target.closest(EDITABLE_SELECTOR) !== null;
}

export function SfxListener() {
  useEffect(() => {
    const detach = attachSfx();
    let pointer: { x: number; y: number } | null = null;
    let lastKeyAt = -Infinity;

    const onPointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const scrolledUnder = pointer !== null && pointer.x === event.clientX && pointer.y === event.clientY;
      if (scrolledUnder) return;
      const element = hoverTarget(event.target, event.relatedTarget);
      if (element) playHover(element);
    };

    const onFocusIn = (event: FocusEvent) => {
      if (performance.now() - lastKeyAt > KEYBOARD_FOCUS_WINDOW_MS) return;
      if (!(event.target instanceof Element) || !matchesFocusVisible(event.target)) return;
      const element = hoverTarget(event.target, event.relatedTarget);
      if (element) playHover(element);
    };

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = linkSlot(event, event.target);
      if (link === "silent") return;
      const slot = link ?? declaredSlot(event.target);
      if (slot) playClick(slot);
    };

    const onTraverse = (event: Event) => {
      playClick((event as CustomEvent<TraverseDetail>).detail.back ? "back" : "route");
    };

    const onLost = () => {
      if (LOST_SLOT) playSfx(LOST_SLOT);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      lastKeyAt = performance.now();
      if (event.key !== "m" && event.key !== "M") return;
      if (event.repeat || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditable(event)) return;
      toggleSfx();
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true, capture: true });
    document.addEventListener("pointerdown", onPointerMove, { passive: true, capture: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener(TRAVERSE_EVENT, onTraverse);
    window.addEventListener(LOST_EVENT, onLost);

    return () => {
      document.removeEventListener("pointermove", onPointerMove, { capture: true });
      document.removeEventListener("pointerdown", onPointerMove, { capture: true });
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(TRAVERSE_EVENT, onTraverse);
      window.removeEventListener(LOST_EVENT, onLost);
      detach();
    };
  }, []);

  return null;
}
