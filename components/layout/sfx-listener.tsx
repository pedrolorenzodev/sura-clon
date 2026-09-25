"use client";

import { useEffect } from "react";

import { isSfxSlot, type SfxSlot } from "@/lib/data/sfx";
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

const KEYBOARD_FOCUS_WINDOW_MS = 600;

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
      if (hoverTarget(event.target, event.relatedTarget)) playSfx("hover");
    };

    const onFocusIn = (event: FocusEvent) => {
      if (performance.now() - lastKeyAt > KEYBOARD_FOCUS_WINDOW_MS) return;
      if (!(event.target instanceof Element) || !matchesFocusVisible(event.target)) return;
      if (hoverTarget(event.target, event.relatedTarget)) playSfx("hover");
    };

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = linkSlot(event, event.target);
      if (link === "silent") return;
      const slot = link ?? declaredSlot(event.target);
      if (slot) playSfx(slot);
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

    return () => {
      document.removeEventListener("pointermove", onPointerMove, { capture: true });
      document.removeEventListener("pointerdown", onPointerMove, { capture: true });
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("keydown", onKeyDown);
      detach();
    };
  }, []);

  return null;
}
