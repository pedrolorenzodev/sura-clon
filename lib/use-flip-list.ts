"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import { cssZoom } from "@/lib/css-zoom";
import { prefersReducedMotion, readMs } from "@/lib/motion";

type Box = { x: number; y: number; width: number; height: number };

type Snapshot = { boxes: Map<string, Box>; nodes: Map<string, HTMLElement>; height: number };

const FLIP = "flip";
const MAX_ENTER_STEPS = 8;

function measure(list: HTMLElement, keys: string[]): Snapshot {
  const zoom = cssZoom(list);
  const origin = list.getBoundingClientRect();
  const nodes = new Map<string, HTMLElement>();
  const boxes = new Map<string, Box>();
  [...list.children].forEach((child, index) => {
    const key = keys[index];
    if (!key || !(child instanceof HTMLElement)) return;
    const box = child.getBoundingClientRect();
    nodes.set(key, child);
    boxes.set(key, {
      x: (box.left - origin.left) / zoom,
      y: (box.top - origin.top) / zoom,
      width: box.width / zoom,
      height: box.height / zoom,
    });
  });
  return { boxes, nodes, height: origin.height / zoom };
}

function cancelFlips(element: Element) {
  for (const animation of element.getAnimations({ subtree: true })) {
    if (animation.id === FLIP) animation.cancel();
  }
}

export function useFlipList(
  listRef: React.RefObject<HTMLElement | null>,
  ghostsRef: React.RefObject<HTMLElement | null>,
  keys: string[],
) {
  const previous = useRef<Snapshot | null>(null);
  const signature = keys.join("\n");

  useLayoutEffect(() => {
    const list = listRef.current;
    const currentKeys = signature.split("\n");
    if (!list) {
      previous.current = null;
      return;
    }

    cancelFlips(list);
    const before = previous.current;
    const after = measure(list, currentKeys);
    previous.current = after;
    if (!before || prefersReducedMotion()) return;

    const easing = getComputedStyle(document.documentElement).getPropertyValue("--ease-reveal").trim();
    const shift = getComputedStyle(document.documentElement).getPropertyValue("--row-reveal-shift").trim();
    const move = { duration: readMs("--flip-move-duration"), easing, id: FLIP };

    const ghosts = ghostsRef.current;
    for (const [key, node] of before.nodes) {
      if (after.nodes.has(key) || !ghosts) continue;
      const box = before.boxes.get(key)!;
      const ghost = node.cloneNode(true) as HTMLElement;
      Object.assign(ghost.style, {
        position: "absolute",
        left: `${box.x}px`,
        top: `${box.y}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
        margin: "0",
      });
      ghosts.appendChild(ghost);
      ghost
        .animate([{ opacity: 1 }, { opacity: 0, transform: "scale(0.96)" }], {
          duration: readMs("--flip-exit-duration"),
          easing: "ease-out",
          fill: "forwards",
        })
        .finished.then(() => ghost.remove(), () => ghost.remove());
    }

    let entering = 0;
    for (const [key, node] of after.nodes) {
      const from = before.boxes.get(key);
      if (!from) {
        node.animate(
          [
            { opacity: 0, transform: `translateY(${shift})` },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: readMs("--row-reveal-duration"),
            delay: readMs("--flip-enter-delay") + Math.min(entering++, MAX_ENTER_STEPS) * readMs("--flip-enter-stagger"),
            easing,
            fill: "backwards",
            id: FLIP,
          },
        );
        continue;
      }
      const to = after.boxes.get(key)!;
      const dx = from.x - to.x;
      const dy = from.y - to.y;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        node.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], move);
      }
    }

    if (Math.abs(after.height - before.height) > 1) {
      const shrinking = after.height < before.height;
      list.animate([{ height: `${before.height}px` }, { height: `${after.height}px` }], {
        ...move,
        delay: shrinking ? readMs("--flip-exit-duration") : 0,
        fill: "backwards",
      });
    }
  }, [signature, listRef, ghostsRef]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(() => {
      if (previous.current && !list.getAnimations({ subtree: true }).length) {
        previous.current = measure(list, signature.split("\n"));
      }
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, [signature, listRef]);
}
