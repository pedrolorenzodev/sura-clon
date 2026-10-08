# DESIGN — SURA Gaming

> Fuente de verdad visual y de interacción. Se lee **antes de tocar UI**, que en la Fase 2 sólo
> pasa con autorización explícita. La UI está congelada desde el 2026-10-07.
> Los valores viven en `app/globals.css` y se ven en `/styleguide`: acá no se repiten.
> El detalle histórico de cada decisión está en `docs/archive/PRD-fase1.md`.

## 1. Concepto

- **La interfaz es el HUD de un juego** que se enciende, apunta y suma puntos. Las cards tienen
  corchetes de mira, los títulos se encienden con un barrido, los labels se decodifican, los
  puntos ruedan como un marcador arcade.
- **Dark-only.** No hay tema claro ni clase `.dark`: las utilities `dark:` de shadcn quedan inertes.
- **Curvas que frenan en seco** (`--ease-lock`, `--ease-scan`, `--ease-reveal`). Sin rebotes.
- **Un efecto protagonista por zona.** Si una pieza ya se mueve, lo de al lado se queda quieto.
- **UI en español con voseo** ("Unite", "Reclamá"), copy de juego. URLs en inglés, anclas en español.
- **El verde de marca es para lo accionable explícito**: CTAs, Reclamar, el pill activo, links
  "Ver todo". En una card entera se lee como alarma.

## 2. Fuente de verdad

| Qué | Dónde |
|---|---|
| Diseño | Figma `uuh0qonxt0qkmKJku7jSUd` (Sura Gaming UX/UI · Copy). Home desktop `3628:74971` (1440), mobile `3567:88242` (390) |
| Nodos por bloque | Registro de bloques, § 9 de `docs/archive/PRD-fase1.md` |
| Tokens | `app/globals.css`, `@theme static` (sin `static`, `/styleguide` lee vacío) |
| Catálogo visual | `/styleguide` (`app/styleguide/page.tsx`, lista en `lib/data/design-tokens.ts`) |

- Ante una diferencia entre Figma y `app.suragaming.com`, manda Figma. El live muestra el diseño viejo.
- El archivo viejo (`9XB4HoW0POtA24p3AXuj7I`) está obsoleto.
- Varias pantallas no tienen frame (404, Sura News, detalle de evento mobile, Juegos y Footer
  mobile): son diseño propio, aprobado con propuestas. El mobile del Figma está incompleto y sus
  títulos de sección traen typos ("eventos" repetido).
- **El MCP de Figma aplana degradés, infla opacidades y esconde controles detrás de un `<img>`.**
  Ante la duda sobre un color, se mide el render; ante un nodo que vuelve como imagen, se abre el SVG.

## 3. Tipografía

Tres familias locales vía `next/font`. Monument y KH son versión TRIAL: sirven para este proyecto,
no para producción.

| Familia | Utility | Uso |
|---|---|---|
| Monument Extended | `font-display` | H1 del hero, títulos de ruta, banners, título de detalle. Uppercase, tracking negativo en `em` |
| KH Interference | `font-techno` | Labels de HUD: CTAs, títulos de card, tabs, contadores, pills de puntaje |
| Inter | `font-sans` | Cuerpo, nombres de usuario, tooltips, legales |

- **KH no tiene minúsculas.** Todo texto en `font-techno` lleva `uppercase`: protege el fallback
  mientras carga y deja el markup explícito. De KH sólo hay Regular y Bold.
- La escala completa (`--text-*`, cada uno con su line-height y tracking) está en `/styleguide`.
- TT Firs Neue aparece en algunos frames y no se usa: se unificó en Monument o KH.

## 4. Color

| Familia | Para qué |
|---|---|
| Fondo `#202020` (`--color-background`) | La página. Los scrims se funden a este color |
| Marca `#a5e04a` (`--color-brand`) | Pill activo, hover de íconos, CTAs, foco. No está publicado como variable de Figma |
| `--color-brand-vivid` | Bordes y glows neón (banner de Juegos, "Tu posición", escaneo del hero) |
| `--color-brand-legacy` / `-faint` | El verde viejo que sobrevive en el borde de la miniatura activa y de las cards de torneo |
| Dorada, plata, bronce (`--color-gold*`, `--color-silver*`, `--color-bronze*`, `--color-rank-*`) | Sólo premios, podio y medallas |
| Promo (`--color-promo*`) | El banner violeta del Home |
| Superficies (`--color-surface`, `-2`, `-3`, `-deep`, `-done`, `-ended`) | Cards, badges, paneles. Los escalones de hover suben un nivel de superficie |
| Bordes (`--color-border`, `-muted`, `-light`, `-dim`, `-done`, `-panel`) | Anillos y separadores |

Los degradés son tokens `--gradient-*` con su `@utility` (`bg-*` o `border-gradient-*`).

## 5. Breakpoints y grilla

- **Dos layouts y nada más.** `--breakpoint-*: initial` deja un solo prefijo, `desktop:` (768px).
  `sm:`, `md:`, `lg:`, `xl:` y `2xl:` no existen. Mobile-first: la base es mobile, `desktop:` el override.
- **Tramos:**

| Ancho | Qué se ve |
|---|---|
| ≤ 767 | Diseño mobile, fluido. A 390 es idéntico al Figma |
| 768 – 1099 | El desktop maquetado a 1100, escalado con CSS `zoom` (`lib/desktop-zoom.ts` escribe `--desktop-zoom` antes de pintar) |
| ≥ 1100 | Desktop fluido. A 1440 es idéntico al Figma |

- Todo lo que mezcla rects y scroll bajo zoom pasa por `lib/css-zoom.ts`. Bajo `zoom`, en WebKit,
  nada de `calc()` que mezcle `%` y `px` en un ancho.
- `DESKTOP_MIN_WIDTH` (`lib/desktop-zoom.ts`) y `--breakpoint-desktop` tienen que coincidir.
- **Grilla del Home:** columna de 1144 (`--container-page`) con gutters de 148; el izquierdo aloja
  el riel. Cards de 4 × 268 con gap 24. Leaderboard + Medallas 657 + 120 + 367 a 1440.
- **Rutas internas:** columna fluida a 40 de cada borde (`--spacing-route-edge`). Arriba de 1440 estira.
- **Mobile:** gutter 24 en secciones (`--spacing-gutter`), 16 en header y rutas (`--spacing-route-gutter`).
  Grillas de cards con `card-grid` / `card-grid-wide`.
- **Entre secciones:** 80 en desktop, 40 en mobile (`--spacing-section-gap`, `-mobile`).
  Título de sección → contenido: 16 (`--spacing-title-gap`).

## 6. Navegación

- **El menú scrollea a secciones del Home, no rutea.** Seis ítems (Home, Eventos, Leaderboard,
  Misiones, Sura News, Juegos), anclas `#seccion` con `scroll-margin-top`. Todo pasa por
  `SectionLink` (`components/layout/section-link.tsx`): la URL queda en `/` y Cmd+click sigue abriendo
  `/#seccion`.
- **Desktop:** riel flotante vertical de 60 de ancho en el gutter izquierdo, centrado contra el hero.
  Tooltip a la derecha (sale del live, no del Figma). Hover del ícono a `--color-brand`.
- **Mobile:** bottom bar de vidrio, alto 80, al ancho del contenido. Íconos en `--color-nav-icon`,
  no blancos. Sin tooltip. Respeta la safe-area (`bottom-nav-safe`).
- **Pill activo:** una sola capa que viaja con `transform` (`nav-pill-y` / `nav-pill-x`, índice en
  `--nav-index`). El ícono activo cambia de color cuando el pill llega.
- **Scroll-spy** (`lib/use-section-spy.ts`): `IntersectionObserver` como disparador y medición con
  `getBoundingClientRect` al decidir. Un click bloquea el spy hasta que el scroll se asienta.
- **Íconos del menú:** SVG inline por partes (`components/layout/nav-icon.tsx`), cada uno con su
  animación corta en hover y al quedar activo.
- **Fuera del Home** el riel se desliza a la izquierda (`nav-rail-away`) y la bottom bar baja
  (`nav-bar-away`); quedan `inert`. En mobile aparece la flecha de volver en el header.
- **Persiana entre rutas:** View Transition nativa. Un panel oscuro con filo verde cruza en diagonal
  (`route-shutter`) y la pantalla cambia a la mitad, tapada. Hacia atrás (`nav-back`) cruza al revés.
  Header y riel se funden con su propia captura (`vt-header`, `vt-rail`).
- **Chrome de ruta:** `RouteShell` (`components/layout/route-shell.tsx`), H1 en Monument con barrido.
- **Scroll:** Lenis en desktop (`components/layout/smooth-scroll.tsx`), nativo en mobile y con
  movimiento reducido. Scrollbar propia en desktop, de la altura del riel.

## 7. Vocabulario de hover

El Figma no define hovers. Hay cuatro recetas; un hover nuevo es una de estas.

| Receta | Dónde | Qué hace |
|---|---|---|
| **Elevación** | Cards con imagen (Juegos, Misiones, Sura News, Torneos) | Sube 2px con `translate`, sombra negra `--shadow-card-hover`, un escalón en su propio gris (borde o superficie), zoom 1.05 de la imagen. Cero color |
| **Crecimiento** | Filas del Leaderboard | La fila crece con `flex-1` y empuja a las de abajo; la tabla no cambia de alto. Borde un escalón más presente. En tablas largas, velo en vez de crecimiento |
| **Glow de link** | "Ver todo", "Ir a Sura News", íconos del footer | `--drop-shadow-link-hover`. Sólo para elementos chicos que ya son verdes |
| **Corchetes de mira** | Misiones, destacadas, Sura News, Torneos, Eventos | `CardBrackets` (`card-bracket`): cuatro esquinas verdes que se dibujan por fuera de la card. Juegos no los lleva |

Lo que comparten:

- **El movimiento es la señal fuerte; el color sólo acompaña.**
- Siempre `focus-visible:` en pareja con `hover:`, y `motion-reduce:transition-none`.
- Si una propiedad tiene override `desktop:`, el hover se escribe también como `desktop:hover:`.
- 200 ms para sombra, color, borde y el lift de 2px (con `--ease-reveal`); 250 ms para el zoom.
- Al apretar, la card baja a `scale-98`: es la única señal en touch.
- El aire de la sombra se reserva con `lift-room` y se recorta con `lift-clip` en los carruseles.

## 8. Vocabulario de entrada y movimiento

| Efecto | Dónde | Cómo |
|---|---|---|
| Escaneo HUD | Bloque de texto del hero | `hud-scan`: una línea verde baja y revela con `clip-path` |
| Intro de PROJECT: Yi | Home, cada carga completa | Video sobre la página veilada (`intro-veil`, variante `intro-pending`); la UI entra con el golpe. Ver `lib/hero-intro.ts` |
| Cascada de filas + conteo | Leaderboard (Home y ruta) | `RevealList` + `row-reveal` + `CountUp`. No anima si ya se ve al cargar |
| Cascada de miniaturas | Slider del hero | `thumb-reveal` |
| Barrido de títulos | Títulos de sección y H1 de ruta | `TitleSweep` (`title-sweep`, `title-sweep-after-route`). Sólo hijos inline adentro |
| Decodificado de labels | "Ver todo", tabs, CTAs | `ScrambleText`, ancho fijo mientras corre |
| Barrido diagonal | CTAs, chips, paginador | `wipe` + `wipe-on` |
| Subrayado que viaja | Tabs de ruta | `RouteTabs` |
| Odómetro y "+N" | Contador de SP del header | `Odometer` + `odometer-digit` + `reward-pop` |
| Destello, inclinación, denegado | Podio, medallas | `PodiumSheen`, `medal-tilt`, `medal-glint`, `deny-shake`, `flicker` |
| Luz de borde | Banners del Mundial y del Home | `BorderLight` (`border-light`) |
| Reacomodo FLIP | Filtros, búsqueda y paginado | `FlipList` / `lib/use-flip-list.ts`, tokens `--flip-*`. La búsqueda espera 250 ms |
| Cascada de carruseles, texto en streaming | Detalles de juego y evento | `slides-reveal`, `StreamText` (`stream-word`) |
| Radar del estado vacío | Todas las colecciones | `EmptyResults` (`radar`, `blip-blink`) |
| 404 "Sin señal" | Carga completa de la 404 | `LostArrival` (`lost-arrival`, `lost-lead`); después, la línea del minimapa (`route-draw-x/y`) |

- **Movimiento reducido:** todo queda en su estado final desde el primer cuadro. El guard vive
  dentro de cada utility.
- Sólo `opacity`, `transform`, `clip-path` y máscaras: nada que mueva el layout.
- Lo que se evita a propósito: blur-in, rebotes, parallax, un efecto por elemento, animar el arte.

## 9. Sonido

- **Motor:** `lib/sfx.ts`. Volúmenes, carriles y límites en `lib/data/sfx.ts`. Un listener delegado
  (`components/layout/sfx-listener.tsx`) lee `data-sfx` y `data-sfx-hover`: cablear un elemento es
  sumar un atributo, sin volverlo cliente.
- **Qué suena:** hover de lo accionable (las cards, más bajo con `data-sfx-hover="soft"`), clic,
  selección (menú, flechas, tabs, chips, paginador), ida y vuelta de ruta sincronizadas con la
  persiana, Reclamar, bloqueado, tecleo en buscadores, llegada a la 404. Música de fondo sólo en desktop.
- **Mudo a propósito:** hover de chips y footer, scroll-spy, barridos de títulos, conteos, odómetro,
  click en medalla obtenida, toggle de sonido, lo que ya está seleccionado.
- **Límites:** un hover cada 110 ms y ninguno mientras suena el anterior; carriles que funden al
  anterior; tope de 6 voces; jitter de afinación y volumen.
- **Nada suena antes del primer gesto** (política de autoplay; no tiene arreglo legítimo).
- Toggle de efectos y de música en el header, preferencia guardada, la tecla **M** apaga y prende los dos.

## 10. Política de normalización

1. Si el valor cae a ≤ 2 px de un token existente, se usa ese token.
2. Si no, se redondea al entero más cercano (o a `.5`) y se crea token.
3. El tracking va en `em`, no en px.
4. Cards hermanas que difieren se unifican al valor de la primera.
5. Nunca fijar anchos de hijos dentro de una fila: se fija el contenedor y el resto se reparte
   con `flex-1` / `grid`.

## 11. Qué no hacer

- Verde en una card entera, ni en títulos de card al hover.
- `transparent` en un stop de degradé: va el mismo color con alfa 0.
- Librerías de motion. Todo es CSS, Web Animations o View Transitions.
- Blur-in, rebotes, parallax.
- Breakpoints intermedios o prefijos responsive que no sean `desktop:`.
- Redibujar, inline-ar o sustituir un asset del diseño; ni URLs temporales de Figma.
- Strokes de medio píxel: se redondean al entero de arriba. Bordes que no deben sumar tamaño van
  como `ring-1 ring-inset`.
- `style={{…}}` salvo un valor calculado en runtime pasado como custom property.
- Un `group` sin nombre en un contenedor grande.
- Utilities propias con prefijo de Tailwind (`fill-`, `text-`, `bg-`…) que convivan en un mismo `cn()`.

## 12. Cómo se extiende

Sólo con autorización explícita.

1. **Token nuevo:** se agrega en el `@theme` de `app/globals.css`, se cataloga en
   `lib/data/design-tokens.ts` (si no, no aparece en `/styleguide`) y se anota en `docs/DECISIONS.md`.
2. **Primitive nuevo:** shadcn (estilo `base-nova`, Base UI: `render`, no `asChild`), re-estilado con
   los tokens.
3. **UI sin definición precisa** (animación, estado sin frame, pantalla sin diseño): primero una
   propuesta en un Artifact con demos en vivo y opciones comparables; se implementa recién cuando
   el usuario elige.
4. **Verificación:** `npm run verify` y `npm run visual`; lo que cambió a propósito se le muestra al usuario, y la referencia la regenera él.
