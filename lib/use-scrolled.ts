import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};

const isScrolled = () => window.scrollY > 0;

export function useScrolled() {
  return useSyncExternalStore(subscribe, isScrolled, () => false);
}
