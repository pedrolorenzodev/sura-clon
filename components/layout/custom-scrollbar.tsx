"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { cssZoom } from "@/lib/css-zoom";
import { scrollInstant, scrollSmooth } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

const MIN_THUMB = 32;

type Metrics = { max: number; travel: number };

export function CustomScrollbar() {
  const isHome = usePathname() === "/";
  const track = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const metrics = useRef<Metrics>({ max: 0, travel: 0 });
  const drag = useRef<{ startY: number; startScroll: number } | null>(null);

  useEffect(() => {
    const trackEl = track.current;
    const thumbEl = thumb.current;
    if (!trackEl || !thumbEl) return;
    const root = document.documentElement;

    const update = () => {
      const viewport = window.innerHeight;
      const total = root.scrollHeight;
      const max = Math.max(0, total - viewport);
      const trackHeight = trackEl.clientHeight;
      const thumbHeight = Math.min(trackHeight, Math.max(MIN_THUMB, (viewport / total) * trackHeight));
      const travel = trackHeight - thumbHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      metrics.current = { max, travel };
      thumbEl.style.setProperty("--thumb-h", `${thumbHeight}px`);
      thumbEl.style.setProperty("--thumb-y", `${progress * travel}px`);
      trackEl.toggleAttribute("data-scrollable", max > 1);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer = new ResizeObserver(update);
    observer.observe(root);
    observer.observe(document.body);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, []);

  const onThumbDown = (event: React.PointerEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startY: event.clientY, startScroll: window.scrollY };
    track.current?.setAttribute("data-dragging", "");
  };

  const onThumbMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    const state = drag.current;
    const { max, travel } = metrics.current;
    if (!state || travel <= 0) return;
    const delta = (event.clientY - state.startY) / cssZoom(document.documentElement);
    scrollInstant(Math.min(max, Math.max(0, state.startScroll + (delta / travel) * max)));
  };

  const onThumbUp = (event: React.PointerEvent<HTMLSpanElement>) => {
    drag.current = null;
    track.current?.removeAttribute("data-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onTrackDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const trackEl = track.current;
    const { max, travel } = metrics.current;
    if (!trackEl || travel <= 0) return;
    const zoom = cssZoom(trackEl);
    const thumbHeight = trackEl.clientHeight - travel;
    const y = (event.clientY - trackEl.getBoundingClientRect().top) / zoom - thumbHeight / 2;
    scrollSmooth(Math.min(max, Math.max(0, (y / travel) * max)));
  };

  return (
    <div
      aria-hidden
      className={cn(
        "intro-veil pointer-events-none fixed right-0 top-header-desktop z-40 hidden h-hero-content-desktop items-center desktop:flex",
        isHome ? "pr-scrollbar-inset" : "pr-scrollbar-inset-route",
      )}
    >
      <div className="translate-x-0 opacity-100 transition-[opacity,translate] duration-(--scrollbar-show-duration) ease-reveal [:root[data-scrollbar-away]_&]:translate-x-2 [:root[data-scrollbar-away]_&]:opacity-0 [:root[data-scrollbar-away]_&]:duration-(--scrollbar-hide-duration) [:root[data-scrollbar-away]_&]:ease-in motion-reduce:transition-none">
        <div
          ref={track}
          onPointerDown={onTrackDown}
          className={cn(
            "group/scrollbar relative h-scrollbar w-4 touch-none opacity-0 transition-opacity duration-(--scrollbar-show-duration) ease-reveal motion-reduce:transition-none",
            "data-scrollable:pointer-events-auto data-scrollable:cursor-pointer data-scrollable:opacity-100",
          )}
        >
          <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rounded-pill bg-border-dim/60" />
          <span
            ref={thumb}
            onPointerDown={onThumbDown}
            onPointerMove={onThumbMove}
            onPointerUp={onThumbUp}
            onPointerCancel={onThumbUp}
            className="absolute left-1/2 top-0 h-(--thumb-h) w-1 -translate-x-1/2 translate-y-(--thumb-y) cursor-grab rounded-pill bg-accent transition-[width] duration-200 group-hover/scrollbar:w-1.5 group-data-dragging/scrollbar:w-1.5 group-data-dragging/scrollbar:cursor-grabbing motion-reduce:transition-none"
          />
        </div>
      </div>
    </div>
  );
}
