"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Los tokens no cambian después del primer paint: no hay a qué suscribirse. */
const subscribe = () => () => {};

/**
 * Lee el valor real de una custom property del `<html>` en runtime.
 *
 * El styleguide no repite los valores del Design System: los lee del CSS ya
 * compilado, así no puede quedar desincronizado de `app/globals.css`.
 */
export function TokenValue({ name }: { name: string }) {
  const value = useSyncExternalStore(
    subscribe,
    useCallback(
      () =>
        getComputedStyle(document.documentElement)
          .getPropertyValue(name)
          .trim() || "—",
      [name],
    ),
    () => "",
  );

  return (
    <span className="font-mono text-2xs text-muted-foreground">
      {value || " "}
    </span>
  );
}
