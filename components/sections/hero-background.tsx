/**
 * Fondo del hero: tres capas dentro de una caja que se desborda por debajo del
 * contenido (1024 de alto contra 826 de hero en desktop), para que la sección
 * siguiente arranque pisándola, como en el diseño.
 *
 * Cuidado con dos cosas, que son frágiles a un cambio inocente:
 *
 * 1. `-z-10` funciona porque la `<section>` que la contiene NO crea contexto de
 *    apilado. Si alguien le agrega `isolate`, `z-*`, `transform` u `opacity`,
 *    el fondo pasa a pintarse ENCIMA del contenido de las secciones siguientes.
 *    Por lo mismo, ningún ancestro puede tener fondo propio.
 * 2. `overflow-hidden` va acá y nunca en la `<section>`: en la sección
 *    recortaría el desborde, que es justo lo que tiene que verse. Acá es
 *    además lo que garantiza cero scroll horizontal, porque el arte mide más
 *    que el viewport.
 *
 * La capa base sólida no es decorativa: el arte mide 101.95% del ancho del
 * contenedor de alto, así que por debajo de ~1004px de viewport no llega a
 * cubrir los 1024 y quedaría una franja sin pintar. Y en mobile el arte va al
 * 75%, o sea que deja pasar lo que tenga debajo.
 */
export function HeroBackground() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-4 -z-10 h-hero-mobile overflow-hidden bg-background desktop:top-0 desktop:h-hero-desktop"
    >
      <div className="hero-art-mobile absolute inset-0 opacity-75 desktop:hero-art-desktop desktop:opacity-100" />
      <div className="bg-hero-scrim-mobile absolute inset-0 desktop:bg-hero-scrim" />
    </div>
  );
}
