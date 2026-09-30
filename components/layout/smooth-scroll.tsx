"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";

import { DESKTOP_MIN_WIDTH } from "@/lib/desktop-zoom";
import { setSmoothScroll } from "@/lib/smooth-scroll";
import { useIntroPhase } from "@/lib/use-intro-phase";

const SMOOTH_LERP = 0.18;
const OVERLAY_SELECTOR = '[role="dialog"], [role="menu"], [role="listbox"], [data-lenis-prevent]';

const isScrollLocked = () =>
  document.documentElement.style.overflow === "hidden" || document.querySelector('[role="dialog"]') !== null;

export function SmoothScroll() {
  const introPending = useIntroPhase() === "pending";
  const introPendingRef = useRef(introPending);
  const instanceRef = useRef<Lenis | null>(null);

  useEffect(() => {
    introPendingRef.current = introPending;
    if (introPending) instanceRef.current?.stop();
    else instanceRef.current?.start();
  }, [introPending]);

  useEffect(() => {
    const query = window.matchMedia(
      `(min-width: ${DESKTOP_MIN_WIDTH}px) and (prefers-reduced-motion: no-preference)`,
    );
    let lenis: Lenis | null = null;
    let bodyObserver: ResizeObserver | null = null;

    const sync = () => {
      if (query.matches && !lenis) {
        lenis = new Lenis({
          lerp: SMOOTH_LERP,
          wheelMultiplier: 1,
          autoRaf: true,
          prevent: (node) => isScrollLocked() || node.closest(OVERLAY_SELECTOR) !== null,
        });
        setSmoothScroll(lenis);
        instanceRef.current = lenis;
        if (introPendingRef.current) lenis.stop();
        const instance = lenis;
        let height = document.body.scrollHeight;
        bodyObserver = new ResizeObserver(() => {
          if (Math.abs(document.body.scrollHeight - height) < 1) return;
          height = document.body.scrollHeight;
          instance.resize();
        });
        bodyObserver.observe(document.body);
      } else if (!query.matches && lenis) {
        bodyObserver?.disconnect();
        lenis.destroy();
        lenis = null;
        instanceRef.current = null;
        setSmoothScroll(null);
      }
    };

    sync();
    query.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
      bodyObserver?.disconnect();
      lenis?.destroy();
      instanceRef.current = null;
      setSmoothScroll(null);
    };
  }, []);

  return null;
}
