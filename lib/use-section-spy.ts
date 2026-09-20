import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Sigue con el scroll cuál de las secciones del Home está en pantalla, para que
 * el menú flotante marque **dónde estás** y no sólo dónde clickeaste.
 *
 * Es un `IntersectionObserver`, no un listener de scroll: sólo dispara cuando
 * una sección cruza la franja de decisión, así que no hay trabajo por píxel ni
 * re-render de más.
 */

/**
 * Borde superior de la franja: el `scroll-margin-top` de la propia sección, que
 * es donde el ancla la deja al clickearla. Sale del CSS y no de una constante,
 * así el valor es el del breakpoint en curso — 106 en desktop, 56 en mobile.
 */
const anchorOffset = (section: HTMLElement) =>
  Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0;

/** Margen para dar una sección por posada en su ancla, en px. */
const ANCHOR_TOLERANCE = 2;

/**
 * Borde inferior: la franja termina a esta fracción del viewport, y entre las
 * secciones que la tocan gana la **última** — la que acaba de entrar. Así el
 * pill cambia cuando la sección nueva cruza el 40% de la pantalla, en vez de
 * esperar a que la anterior termine de salir (PRD § 5).
 */
const BAND_BOTTOM_RATIO = 0.4;

/** Margen para comparar contra el fondo de la página, en px. */
const BOTTOM_TOLERANCE = 4;

/** Ratio a partir del cual damos la última sección por entera en pantalla. */
const FULLY_VISIBLE_RATIO = 0.99;

/** Colchón por si `scrollend` no existe o no llega. */
const SCROLL_RELEASE_FALLBACK = 700;

export function useSectionSpy(ids: readonly string[], defaultId: string) {
  const [activeId, setActiveId] = useState(defaultId);

  /** Las que existen en el DOM: el menú tiene ítems cuya sección todavía no se maquetó. */
  const presentIdsRef = useRef<readonly string[]>([]);
  /** Mientras hay un scroll por click en curso, el observer no escribe. */
  const lockedRef = useRef(false);
  const releaseRef = useRef<() => void>(() => {});
  const resolveRef = useRef<() => void>(() => {});

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    presentIdsRef.current = sections.map((section) => section.id);
    if (sections.length === 0) return;

    const last = sections[sections.length - 1];
    let lastIsFullyVisible = false;

    /**
     * La banda se mide acá y no se acumula desde los callbacks: cuando una
     * sección se queda tocando el borde exacto, el observer no vuelve a
     * disparar y un `Set` guardaría el estado viejo (PRD § 6).
     */
    const touchesBand = (section: HTMLElement) => {
      const rect = section.getBoundingClientRect();
      return (
        rect.bottom > anchorOffset(section) &&
        rect.top < window.innerHeight * BAND_BOTTOM_RATIO
      );
    };

    /**
     * El scroll está posado justo en el ancla de esta sección, que es donde lo
     * deja un click del menú. Manda sobre la banda: en mobile las secciones son
     * más cortas que la franja y la de abajo entraría a robarle el pill.
     */
    const isAnchored = (section: HTMLElement) =>
      Math.abs(section.getBoundingClientRect().top - anchorOffset(section)) <=
      ANCHOR_TOLERANCE;

    /**
     * La última sección puede no llegar nunca a la franja de arriba si la página
     * termina antes — hoy pasa: el Home mide ~1500px y Eventos arranca en 1024,
     * así que en un viewport alto no hay scroll suficiente. Si estamos al fondo,
     * gana la última.
     */
    const tailWins = () =>
      lastIsFullyVisible ||
      window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - BOTTOM_TOLERANCE;

    const resolve = () => {
      if (lockedRef.current) return;

      /**
       * Sin scroll no hay nada que espiar: la página entra entera y todas las
       * secciones están a la vista. El pill se queda donde lo dejó el click, que
       * es el comportamiento que el menú tenía antes de existir el spy. Hoy pasa
       * en mobile, que mide menos que su propio viewport hasta que lleguen las
       * secciones que faltan.
       */
      const doc = document.documentElement;
      if (doc.scrollHeight - window.innerHeight <= BOTTOM_TOLERANCE) return;

      const next =
        sections.find(isAnchored)?.id ??
        (tailWins() ? last.id : sections.findLast(touchesBand)?.id);
      if (next) setActiveId(next);
    };
    resolveRef.current = resolve;

    const band = new IntersectionObserver(resolve, {
      rootMargin: `0px 0px -${(1 - BAND_BOTTOM_RATIO) * 100}% 0px`,
    });
    for (const section of sections) band.observe(section);

    /**
     * Segundo observer: el único que nos despierta cerca del fondo, donde la
     * franja de arriba ya no recibe a nadie. Mira la última sección entera en
     * pantalla, que es lo que pasa justo al llegar al final.
     */
    const tail = new IntersectionObserver(
      ([entry]) => {
        lastIsFullyVisible = entry.intersectionRatio >= FULLY_VISIBLE_RATIO;
        resolve();
      },
      { threshold: [FULLY_VISIBLE_RATIO, 1] },
    );
    tail.observe(last);

    return () => {
      band.disconnect();
      tail.disconnect();
      resolveRef.current = () => {};
    };
  }, [ids]);

  useEffect(() => () => releaseRef.current(), []);

  /**
   * Click en un ítem del menú. Como el scroll es suave, el observer ve pasar
   * todas las secciones del medio y el pill las recorrería de a saltos: se lo
   * silencia hasta que el scroll termina.
   *
   * Un ítem cuya sección todavía no existe no mueve el pill: no hay a dónde ir,
   * así que marcarlo sería mentir sobre dónde está el usuario.
   */
  const select = useCallback((id: string) => {
    if (!presentIdsRef.current.includes(id)) return;

    setActiveId(id);
    releaseRef.current();
    lockedRef.current = true;

    const release = () => {
      clearTimeout(timer);
      window.removeEventListener("scrollend", release);
      releaseRef.current = () => {};
      lockedRef.current = false;
      resolveRef.current();
    };

    const timer = setTimeout(release, SCROLL_RELEASE_FALLBACK);
    window.addEventListener("scrollend", release);
    releaseRef.current = release;
  }, []);

  return { activeId, select };
}
