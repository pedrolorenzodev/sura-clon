# PRD — SURA Gaming (clon pixel-perfect)

> Documento vivo. Se actualiza en cada implementación.
> El **proceso de trabajo** (reglas, prohibiciones, verificación) vive en [`AGENTS.md`](./AGENTS.md)
> y no depende del target. **Acá vive todo lo específico del target.**
> Si cambiamos de app a clonar, se reescribe este archivo y `AGENTS.md` no se toca.
> Checklist de migración al final (sección 12).

---

## Target actual

| | |
|---|---|
| **App** | SURA Gaming — `app.suragaming.com` |
| **Figma** | [Sura Gaming UX/UI](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-) — Home [`desktop`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-74971&m=dev) · [`mobile`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3567-88242&m=dev) |
| **Empresa** | Sura GG Corp., ecosistema gaming LATAM. *Sin relación con la aseguradora SURA.* |
| **Navegación** | Difiere por tamaño: menú flotante lateral en desktop, bottom bar en mobile. **Modelo a confirmar** (ver sección 5) |
| **Idioma UI** | Español |

> **Rediseño, 2026-09-18.** Este es el archivo **nuevo** y es la única fuente de verdad.
> El archivo anterior (`9XB4HoW0POtA24p3AXuj7I`) quedó obsoleto: no se consulta más.

---

## 0. Decisiones tomadas sin consulta

### 2026-09-25 · Sonido e íconos del menú

> Corrida autónoma de la implementación del sonido y de los íconos animados, con el usuario
> ausente. Lo que decidió el usuario antes de irse está en § 5, *Sonido*. Esto es lo que hubo que
> resolver solo, con la alternativa descartada.

| # | Qué se eligió | Por qué | Qué se descartó |
|---|---|---|---|
| 1 | **El listener de sonido vive en `SiteChrome`**, no en el layout `(site)` | La 404 renderiza `SiteChrome` por fuera de `(site)`: con el listener en el layout tenía toggle pero no sonaba ni respondía a la M | Montar un segundo listener en la 404 |
| 2 | **El hover no suena cuando un elemento pasa debajo de un mouse quieto** | Los tres motores disparan `pointerover` al scrollear: medido, 17 sonidos en 20 pasos de rueda. Se descarta el evento si trae las mismas coordenadas que el último `pointermove` | Dejarlo sonar |
| 3 | **El foco sólo suena si viene del teclado** (una tecla en los últimos 600ms) | Un foco que devuelve el código, como al cerrar un menú, no es una acción del usuario | Sonar con cualquier `:focus-visible` |
| 4 | **Cmd/Ctrl/Shift-click y el click del medio en un link son mudos** | Abren otra pestaña: la pantalla no cambia | Sonar la ruta |
| 5 | **Los sonidos se bajan aunque el sonido esté apagado**, pero el `AudioContext` no se crea hasta prenderlo | Son 21 KB y así prender el toggle suena en el acto | No bajarlos hasta prender |
| 6 | **El primer gesto también arranca la descarga** si todavía no había empezado | Antes, un click antes del `load` quedaba mudo hasta el segundo. Un gesto real significa que la página ya pintó | Esperar siempre al `load` |
| 7 | **Los ticks del odómetro suenan también con movimiento reducido** | El sonido no es movimiento. Lo único que cambia con movimiento reducido es la persiana, que suena como un clic porque no hay panel | Silenciarlos |
| 8 | **El banner entero suena `click`, sin hover** (el botón estirado de "Jugar ahora") | Lleva al mismo destino que el CTA | Dejarlo mudo |
| 9 | **"Ir a Sura News" y el "Ver todo" que es botón suenan `click`** | Son botones sin destino todavía, igual que el resto de los botones inertes que suenan | Sólo hover |
| 10 | **Shift+M también silencia** | Con Shift o Bloq Mayús la M sigue siendo la M | Sólo la m minúscula |
| 11 | **El botón del joystick se aprieta (1 → 0,5 → 1)**, como en la demo aprobada | La spec interna decía 0,5 → 1; manda lo que vio el usuario | Seguir la spec |
| 12 | **La animación de hover del ícono corre entera** aunque el mouse se vaya (ventana de 900ms, con JS) | Con `:hover` puro, pasar rápido por el riel cortaba cada animación a la mitad | CSS puro |
| 13 | **El ícono que queda activo no se anima hasta la primera interacción real** | Al recargar a mitad del Home el scroll-spy corregía el activo a los ~200ms y animaba un ícono en la carga | Animar siempre |
| 14 | **La unión del tallo y la copa del trofeo difiere 5px del render anterior** (Δ ≤ 25) | Tienen que ser dos formas para que la copa se mueva sola sobre la base | Una sola forma y la copa quieta |
| 15 | **A 320px, en las rutas internas, el nombre del usuario desaparece** | Flecha, avatar, contadores y toggle ocupan la fila entera. A 360 quedan 35px de nombre y a 375, 50. Nada se desborda | Achicar los gaps del header mobile, que es tocar un diseño aprobado |
| 16 | **El "Ver todo" de Sura News en mobile no se arregló** | Es un bug anterior: el aire de sombra de la lista de cards le tapa el centro al tocarlo. Queda en la deuda | Arreglarlo en esta tanda |

### 2026-09-21 · `/leaderboard` y `/games`

> Corrida autónoma de `/leaderboard` y `/games`, sin nadie del otro lado. Todo lo que había
> que resolver solo está acá, con la alternativa que se descartó. **Es lo primero que hay que
> revisar.** El detalle largo de cada una vive en el changelog del DS, en la deuda de diseño
> o en las notas de implementación de § 6.

| # | Qué se eligió | Por qué | Qué se descartó |
|---|---|---|---|
| 1 | **El H1 sigue siendo el de `RouteShell`** (Monument uppercase) aunque los dos frames lo escriben en TT Firs Neue | Los tamaños coinciden al píxel (32/28 y 24); sólo cambia la familia. `RouteShell` ya sirve a 15 rutas y salió de dos frames que coinciden entre sí. § 6, normalización punto 4 | Cambiar `route-shell.tsx` a `font-techno`, que habría movido `/tournaments` y `/missions`, ya maquetadas |
| 2 | ~~El título del banner de `/games` va en `font-techno` (KH)~~ → **corregido por el usuario (2026-09-21): va en `font-display`, como el mismo banner del Home** | Pedido explícito. Monument necesita 523px con su tracking de -0.0625em, así que la caja pasó de los 486 del diseño a **530**, que es la del banner del Home | KH, que entraba en 486 pero dejaba la misma promo en dos familias distintas según la pantalla |
| 3 | **No se implementó el hover que el diseño dibuja en la card de `/games`** (glow verde + botón "Ver Juego") | El usuario descartó el verde en estas cards el 2026-09-20 ("lo quería oscuro y sutil"), y la card entera ya es un link: el botón duplica la acción | Implementarlo tal cual. **Es el desvío más grande de la corrida** |
| 4 | **No se maquetó el bloque "Mini juego"** de `/games` mobile | En el frame desktop el mismo componente está **oculto**. Maquetarlo dejaría contenido en mobile que desktop no tiene | Maquetarlo mobile-only |
| 5 | **La card de `/games` mobile es la de desktop adaptada** | El frame mobile la dibuja con el lenguaje viejo (miniatura 4:3 + texto). Mismo caso que Sura News, que el usuario ya resolvió así, y es como se ve la sección Juegos del Home en mobile | Maquetar dos cards distintas |
| 6 | **El buscador lleva el ícono a la izquierda en los dos tamaños** | Tres de los cuatro frames lo ponen ahí; sólo `/leaderboard` mobile lo manda a la derecha | Una prop para el lado del ícono, o seguir cada frame |
| 7 | **En mobile se muestran tabs y chips en vez del botón `FILTRAR`** de `/leaderboard` | Es el precedente de Misiones: el panel que abriría no está diseñado, y mostrarlos no inventa nada | Maquetar el `⚙ Filtrar` inerte |
| 8 | **En `/games` mobile sí se maquetó el ícono de filtro**, inerte | Ahí el control **tiene referente en desktop** (los 4 dropdowns), que es justamente el caso que el pedido marcaba como "se maqueta inerte" | Omitirlo, como en `/leaderboard` |
| 9 | **El hover de una fila de la tabla es un velo, no el crecimiento del Home** | El *hover de crecimiento* funciona porque las 5 filas del Home se reparten una altura fija; acá son 11 filas sin altura contenedora y crecer empujaría la página entera | Reusar el crecimiento y aceptar el salto |
| 10 | **Las tres primeras filas usan degradés opacos de cinco stops** | Figma interpola el alfa sin premultiplicar y CSS al revés: la traducción literal se iba 13 niveles. Los cinco stops dejan Δ ≤2 | Traducir el `rgba()` literal |
| 11 | **El anillo de las medallitas va a 1px al 30 %** | El MCP declara 0,25px, pero el render de Figma lo pinta como **un píxel entero al 31 %**. Respeta además la política de redondear strokes | Dejar 0,25px, que en pantallas no-retina no se ve |
| 12 | **SabooMafoo es "Héroe"** en toda la pantalla | El podio dice Héroe y la fila 03 dice Guerrero, en el mismo frame. Héroe es además lo que ya decía la data del Home | Replicar la contradicción |
| 13 | **Las tres cards del podio se unifican en gap 8** | La del 2º puesto usa 12 y sale 3px más alta que las otras dos | Replicar los 3px |
| 14 | **El podio y la tabla usan la data del frame desktop** | El mobile trae otros tres nombres y 473 puntos en todas las filas. Mismo criterio que el podio del Home | Duplicar la data por tamaño |
| 15 | **Mobile muestra las 12 cards de `/games`**, no las 6 del frame | El frame mobile corta por pantalla, no por lista | Ocultar seis con `hidden desktop:block` |
| 16 | **El paginador mobile va centrado**, como el de `/leaderboard` | El frame de `/games` lo reparte contra los bordes; el de `/leaderboard` lo centra. Es el mismo control | Seguir cada frame |
| 17 | **Se generalizaron cuatro componentes ya aprobados** — tabs, chips, buscador y paginador | El pedido priorizaba reusar. Los tres verificados sin movimiento: `/missions` con los tabs en 160 × 44, `/tournaments` en 1508px, el Home en 4156 / 4046 | Duplicar los componentes por pantalla |
| 18 | **Los tabs estrenan el hover que el propio diseño dibuja** (fondo `white/3` + texto blanco) | El frame de `/leaderboard` muestra un tercer tab en ese estado. Antes el hover era nuestro (`text-muted-foreground`) | Dejar el hover viejo y perder información del diseño |
| 19 | **El ícono "info" del título mobile no se maquetó** | No tiene comportamiento definido y sólo existe en mobile. Es la misma decisión que ya se había tomado para el mismo ícono en el Home | Maquetarlo sin acción |
| 20 | **`/tournaments` cambió**: perdió `tournaments-search.tsx` y ahora usa el buscador compartido | Era el mismo control duplicado. Verificado que no se movió un píxel | Dejar los dos componentes |

---

## 1. Objetivo

Replicar **pixel-perfect** la UI de `app.suragaming.com` a partir de los diseños de Figma,
en dos tamaños: **Desktop** y **Mobile**.

### Fase 1 — Maquetado (actual)

Solo UI. Toda la data es hardcodeada. El foco está 100% en que el render coincida con el diseño.

### No-objetivos de la Fase 1

- Backend, API, base de datos, autenticación.
- Estados de carga/error reales, paginación, búsqueda funcional.
- i18n.
- Animaciones de scroll, parallax, transiciones de página.
- Breakpoints intermedios (tablet). **Fuera de scope** — decisión permanente, ver `AGENTS.md` regla 7.
- SEO avanzado, analytics, tests automatizados de UI.

---

## 2. Stack

| | |
|---|---|
| Framework | Next.js **16.3.5** (App Router, Turbopack) |
| React | **19.2.8** |
| TypeScript | **5.9.3** (`strict: true`) |
| Estilos | **Tailwind v4.3.3** — CSS-first, sin `tailwind.config.ts` |
| UI primitives | **shadcn/ui** — estilo `base-nova`, sobre **Base UI** (no Radix) |
| Iconos | `lucide-react` |
| Alias | `@/*` → raíz del repo (no hay `src/`) |
| Fuentes | **Monument Extended** (display) y **KH Interference** (techno) locales vía `next/font/local`; **Inter** (sans) desde Google |
| Verificación visual | **Playwright** (screenshots) + revisión del usuario |

> **Base UI, no Radix.** Los triggers custom usan la prop `render`, **no** `asChild`.

### Notas de Next 16 que muerden

- `params` y `searchParams` son **`Promise`** — hay que `await`.
- Los layouts usan el tipo global generado `LayoutProps<"/ruta">`, no un tipo escrito a mano.
- Turbopack es el bundler por default.
- `middleware` se renombró a `proxy`.
- Antes de escribir código, leer la guía en `node_modules/next/dist/docs/`.

---

## 3. Referencia

- **Diseño (fuente de verdad):** Figma — `uuh0qonxt0qkmKJku7jSUd` (Sura Gaming UX/UI · Copy).
  - Home desktop → node `3628:74971` ("Home v.02") — https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-74971&m=dev
  - Home mobile → node `3567:88242` ("Home: Rediseño") — https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3567-88242&m=dev
- **Sitio original (solo referencia):** `app.suragaming.com` — ojo, el live todavía muestra el
  diseño viejo. **No sirve como referencia de este rediseño.**
- La empresa es **Sura GG Corp.**, ecosistema gaming LATAM. *Sin relación con la aseguradora SURA.*

> Ante cualquier diferencia entre el Figma y el sitio live, **manda el Figma**.

> **Excepción acotada:** si un elemento **no existe en el Figma** pero sí en el live, el live
> es la única referencia posible y se usa — solo para ese elemento, y queda anotado. Hasta hoy
> pasó una vez: el tooltip de hover del menú flotante (2026-09-18). Ojo con el texto: el live
> está en **inglés** ("Events", "Missions") y la UI del rediseño va en español.

---

## 4. Widths de los frames

La **estrategia** de dos breakpoints es permanente y vive en `AGENTS.md` (regla 7).
Acá van solo los valores, que sí dependen del target.

| | Width del frame Figma | Alto del frame | Estado |
|---|---|---|---|
| Mobile | **390 px** | 844 px (una pantalla, ver sección 5) | ✅ Confirmado |
| Desktop | **1440 px** | 4138 px | ✅ Confirmado |

Los widths de los frames son los de `VIEWPORTS` en `scripts/shot.mjs`: mobile 390 · desktop 1440.

### Breakpoint: 1100px, con el mobile topado en 430

**Actualizado el 2026-09-23** (usuario). Antes el corte era **391px** (decisión del 2026-09-18,
para que una ventana de 1339px no cayera en mobile): de 391 para arriba mandaba desktop, y entre
391 y ~1300 el layout desktop se recortaba o se aplastaba. Medido: el podio de `/leaderboard`, los
controles de `/games`, Sura News y los badges del footer se cortaban debajo de ~1000; el título
del hero desbordaba debajo de ~1100; y Medallas se desarmaba debajo de 1366 (celda de 106px a
1440, 53 a 1280, 22 debajo de 1200).

Ahora son tres tramos, sin un tercer breakpoint (`AGENTS.md` regla 7 sigue en pie):

| Ancho | Qué se ve |
|---|---|
| ≤ 430 | El diseño mobile, fluido. **390 no cambió un píxel.** |
| 431 – 1099 | El mismo layout mobile en una **columna centrada de 430** (`--container-mobile`, el iPhone más ancho), con el fondo de página a los costados. Sin tope, a 800–1099 las medallas y las cards de Juegos quedaban gigantes y la bottom bar de borde a borde. El `<body>`, el header fijo y la bottom bar llevan `max-w-mobile`. |
| ≥ 1100 | El diseño desktop (`--breakpoint-desktop: 1100px`). **1440 no cambió un píxel.** |

Dentro de desktop, dos piezas pasaron de medidas fijas a **proporciones que a 1440 dan exactamente
el mismo valor**:

- **Título del hero** (`--text-display-fluid`): `min(64px, columna × 64/927)`. La columna mide
  `100vw − 513` (gutter + padding + gap + columna del slider, todos tokens) y a 1440 son 927, justo lo
  que ocupa el título en 2 líneas. Queda en **2 líneas en cualquier ancho** (35px a 1100, 53 a 1280).
- **Leaderboard + Medallas**: la columna del Leaderboard es 657/1144 de la fila y el gap 120/1144
  (`--spacing-leaderboard-share` / `-gap-share`); Medallas se queda con el resto. A 1144 da 657 / 120
  / 367. Más angosto escalan juntas: el círculo de la medalla mide 86 a 1440, 69 a 1280 y 50 a 1100.
  El podio aguanta hasta 1100 sin que el pill se salga de la card —por eso el corte está ahí—; los
  nombres largos se truncan con `…`, que es para lo que está el `truncate`.
- Y los badges de las cards de Juegos no parten su texto (`whitespace-nowrap`): si no entran, pasan a
  una segunda fila.

**Verificado:** 390 y 1440 idénticos al píxel en las cinco rutas; cero desbordes de texto ni recortes
en 15 anchos entre 400 y 1920; cero scroll lateral en 19 anchos × 6 rutas (salvo `/styleguide`, que
ya desbordaba a 390 y es de uso interno); menú, scroll-spy, navegación entre rutas, logo, header,
animaciones de entrada, conteo del leaderboard y carruseles funcionando a 430, 800 y 1100, sin
errores de consola.

### Grilla

La grilla del rediseño cierra exacta, sin asimetrías:

| | Valor |
|---|---|
| Columna de contenido desktop | **1144 px** (`--container-page`) |
| Gutters desktop | **148 px** a cada lado. El izquierdo aloja el menú flotante (60 px de ancho, a 44 del borde) |
| Grilla de cards | 4 columnas de 268 + 3 gaps de 24 = 1144 |
| Leaderboard + Medallas | 657 + gap 120 + 367 = 1144 |
| Cards de Torneos | 365 de ancho, gap 24 |
| Título de sección → contenido | 16 px |
| Entre secciones | 80 px |
| Nav | `px-40 py-24`, alto 106 |
| Gutter mobile | **24 px** en secciones · 16 px en el header |

---

## 5. Navegación

**El rediseño cambió el modelo y ahora difiere por tamaño.**

| | Qué hay |
|---|---|
| **Desktop** | Nav superior (logo + saldo + perfil) **y** menú flotante vertical a la izquierda: 60 de ancho, a 44 px del borde, centrado dentro del gutter (`col-izq`, 148 × 720, nodo `6008:26347`). El Figma trae 7 ítems; se maquetan **6** (ver abajo) |
| **Mobile** | **Bottom bar del Figma** (`3567:92009`): 375 × 80, radio 16, borde `#494949`, `backdrop-blur`, `px-10` y sombra "Shadow 3". Con **nuestros ítems** (las 6 secciones) y el pill verde de desktop en vez de los destinos de app, ver abajo |

**El header va fijo arriba y siempre visible.** En el top queda sobre el hero con el fondo casi
transparente del diseño (decisión del usuario, 2026-09-18). **En mobile, apenas se scrollea, toma
vidrio**: `backdrop-blur-nav` —el mismo blur de la bottom bar— más `bg-background/60`, con un
fundido de 200ms (usuario, 2026-09-23). El blur solo no alcanzaba: sobre el arte de Fortnite de
Sura News el contraste del nombre bajaba a **1,2:1**; con el fondo al 60% el peor punto del Home da
**4,8:1** (AA), contra 2,8 al 40% y 9,0 al 80%. En el top el header del Home queda **idéntico al
píxel** al de antes, y desktop no cambia en ningún estado.

**En mobile es el mismo header en todas las rutas** (usuario, 2026-09-23): `solid` pasó a ser
`desktop:bg-background`, así que en una ruta interna mobile el header también arranca casi
transparente y toma el vidrio al scrollear. En el top no hay nada debajo más que el `#202020` de la
página, así que el cambio es el `bg-white/1` del diseño: **2 niveles** más claro que el sólido de
antes, el mismo que ya tiene el Home. Verificado en `/tournaments`, `/missions`, `/leaderboard` y
`/games`: el nombre se lee sobre texto, sobre el CTA verde del banner y sobre una portada roja.

> La status bar de iOS y el home indicator del frame mobile son chrome del dispositivo y
> **no se maquetan**. Tampoco la "Progress bar" que está oculta dentro del header mobile.

### Modelo: scroll a sección ✅ Confirmado

Decisión del usuario, 2026-09-18 (bloque 2): el menú **scrollea a las secciones del Home**,
no rutea. Se implementa con anchors (`href="#seccion"`) contra `<section id="seccion">`, con
`scroll-margin-top` = `--spacing-header-desktop` y `scroll-behavior: smooth` envuelto en
`prefers-reduced-motion: no-preference` (ya está en `app/globals.css`).

### Ítems del menú flotante desktop

Solo entran las secciones que **tienen contenido en el Home**, en este orden — que **no** es
el del Figma. Lo pidió el usuario y manda sobre el orden del diseño.

| # | Ítem | Ancla | Ícono (tamaño nativo del export) |
|---|---|---|---|
| 1 | Home | `#home` | 26 px — **seleccionado**, pill verde |
| 2 | Eventos | `#eventos` | 26 px |
| 3 | Leaderboard | `#leaderboard` | 24 px |
| 4 | Misiones | `#misiones` | 18 px |
| 5 | Sura News | `#sura-news` | 20 px |
| 6 | Juegos | `#juegos` | 24 px |

El séptimo ítem del Figma, **Niveles**, queda fuera: no tiene sección en el Home. Vuelve
cuando exista la pantalla.

Los ítems son solo íconos: el nombre accesible va en un `sr-only` y el activo lleva
`aria-current`.

**El slider del hero es un carrusel** desde el 2026-09-20 (pedido del usuario): flechas arriba
y abajo en desktop, a los lados en mobile, con el chevron de trazo 1.5 de las de Eventos. Acá
**no se apagan en las puntas**: el carrusel da la vuelta, así que siempre hay destino. Avanzaba
solo cada 3s (`hero.autoplayMs`), frenándose con el puntero o el foco encima, con la pestaña
oculta y con `prefers-reduced-motion`. **Desde el 2026-09-24 el avance automático está apagado**
(`autoplayMs: null`, pedido del usuario) para que siempre se vea el slide con el video; el
código sigue en `hero-slide-context.tsx` y vuelve con volver a poner 3000.

**Los slides, desde el 2026-09-24:** League of Legends (PROJECT: Yi, **el default**, con intro —
ver *Intro de PROJECT: Yi*, § 6) · Valorant (el loop de Jett) · Fortnite · Black Ops 6. Modern
Warfare III se sacó para dejar lugar, y sus dos archivos se borraron.

**Estado activo:** arranca en Home y lo escriben el scroll y el click (ver Scroll-spy, abajo).
Vive en `SectionNavProvider` (`components/layout/section-nav-context.tsx`), montado en el layout
`(site)`, que lo comparten el menú, el logo del header y el CTA del hero.

### Scroll-spy ✅ Implementado (2026-09-19)

El pill sigue a la sección donde está el usuario. Vive en `lib/use-section-spy.ts` y lo
consume `components/layout/nav.tsx`, que ya era el dueño del estado: lo único que cambió es
**quién lo escribe**. Antes sólo el click, ahora también el scroll. La capa de animación no se
tocó — el pill viaja con `--nav-index`, así que le da igual de dónde salga el índice.

**Cómo:** un `IntersectionObserver` sobre las `<section id>` de `homeSections` que existen en
el DOM. Nada de listener de scroll — el observer sólo dispara cuando una sección cruza el
umbral, así que no hay trabajo por píxel ni re-render de más.

```
rootMargin: "0px 0px -60% 0px"   // la franja llega al 40% del viewport
```

**El criterio se reescribió el 2026-09-20** porque el pill cambiaba tarde: con la regla
anterior —franja al 30% y gana la más alta— la sección nueva recién tomaba el pill cuando la
anterior terminaba de salir por arriba, y para entonces ya ocupaba el **80-89% de la
pantalla**. Medido en las cinco transiciones.

Ahora la franja llega al **40% del viewport** y entre las que la tocan gana la **última**, o
sea la que acaba de entrar. Con eso el relevo cae cuando la sección nueva ocupa el **60-62%**,
y es simétrico: bajando y subiendo el umbral es el mismo (Δ ≤ 43px, que es el paso del
muestreo).

El borde de arriba ya no es una constante: sale del `scroll-margin-top` de cada sección, que
es exactamente donde el ancla la deja. Así vale 106 en desktop y 56 en mobile sin duplicar
nada.

**Una sección posada en su ancla gana sobre la banda.** Es lo que hace que el click siga
mandando: en mobile las secciones son más cortas que la franja del 40%, así que al clickear
Eventos la sección de abajo entraba a la banda y le robaba el pill. Si el scroll está a ±2px
del ancla de una sección, esa gana.

**Cómo quedaron las cuatro cosas que había que resolver:**

1. **El click pelea con el scroll.** Resuelto como estaba planeado: un `ref` que se levanta en
   el click y se baja en `scrollend`, con un timeout de respaldo de 700ms para los navegadores
   que no lo tienen. Al bajarse, el observer **recalcula** en vez de quedarse con lo que dejó
   el click, así que el estado siempre reconverge a la verdad.
2. **La última sección puede no llegar nunca a la franja de arriba.** Pasa hoy: en desktop el
   scroll máximo del Home son 279px y Eventos necesitaría 720 para cruzar el header. Se
   resolvió **sin listener de scroll**, con un segundo observer sobre la última sección
   (`threshold: [0.99, 1]`): es lo único que despierta al hook cerca del fondo, donde la franja
   de arriba ya no recibe a nadie. Ahí gana la última.
3. **`prefers-reduced-motion`** ya estaba resuelto aguas abajo. Verificado: el scroll es
   instantáneo, `scrollend` llega enseguida y el pill salta.
4. **Sin JS el menú sigue funcionando**: verificado con JavaScript deshabilitado, `/#eventos`
   scrollea igual. Lo único que se pierde es que el pill acompañe.

**Y dos que aparecieron al implementarlo:**

5. **Los ítems que todavía no tienen sección** (Leaderboard, Misiones, Sura News, Juegos) **no
   mueven el pill.** Decisión del usuario, 2026-09-19: ahora el pill significa una sola cosa
   —dónde estás—, así que marcar un destino que no existe sería mentir. El ancla sigue siendo
   un link de verdad y el hash se escribe; cuando la sección se maquete, el ítem funciona solo.
6. **Si la página no scrollea, el spy no opina.** Hoy el Home mobile mide menos que su propio
   viewport (390 × 844), así que clickear Eventos no scrollea nada y el observer devolvía el
   pill a Home a los 700ms: un rebote. Con la página entera a la vista no hay nada que espiar,
   así que el pill se queda donde lo dejó el click, que es el comportamiento que el menú tenía
   antes del spy. Se destraba solo cuando lleguen las secciones mobile que faltan.

**Se llevó puesta una inconsistencia que existía:** el logo del header también apunta a `#home`
(bloque 1) y antes scrolleaba al hero sin mover el pill. Ahora el pill sigue al scroll venga de
donde venga. Desde el 2026-09-23 el logo además es un `SectionLink` más: ver *La URL no guarda
la sección*, abajo.

**Tooltip en hover.** No está en el Figma: existe solo en `app.suragaming.com` y se replicó
midiendo el elemento real (decisión del usuario, 2026-09-18). Abre a la derecha del ítem, sin
delay, y también con foco de teclado — eso último lo suma el primitive, el live no lo tiene.

| Propiedad | Valor | De dónde sale |
|---|---|---|
| Posición | a la derecha, centrado vertical, gap 12 px | `side="right" sideOffset={12}` |
| Fondo | `#1A1A1A` | `--color-tooltip` (token nuevo) |
| Borde | 1 px `#494949` | `--color-border` |
| Radio | 12 px | `--radius-xl` |
| Sombra | `0 0 8px rgba(39,82,108,.3)` | `--shadow-nav` — la misma del menú |
| Padding | 8 / 12 px | `py-2 px-3` |
| Texto | Inter 14/20, regular, blanco, `nowrap` | `--text-sm` |
| Transición | fade 200 ms | la del elemento real |

Se implementó con el primitive **Tooltip de shadcn** (`components/ui/tooltip.tsx`), re-estilado
con nuestros tokens y sin flecha (el de referencia no tiene; queda disponible con `arrow`).
Base UI, así que el trigger usa `render`, no `asChild`.

El nombre accesible del link sigue en un `sr-only`: el tooltip aporta `aria-describedby`, no
reemplaza al nombre cuando está cerrado.

**Hover del ícono.** No existe ni en el Figma ni en el live: lo elegimos nosotros (usuario,
2026-09-18). El ícono pasa de `--color-foreground` a **`--color-brand`** en 200 ms, y lo mismo
con `focus-visible` para que el teclado tenga la misma señal.

El verde de marca se eligió porque es el color del pill del activo: el hover queda funcionando
como **preview del estado seleccionado** en lugar de ser un color decorativo. Se descartaron
`--color-subtle-foreground` y `--color-muted-foreground` (sobre fondo oscuro, oscurecer el
blanco lee como deshabilitado) y la familia dorada (reservada a premios, podio y medallas).

El ítem activo **no** reacciona al hover: ya está en su estado final.

### El menú mobile: la caja del Figma con nuestros ítems

**Por qué abajo y no a un costado.** El hero mobile concentra todo su contenido en los dos
tercios superiores: título de 28 px de borde a borde (y 215–300), copy y CTA (310–410) y el
slider de juegos (440–475). Un riel vertical a la izquierda caería sobre el título; a la
derecha taparía el rostro del personaje y, al scrollear, el asomo de la card siguiente en el
carrusel de Eventos — que es justamente la señal de que hay más contenido. Abajo no pisa nada
legible, y un riel de 60 px se comería el 15 % del ancho de una pantalla de 390 contra el 4 %
que ocupa en desktop.

**La caja se replica del Figma** (`3567:92009`), medida por medida:

| Propiedad | Valor |
|---|---|
| Medidas | 375 × 80 (implementado como `px-2` + `w-full`: **374** en una pantalla de 390 — 1 px, dentro de la tolerancia de § 6 — y no desborda en pantallas más angostas, que el Figma no contempla) |
| Radio | 16 (`--radius-2xl`) |
| Borde | 1 px con **degradé vertical**: `#494949` arriba → `#2E2E2E` abajo (`--gradient-nav-border`) |
| Padding | 10 horizontal, ítems centrados en los 80 de alto |
| Fondo | `--color-nav-glass` + `backdrop-blur(10px)` |
| Sombra | **`--shadow-bar`** — la "Shadow 3" del Figma, no la del menú desktop |
| Ítems | `flex-1`, `justify-between`, **sin gap** → celdas de 58,67 px |

**Lo nuestro son los ítems y el estado activo.** El Figma trae 5 destinos de app (Home,
buscar, `+`, medallas, menú) y un botón circular verde de 70 px para Home que **sobresale** del
borde superior. Por decisión del usuario (2026-09-18) ese botón queda afuera: todos los íconos
van en su estado normal, y el activo se marca con el mismo pill verde que desktop, que se
desplaza igual.

**El tamaño del pill es lo único inventado**: el Figma no define un pill para mobile, define el
círculo de 70 px que descartamos. Quedó en **48 × 48, radio 16** — conserva los ~11 px de aire
alrededor del ícono que tiene el pill de desktop (46 × 42 sobre un ícono de 26) y toma el radio
de la propia barra. Se compararon 44, 46 × 42 y 52 antes de elegir.

**Los íconos de esta barra no son blancos.** El Figma los dibuja en **`#ABB7C2`**, un gris
azulado (`--color-nav-icon`). Los del riel desktop sí son blancos: son dos sets distintos y
cada uno respeta su propio diseño.

**El tamaño, en cambio, no se unifica.** La barra del Figma pone todos sus íconos en 24 px,
pero eso funciona porque están dibujados con el mismo padding interno. Los nuestros no: el
export de Misiones pinta de borde a borde de su viewBox y el de Home deja 4 px de aire por
lado. Medido en una caja de 24, la tinta queda en **24 × 24 para Misiones contra 18 × 18 para
Home** — un 33 % más grande, y se nota a simple vista.

Los tamaños nativos (26/26/24/18/20/24) son justamente los que **igualan la tinta**: ahí
Misiones y Home pintan los dos 18 × 18. Por eso se respetan en las dos pantallas.

El borde inferior usa `bottom-nav-safe`, que suma `env(safe-area-inset-bottom)` al gutter para
no quedar debajo del home indicator en iOS.

**Sin tooltip**: en touch no hay hover. Los íconos van solos, igual que en la bottom bar del
Figma. Si hace falta que se lea el nombre, la alternativa es que el pill activo se expanda con
el label — cambia el ancho por ítem, así que se consulta antes de hacerlo.

El estado activo es **compartido** entre los dos menús (`SectionNavProvider`): una sola
fuente de verdad, no dos.

**El menú se centra contra el hero, no contra la pantalla.** `col-izq` mide 720 de alto, que
es exactamente lo que mide la fila del hero, y las dos arrancan en y=106. Como el contenido del
hero también está centrado en esos 720, los dos centros caen en el mismo píxel (466) por
construcción, a cualquier alto de viewport. Estirar la columna hasta el pie de la pantalla —
que fue la primera implementación — dejaba el menú 37 px más abajo y se notaba.

### El pill activo se desplaza

Decisión del usuario, 2026-09-18. **Es una desviación consciente de `AGENTS.md` regla 16**: el
diseño no define ninguna animación. Lo que la regla sí protege queda intacto — no se instaló
ninguna librería de motion, es una propiedad de CSS.

En vez de un pill por ítem que aparece y desaparece, hay **una sola capa** que viaja al ítem
seleccionado con `transform` (250 ms, `ease-in-out`). El paso es el tamaño de una celda más el
gap, en porcentaje, así que funciona igual con las celdas fraccionarias de mobile
(`nav-pill-y` / `nav-pill-x` en `globals.css`). El único dato que CSS no puede saber —
el índice activo — entra como custom property (`--nav-index`), que es la excepción que habilita
`AGENTS.md` regla 6.

Con `prefers-reduced-motion: reduce` no hay transición: el pill salta. Verificado.

> Se evaluó instalar una skill de animación: las de volumen son de **Framer Motion** y las de
> CSS puro no llegan al umbral de calidad que la propia skill `find-skills` recomienda
> (1K+ instalaciones). No se instaló ninguna.

### La ruta `/tournaments`: UX del diseño viejo, UI nuestra

Los dos frames de esta pantalla (`407:10565` / `407:11651`) son del **diseño anterior**, el mismo
que § 3 declara obsoleto. Decisión del usuario (2026-09-20): se toma de ellos la **UX** —la
arquitectura de información y el flujo— y **nada de la UI**. O sea que entran la cabecera con
título y buscador, el contrato de datos de la card (juego · título · fecha + premio · badges de
modalidad, formato y cupo · *Hosted by*), la grilla de 4 columnas y el paginador al pie; y
quedan afuera su sidebar de 12 ítems, su bottom bar de 5 destinos, sus colores, radios y
tipografías. La grilla es la nuestra: 1144 con gutters de 148, no los 1276/1368 de ese frame.

**Fuera del Home el menú flotante no marca nada.** En ese diseño el ítem del trofeo está activo
porque **rutea** acá; nosotros decidimos que el menú scrollea a secciones del Home y el
2026-09-19 fijamos que el pill significa una sola cosa: *dónde estás*. `/tournaments` no es una
sección del Home, así que marcarla mentiría dos veces — el pill diría "estás en Eventos" y el
click te sacaría de la página. Decisión del usuario (2026-09-20):

- En `/tournaments` **no hay pill**: `SectionNavProvider` deriva el activo de `usePathname()` y
  expone `null` fuera del Home. Se derivó en vez de setearlo en un efecto del scroll-spy — el lint
  de React lo rechaza y además así no hay un frame con el pill en Home antes de que corra el efecto.
- Los ítems siguen siendo links de verdad: `href` a `/#seccion` fuera del Home y a `#seccion`
  adentro, con `next/link`. El `href` hoy sólo lo usa quien navega sin JS o abre en otra pestaña
  (ver abajo).
- El hover, el tooltip y el `sr-only` no cambian.

### La URL no guarda la sección ✅ (2026-09-23)

Pedido del usuario: clickear un ítem escribía `/#eventos` en la URL, y la URL seguía diciendo
Eventos aunque el usuario ya estuviera en otra sección. **Ahora la URL queda en `/`.**

Todo lo que scrollea a una sección del Home pasa por **`SectionLink`**
(`components/layout/section-link.tsx`): los seis ítems de los dos menús, el logo del header
(`home`) y —extensión nuestra, por la misma razón— el CTA "Comenzar ahora" del hero, que
también escribía `#eventos`. `SectionLink` es un `<Link>` con el `href` de siempre y un
`onNavigate` que cancela la navegación y llama a `goTo(id)`:

- **En el Home:** fija el pill (`select`) y `scrollIntoView()`, que respeta el
  `scroll-margin-top` de la sección y el `scroll-behavior` del CSS — o sea que con
  `prefers-reduced-motion` salta.
- **Desde otra ruta:** `router.push("/", { scroll: false })` y guarda el destino. Cuando el Home
  monta, un `useLayoutEffect` salta **instantáneo** a la sección —antes del primer frame, así no
  se ve la página arriba y después el salto— y un efecto posterior fija el pill. Instantáneo y no
  suave es decisión nuestra: al llegar de otra pantalla no hay nada que acompañar con la vista.
- **El logo** es `SectionLink` a `home`: en el Home scrollea al top (el hero tiene
  `scroll-margin-top` de 106 pero arranca en 0, así que el scroll clampa a 0), y desde otra ruta
  lleva al Home arriba. Antes, fuera del Home no hacía nada visible y escribía `/tournaments#home`.

`onNavigate` y no `onClick` porque sólo corre en navegación de cliente: **Cmd/Ctrl+click sigue
abriendo `/#seccion` en otra pestaña**, y **sin JS el `href` sigue funcionando por hash** —
verificado, `/tournaments` → Eventos cae en `/#eventos` a y=720.

### La 404: “Fuera del mapa” 👀 (2026-09-25)

**Excepción a la regla 2 de `AGENTS.md`**, autorizada por el usuario el 2026-09-25: no hay frames de Figma de la 404 y se diseñó acá, en los dos tamaños. Siguiendo la regla 20, antes se publicó una página de propuesta con tres conceptos y demos en vivo dentro del chrome real: **[SURA 404](https://claude.ai/artifact/6G4urUtxnPWsrbxDuLCAyW)**. Ahí también está la investigación: la 404 de emalorenzo.com, 404 premiadas (Marathon, THE FINALS, Kualo, Feldman, MAD, Figma) y lo que se descartó.

**Concepto elegido: A, “Fuera del mapa”** (usuario, 2026-09-25). La ruta que tipeaste no está en el mapa: sos un punto afuera de la zona de juego y la pantalla te muestra dónde reaparecer. **B (“Práctica de puntería”) y C (“Eliminado”) quedan guardados** en la misma página por si se retoman.

| Decisión | Qué se eligió | Por qué |
|---|---|---|
| **Dónde vive** | `app/not-found.tsx`, el raíz, que monta el chrome con `SiteChrome` | Atrapa cualquier URL sin ruta, sale completa del servidor y es estática (`○ /_not-found`). El raíz no está dentro del layout `(site)`, así que el chrome se extrajo a `components/layout/site-chrome.tsx` y lo usan los dos. **Primero se hizo con un catch-all `(site)/[...slug]` que llamaba a `notFound()`, y estaba mal**: ver notas de implementación. |
| **Respuesta** | HTTP **404** real, `noindex` (lo inyecta Next) y título “Página no encontrada \| Sura Gaming” | Verificado en dev y en `next start`. |
| **Header** | Se queda, sólido y con la flecha de volver en mobile | Su logo lleva al Home y la flecha te devuelve a la página donde estabas, que es lo más útil para un link roto. Además dice que seguís en SURA con tu sesión. |
| **Riel desktop** | **Oculto sólo en la 404** (usuario, 2026-09-25) | El mapa y la lista ya son la navegación: dos menús de destinos competían. La 404 marca su `<main>` con `data-hide-rail` y el riel se oculta con la variante `rail-hidden`. En la persiana se funde solo, por `vt-rail`. **Es la única ruta sin riel en desktop.** |
| **Bottom bar mobile** | Escondida, como en cualquier ruta que no es el Home | No hubo que tocar nada. |
| **“Volver atrás”** | Link secundario al lado del CTA, **sólo en desktop** y **sólo si el navegador tiene una página anterior** (usuario, 2026-09-25) | Hace `router.back()`: vuelve a la página de donde viniste, sea del sitio o no, que es lo que se espera de un link roto. Si la 404 se abrió en una pestaña nueva, `history.length` es 1 y el link no aparece, porque repetiría al CTA. En mobile la flecha del header sigue con su lógica de siempre. |
| **Grilla** | La del Home, 1144 centrados, pero con gutter de **40** (`--spacing-route-edge`) y no 148 | Sin riel, el gutter de 148 no aloja nada. Con 40, a 1100 el título sigue entero y el mapa se achica a 490. Mobile usa el gutter de ruta (16). |
| **Minimapa** | Cuadrado de 592 como máximo, al lado de la columna de texto. En mobile, 358 × 232 entre el copy y el CTA | La columna de texto es `minmax(min-content, 1fr)`: el mapa toma lo que queda hasta 592 y nunca aplasta al título. Mide 592 desde ~1280, 570 a 1180 y 490 a 1100. |
| **La línea** | Sale de tu punto, sube y entra horizontal al destino. Por default apunta al Home; con hover o foco sobre una fila, un nodo o el CTA, se redibuja a ese destino | Son dos `<span>` posicionados con variables CSS en porcentaje, que se animan con `route-draw-y` / `route-draw-x` al remontarse (`key` por destino). No se mide el DOM. Los corchetes del nodo destino se traban con `data-locked` cuando la línea llega (`--bracket-lead`). En touch no hay hover: la línea se queda en el Home y al tocar un destino se redibuja justo antes de navegar. |
| **Nodos del mapa** | Links con `tabIndex={-1}` y `aria-hidden` | Duplican la lista, que es la navegación accesible. Son comodidad de puntero, el mismo criterio que el botón estirado del banner de Juegos. |
| **Distancias** | Salen de la posición de cada nodo, así que son coherentes con la barra de “100 M” | Home 747 M, Eventos 1044, Misiones 855, Leaderboard 567, Juegos 450. |
| **Entrada** | El título hace el barrido de luz, la ruta tipeada se decodifica, tu punto entra con el parpadeo de las medallas bloqueadas y la línea se traza al Home | Llegando navegando, las tres esperan a que pase la persiana (`title-sweep-after-route`, `route-draw-after-route` y el retraso de `ScrambleText`). En una carga directa corren enseguida. Nada entra con fade-up. |
| **Lo único en loop** | El parpadeo lento de tu punto (`blip-blink`, 1,6 s en `steps`) | Es el “estás acá” de cualquier minimapa. |
| **Movimiento reducido** | Todo en su estado final desde el primer cuadro: la línea al Home dibujada, el título blanco y el punto quieto | Verificado: cero animaciones a los 150 ms. |
| **Copy** | De juego y con voseo, como el resto de la UI | “Fuera del mapa”, “ERR 404 · Sector sin señal”, “Puntos de reaparición”. Vive en `lib/data/not-found.ts`. |

**Verificado** (2026-09-25):
- 390 y 1440 en dev, con capturas.
- Cero desbordes y cero scroll lateral en 14 anchos entre 320 y 1920.
- Hover, foco con teclado, toque en mobile, “Volver atrás” (vuelve a `/tournaments`), CTA al Home, filas a su ruta y flecha del header mobile al Home en una carga directa.
- En `next start`: HTML completo del servidor (también sin JS), HTTP 404, `noindex` y título correcto, para `/pagina-que-no-existe`, `/tournaments/123`, `/styleguide/x`, `/favicon.ico` y assets inexistentes. `/tournaments` y `/icon.svg` siguen en 200.
- En la consola sólo quedan los `404` del propio documento y de su pedido RSC.

### Fuera del Home la bottom bar se va ✅ (2026-09-24)

Feedback del equipo (Ema): al entrar a una ruta interna la barra de abajo tiene que desaparecer,
**animada y no de golpe**, y para eso tiene que vivir en el layout persistente. Ya vivía ahí
—`Nav` se monta en `app/(site)/layout.tsx`, que no se desmonta al navegar—, así que no hizo
falta refactor ni librería: es una transición de CSS sobre `usePathname()`.

- **Fuera del Home** la barra baja hasta salir de la pantalla y se funde en **300 ms**
  `ease-in-out` (`nav-bar-away`: su alto + el gutter + la safe-area), y queda `inert`, así ni el
  teclado ni un lector de pantalla la encuentran. **Al volver al Home** sube igual.
  Con `prefers-reduced-motion` cambia en el acto.
- Tiene sentido por lo que la barra es: sus seis ítems son secciones del Home y fuera de él ya no
  marcaba nada (ver *Fuera del Home el menú flotante no marca nada*, arriba).
- **El footer deja de reservarle lugar** en esas rutas: `pb-nav-clearance` (128) pasa a
  `pb-gutter-safe` (24 + safe-area). Lo lee del estado de la barra con `peer/bar`, sin volverse
  client component — por eso `Nav` tiene que seguir siendo hermano anterior del footer (guarda en
  el layout).
- **Desktop no cambia**: el riel flotante sigue en todas las rutas.

**Flecha de volver.** Sin la barra, una ruta interna en mobile quedaba sin salida: el header
mobile no tiene logo. El header mobile de las rutas internas suma un chevron a la izquierda
del avatar (`BackButton`, 40 × 40, el `ChevronLeft` de trazo 1,5 de las flechas del hero, hover y
foco a `--color-brand`). Si se llegó navegando dentro del sitio hace `router.back()`, así vuelve
a donde estaba, con su scroll; si la ruta se abrió directo, va al Home. Es sólo mobile: desktop
tiene el riel y el logo.

Para que entre la flecha, **el nombre del usuario se trunca con `…`** cuando no alcanza el ancho:
desde el 2026-09-25, con el toggle de sonido al lado, a 390 se corta en el Home ("RocketMan19…") y en las rutas internas ("Rocket…"); a 320, en las rutas internas, desaparece (§ 0). Medido de 320 a 430: nada
se sale del header y el alto sigue en 56.

### Sonido ✅ implementado · 👀 esperando aprobación (2026-09-25)

Feedback del equipo (Ema): SFX en hovers, clicks y cambios de página, toggleable y prendido por
defecto, más los íconos del menú animados. Se propuso en **[Sonido SURA](https://claude.ai/artifact/FtyLwp9kX6guF4FCEek39E)**, con demos que se
escuchan (AGENTS regla 20), y el usuario eligió el 2026-09-25:

- **Paleta Libre**: Kenney, CC0, sin aviso de licencia. La ida y la vuelta de la persiana son el
  par **Ventana** (maximize / minimize de Kenney), que reemplazó a las puertas sci-fi. **Desde el
  2026-09-25 la paleta es mixta con uisfx**: ver *Paleta mixta con uisfx*, abajo.
- **Toggle en el header** (T1), **preferencia guardada** entre visitas y la tecla **M**.
- **Hover sonoro sólo en lo accionable** (el mapa de la propuesta) y **los íconos del menú "por partes"** (opción D).

La referencia fue **emalorenzo.com**. Sus sonidos son rips de Metal Gear Solid, que no usamos, y de
ahí salieron las prácticas: hover muy bajo con limitador, carriles que se reemplazan, fundidos
cortos, desbloqueo al primer gesto y silencio con la pestaña oculta. Lo que hacemos distinto: la
preferencia se guarda y no hay Howler.

| Evento | Dónde | Volumen |
|---|---|---|
| Hover | Ítems del riel, CTA del hero, "Jugar ahora" ×2, Reclamar, tabs de ruta, "Ver todo", "Ir a Sura News", el toggle. También el foco con teclado | 0,16 |
| Clic | Flechas de carruseles y del hero, chips, paginador, CTAs, "Ver todo" sin ruta, banners, medallas obtenidas | 0,42 |
| Selección | Ítem del menú, tab de ruta, miniatura del hero | 0,5 |
| Ida de ruta | Cualquier link a otra ruta que no sea el Home | 0,55 |
| Vuelta al Home | Links al Home desde una ruta interna, flecha de volver | 0,55 |
| Reclamar | El botón | 0,8 — lo más fuerte |
| Odómetro | Un tick por dígito que cambia al reclamar, con la afinación subiendo | 0,2 |
| Bloqueado | Click en una medalla bloqueada | 0,5 |
| Sonido on / off | El toggle | 0,45 |

**Mudos a propósito:** el hover de cards, filas, chips y footer (son grillas, y ahí el hover se
vuelve ráfaga), el scroll-spy, los barridos de títulos, la intro, los conteos al scrollear, el botón
de perfil y los del footer. Un elemento que ya está seleccionado tampoco suena.

**Límites:**
- **Hover:** un hover cada 110ms, y ninguno mientras suena el anterior; sólo mouse.
- **Carriles:** un sonido nuevo del mismo carril funde al anterior en 18ms; tope de 6 voces.
- **Variación:** ±2–4% de afinación y ±6% de volumen, para que el mismo tick no canse.
- **Movimiento reducido:** la persiana no corre, así que la ida y la vuelta suenan como un clic.

**El toggle.** Un cuadrado de 40 con la superficie de los contadores: primero en el grupo del header
desktop, último en el mobile. El ícono es el parlante de Lucide dibujado inline. Al apagar, las
ondas se retraen y se dibuja una cruz; con cada sonido que sale, las ondas titilan una vez. El
estado vive en `localStorage` (`sura-sound`) y un script en el `<head>` lo pone en
`<html data-sound>` antes de pintar, así no hay parpadeo del ícono. Se sincroniza entre pestañas.

**Antes del primer click no suena nada, y no tiene arreglo.** Los navegadores no dejan sonar audio
hasta un `pointerdown` o una tecla. Hover, movimiento del mouse y focus no cuentan; en Chrome la
rueda tampoco. Se investigó en el código fuente de Chromium, Firefox y WebKit y se probó en los tres:
no hay workaround legítimo para una primera visita. Lo único que existe:

- el *Media Engagement* de Chrome, que sólo se gana con más de 7 segundos de audio (sólo la música de fondo lo construiría);
- el permiso que el usuario le da al sitio;
- una PWA instalada;
- una pantalla de entrada, que se descartó porque le agrega un paso a cada visita.

Así que los hovers anteriores al primer click son mudos, igual que en emalorenzo.com.

**Carga.** 10 archivos en `public/assets/sfx/`: Opus en WebM (31 KB en total) con AAC de respaldo
si el navegador no decodifica WebM. Se bajan después del `load`, en idle, o con el primer gesto si
llega antes. Se decodifican al crear el `AudioContext`, en ese mismo gesto. Un sonido que no está
listo en 500ms se descarta: nunca suena tarde. Con la pestaña oculta el contexto se suspende.

**La salida de audio no se duerme** (2026-09-25). Lo levantó el usuario: después de unos segundos
sin sonidos, el siguiente no sonaba o sonaba bajo, y con varios seguidos se oía al volumen real. El
motor no suspende nada por inactividad; la causa está afuera y son dos cosas:

- **Chrome** apaga la salida real de Web Audio después de **30 s de silencio exacto** y pasa a una
  salida falsa (`SilentSinkSuspender`, en `media/base/`). El primer sonido que no es silencio lo
  devuelve a la salida real, y ese cambio lo demora o lo recorta.
- **El sistema y los dispositivos** también apagan la salida sin uso: auriculares y parlantes
  Bluetooth, monitores por HDMI, placas USB. Al volver, se comen el principio del sonido o lo
  arrancan con un fundido. En sonidos de 80 a 200 ms eso es casi todo el sonido.

El motor mantiene una señal que nunca es silencio exacto: un tono de **30 Hz a -80 dBFS**
(`keepAliveGain`, `keepAliveHz`) conectado directo a la salida, sin pasar por el volumen maestro.
Está por debajo del umbral con el que Chrome marca una pestaña como “reproduciendo audio”
(-72 dBFS) y es inaudible a cualquier volumen. Arranca con el primer gesto y se corta al apagar el
sonido, con la pestaña oculta (el contexto se suspende) y **después de 5 minutos sin actividad**
(`keepAliveIdleMs`): en macOS una salida de audio activa impide el reposo automático de la
computadora. Cualquier movimiento del mouse, rueda o toque la vuelve a arrancar.

### Paleta mixta con uisfx ✅ implementada · 👀 en prueba (2026-09-25)

Feedback del equipo: la ida y la vuelta de Libre no gustaron, y se recomendó mirar
[uisfx](https://uisfx.com/) (CC0, 12 paquetes con los mismos 78 sonidos con nombre de evento). Se
comparó la paleta entera contra cuatro paquetes —Sci-fi, Arcade, Mecánico y Cinemático— en la misma
propuesta, **[Sonido SURA](https://claude.ai/artifact/FtyLwp9kX6guF4FCEek39E)**, sección *La paleta
entera, contra uisfx*.

**La combinación en prueba** (usuario, 2026-09-25):

| Evento | Paleta | Archivo de origen | Nivel | Duración |
|---|---|---|---|---|
| Hover | **Sci-fi** | `scifi/hover` | -5,1 dB | 124 ms |
| Clic | **Sci-fi** | `scifi/press` | -5,6 dB | 135 ms |
| Selección | **Sci-fi** | `scifi/select` | -5,1 dB | 220 ms |
| Ida de ruta, vuelta al Home | **Libre** (Ventana) | sin cambios | — | 513 / 510 ms |
| Reclamar | **Libre** | sin cambios | — | 516 ms |
| Odómetro | **Arcade** | `arcade/typing` | -7,4 dB | 79 ms |
| Bloqueado | **Sci-fi** | `scifi/blocked` | -5,2 dB | 272 ms |
| Sonido on / off | **Sci-fi** | `scifi/toggle-on` / `toggle-off` | -3,2 dB | 225 / 207 ms |

El nivel es la ganancia aplicada al archivo para que suene igual de fuerte que el de Libre al que
reemplaza, medido como el pico de RMS en ventanas de 30 ms. Es el mismo que tenían en la propuesta,
así que en la web suenan como ahí. Los volúmenes de `lib/data/sfx.ts` no cambiaron.

Los sonidos de uisfx son más largos que los de Libre (el hover pasa de 40 a 124 ms). Como el
limitador no deja sonar un hover mientras suena el anterior, recorrer el riel rápido deja pasar
menos hovers que antes.

La ida y la vuelta quedan en Libre, pero el usuario no está seguro: se retoma más adelante.

**Datos a tener a mano al retomar:**
- La ida de Ventana mide **9 dB más fuerte** que su vuelta. Si Libre se queda con la ida y la vuelta, conviene nivelarlas.
- Contra la persiana de 640 ms, la única ida de uisfx con ese largo es la de Cinemático (511 ms); las otras terminan antes de la mitad.
- Los archivos salen del paquete de npm `uisfx@0.4.0` (`sounds/<paquete>/<sonido>.ogg`, CC0): se recortan en el silencio del final, se pasan a mono (el estéreo de uisfx está 16 a 26 dB por debajo del centro) y se convierten a Opus 64k con AAC 96k de respaldo, como los de Libre. **No se instala el runtime de uisfx**: sólo se usan los archivos.
- uisfx no tiene servidor MCP.

### Íconos del menú por partes ✅ implementado · 👀 esperando aprobación (2026-09-25)

Opción D de la misma propuesta. Los íconos del riel y de la bottom bar dejaron de ser máscaras CSS y
son SVG inline (`components/layout/nav-icon.tsx`) con **la misma geometría de los assets**: cada
`d` se partió sólo por sus propios comandos `M` y la unión da el original, verificado con un
script. **Es un desvío consciente de AGENTS regla 10**, aceptado por el usuario, y de la regla 16,
con el criterio de siempre: cero librerías de motion.

| Ícono | Qué hace | Duración |
|---|---|---|
| Home | La casa se presiona | 400ms |
| Eventos | La copa se sacude sobre su base | 540ms |
| Leaderboard | Las barras suben desde el piso, en cascada, y el "1" parpadea | 380ms + 60ms de escalón |
| Misiones | El lápiz escribe | 500ms |
| Sura News | Las líneas se vuelven a escribir | 260ms + 70ms de escalón |
| Juegos | El joystick vibra, el botón se aprieta y la cruz parpadea | 280ms |

- **Cuándo se animan:** en desktop, con hover o foco de teclado de un ítem que no está activo, y una vez cuando un ítem queda activo. En mobile, sólo cuando queda activo.
- **Cuándo no:** el ítem activo en la carga no se anima hasta la primera interacción real.
- **Movimiento reducido:** nada se mueve.
- **En reposo** los íconos son los mismos que antes: medido contra la máscara, 4–14 píxeles de antialiasing por estado y la unión del tallo del trofeo (ver § 0).
- **Assets:** los SVG de `public/assets/home/nav/` siguen en el repo porque la 404 los usa como máscara, salvo el de news, que quedó sin uso.

### El chrome de una ruta interna

Sale de los **dos únicos frames del rediseño de una ruta interna** que existen: Misiones
(`6008:29000` / `6008:29689`) y Mi Perfil (`6140:118274` / `6140:117864`). Los dos definen los
mismos valores al píxel, así que se implementó **una vez y reusable** en
`components/layout/route-shell.tsx`, para las 13 rutas que faltan.

| | Desktop | Mobile |
|---|---|---|
| Header | 106 | 56 |
| Header → H1 | **24** | **16** |
| H1 | Monument uppercase **32 / 28** | **24 / 29** |
| H1 → contenido | **40** | **24** |
| Columna | **x=155, ancho 1245** (borde derecho a 40) | gutter **16** |
| Contenido → footer | **40** | **40** |

**La grilla de ruta no es la del Home**, y es a propósito: el Home usa 1144 centrado con gutters
de 148, y una ruta interna usa una columna **fluida** que arranca en 155 —donde termina el
gutter del riel— y muere a 40 del borde derecho. A 1440 da los 1245 del diseño; arriba de eso
estira, que es lo que se desprende del frame. Decisión del usuario, 2026-09-20.

**Dos valores normalizados**, porque los frames no coinciden entre sí:

- El gutter mobile es 16 en Misiones y 18 en Mi Perfil → se unifica en **16**, que además es el
  `px-4` del header mobile, así el contenido de ruta le queda alineado.
- El header → H1 mobile: Mi Perfil deja 12 hasta su contenedor y Misiones 16 de padding interno.
  Va **16**. No hay frame mobile compuesto de una ruta, así que queda para confirmar.

**El interlineado del H1 mobile va fijo en 29 y no en `normal`.** El Figma declara `normal` pero
calcula 29; el browser, con Monument, da 35. Eran 6px que corrían todo el contenido hacia abajo.

**Sin banner de cabecera.** No hay frame del rediseño para esta ruta y el usuario descartó
(2026-09-20) traer el arte de trofeos del diseño viejo. Como no hay hero, el header fijo tomaría
el contenido por debajo: gana la variante `<Header solid />`, que le pone `bg-background` **sólo en
desktop** — en mobile lo resuelve el vidrio del header al scrollear (ver § 5, 2026-09-23). En el
Home el header sigue transparente sobre el hero, sin cambios.

### Mapa de rutas

> Absorbido desde `ROUTES.md` el 2026-09-20, que era temporal y ya cumplió su condición de merge.
**URLs en inglés**, igual que `app.suragaming.com`. La UI va en español y los anchors
del menú flotante también (`#eventos`, `#misiones`, `#sura-news`): son ids de sección,
no rutas, y conviven sin conflicto.

#### Rutas del proyecto

| Ruta | Pantalla | Estado |
|---|---|---|
| `/` | Home | ✅ Aprobada (2026-09-20) |
| `/tournaments` | Lista de eventos | 👀 Esperando aprobación (bloques 15–20) |
| `/tournaments/:id` | Detalle de evento | ⏳ Pendiente |
| `/leaderboard` | Leaderboard | 👀 Esperando aprobación (bloques 26–30) |
| `/missions` | Misiones | 👀 Esperando aprobación (bloques 21–25) |
| `/missions/:id` | Detalle de misión | ⏳ Pendiente ❓ a confirmar |
| `/news` | Lista de Sura News | ⏳ Pendiente |
| `/news/:id` | Detalle de noticia | ⏳ Pendiente |
| `/games` | Lista de juegos | 👀 Esperando aprobación (bloques 31–34) |
| `/games/:id` | Detalle de juego | ⏳ Pendiente ❓ a confirmar |
| `/profile` | Perfil propio | ⏳ Pendiente ❓ a confirmar |
| `/profile/:id` | Perfil de otro usuario | ⏳ Pendiente ❓ a confirmar |
| `/styleguide` | Referencia visual del DS (solo dev) | ✅ Implementada |
| `not-found` | 404 · “Fuera del mapa” | 👀 Esperando aprobación (bloques 35–38). **Sin frames: diseño propio**, ver *La 404*, § 5 |

**Ninguna se maqueta sin sus dos frames de Figma** (`AGENTS.md` regla 2), y ninguna se
abre hasta que el Home esté aprobado completo (regla 14) — **el Home quedó aprobado el 2026-09-20**, así que las rutas hijas están destrabadas y sólo esperan sus frames.

#### Cómo se entra a cada una

Los 6 ítems del menú flotante **scrollean a las secciones del Home**, no rutean
(decisión del usuario, 2026-09-18 — ver más arriba en esta misma sección). Así que las rutas necesitan su
propia puerta de entrada:

- `/tournaments`, `/news`, `/games`, `/leaderboard`, `/missions` → presumiblemente un
  **"Ver todos"** en el título de cada sección del Home. **Sin confirmar**: hay que
  mirarlo en el frame de cada bloque a medida que se maquetan.
- `/tournaments/:id`, `/news/:id`, `/games/:id` → click en la card correspondiente.
- `/profile` → avatar del header.

Hasta que exista la puerta, el link se maqueta apuntando a su destino real (regla 14).

**Excepción (usuario, 2026-09-23):** con el sitio público en Vercel, las cards de los **detalles** (`/tournaments/:id`, `/missions/:id`, `/games/:id`, `/news/:id`) y el perfil (`/profile/:id`) **dejaron de linkear** para no mandar a nadie a un 404. `/news` tampoco se va a implementar por ahora. Ver *Rutas de detalle apagadas*, § 6.

#### Rutas descartadas a propósito

Existen en `app.suragaming.com` y se decidió **no** hacerlas (usuario, 2026-09-19).
Quedan acá por si alguna vuelve a entrar en scope.

| Ruta | Qué es | Por qué queda afuera |
|---|---|---|
| `/levels` | Niveles | Es el 7º ítem del menú flotante del Figma, ya excluido del menú por no tener sección en el Home. |
| `/achievements` | **Medallas** | Destino natural de la sección Medallas del Home. Confirmado por la API del live (`/medal/list`, `/medal/claim/`). |
| `/store` · `/store/:slug` | Tienda | No hay sección de tienda en el Home ni ítem en el menú: no hay por dónde entrar. |
| `/wallet` · `/wallet/tokens` · `/wallet/nfts` · `/wallet/transactions` | Billetera web3 | Fuera del alcance visual del rediseño. Ojo: el **saldo del header** podría apuntar acá. |
| `/faq` | Preguntas frecuentes | Link del footer, baja prioridad. |
| `/privacy-policy` | Política de privacidad | Link del footer, baja prioridad. |
| `/about` | "Sobre nosotros & Partnerships" | **No es una ruta de la app**: vive en el sitio de marketing, `suragaming.com/es/about`. El link del footer es externo. |

#### Anexo — el mapa real del live

Relevado el 2026-09-19 sobre `app.suragaming.com` (Next.js App Router), enumerando los
chunks `static/chunks/app/**/page-*.js` que sirve cada página. Es la lista completa, no
una inferencia por status code.

```
app/
  page                          /
  tournaments/page              /tournaments
  tournaments/[id]/page         /tournaments/:id
  leaderboard/page              /leaderboard
  games/page                    /games
  games/[id]/page               /games/:id
  faq/page                      /faq
  privacy-policy/page           /privacy-policy
  not-found
  (protected)/
    missions/page               /missions
    profile/page                /profile
    levels/page                 /levels
    achievements/page           /achievements
    store/page                  /store
    store/[slug]/page           /store/:slug
    wallet/page                 /wallet
    wallet/tokens/page          /wallet/tokens
    wallet/nfts/page            /wallet/nfts
    wallet/transactions/page    /wallet/transactions
```

Tres cosas que conviene tener presentes:

1. **`/news` no existe en el live.** Devuelve 200 pero sirve el `not-found` dentro del
   layout `(protected)`. O sea que la sección Sura News del Home no tiene pantalla
   propia hoy. Nuestras `/news` y `/news/:id` son una decisión del rediseño, no una
   réplica — no hay nada upstream contra qué validarlas.
2. **Nombres de params**: el live usa `[id]` en tournaments y games, y `[slug]` sólo en
   store. Seguimos `:id`.
3. **`(protected)`** separa lo público (`/`, tournaments, games, leaderboard, faq,
   privacy-policy) de lo que pide sesión (missions, profile, levels, achievements,
   store, wallet). Como auth está fuera de scope (`PRD.md` § 1), **no replicamos el
   route group**: todas nuestras rutas son públicas.
4. **No quedó ninguna ruta sin relevar.** Las únicas del live que no están en nuestra
   lista son las siete descartadas arriba.

**Secciones del Home desktop**, en orden:

`Nav` → `Hero` (full-bleed, 1024 de alto) → `Eventos` → `Leaderboard + Medallas` (dos columnas)
→ `Misiones` → `Sura News` → `Juegos` → `Footer`

### ⚠️ El diseño mobile está incompleto

El frame mobile original mide **390 × 844: una sola pantalla**, no la página completa: contiene
status bar, header, Hero, la sección Eventos y la bottom bar. El **Leaderboard mobile llegó
aparte** el 2026-09-19, como nodo suelto (`6011:77868`), y por eso no está en ese frame.

**No hay diseño mobile de:** Juegos · Footer. Los dos se adaptan del desktop por decisión del usuario (2026-09-19).

> El frame mobile **creció**: al maquetar Misiones apareció completo hasta Sura News
> (`6009:35214`, 390 × 2236). Misiones vive en `6015:78190` y Sura News en `6015:78134`.

**Medallas es la excepción**: tampoco tiene frame mobile, pero el usuario pidió adaptarlo
(2026-09-19) en vez de esperarlo — desvío consciente de la regla 2, acotado a ese bloque. La
adaptación no inventó nada: la grilla de 3 × 3 del desktop entra tal cual en mobile (3 celdas
de 106 + 2 gaps de 8 = 334 contra los 342 de ancho útil), así que lo único que cambia es que
las celdas quedan en ~98 y todo lo de adentro escala con ellas.

Por la regla 2 de `AGENTS.md`, esos bloques **no se maquetan** hasta que aparezcan sus frames.

> Como el mobile llega por nodos sueltos, tampoco hay un frame compuesto que defina la
> **separación entre secciones** en ese tamaño: los 40px son decisión del usuario (2026-09-19),
> la mitad de los 80 que sí da el desktop.

**Footer mobile.** Adaptado del desktop (usuario, 2026-09-19). Las tres filas del diseño se apilan en una
columna centrada con el gutter de 24: logo, los cuatro links uno debajo del otro (gap 12, sin
separadores), los dos badges de tienda en fila, las redes en tres filas (portugués, español,
comunidad), la línea y el copyright. Arriba lleva los 40 de separación de sección mobile; abajo,
`pb-nav-clearance` (128px + safe-area) para que la bottom bar fija no tape el copyright y quede
con 24 de aire por encima de la barra. Tamaños y tokens son los de desktop: no se inventó ninguno.

> Nota: la misma sección se llama "Torneos" en desktop y "EVENTOS" en mobile. Se respeta el
> texto de cada frame y queda anotado como deuda de diseño.

---

## 6. Design System

### Cómo se define

Los tokens se **derivan escaneando el diseño completo del Home** (desktop + mobile).
No hay una página de Foundations separada.

1. Escanear el Home entero: `get_design_context` + `get_variable_defs` + `get_screenshot`.
2. Inventariar **todo**: colores, familias/tamaños/pesos/line-heights/tracking, spacing,
   radios, sombras, tamaños de ícono.
3. Consolidar: lo que se repite se vuelve token; lo que aparece una sola vez queda
   como candidato y se consulta antes de promoverlo.
4. Presentar la tabla de tokens al usuario **antes** de escribir CSS.
5. Escribir el `@theme` en `app/globals.css` y publicar `/styleguide`.

El DS nace **acotado al Home a propósito**. Se extiende **solo** cuando una pantalla
concreta necesita algo que no existe — y queda registrado abajo.

### Estructura

```
app/
  globals.css          @theme — todos los tokens
  layout.tsx           fuentes vía next/font
  styleguide/page.tsx  referencia visual (solo dev)
components/
  ui/                  primitives shadcn, re-estilados con nuestros tokens
  layout/              header, footer, nav flotante
  sections/            secciones compuestas
lib/
  utils.ts             cn()
  use-section-spy.ts   scroll-spy del menú flotante
  data/                data hardcodeada y tipada
public/assets/<pantalla>/   assets exportados de Figma
```

### Changelog del Design System

> **Reseteado el 2026-09-18** al migrar al Figma del rediseño. Las entradas del archivo
> anterior se descartaron: ningún token sobrevivió con el mismo valor.

| Fecha | Token | Pantalla que lo pidió | Motivo |
|---|---|---|---|
| 2026-09-25 | **404 “Fuera del mapa”**: `--route-draw-duration` (450ms), `--blip-blink-duration` (1600ms), `--spacing-map` (592), `--spacing-map-mobile` (232), `--spacing-map-grid` (32) / `-desktop` (48); utilities `map-grid`, `route-draw-y`, `route-draw-x`, `route-draw-after-route`, `blip-blink`; variante `rail-hidden`; `card-bracket` suma el estado `data-locked` con `--bracket-lead` y `@starting-style`, así también espera a la línea al montar | 404 | Pantalla sin frames, con diseño propio y excepción a la regla 2. Detalle en *La 404*, § 5. `ScrambleText` suma `decodeOnMount` y ahora deja fijos los caracteres que no son letras ni números (`/`, `-`, `·`); con los labels actuales no cambia nada, porque todos son letras y espacios. |
| 2026-09-25 | **Paleta mixta con uisfx** (7 de los 10 sonidos: hover, clic, selección, bloqueado y on / off de Sci-fi; el odómetro de Arcade) y **señal que mantiene despierta la salida de audio** (`keepAliveGain`, `keepAliveHz`, `keepAliveIdleMs` en `lib/data/sfx.ts`) | Todas las rutas | Elegida por el usuario sobre la propuesta *Sonido SURA*, y arreglo del sonido que se perdía o sonaba bajo después de un rato sin sonidos. Detalle en § 5, *La salida de audio no se duerme* y *Paleta mixta con uisfx*. |
| 2026-09-25 | **Sonido**: `public/assets/sfx/` (10 sonidos, 21 KB), `--sound-morph-duration`, `--sound-wave-fade-duration`, `--sound-cross-delay`, `--sound-live-duration`, `--sound-live-stagger`, `--sound-wave-off-scale`, `--sound-live-dim`; utilities `sound-wave`, `sound-wave-far`, `sound-cross`; variantes `sound-on` / `sound-off` | Todas las rutas · Header | Propuesta *Sonido SURA*, elegida por el usuario. Detalle en § 5, *Sonido*. El sonido no es parte del diseño: todo es `offDesign`. |
| 2026-09-25 | **Íconos del menú por partes**: `--nav-icon-*` (16 duraciones), utilities `navicon` y `navpart-*`; los íconos pasan de máscara a SVG inline, `--color-nav-icon` se usa como `text-nav-icon` y se borra `nav-icon-news` | Menú flotante · Bottom bar | Opción D de la misma propuesta. Detalle en § 5, *Íconos del menú por partes*. Las otras cinco máscaras `nav-icon-*` siguen porque las usa la 404. |
| 2026-09-25 | **En desktop, `lift-clip` recorta `--bracket-offset` (5px) más afuera, siempre** | Eventos · Misiones · destacadas de `/missions` | Feedback del usuario: los corchetes de la card pegada al borde de la columna salían cortados, porque `lift-clip` recorta justo ahí para que no asome la card siguiente. Primero se abrió sólo con hover o foco, pero con una card a medio scrollear se veía el recorte crecer y achicarse al pasar el mouse; y a 10px no convencía. Queda fijo en 19px en vez de 24: en reposo no cambia nada, porque la card siguiente está a 24px, y en las puntas sigue en 0. **Mobile no cambia**: ahí la card siguiente siempre asoma y se metería 5px en el gutter, y sin hover los corchetes no aparecen. Verificado: flechas, puntas, scroll y mobile sin cambios. |
| 2026-09-25 | `--chrome-fade-duration` (220ms), utilities `vt-header` / `vt-rail` | Todas las rutas | Feedback del usuario: el header y el riel aparecían y desaparecían de golpe con la persiana, y al volver al Home el riel mostraba la pill antes de que pasara el panel. Detalle en *Micro-animaciones HUD*, § 6. |
| 2026-09-25 | **El carrusel de Eventos gana 8px de aire abajo** (`pb-2` con `-mb` que lo compensa) | Eventos | Los corchetes de P1 asoman 5px y el viewport sólo dejaba 1–2px: los de abajo se cortaban en todas las cards. Medido: las secciones siguientes quedan en el mismo píxel a 390 y 1440. |
| 2026-09-25 | **P1 B y P2 C**: `--bracket-*`, `--title-sweep-duration`; utilities `card-bracket`, `title-sweep`, `title-sweep-after-route` | Cards · títulos de sección · H1 de ruta | El usuario eligió *Se dibujan* para los corchetes y *Barrido de luz* para los títulos. Detalle en *Micro-animaciones HUD*, § 6. |
| 2026-09-25 | **Persiana: la vuelta se reescribe sin espejo, y volver al Home desde la flecha también la dispara** | Todas las rutas | Feedback del usuario: la vuelta se trababa al final y la pill verde aparecía antes de que pasara el panel. Causa en notas de implementación. |
| 2026-09-24 | **Micro-animaciones HUD, tanda 1**: `--ease-lock`, `--scramble-*`, `--wipe-*`, `--odometer-*`, `--reward-pop-duration`, `--sheen-duration`, `--medal-tilt`, `--medal-perspective`, `--deny-duration`, `--flicker-duration`, `--border-light-*`, `--route-shutter-*`, `--color-sheen-gold`, `--color-glint`, `--color-promo-light`; utilities `wipe`, `wipe-on`, `odometer-digit`, `reward-pop`, `podium-sheen`, `medal-tilt`, `medal-glint`, `deny-shake`, `flicker`, `border-light`, `route-shutter` | Todas las rutas | Feedback del equipo (Ema): más micro-animaciones. Siete de las nueve propuestas de la página *Movimiento SURA*, aprobadas por el usuario. Detalle en *Micro-animaciones HUD*, § 6. **Son desvíos conscientes de AGENTS regla 16**, con el criterio de siempre: cero librerías de motion. |
| 2026-09-24 | **El banner violeta del Home cambia su hover**: la luz de borde reemplaza al glow `--shadow-promo-hover`, que queda sólo para el foco de teclado | Home · Juegos | Pedido del usuario al aprobar P9: la misma receta que el banner de `/games`, en violeta. |
| 2026-09-24 | **Lift unificado en 200ms con `--ease-reveal`**, y las cards suman `active:scale-98` | Todas las cards · podios | Las cards subían en 200ms con la curva por defecto y los podios en 250ms con `--ease-reveal`. En touch, además, ninguna card daba respuesta al toque. |
| 2026-09-24 | **Slide default: PROJECT: Yi con intro**; `--hero-intro-fade-duration` (500ms), `--hero-intro-reveal-duration` (600ms), variante `intro-pending`, utilities `intro-veil`, `intro-veil-sections`, `hero-poster-cover-*`, `hero-video-focus-*`, `hero-intro-fade`; se borra Modern Warfare III | Hero · todo el Home | Pedido del usuario. Detalle en *Intro de PROJECT: Yi*, § 6. Jett pasa a segundo slide. |
| 2026-09-24 | `nav-bar-away`, `pb-gutter-safe`; `BackButton` en el header mobile de las rutas internas | Bottom bar · Header · Footer | Feedback del equipo: la bottom bar se va animada fuera del Home y vuelve al Home. Detalle en § 5, *Fuera del Home la bottom bar se va*. |
| 2026-09-24 | **El arte del hero de Valorant pasa a video** (`--aspect-hero-loop-mobile` / `-desktop`, utilities `hero-poster-mobile` / `-desktop`); se borran `hero-art-mobile` / `-desktop` y `hero-art@2x.webp` | Hero | Pedido del usuario. Detalle en *Hero en video*, § 6. Desktop cambia de encuadre al **D1** —el arte 17,7 % más arriba— y mobile se queda en el del diseño. Los dos recortes viven en el archivo, así que la caja va al 100 % del ancho con la proporción del recorte. |
| 2026-09-24 | `hero.autoplayMs` **3000 → `null`** | Slider del hero | Pedido del usuario: que por defecto siempre se vea el slide con el video. El avance automático queda apagado, no borrado. |
| 2026-09-23 | **Preview al compartir el link** (`app/opengraph-image.png`, `twitter-image.png`, `apple-icon.png`) | Todas las rutas | Lo levantó el usuario: WhatsApp mostraba el triángulo de Vercel. No había ningún `og:image`, así que el preview caía al ícono default que servía antes `/favicon.ico`. Ahora la imagen es el logo SURA GAMING en blanco sobre `--color-background`, 1200 × 630 y centrado para que también entre en el recorte cuadrado de WhatsApp. `metadataBase` queda fijo en `https://sura-clon.vercel.app`: Next compone ahí la URL absoluta, y en dev la muestra con `localhost`, que es lo esperado. Suma `openGraph` y `twitter` en el metadata raíz (título, descripción, `es_AR`). **Si cambia el dominio, se cambia ahí.** |
| 2026-09-23 | `--breakpoint-desktop` **391 → 1100px**, `--container-mobile` (430), `--text-display-fluid`, `--spacing-leaderboard-share` / `-gap-share`; se borra `--spacing-leaderboard-col` | Todas las rutas | Arreglo de los anchos intermedios. Detalle y medidas en § 4, *Breakpoint*. |
| 2026-09-23 | **Las filas del Leaderboard del Home son los puestos 04–08 de `/leaderboard`** | Home | Pedido del usuario: el Figma repite "NombreUsuario" y el mismo avatar en las cinco filas. `leaderboardRows` se deriva ahora de `standings` (mismo nombre, avatar, nivel y puntaje que la ruta), así el Home y `/leaderboard` no pueden contradecirse. `avatar-row.png` quedó sin uso y se borró. La sección no cambia de alto: 486 en desktop. |
| 2026-09-23 | **Fondos CSS a WebP** | Hero · Eventos | La primera pasada miró sólo los `<img>` y se le escaparon los fondos: los cuatro artes del carrusel (`--hero-art`) y las dos superficies de card de Eventos (`url()` en `globals.css`). Los artes mantienen sus dimensiones —el encuadre del diseño los estira al 181%— y sólo cambian de formato; las superficies van a 730, el doble de la card. 4,45 → **1,08 MB**; el `hero-art@2x`, que es el LCP en mobile, 895 → 240 KB. Δ medio ≤ 0,74 en los cuatro slides y en Eventos. El Home descarga ahora **1,8 MB**. |
| 2026-09-23 | **La portada de la card de torneo pierde su anillo** | `/tournaments` | Mismo bug que la card de misión (notas de implementación, *Un anillo inset debajo de una imagen asoma cuando la imagen se anima*): el `ring-inset` quedaba debajo de la imagen con zoom y asomaba al salir del hover. Medido en las cards de portada de color: **61 frames con línea gris de 168 → 0**. |
| 2026-09-23 | **Assets pesados a WebP a tamaño de uso** | Todas las rutas | Pedido del usuario: los assets aparecían de golpe al recargar. Se descartó un fade global —envolvía cada imagen en un cliente y sólo disimulaba— y se bajó el peso. Detalle en la deuda *Peso de los assets*, ahora resuelta. |
| 2026-09-23 | **Miniaturas del slider livianas** (`*-thumb.jpg`) | Slider del hero | La segunda miniatura, Fortnite, mostraba el placeholder negro antes de cargar: era un PNG de 2,5 MB para un cuadrado de 60px. Detalle en la deuda *Portadas del slider a tamaño completo*, ahora resuelta. |
| 2026-09-23 | `--thumb-reveal-stagger` de 90ms a **150ms** | Slider del hero | Pedido del usuario: más aire entre la entrada de una miniatura y la siguiente. La duración se queda en 420ms: como es mayor que el stagger, cada una arranca antes de que termine la anterior y la cascada sigue continua, y la última cierra a los **870ms**, dentro del segundo de la entrada del hero. Con 700ms se iba a 1150ms. |
| 2026-09-23 | `--ease-scan`, `--hud-scan-*`, `--count-up-duration`, `--row-reveal-*` y las utilities `hud-scan` / `row-reveal` | Hero · Leaderboard (Home) | Entrada del hero (escaneo HUD) y de las filas del Leaderboard (puntaje arcade), elegidas por el usuario después de descartar una primera versión genérica. **Son el 4º y 5º desvío consciente de AGENTS regla 16**, con el criterio de los anteriores: cero librerías de motion. Receta y medidas en *Vocabulario de entrada*, § 6. |
| 2026-09-23 | `--text-shadow-hero-copy` (`0 0 3px` negro al 90% + `0 0 10px` al 70%) | Hero | Pedido del usuario: el copy "Unite a Sura…" se mezclaba con el arte y lo quería "sutil". No sale del Figma. Se midió el contraste del blanco contra cada píxel del contorno de las letras (2px alrededor de la tinta), en los cuatro slides y los dos tamaños. **Sin sombra**, el contorno por debajo de 4,5:1 iba de 2 a 29% en desktop y de 35 a 66% en mobile. `--text-shadow-banner`, que ya existía, resolvía desktop pero dejaba mobile en 31-48%: a 12px una sombra de 4px no alcanza. La de dos capas —un halo corto que recorta la letra y uno ancho que baja el fondo— deja **desktop en 0% en los cuatro slides y mobile en 7-20%**, sin armar un bloque oscuro detrás del texto. Va la misma en los dos tamaños para que el copy tenga una sola receta. Los slides 2 y 3 en mobile (Black Ops 6 y Modern Warfare III, con el logo gris enorme detrás) siguen siendo los peores: no se empujó más para no perder el "sutil". No mueve el layout. |
| 2026-09-23 | **Header mobile con vidrio al scrollear, en todas las rutas** | Header | Sin tokens nuevos: reusa `--blur-nav` de la bottom bar y `--color-background` al 60%. El estado lo da `data-scrolled` en el `<header>` (`scrollY > 0`) y el div mobile lo lee con `group-data-scrolled:`. El `solid` de las rutas internas pasa a `desktop:bg-background`. Detalle y medidas de contraste en § 5. |
| 2026-09-23 | `--shadow-row-me` (`0 0 10px` `#97f300` al 15 %) y **el velo de "Tu posición" ya no tapa su borde** | Leaderboard | Bug que levantó el usuario: en hover el borde verde de la fila desaparecía y sólo quedaban unos píxeles verdes en las esquinas. El borde es `ring-1 ring-inset` —un `box-shadow` de la propia fila— y el velo de hover es un `<span>` opaco (`bg-surface-2`) en `inset-0`: se pinta encima del anillo y lo tapa entero, salvo el antialias de las esquinas, que el velo recto no llega a cubrir. Medido: el borde pasaba de `151,243,0` a `48,48,48`. **Sólo le pasaba a esta fila**: las comunes dibujan el borde en un `::after` que queda arriba del velo, y las del podio tienen un velo translúcido (`white/4`) que deja ver su anillo. Ahora el velo de esta fila va `inset-px` con el radio concéntrico (`calc(var(--radius-lg) - 1px)`), así que llena el interior sin pisar el borde. Primero se probó llevar el anillo a una capa encima del velo, pero las esquinas quedaban antialiaseadas dos veces —por el radio de la capa y por el `overflow-hidden` de la fila— y el reposo cambiaba hasta Δ52. Con el velo achicado, **el reposo queda idéntico al píxel** y el hover mantiene el verde en los cuatro bordes. Como señal extra de hover, pedida "sutil", la fila suma un glow verde con la receta del glow de la fila dorada (10px al 15 %): el borde ya es verde, así que es el mismo criterio que el *glow de link* de § 6 — iluminar lo que ya es verde. Las filas común y dorada no se movieron un píxel ni en reposo ni en hover. Aplica también a la fila mobile, que comparte `standings-tone`. |
| 2026-09-23 | **Sin over-scroll en ningún eje** | Todas las rutas | Pedido del usuario: la página rebotaba en los bordes (Y) y se podía arrastrar de costado (X). `overscroll-behavior: none` en `html` y `body`, en la misma regla base que ya oculta la barra de scroll, y **`overscroll-x-none` en los cuatro scrollers horizontales** (`card-slider`, la galería mobile de Sura News, `route-tabs` y `filter-chips`) para que al llegar a la punta de un carrusel el gesto no se encadene a la página: en Chrome eso dispara el *swipe* de atrás/adelante. En los scrollers se apaga sólo el eje X: la rueda vertical sobre un carrusel sigue scrolleando la página (medido, +300px por muesca en los dos tamaños). Consecuencia aceptada: en Chrome Android se pierde el *pull-to-refresh*. El rebote y el swipe no se pueden reproducir en Playwright headless: lo verificado es el valor computado en `html`, `body` y los siete scrollers de `/`, `/missions` y `/leaderboard`. |
| 2026-09-21 | `--gradient-banner-border` + `@utility border-gradient-banner` | Juegos | El borde del banner **no es el `#97f300` plano** que devolvió el MCP: lo levantó el usuario del panel de Figma y se reconstruyó muestreando el render del nodo, borde por borde. Es un degradé de **siete stops a 160,7°** con el verde puro en el medio y las puntas apagadas: `#b7e369 → #acbd81 → #a1d148 → #97f300 (50%) → #a7ba79 → #7d9e3e → #68951c`. El eje salió de que dos esquinas opuestas —arriba a la derecha y abajo a la izquierda— dan el mismo `#97f300`: eso fija la iso-línea, y la perpendicular es el eje. Medido contra el render en 14 puntos del perímetro: **11 dentro de Δ≤4** y el peor caso Δ15 en el azul, en un tramo de transición. **Es la sexta vez que el MCP aplana un degradé.** |
| 2026-09-21 | **El banner de `/games` es un solo destino** | Juegos | Pedido del usuario: la card entera lleva al mismo lado que "Jugar ahora", igual que el banner del Home. Mismo recurso — un `<button>` estirado (`absolute inset-0`, `aria-hidden`, `tabIndex={-1}`) debajo del contenido en `pointer-events-none`, con el CTA de vuelta en `auto`. Verificado: el click en el arte, en el título y en la esquina cae en el botón estirado, el del CTA en el CTA, y la tabulación sigue teniendo **una sola parada**. **No lleva sombra de hover** —a diferencia del banner del Home— porque en reposo ya tiene el glow verde; el CTA conserva la suya. |
| 2026-09-21 | **El título del banner pasa a Monument y su caja de 486 a 530** | Juegos | Pedido del usuario: la misma font que el banner del Home. Los tokens `--text-banner-title` (40/48) y `-sm` (24/28) suman el `letter-spacing: -0.0625em` que el Home arrastra desde `--text-display-xs`, y la familia pasa a `font-display`. Con ese tracking la línea larga mide **523px**, así que la caja del diseño (486) no alcanza y va a los **530 del banner del Home**. En mobile entra sin tocar nada: 313,8 sobre 326. |
| 2026-09-21 | **Los dropdowns de `/games` pasan de `--color-surface` a `--color-surface-2`** | Juegos | Pedido del usuario. El frame los pinta `#222` sobre un artboard sin fondo; contra nuestro `#202020` quedaban a **2 niveles** y casi no se distinguían. `--color-surface-2` (#303030) los deja a 16, y es el token que ya usan el chip de filtro activo y el pill de puntaje neutro. |
| 2026-09-21 | **El aire de `/games` no es el `gap-6` del shell de ruta** | Juegos | El frame pone **48** entre los controles y el banner, otros 48 entre el banner y la grilla, y sólo 24 antes del paginador. Es el mismo patrón que ya tenía la sección Juegos del Home (50,5 en vez de los 16 de siempre). Se resuelve con un único hijo del `RouteShell` que arma su propia columna (`gap-6 desktop:gap-12`), así el `gap-6` del shell queda inerte y ninguna otra ruta se entera. En mobile el frame sí pide 24 en todos los saltos. |
| 2026-09-21 | **El buscador estrena anillo de foco** | Eventos · Leaderboard · Juegos | El componente mataba el `outline` del input pero el anillo de reemplazo sólo lo pasaba `/tournaments` por `className`: en las dos rutas nuevas, tabular al buscador no se veía. El `focus-within:ring-border-light` bajó a la base, donde vive el `outline-none`. Verificado: las tres rutas dan ahora `rgb(221,221,221)` inset de 1px con el foco puesto, y `/tournaments` conserva su anillo en reposo al 25 %. |
| 2026-09-21 | **Las flechas del paginador compacto toman el hover de las del carrusel** | Leaderboard · Juegos | El diseño no define hover y la variante compacta había quedado con `transition-colors` y ningún color al que ir. Reusa `hover:text-brand` / `focus-visible:text-brand`, que es lo que ya hacen las flechas de `card-slider`: es el mismo control. |
| 2026-09-21 | **Los degradés de las tres primeras filas se reescriben opacos, con cinco stops** | Leaderboard | El Figma los define como `rgba(c, 0.75) → #222 al 25%`, pero **Figma interpola el alfa sin premultiplicar y CSS sí lo premultiplica**: traducido literal, la mitad del recorrido queda 13 niveles más oscura. Se reprodujo la curva de Figma compuesta sobre `#222` con stops al 0 / 6,25 / 12,5 / 18,75 / 25 %. Medido contra el render: **≤2 niveles** en todo el barrido, contra 13 de la traducción directa. `--gradient-row-gold` (de `#c08a0c`), `-silver` (`#909090`) y `-bronze` (`#9f6c3c`). |
| 2026-09-21 | `--color-rank-gold` (#ffd658), `-silver` (#e6e6e6), `-bronze` (#ffa951) | Leaderboard | El número de puesto de las tres primeras filas. El resto usa `--color-muted-foreground`, que ya existía. |
| 2026-09-21 | `--shadow-row-gold` / `-silver` / `-bronze` y `--shadow-gold-glow-soft` | Leaderboard | Glows de las tres filas del podio (10px el oro, 5px los otros dos, todos al 15 %) y el del 1º del podio, que acá es **7,5px al 35 %** y no los 15px/55 % del Home: son dos frames distintos y cada uno conserva el suyo. |
| 2026-09-21 | `--color-search-field` (#1c1b1f) | Leaderboard · Juegos | Fondo del buscador de una ruta interna. Es el único valor del control que no era ya un token nuestro. |
| 2026-09-21 | **El anillo de las medallitas va a 1px al 30 %, no a los 0,25px del Figma** | Leaderboard | El MCP declara `border 0.25px #97f300` en los tres círculos de 16px de la columna Medallas. Muestreado el render del nodo, Figma lo pinta como **un píxel entero de `#97f300` al 31 %** sobre `#222` (medido `#466317`). Se implementó así — `border-brand-vivid/30` —, que respeta la política de redondear los strokes de medio píxel y encima reproduce el render. El token `--shadow-medal-ring` que se había creado para el 0,25px se borró. |
| 2026-09-21 | `--text-banner-title` (40/48) y `--text-banner-title-sm` (24/28) | Juegos | Título del banner de la ruta. `--text-display-sm` es 40/40 y arrastra Monument; acá el interlineado es 48 y la familia es otra (ver *Decisiones tomadas sin consulta*). |
| 2026-09-21 | `--text-game-title` (20/24) | Juegos | Título de la card en la grilla de `/games`. La misma card en el Home usa `--text-base` (16/24); acá el frame pide 20 y el `min-h` de 126 del panel sólo cierra con interlineado 24, así que `--text-card-title` (20/28) no servía. Entra como prop `largeTitle`, así el Home no se mueve. |
| 2026-09-21 | `--gradient-banner-scrim`, `-mobile` y `--gradient-banner-cta`; `--shadow-banner` | Juegos | El banner de la ruta **no es el del Home**: el scrim es **olivo** (`#354619`, que ya era `--color-sp-foreground`) y no violeta, el borde y el glow son verdes (`--color-brand-vivid`, `0 0 15px` al 35 %) y el CTA va `#97f300 → #6bad00` con el texto en `--color-sp-foreground`. Los stops del scrim desktop son los mismos de `--gradient-promo-scrim` con otro ángulo (244,46°); el mobile es vertical. |
| 2026-09-21 | **`mission-tabs` → `route-tabs`, `mission-filters` → `filter-chips`** | Leaderboard · Misiones | Los dos eran el mismo componente del Figma con la data de Misiones adentro. Ahora reciben `items` y `label`, y `/missions` los llama con su propia data. Verificado que la pantalla no se movió: los cuatro tabs siguen midiendo **160 × 44** en desktop y 80 / 108,81 / 70,41 / 99,2 en mobile. El `desktop:w-40` pasó a **`desktop:min-w-40`** porque "Sura Points" en KH mide 185,6 y no entraba; con los labels de Misiones el ancho sigue dando 160. |
| 2026-09-21 | **`tournaments-search` → `search-field`, compartido por las tres rutas** | Eventos · Leaderboard · Juegos | Era el mismo control duplicado. El componente trae ahora el chrome de las rutas nuevas (`bg-search-field`, `px-4 py-2`, gap 8/12) y `/tournaments` pasa el suyo por `className`. Verificado que `/tournaments` no se movió: buscador 622,5 × 40 con `#303030`, gap 6 y el mismo anillo, y el documento sigue en 1508px. |
| 2026-09-21 | **El paginador estrena variante compacta de mobile** | Leaderboard · Juegos | Los dos frames mobile dibujan `‹ 1 / 5 ›` en vez de la lista numerada. Entra como prop `compactOnMobile`, que no toca a `/tournaments` ni a `/missions`. Sin tokens nuevos: chevrons de `lucide-react` a 32, "1" en `text-base` semibold y "/ 5" en `--color-muted-foreground`. El `pt-3` que el componente traía se puede apagar con `className`, porque acá el frame pide exactamente los 24 del `gap-6` del shell. |
| 2026-09-18 | `--breakpoint-desktop: 391px` | Home | Único prefijo responsive. El diseño mobile vive sólo hasta 390px; de 391 para arriba manda desktop. |
| 2026-09-18 | Fuentes: `--font-display`, `--font-techno`, `--font-sans` | Home | Tres familias. Las dos primeras son **sustitutos libres** de fuentes comerciales (ver deuda). |
| 2026-09-18 | Tipografía: `--text-display(-sm/-xs)`, `--text-title`, `--text-card-title`, `--text-link`, `--text-cta`, `--text-note`, `--text-base`, `--text-ui`, `--text-xs/2xs/3xs` | Home | Escala relevada sección por sección. Cada token lleva su familia, line-height y tracking. |
| 2026-09-18 | `--text-sm` (14/20, Inter) | Header | Nombre de usuario en el header mobile. *(Antes estaba marcado como fuera del diseño: se corrigió al maquetar el bloque 1.)* |
| 2026-09-18 | ~~`--border-thin: 1.5px`~~ | Header | Anillo del avatar. **Eliminado el 2026-09-19**: Chrome trunca `border-width` a píxeles enteros y el 1.5 se pintaba de 1. El anillo pasó a `border-2`, que está en la escala de Tailwind, y el token quedó sin uso. |
| 2026-09-18 | `--shadow-badge` → `--drop-shadow-badge` | Header | El badge de nivel es un PNG con alfa: la sombra tiene que seguir la silueta. `box-shadow` dibujaba un rectángulo. |
| 2026-09-18 | Marca: `--color-brand #A5E04A`, `--color-brand-deep`, `--color-brand-faint` | Home | El verde cambió respecto del diseño viejo y **no está publicado como variable de Figma**: se tomó del uso real. |
| 2026-09-18 | Superficies y bordes: `--color-surface(-2/-3)`, `--color-overlay`, `--color-border(-muted/-light/-dim)` | Home | Nav, cards, badges, bottom bar. |
| 2026-09-18 | **Familia dorada**: `--color-gold`, `--color-gold-deep`, `--color-gold-bright` + gradientes | Home | Nueva en el rediseño: premios, podio y medallas. No existía antes. |
| 2026-09-18 | Radio: `--radius-xs…2xl`, `--radius-pill` | Home | De 2 px (badges) a 30 px (CTA del hero). |
| 2026-09-18 | Sombra: `--shadow-bar`, `--shadow-badge`, `--shadow-gold-glow`, `--drop-shadow-claim`, `--drop-shadow-cta` | Home | `--shadow-bar` es la variable "Shadow 3" del Figma. |
| 2026-09-18 | Layout: `--container-page 1144px`, `--spacing-gutter(-desktop)`, `--spacing-nav-x`, `--spacing-section-gap`, `--spacing-title-gap` | Home | La grilla del rediseño cierra exacta (ver sección 4). |
| 2026-09-18 | `--color-nav-glass`, `--shadow-nav`, `--blur-nav` | Menú flotante desktop | Fondo `rgba(255,255,255,0.01)` + `backdrop-blur(10px)` + sombra `0 0 8px rgba(39,82,108,0.3)`. La sombra es distinta de `--shadow-bar`; el blur va al namespace `--blur-*`, que no está reseteado. |
| 2026-09-18 | `--color-tooltip: #1A1A1A` | Tooltip del menú flotante | Único token que **no sale del Figma**: el elemento solo existe en `app.suragaming.com`. El resto de sus valores ya eran tokens nuestros (`--color-border`, `--radius-xl`, `--shadow-nav`, `--text-sm`). |
| 2026-09-20 | **El scrim del banner se queda como está** | Juegos | Se probó apagarlo al 40% del ancho para que se viera más el arte (pedido del usuario). En mobile no entra: el copy va de borde a borde y el título, que no lleva `text-shadow`, se lava sobre la camiseta celeste. En desktop sí entraba —la cola del título quedaba sobre cancha oscura, luminancia 47-71 sobre 255— pero al verlo el usuario lo descartó (2026-09-20). Los stops de `--gradient-promo-scrim` y `-mobile` vuelven a los del diseño; el render desktop es **idéntico píxel a píxel** al de antes del bloque. |
| 2026-09-20 | `--shadow-promo-hover` y `--shadow-promo-cta-hover` | Juegos | Hover del banner y de su CTA. Ninguno sale del Figma. El violeta es el de `--shadow-promo` más extendido y al doble de opacidad (15px/0.2 → **24px/0.4**); el verde apila un glow de 14px al 0.55 sobre la caída que el CTA ya tenía, que es la receta de `--shadow-cta-hover`. El banner no es link: el hover es del contenedor y el CTA mantiene el suyo. |
| 2026-09-20 | `--gradient-card-border` + `@utility border-gradient-card` | Juegos | El borde del panel de la card también se apaga hacia abajo. Medido sobre el render del nodo `6008:26683`: `rgba(161,161,161,.5)` arriba, que se sostiene hasta el **40% de la altura** y cae a **0,1** abajo. Mismo anillo enmascarado que la fila del Leaderboard y el menú. |
| 2026-09-20 | **El banner de Juegos es un solo destino** | Juegos | Pedido del usuario: la card entera lleva al mismo lado que "Jugar ahora". Como no hay ruta todavía, los dos van como `<button>` sin handler — el criterio del footer y de "Ver todo". El CTA sigue siendo el control real, focusable y con su propio hover; la card suma un segundo botón estirado (`absolute inset-0`), `aria-hidden` y `tabIndex={-1}`, que es sólo comodidad de puntero y no agrega una parada de tabulación. El contenido va `pointer-events-none` sobre él, con el CTA de vuelta en `auto`: así el click en el título cae en el botón estirado y el del CTA en el CTA. |
| 2026-09-20 | **Se aplicó la regla 19 a todo el repo** | — | Se borraron los 146 bloques de comentario de `app/`, `components/` y `lib/`, los de `scripts/shot.mjs` y los 81 de `globals.css`: 1138 líneas. Sobreviven el único `TODO` (los widths de `shot.mjs`), 24 separadores de `globals.css` reducidos a su etiqueta — son navegación en un archivo de 900 líneas, no explicación. Lo que decían las medidas y los desvíos ya estaba acá; lo que no, se migró antes de borrar: tres trampas nuevas a las notas de implementación y todo lo que era decisión de código a **Notas de arquitectura**, una sección nueva de § 6. Después se agregaron **13 guardas** de una línea, con la excepción que estrena la regla 19 (ver Notas de arquitectura). Verificado: `npm run verify` limpio y el render no se movió (el único delta contra el screenshot anterior es el pill del menú, que depende del scroll al sacar la foto). |
| 2026-09-20 | **Footer: hover en todo lo accionable y mobile redistribuido** | Footer | Pedido del usuario. **Hover**, sin tokens nuevos: los textos suben de `--color-foreground/80` a full, los íconos de redes toman `--drop-shadow-link-hover` y el borde de los badges de tienda pasa de `--color-border-muted` a `--color-border-light`. **Mobile**: el footer estaba todo centrado en una columna angosta, con el ancho libre a los costados. Ahora alinea al gutter y **agrupa denso**: el logo lleva al lado los dos íconos de comunidad, los cuatro links pasan de una columna a una **fila envuelta** de dos renglones, los badges de tienda van `flex-1` y llenan la fila (163 × 36), y cada fila de redes pone la etiqueta en un ancho fijo de 72 para que los íconos de los dos idiomas queden alineados. El alto baja de **554 a 462**. Es adaptación nuestra —no hay frame mobile del footer— y **desktop no se movió**: medido, 1440 × 210 con el logo, el nav, los badges de 104 × 36, la línea y el copyright en las mismas coordenadas. |
| 2026-09-20 | `--drop-shadow-link-hover` | Todas las secciones | Los links "Ver todo" e "Ir a Sura News" no tenían ningún hover. Pedido del usuario. `0 0 4px` del `#97F300` al 0,25 — la misma familia de luz que `--shadow-brand-glow`. Arrancó en `0 0 8px` al 0,45 y el usuario lo bajó: a ese tamaño era una nube alrededor del texto. A 4px el halo queda pegado a la letra, que es lo que se pedía. Se comparó también con `0 0 3px` al 0,2, que ya casi no se ve. Va como `drop-shadow` y no `text-shadow` porque la flecha es un `<img>` y quedaría apagada. |
| 2026-09-20 | **Misiones y Sura News pasan al hover de elevación** | Misiones · Sura News | Pedido del usuario: las dos usaban el glow verde y el título a verde, y querían el efecto de Juegos. Sin tokens nuevos — reusan `--shadow-card-hover` y los grises que ya existen. Misiones sube su anillo de `--color-border` a `--color-border-muted` al 60%; Sura News no tiene borde, así que el escalón lo da la superficie: `--color-background` → `--color-surface-3` en desktop y `--color-surface-3` → `--color-surface-2` en mobile, los dos de 8 niveles. Los títulos dejan de teñirse. |
| 2026-09-20 | Cards de Juegos → `<Link href="/games/:id">`, con `--shadow-card-hover` y `--gradient-card-border-active` | Juegos | Arrancaron con el vocabulario verde de Misiones y Sura News (glow de marca + título a verde) y el usuario lo descartó (2026-09-20): lo quería **oscuro y sutil**. El verde se fue entero. Queda el zoom de la portada, la card **sube 2px** con `translate` —el mismo recurso que las cards del podio, que no toca el layout—, una sombra negra de elevación (`0 8px 24px` al 0,55) y el borde del panel un escalón más presente, con el mismo desvanecido hacia abajo: medido, de 100 a **175** a media altura. El título se queda blanco y los badges van de `--color-muted-foreground` a `--color-subtle-foreground`. Es el mismo criterio que la fila del Leaderboard: **el movimiento es la señal fuerte, el color sólo acompaña.** |
| 2026-09-20 | `--gradient-row-border` + `@utility border-gradient-row` | Leaderboard | El borde de la fila se apaga hacia abajo, como en el diseño. Medido sobre el render del nodo `6008:26530` muestreando el borde izquierdo cada 2px: **0,95 arriba, 0,59 a media altura y 0,18 abajo**, lineal. El MCP lo devolvía plano, como ya había pasado con la bottom bar, el podio y la card de Juegos. Reusa el anillo enmascarado del menú, que no agrega tamaño: la fila sigue midiendo 59,4 en desktop y 56 en mobile. |
| 2026-09-20 | `components/sections/events-slider.tsx` → **`card-slider.tsx`**, compartido | Eventos · Misiones | Las dos secciones pasan a **6 cards** (pedido del usuario) y comparten el carrusel. Lo que cambia entre ellas entra por prop: paso, recorte del viewport y altura de las flechas. Eventos conserva su `padding-top`, que no es decorativo — es el aire del personaje que se sale por arriba. En Misiones las cards pasan de repartirse los 1144 a los **268 fijos del diseño**: con seis, la fila ya no entra. Los personajes de Eventos ahora **alternan** Domino/Squad en vez de repetirse pegados. |
| 2026-09-20 | `hero.autoplayMs` (3000) en `lib/data/hero.ts` | Slider del hero | El slider pasa a **carrusel**: flechas que dan la vuelta y avance automático cada 3s. Pedido del usuario. Es el **tercer desvío consciente de AGENTS regla 16** y el **único lugar del proyecto donde `prefers-reduced-motion` se lee desde JS** — el resto son transiciones que apaga el propio CSS. Sigue sin entrar ninguna librería de motion. |
| 2026-09-20 | `--hero-art-fade-duration` de 320ms a **500ms**, y la curva de `--ease-reveal` a **`ease-in-out`** | Hero | El cambio de arte se sentía brusco (usuario). Eran dos cosas: no había cruce real (ver notas de implementación) y la curva era de entrada, no de cruce. Medido sobre el render: con `--ease-reveal` la capa nueva llegaba al **75% de opacidad en los primeros 177ms** de los 320, así que el cambio pasaba casi entero en un cuarto del tiempo y el resto era arrastre invisible. Con `ease-in-out` a 500ms el reparto es simétrico: 23% a los 170ms, 50% a los 252, 81% a los 353. Se probó 700 y 600; los 500 son pedido del usuario, que los quería \"ligeramente más rápidos\". |
| 2026-09-20 | **Arte del hero y de los tres juegos, upscaleado 2×** | Hero | Pedido del usuario, que autorizó el desvío de la regla 10. Real-ESRGAN (`realesrgan-ncnn-vulkan`, binario oficial, local y gratis) con el modelo **`realesrgan-x4plus`**: se probó también `-anime` y aplana las pinceladas del arte, que es justo lo que hay que conservar. Se sube 4× y se baja al doble del tamaño de uso, en JPEG calidad 85 — comparado contra 70, 80 y 90, arriba de 85 no se gana nada visible. Los originales **quedan en el repo** y siguen siendo la miniatura del slider: el `@2x` entra sólo en `artSrc`, así el cuadradito de 60px no carga el archivo grande. |
| 2026-09-20 | **La barra de scroll de la página se oculta** | Home | Pedido del usuario. `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` sobre `html` y `body` en la capa base, la misma receta que ya usaba `@utility no-scrollbar` en los carruseles. No se hereda: una `<section>` cualquiera sigue en `auto`. La página scrollea igual con rueda, teclado (`PageDown`, `End`, `Home`) y touch — verificado. En macOS la barra ya se oculta sola salvo que el sistema esté en "Mostrar siempre", así que el cambio se nota sobre todo con mouse, en Windows y en Linux. |
| 2026-09-21 | **Variante `compact` de la card de misión** | Misiones | La grilla mobile de la ruta es de 2 columnas y su card mide 173,5: el diseño le da **padding 8 y gap 8**, contra los 16/24 de la card grande. Estábamos usando los de desktop en los dos tamaños y la card salía **208,6 de alto contra los 153,6** del frame. Entra como prop `compact`, que sólo afecta a mobile —desktop queda idéntico— y además clampea la bajada a 2 líneas, que es lo que el diseño muestra. Medido después: **173,0 × 153,6**. El Home no la usa: su card mobile mide 261 y se queda con el padding grande, que es lo que le corresponde por tamaño. |
| 2026-09-21 | **El título y el check de la card escalan con el tamaño** | Misiones | Título **12/14 en mobile** y 14/20 en desktop. El círculo del check pasa de uno solo de 54 a **32 en mobile** y 54 en desktop, con el ícono a 14 y 23. Todo sale de los frames. |
| 2026-09-21 | **Lote de correcciones de la revisión de código** | Misiones | Cuatro hallazgos sobre los dos commits de la pantalla. **(1)** El subrayado del tab activo no se pintaba — ver notas de implementación. **(2)** `slide-third` había quedado insertada entre el comentario de `lift-room` y su utility, robándole la etiqueta a una guarda listada en *Notas de arquitectura*; se reordenó y el `calc` se reescribió como `2 * var(--spacing) * 6` para que se lea que está atada al `gap-6`. **(3)** Los nueve tokens nuevos de la pantalla estaban en este changelog pero **no en `lib/data/design-tokens.ts`**, así que no aparecían en `/styleguide` (§ 7, paso 5). Catalogados; verificado que los nueve se ven y que ninguno resuelve vacío. **(4)** El paginador ocultaba en mobile las páginas 4 en adelante por posición: con `current` mayor a 3 desaparecía justo la página activa. Pasa a una ventana de tres centrada en `current`, que hoy da lo mismo y mañana no miente. |
| 2026-09-21 | **El badge de la card completada lleva borde, y el de la destacada crece en desktop** | Misiones | Los dos, pedido del usuario. El badge de completada no tenía borde en el diseño y por eso salía **1px más chico** que el de una card normal: ahora lleva el mismo `border-b border-r`, pero en `--color-border-done` —el olivo del borde de la card— y no en el verde de marca, para igualar el tamaño sin encender un badge que el diseño tiene apagado. Los dos miden **65,1 × 28**. Y en desktop la card destacada es 1,36× la de la grilla mientras el badge era idéntico: se lo escaló ~1,25× (`--text-reward-lg` 18/18, moneda a 20, padding 8/6) y queda en **83 × 35**. **En mobile no cambia**: ahí la destacada es sólo 1,5× y el badge está bien. De paso la moneda pasó de un ancho arbitrario a `aspect-[17.455/16]`, así el tamaño grande sale solo. |
| 2026-09-21 | **La card completada se unifica al diseño mobile** | Misiones | En el Figma los dos tamaños no coinciden y el usuario pidió priorizar mobile (2026-09-21), que se ve mejor. El nodo bueno es `6008:29730`. Fondo **`#1d2518`** —que es el `#091900` que sospechaba el usuario con un `#303030` al 50% encima, no un velo verde—, borde **`#456215`**, y el texto a `--color-muted-foreground` al **67%**. El badge de SP comparte el mismo fondo, así que `--color-sp-badge-done` se borró y quedó un solo `--color-surface-done`, que cambió de `#404040` a `#1d2518`. Desktop ahora usa exactamente lo mismo; lo único que sigue escalando es el círculo del check (32 / 54), que es proporción, no desconexión. |
| 2026-09-21 | `--gradient-mission-border` + `@utility border-gradient-done` | Misiones | El borde de la portada de una card completada **no es el `#a5e04a` plano** que devolvió el MCP: es un degradé de **seis stops** a 61° que el usuario levantó del panel de Figma — `#a5e04a → #abb58a → #588d00 → #bcf363 → #abb58a → #a5e04a` en 0/18/39/63/81/100%. Es la cuarta vez que el MCP aplana un degradé. Se dibuja con el anillo enmascarado de siempre, pero en `::after` y no `::before`: el velo verde de la portada es un hermano posicionado posterior y taparía un `::before`. |
| 2026-09-21 | Las flechas del carrusel salen del SVG, no del MCP | Misiones | `--shadow-arrow`. El chevron es **círculo de 40 con fondo `#303030`, anillo 1px `#a5a5a5`, glifo blanco de 14,5 con trazo 1 y sombra `0 3.64px 4.55px` negro al 50%**; apagado va `#252525` con anillo y glifo `#414141`, sin sombra. Nada de eso estaba en el `get_design_context`, que devolvió un `<img>` pelado — hubo que abrir el SVG. Los grises del apagado se normalizaron a `--color-surface-3` y `--color-border-dim`, los dos a 3 niveles del medido. El glifo va con `[&_svg]:size-7 [&_svg]:stroke-1` desde `arrowClassName`, así `CardSlider` no cambia y los carruseles del Home siguen con su chevron pelado. |
| 2026-09-21 | **Las flechas del carrusel de Misiones llevan fondo y van a caballo del borde** | Misiones | El Figma las dibuja como chevrons pelados igual que los del Home, pero acá caen **sobre la portada de las cards** y no se ven — el problema lo tiene el propio diseño, se ve en su render sobre la card roja de Call of Duty. Se les puso un círculo con `--color-overlay` y anillo `--color-border`, que es el mismo recurso que ya usa el panel de las cards de Juegos para apoyar texto sobre una imagen. Y pasan a `-left-5` / `-right-5`, centradas en el borde de la columna: mitad sobre la card, mitad afuera, que es lo que hace la flecha derecha del Figma. Sólo este carrusel; los del Home no se tocan. |
| 2026-09-21 | **Las cards de un carrusel de ruta se miden en fracción de la columna, no en px** | Misiones | Lo vio el usuario en su monitor. La columna de ruta es **fluida** y las destacadas estaban fijas en 399: a 1440 cerraban justo, pero de ahí para arriba sobraba espacio a la derecha y la flecha quedaba flotando lejos de la última card. Ahora usan `@utility slide-third` —`calc((100% - var(--spacing) * 12) / 3)`— así que a 1440 siguen dando los **399 exactos del diseño** y a 1700 / 1920 crecen a 485,7 / 559 cerrando siempre contra el borde. `--spacing-mission-feature` quedó sin uso y se borró. **Cualquier carrusel de una ruta interna tiene el mismo problema si fija el ancho en px.** |
| 2026-09-21 | **`CardSlider` mide el paso en vez de recibirlo** | Todos los carruseles | La prop `step` declaraba el ancho de card más el gap en cada call site — tres constantes duplicadas que además se rompían con las cards fraccionarias de arriba. Ahora lee el primer slide y el `column-gap` computado. Verificado que los del Home no cambiaron: Eventos avanza 389 en desktop y 234 en mobile, Misiones 292 y 273, exactamente los valores que declaraban. |
| 2026-09-21 | **El carrusel de destacadas pasa de 3 a 6** | Misiones | Pedido del usuario. Las tres nuevas traen portada y copy propios —racha, referidos y primer torneo— en vez de repetir las de conexión de cuentas, y cada una tiene su propia bajada en lugar del texto placeholder compartido. Las seis portadas son distintas entre sí. |
| 2026-09-21 | **La card de la grilla de `/missions` es la `MissionCard` del Home** | Misiones | No es una card parecida: es la **misma instancia de Figma** (`940:13436`), con el mismo `#222`, borde `#494949`, sombra, aspect `229.456/128` y badge de SP. Lo único que se hizo fue **sacarle el ancho** —ahora lo pone quien la usa, el Home con sus medidas fijas y la ruta dejando decidir a la grilla— y sumarle el estado *completada*. Verificado que el Home no se movió: 4156px y la card sigue en 268 × 237,64. |
| 2026-09-21 | Estado *completada*: `--color-surface-done`, `--color-sp-badge-done`, `--gradient-mission-done`, `--gradient-mission-check` | Misiones | La card sin borde sobre un gris más claro (el `#303030` con un gris al 20% encima, resuelto en un color plano), velo verde sobre la portada, badge de SP en verde sobre fondo oscuro y el círculo del check. Título y descripción bajan a `--color-muted-foreground`. El check es el SVG del diseño, con stroke `#A5E04A`. |
| 2026-09-21 | **La descripción de la card se unifica en gris** | Misiones | La misma instancia describe en `#a5a5a5` en el frame del Home y en blanco en el de la ruta: el diseñador overrideó una sola. Se unificó en gris por § 6, normalización punto 4 (*cards hermanas que difieren se unifican al valor de la primera*), en vez de meter una prop cuyo único trabajo sería un color que casi seguro es un desliz. |
| 2026-09-21 | **Tabs y chips: cero tokens nuevos** | Misiones | Todo el vocabulario ya existía — borde `#444` es `--color-border-dim`, activo `#a5a5a5` es `--color-muted-foreground`, fondo del chip activo `#303030` es `--color-surface-2`, radio 30 es `--radius-pill`, texto 14 es `--text-sm`. El borde de 1,5 va a **2** por la política de redondear los strokes de medio píxel, así que el tab mide 44 y no 43. El chip conserva sus 36 exactos porque el alto lo da el padding, no el interlineado. |
| 2026-09-21 | **En mobile los tabs y los chips van scrolleables, sin `FILTRAR`** | Misiones | El frame mobile colapsa los dos en un `FILTRAR`, pero el panel que abriría no está diseñado — el mismo problema que hizo sacarlo de `/tournaments`. Mostrarlos directamente no inventa nada y no pierde información. Los tabs **huguen en mobile** en vez de los 160 fijos del desktop, que son medida de desktop: así los cuatro entran justos en 358 (80 + 108,8 + 70,4 + 99,2 = 358,4) y ni hace falta scrollear. |
| 2026-09-21 | `--text-mission-copy` (12/18), `--gradient-mission-highlight` | Misiones | La card destacada del carrusel. El 12/18 no estaba: `--text-note` y `--text-news-copy` son 12/16 y `--text-legal` arrastra tracking. El degradé de la destacada es el verde al 12,5-25 % sobre `#141218`. |
| 2026-09-21 | **La card destacada sigue el tratamiento de desktop en los dos tamaños** | Misiones | El frame mobile la dibuja como la card chica con **barra de progreso** y la descripción en **8px**. La barra ya estaba resuelta como error de diseño (usuario, 2026-09-19) y el 8px es el mismo artefacto de escalado de siempre: quedaría más chica que la descripción de la grilla, que es 10. Va el tratamiento de desktop escalado, con `--text-2xs` en mobile. |
| 2026-09-21 | `CardSlider` acepta el lado de las flechas | Misiones · Eventos | En el Home las flechas viven en los gutters (`-left-13.25`); el carrusel de Misiones las mete **adentro**, a 20 del borde. Entra como prop `arrowSides` con el valor del Home por default, así ningún call site existente cambia. El diseño las pone asimétricas —la derecha se sale 20px del carrusel— y se normalizaron simétricas. |
| 2026-09-21 | **El paginador oculta páginas en mobile** | Misiones | Misiones tiene 5 páginas y a 390 el paginador mediría 422 sobre 358. De la cuarta en adelante se ocultan con `hidden desktop:block`, el mismo recurso que ya usan los badges de las cards de Juegos. En mobile quedan Atrás · 1 2 3 · Siguiente, 337,4 de ancho. |
| 2026-09-21 | **Se saca el `FILTRAR` de mobile** | `/tournaments` | Lo levantó el usuario: estaba maquetado y nadie había definido qué abre. Mirando el rediseño se ve qué **es**: Misiones tiene tabs + chips en desktop y en mobile sólo `FILTRAR`, o sea que no es un control propio sino **el colapso mobile de los filtros de desktop**. Eventos no tiene filtros en desktop, así que acá no colapsa nada — no tiene referente. Además `AGENTS.md` regla 12 ya decidía el caso: ante un conflicto irreconciliable entre tamaños gana desktop. Se fueron el componente, el `filter.svg` y el slot `action` del `RouteShell`, que quedaba sin uso (regla 15: no se extiende preventivamente). Verificado que el H1 no se movió: caja de texto en y=130 / 72, con los mismos 24 / 16 al header. |
| 2026-09-20 | **La card de torneo traduce cuatro cosas del Eventos viejo** | `/tournaments` | Sin tokens nuevos. Los badges pasan de pill **blancos** con texto oscuro a los oscuros de Eventos; el premio, de texto verde inline a nuestro pill dorado con borde `--color-gold`; el nombre del juego, de blanco semibold a `--color-muted-foreground`, que es lo que es —una etiqueta, no un dato—; y el título, de Inter 18 a `font-techno` uppercase, como todas nuestras cards. La base es `mission-card.tsx`, que ya era portada arriba + texto abajo con el **hover de elevación** de § 6; se reusan también los tres íconos de badge, el trofeo y el pill dorado de la card de Eventos del Home. |
| 2026-09-20 | **El título de la card lleva caja fija de 2 líneas** | `/tournaments` | Con el título en una o dos líneas las cuatro cards de una fila se desalineaban por dentro: fecha, badges y *Hosted by* caían a distinta altura. El Figma ya lo resolvía con una caja fija de 50 y centrado vertical. Va `h-14` (2 × 28) **sólo en desktop**: en mobile las cards van en una columna, así que ahí la caja fija no alinea nada y sólo agrega aire muerto. |
| 2026-09-20 | **El botón de limpiar del buscador es nuestro, no el nativo** | `/tournaments` | Lo detectó el usuario: la "x" no tenía hover y desaparecía al sacar el foco aunque el texto siguiera. Es el `::-webkit-search-cancel-button` de Chrome, que además **no existe en Firefox ni Safari** —ahí no habría forma de borrar— y no toma nuestros tokens. Se apaga con `appearance-none` y se pone uno propio: `<X>` de `lucide-react` (ya es dependencia y ya lo usan los carruseles), visible **siempre que haya texto**, de `--color-muted-foreground` a `--color-foreground` en 200ms. Es lo único de la ruta que necesita estado de cliente. |
| 2026-09-20 | **Paginador del rediseño, sin tokens nuevos** | `/tournaments` | Reemplaza a los círculos `1 2 3` del Eventos viejo. Los valores del Figma ya eran todos nuestros: borde `#444` = `--color-border-dim`, texto `#a5a5a5` = `--color-muted-foreground`, activo con `--color-surface-2` y borde `--color-border-muted`, radio 4 = `--radius-sm`, texto 14/20 = `--text-sm`. Los chevrons son de `lucide-react` en vez de bajar los de heroicons. Con **3 páginas** mide 337,4 y entra en mobile sin adaptación; con las 5 del frame de Misiones no entraría. El hover no sale del diseño: sube el borde a `--color-border-muted` y el texto a blanco, el mismo escalón que los badges de tienda del footer. |
| 2026-09-20 | Padding de la card mobile a **16** lateral e inferior, título a **16px** | `/tournaments` | Pedido del usuario. El diseño viejo daba 10 de padding en mobile y un título de 13, que son artefactos del escalado de ese frame (§ 6, *El mobile de Eventos es el desktop al 57.4%*). El tope se queda en 10 para que la portada siga pegada al borde superior. |
| 2026-09-20 | `--text-page-title` (32/28) y `--text-page-title-sm` (24/**29**) | Chrome de ruta | H1 de una ruta interna, en Monument uppercase. No entraba en ningún token: `--text-display-xs` es 28 y arrastra el tracking del hero. El mobile va con interlineado **fijo**: el Figma dice `normal` pero calcula 29, y el browser con Monument da **35** — 6px que corrían todo el contenido hacia abajo. |
| 2026-09-20 | `--spacing-route-inset` (155), `--spacing-route-edge` (40), `--spacing-route-gutter` (16) | Chrome de ruta | La grilla de una ruta interna, que **no es la del Home**: columna fluida entre 155 y el borde menos 40, contra los 1144 centrados del Home. Sale de Misiones y Mi Perfil, que coinciden al píxel. El gutter mobile es 16 (Misiones) / 18 (Perfil): se unifica en 16, que además es el `px-4` del header mobile. |
| 2026-09-20 | `--spacing-header-mobile: 56px` | `/tournaments` | Alto real del header mobile (avatar de 40 + `py-2`). Ya existía escrito como `scroll-mt-14` en las seis secciones del Home: se unificó al token y el render no se movió. Lo consume el tope del contenido en cualquier ruta sin hero. |
| 2026-09-20 | **Fuentes reales: Anybody → Monument Extended, Tektur → KH Interference** | Home | Los `.ttf`/`.otf` aparecieron en `mateoLorenzo/sura-clans` (la app Expo de la feature de Clanes) y el usuario autorizó usarlos: este proyecto no va a producción y dos de ellos son versión TRIAL. Pasan a `app/fonts/` vía `next/font/local` (`--font-monument`, `--font-kh`); `Inter` sigue en Google. Se borran los dos `--font-*--font-variation-settings`: eran ejes de fuentes variables y las reales son estáticas. Medido contra el Figma, el desvío máximo del bloque hero es **0,4px**. |
| 2026-09-20 | **Se revierte el tracking y el peso 500** de `--text-copy`, `--text-copy-sm`, `--text-cta`, `--text-cta-sm` y `--text-news-copy` | Hero · Sura News | Con la fuente real el ajuste sobra: "COMENZAR AHORA" en KH a 12px mide **100,8** contra los **101** del nodo de Figma, sin tracking. El peso 500 además era inerte — de KH sólo tenemos Regular y Bold. `--text-display--letter-spacing` (-4px del título) **no** se toca: ése no compensaba nada, es el tracking que el usuario pidió y el título sigue rompiendo en 2 líneas. |
| 2026-09-19 | **Fuente `techno`: Martian Mono → Tektur** | Home | Sustituto más parecido a KH Interference, propuesto por el usuario. Martian Mono se eliminó del proyecto. El eje queda en `wdth 100` (el tope de Tektur), que es donde mejor calza: medido contra la tinta del render de Figma, **3% de error medio** en las tres líneas del copy y el label del CTA. `--font-mono` vuelve al stack del sistema, porque solo lo usa `/styleguide`. |
| 2026-09-19 | **`--color-background` de `#0C0C0C` a `#202020`** | Hero | Muestreado en los dos frames compuestos del Home, seis puntos cada uno: el fondo de página es `#202020`. El `#0C0C0C` salía de la variable publicada `Sura/Negro`, del diseño viejo. El scrim del hero se funde a este color, así que tenían que ser el mismo. La tinta negra del ícono activo del menú pasó a `--color-primary-foreground`, que sigue en `#0C0C0C` — que es el fill que trae el propio SVG. |
| 2026-09-19 | `--text-display--letter-spacing: -0.0625em` (y el mismo en `--text-display-xs`) | Hero | Pedido del usuario: -4px de tracking en el título. En `em`, así que desktop da los -4px exactos y mobile recibe el proporcional (-1.75px sobre 28). El corte en 2 líneas no se movió. |
| 2026-09-19 | `--gradient-nav-border-desktop`; el de mobile pasa a `--gradient-nav-border-mobile` | Menú flotante | El riel es alto y angosto, así que un borde sólido se lee duro. Arranca con una luz tenue (`--color-border-muted` al 30%), pasa a `--color-border` al 70% y baja a 45% y 28% — se desvanece sin desaparecer. Reusa el anillo enmascarado que ya usaba la bottom bar (`::before` + `mask-composite`), que no afecta el layout: el riel sigue midiendo 60 justos. |
| 2026-09-19 | Peso 500 y tracking en `--text-copy`, `--text-copy-sm`, `--text-cta` y el nuevo `--text-cta-sm` | Hero | Pedido del usuario: copy con 1px de tracking y CTA con 0.5px, los dos en peso 500. Va en `em` para que dé el mismo píxel en cada tamaño (§ 6, punto 3): copy `0.0625em`/`0.0833em`, CTA `0.0357em`/`0.0417em`. El CTA mobile necesitó token propio: compartía `--text-copy-sm` con el copy y ahora el tracking difiere. |
| 2026-09-19 | `--text-copy` (16/19) y `--text-copy-sm` (12/14) | Hero | El copy usa `line-height: normal`, que **no** es el `leading-normal` de Tailwind (1.5 = 24px). El nodo mide 38px para 2 líneas: 19 exactos. El tamaño chico lo comparten copy y CTA mobile. |
| 2026-09-19 | `--gradient-hero-scrim` y `--gradient-hero-scrim-mobile` | Hero | Funden el arte al fondo de página. Mobile tiene scrim arriba **y** abajo. Los stops de mobile están reexpresados sobre la caja de 524 (el Figma los define sobre una de 553 corrida 29px). |
| 2026-09-19 | `--shadow-cta` y `--shadow-cta-mobile` (antes `--drop-shadow-cta`) | Hero | Pasaron a `box-shadow`: `drop-shadow` no admite varias capas en un token (ver notas de implementación). El CTA es un pill opaco, así que se ve igual. |
| 2026-09-19 | `--spacing-hero-desktop` (1024), `--spacing-hero-mobile` (524), `--spacing-hero-content-desktop` (720), `--spacing-hero-gap` (137) | Hero | El 1024 es constante entre bloques: define dónde la sección siguiente empieza a solaparse con el fondo. |
| 2026-09-19 | `--color-nav-icon: #ABB7C2` | Bottom bar mobile | Los íconos de esta barra no son blancos en el Figma. Los del riel desktop sí: son dos sets distintos. |
| 2026-09-19 | `--gradient-nav-border` | Bottom bar mobile | El borde lleva degradé vertical, no color plano — el MCP lo devolvió aplanado a `#494949` y se detectó muestreando píxeles del render. El stop inferior medido (`#2E2E2E`) se resuelve con `--color-surface-2` (#303030), a 2 niveles: ver política de normalización. |
| 2026-09-18 | `--spacing-header-desktop: 106px` | Menú flotante desktop | Alto real del header (medido sobre el render, coincide con el diseño). El menú arranca justo debajo y las secciones lo van a usar como `scroll-margin-top`. |
| 2026-09-19 | `--color-brand-legacy: #A0E500` | Slider del hero | El borde de la miniatura activa es el verde **viejo** a full, medido sobre el render (`160,229,0` exacto). No se usó `--color-brand` (#A5E04A) porque el Figma manda: es el mismo verde legacy que ya sobrevivía al 20% en `--color-brand-faint`, que ahora queda documentado como su derivado. |
| 2026-09-19 | `--color-thumb-dim: #0C0C0C` | Slider del hero | Fondo bajo las miniaturas no seleccionadas, que van atenuadas (portada al 40%). Sale del frame mobile y se aplica también en desktop por decisión del usuario. Es el negro del diseño viejo; no se reusó `--color-primary-foreground`, que tiene el mismo valor pero es un alias de shadcn para texto sobre verde. |
| 2026-09-19 | `--shadow-thumb`, `--shadow-thumb-mobile` | Slider del hero | La sombra escala con la miniatura: `0 4px 4px` en desktop (60px) y `0 2.133px 2.133px` en mobile (32px), que normaliza a 2. |
| 2026-09-19 | `--text-title-sm` (18/24) | Eventos | Título de sección en mobile. Desktop sigue con `--text-title` (24/32). |
| 2026-09-19 | `--spacing-event-card(-mobile)` 365/210 y `--spacing-event-surface(-mobile)` 291/167 | Eventos | El alto tokenizado es el de la **superficie redondeada**, no el del frame: el personaje se sale por arriba y no cuenta como caja. |
| 2026-09-19 | `--gradient-event-scrim` y `--gradient-event-scrim-strong` | Eventos | Funden el arte de la card hacia abajo para que se lea el texto. La variante fuerte es la de la card de fondo claro. |
| 2026-09-19 | `--hero-art-fade-duration: 320ms` | Slider del hero | El arte se funde al cambiar de juego. No corre en la carga inicial: el arte es el LCP y no se le pone un fade adelante. |
| 2026-09-19 | `--color-promo` (#6c38b5), `--color-promo-foreground` (#2d184b), `--color-brand-vivid` (#97f300) | Juegos | El violeta del banner —borde, scrim y texto del CTA— y el verde vivo de su borde, que ya vivía sin nombre dentro de `--shadow-cta-mobile`. |
| 2026-09-19 | `--gradient-promo-scrim`, `-mobile` y `--gradient-promo-cta`; `--shadow-promo`, `--shadow-promo-cta`; `--blur-card` (2px) | Juegos | Scrim, degradé y glows del banner, más el blur del panel de la card. El ángulo del scrim (238,69°) **sí** era el que reportó el MCP: medido, puntúa mejor que cualquier alternativa. En desktop los stops son los del diseño. |
| 2026-09-19 | `--text-news-copy` (12/16, `0.0833em`) | Sura News | Bajada del bloque en desktop. Pedido del usuario: 1px de tracking, que en `em` sobre 12px da 0.0833. No se tocó `--text-note`, que comparte tamaño pero lo usan las fechas de Eventos con el tracking negativo del diseño. |
| 2026-09-19 | `--text-reward` (14/14) | Misiones | Premio del badge. `--text-sm` es 14 pero con interlineado 20 y le sumaba 4px de alto al badge; `--text-cta`, que sí es 14/14, arrastra peso 500 y tracking que acá el diseño no pone. |
| 2026-09-19 | `--color-sp-foreground` (#354619), `--gradient-sp-badge` | Misiones | Texto y fondo del badge de puntos: el verde de marca con un negro al 20% encima. |
| 2026-09-19 | `--shadow-mission-card`, `--shadow-sp-badge` | Misiones | En Figma son `drop-shadow`, pero las dos cajas son opacas y con radio: van como `box-shadow`, que es la política desde el CTA del hero. |
| 2026-09-19 | `--spacing-mission-card-mobile` (261px) | Misiones | Ancho de la card en el carrusel mobile. En desktop las cuatro se reparten los 1144 y no hace falta fijarlas. |
| 2026-09-19 | `--color-surface-deep` (#191919), `--color-locked-foreground` (#5a5a5a), `--color-medal-veil` | Medallas | Panel de la grilla, label de una medalla bloqueada y el velo que la apaga. `--color-tooltip` está a 1 nivel del panel, pero es el fondo de otro componente: mismo criterio que `--color-thumb-dim`. La celda desbloqueada reusa `--color-background`, que es exactamente su #202020. |
| 2026-09-19 | `--gradient-medal-sheen` y `-locked` | Medallas | Brillo diagonal del círculo. El verde es el **legacy** (#A0E500), el mismo que sobrevive en el borde de la miniatura activa del hero. El gris va al **0.28** y no al 0.4 que devolvió el MCP (ver notas de implementación). |
| 2026-09-19 | **Plata y bronce**: `--color-silver(-deep/-bright)`, `--color-bronze(-deep)` | Leaderboard | Los otros dos puestos del podio, con la misma estructura de nombres que la dorada: `-bright` para el borde de la card y el anillo del avatar, `-deep` para el fondo del pill y el base para su borde. El fondo del pill del 3º es `#714900`, que ya era `--color-gold-deep`: se reusó. |
| 2026-09-19 | `--gradient-podium-silver` / `-bronze` y las tres variantes `-mobile`; `--gradient-podium-gold` **corregido** | Leaderboard | El dorado existía desde el escaneo inicial con `177deg` y sin la capa negra al 20% que el Figma le superpone: ahora lleva las dos capas y el ángulo medido. Mobile tiene tokens propios porque el mismo fill cambia de ángulo con la proporción de la card y ahí no hay capa negra. |
| 2026-09-19 | `--spacing-leaderboard-col` (657), `--spacing-leaderboard-row` (486), `--spacing-podium-card` (97) | Leaderboard | La fila de dos columnas del diseño y la card del podio. El alto vive en la fila, no en la columna, para que Medallas lo herede sin declararlo. |
| 2026-09-19 | `--spacing-section-gap-mobile: 40px` | Leaderboard | Separación entre secciones en mobile. No sale del diseño: no hay frame compuesto (ver § 5). Desktop estrena en este bloque `--spacing-section-gap` (80), que estaba declarado sin usar desde el escaneo inicial, igual que `--spacing-title-gap`. |
| 2026-09-19 | `--text-legal` (12/18, `0.02em`) | Footer | Copyright. `--text-xs` es 12/16 y ninguno de los tokens de 12 lleva el tracking positivo de 0.24px que pide el diseño. |
| 2026-09-19 | `--spacing-nav-bar` (80px) y la utility `pb-nav-clearance` | Footer | El alto de la bottom bar mobile, que estaba escrito como `h-20` en el propio componente. El footer le deja abajo `gutter × 2 + barra + safe-area` = 128px para que la barra fija no tape el copyright. No sale del diseño: es la consecuencia de haber elegido la bottom bar. |
| 2026-09-19 | `--ease-reveal` y `--thumb-reveal-duration` / `-stagger` / `-shift` | Slider del hero | Revelado escalonado (ver abajo). Ninguno sale del Figma. La curva es de salida marcada, `cubic-bezier(.22,1,.36,1)`: una entrada desacelera y no vuelve, a diferencia del pill del menú, que va y viene con `ease-in-out`. Los tiempos no tienen namespace en Tailwind, así que van como custom properties junto a los gradientes. |

### Deuda de diseño abierta

| Tema | Detalle | Qué hacer |
|---|---|---|
| **La 404 es la única ruta sin riel en desktop** | Decisión del usuario (2026-09-25): el mapa ya es la navegación. | Si se agregan otras pantallas de navegación propia, revisar si también lo ocultan o si se vuelve a la regla de riel en todas. |
| **Las posiciones del minimapa son inventadas** | Los cinco destinos, tu punto y la zona están ubicados a ojo para que se lea bien en los dos tamaños, no representan nada. A 320 de ancho “Zona de juego” y “Misiones” quedan pegados, sin pisarse. | Si se suma un destino, hay que ubicarlo en `lib/data/not-found.ts` y revisar 320 y 1100. La línea asume que todos los destinos quedan arriba y a la izquierda de tu punto. |
| **Las rutas de detalle caen en la 404** | `/tournaments/123`, `/games/…` y compañía muestran “Fuera del mapa”. Hoy ningún link de la UI apunta ahí (*Rutas de detalle apagadas*, § 6). | Cuando se implemente un detalle, su ruta existe y deja de caer en la 404 sola. |
| **Entrar a la 404 navegando vuelve a montar el chrome** | Consecuencia de que la 404 sea el `not-found` raíz (ver *Notas de arquitectura*). El header, el riel y el footer se vuelven a montar, y la flecha del header mobile pierde el historial del sitio: vuelve al Home. | Sólo importa si aparecen links internos a rutas que no existen. |
| **La señal que mantiene despierta la salida de audio no se probó con Bluetooth ni en Safari** | Se verificó en Chromium que arranca, se corta y vuelve cuando corresponde. Que el primer sonido después de un rato ya no se pierda depende de la salida real, que Playwright no tiene. Tampoco se sabe si Safari muestra el ícono de audio en la pestaña por una señal de -80 dBFS. | Probarlo a mano: dejar la web un minuto quieta y disparar un hover, con los parlantes de la compu y con auriculares Bluetooth, en Chrome y Safari. Si con Bluetooth el primer sonido sigue saliendo bajo, subir `keepAliveGain` de a poco. |
| **Nada suena antes del primer click o tecla** | Es la política de autoplay de todos los navegadores. Investigado en el código fuente y probado: no hay workaround legítimo para una primera visita (ver § 5, *Sonido*). | Nada. Si vuelve la música de fondo, el *Media Engagement* de Chrome haría que los visitantes frecuentes escuchen desde el primer hover. |
| **El sonido no se probó en Safari ni Firefox reales** | Sólo en Chrome y en los builds de WebKit y Firefox de Playwright. El respaldo AAC para Safari viejo no se ejercitó. | Probarlo a mano en Safari (macOS e iOS) antes de dar la tanda por cerrada. |
| **El "Ver todo" de Sura News no se puede tocar en el centro en mobile** | Bug anterior al sonido: el aire que la lista de cards reserva para la sombra del hover queda encima del botón. Hoy el botón no navega, así que sólo se pierden su hover y su sonido. | `pointer-events-none` en la lista y `pointer-events-auto` en sus ítems, verificando que el carrusel siga scrolleando con el dedo. |
| **A 320px el nombre del usuario desaparece en las rutas internas** | Lo empujan la flecha de volver y el toggle de sonido (§ 0, punto 15). | Si molesta, achicar los gaps del header mobile. |
| **La flecha de volver no restaura el scroll entre rutas internas** | Si la pantalla anterior no era el Home, `goBack` sigue haciendo `router.back()`: vuelve con su scroll pero sin persiana. Hoy no hay forma de ir de una ruta interna a otra desde la UI, así que sólo pasa con el historial del navegador. | Nada, salvo que aparezcan links entre rutas internas. |
| **Assets de Riot en el hero** | El login screen de PROJECT: Yi es de Riot Games. Su política *Legal Jibber Jabber* lo permite en proyectos de fans gratuitos y no comerciales, **con un aviso visible** de que se usan assets de Riot y que Riot no avala el proyecto. | **Por ahora no aplica** (usuario, 2026-09-25): el proyecto se comparte sólo entre conocidos y no está previsto publicarlo. **Si se publica**, sumar ese aviso antes (el footer es el lugar natural) o sacar el slide. **Para producción no sirve**: licencia de Riot o video propio de diseño. |
| ~~**El video de Yi es de 1280 × 800**~~ | Era el único tamaño de la fuente. | **Resuelta** (2026-09-25) con Real-ESRGAN 4×: ver *Intro de PROJECT: Yi*. Si aparece un original más grande, reemplaza al escalado. |
| **En mobile la intro ocupa sólo la franja del hero** | Durante la intro el video se ve en los 524 px del hero y el resto de la pantalla queda en `#202020`. | Esperando el feedback del usuario al verlo en la web. |
| **El badge "¡Novedad!" cambia de color de texto entre tamaños** | Es el mismo texto sobre el mismo verde: el frame desktop lo escribe en **negro** y el mobile en **`#456215`** (`--color-border-done`), mientras el CTA del mismo banner usa `#354619`. | Se replicaron los tres tal cual. Parece un desliz: unificar, probablemente en `--color-sp-foreground`. |
| **El `search.svg` vive en `public/assets/tournaments/`** | El buscador ahora lo comparten tres rutas, así que el ícono quedó bajo la carpeta de la primera que lo usó. | Mover a una carpeta compartida cuando exista una; hoy `public/assets/home/` hace de eso para `sp-coin.png` y `arrow-right.svg`. |
| ~~**La franja sin diseño de `/games` es más ancha que la del resto**~~ | — | **Resuelta** (2026-09-23): el breakpoint pasó a 1100, así que esa franja ya muestra el layout mobile. Ver § 4. |
| **El H1 de `/leaderboard` y `/games` no es el de `RouteShell`** | Los dos frames escriben el título en **TT Firs Neue** (32/28 desktop, 24 mobile), mientras que Misiones y Mi Perfil —los frames de los que salió el chrome— lo escriben en Monument uppercase con los mismos tamaños. | Se mantuvo `RouteShell` (Monument), por § 6 normalización punto 4: se unifica al valor de la primera. Confirmar con diseño cuál manda; si gana TT Firs Neue son dos líneas en `route-shell.tsx`. |
| **El buscador cambia de lado el ícono entre frames** | `/leaderboard` mobile lo pone a la **derecha** (gap 24, texto 12, padding 20); `/games` mobile y los dos desktop lo ponen a la **izquierda** (gap 8/12, texto 14, padding 16). | Se unificó en **izquierda** con los valores de `/games`, que son mayoría y coinciden con el desktop. Confirmar. |
| ~~El título del banner de `/games` queda en otra familia que el mismo banner del Home~~ | El frame lo escribe en TT Firs Neue; el banner del Home, en Monument. | **Resuelta** (usuario, 2026-09-21): va en Monument, como el Home. La consecuencia es que la caja del texto pasó de los 486 del diseño a 530, porque Monument con su tracking necesita 523. |
| **La caja del texto del banner mide 530 y el diseño dice 486** | Consecuencia directa de usar Monument en vez de TT Firs Neue. El bloque arranca en el mismo x=35 del diseño y se estira 44px hacia la derecha, sobre el tercio del scrim que sigue opaco. | Si algún día llega TT Firs Neue, volver a 486 es un número. |
| **La card de `/games` mobile trae UI vieja** | El frame mobile dibuja la card como miniatura 4:3 arriba y texto abajo, sin panel de vidrio: es el lenguaje anterior, el mismo caso que ya pasó con Sura News. El desktop usa la card del rediseño. | Se adaptó la card de desktop, como se hizo con News (usuario, 2026-09-19) y como ya se ve la sección Juegos del Home en mobile. Confirmar. |
| **El frame mobile de `/games` trae un bloque "Mini juego" que el desktop oculta** | Es un segundo banner (359 × 144, cian, con su propio "Jugar ahora"). En el frame desktop el mismo componente existe pero está **oculto**. | **No se maquetó**: dejaría contenido en mobile que desktop no tiene, y el desktop manda (regla 12). Confirmar si tiene que existir en los dos tamaños. |
| **El hover de la card de `/games` que dibuja el diseño no se implementó** | La tercera card del frame está en estado hover —el cursor del diseñador está encima— y muestra **glow verde** (`0 0 20px` al 25 %) más un botón **"Ver Juego"** que aparece dentro del panel. | Se dejó el *hover de elevación* que ya tienen las cards de Juegos, porque el usuario descartó explícitamente el verde en estas cards (2026-09-20, "lo quería oscuro y sutil") y porque un botón dentro de una card que **ya es un link** duplica la acción. Es el desvío más grande de esta corrida: confirmar. |
| **`/leaderboard` y `/games` no filtran nada** | Tabs, chips, buscadores, los 4 dropdowns de `/games` y el ícono de filtro de mobile son maqueta. Los paginadores tampoco paginan. | Sale de Fase 1, igual que en `/tournaments` y `/missions`. |
| **El podio y la tabla de `/leaderboard` se contradicen en el nivel de SabooMafoo** | El podio dice "Nivel: Héroe" y la fila 03 de la misma pantalla dice "Guerrero". | Se unificó en **Héroe**, que es además lo que ya decía la data del Home. Confirmar. |
| **"Racha de 0 días" es un encabezado de columna con un dato adentro** | Así lo escribe el frame desktop, al lado de valores por fila que dicen "3 días" / "0 días". El tab de la misma pantalla se llama sólo "Racha". | Se replicó tal cual. Parece error de copy: confirmar. |
| **Las dos primeras filas del podio del Figma no miden igual** | La card del 2º puesto usa gap 12 en su columna de texto y las del 1º y 3º usan 8, así que la del 2º sale 3px más alta y arranca 3px más arriba. | Se unificó en 8 (mayoría), así el 2º y el 3º quedan a la misma altura y sólo el 1º sobresale. |
| **Datos de `/leaderboard` y catálogo de `/games` inventados** | Los diez jugadores y el "+40" salen del frame desktop; el mobile trae otros tres nombres y 473 puntos en todas las filas. El catálogo de Juegos son 12 cards sobre **7 artes**, cuatro de ellas repetidas del frame. | Se unificó en los del desktop, mismo criterio que el podio del Home. Pedir la data real. |
| **`/profile/:id` y `/games/:id` no existen** | Las filas y el podio del leaderboard apuntan al perfil; las cards de Juegos a su detalle. Desde el 2026-09-23 **no linkean** (ver *Rutas de detalle apagadas*, § 6): no hay 404 en producción. | Sin fecha: el usuario no sabe todavía si se van a implementar. Se enciende en `lib/routes.ts`. |
| ~~**Los assets de `/leaderboard` pesan 4,5 MB para íconos de 12 y 16px**~~ | Las medallitas eran PNG de 2048² y los íconos de nivel de ~1080². | **Resuelta** (2026-09-23) con los WebP a tamaño de uso: la ruta baja de 4,4 a **0,09 MB**. Ver *Peso de los assets*. |
| ~~**La franja sin diseño recorta más que de costumbre en `/leaderboard`**~~ | — | **Resuelta** (2026-09-23): el breakpoint pasó a 1100, así que esa franja ya muestra el layout mobile. Ver § 4. |
| ~~**Fuentes comerciales sustituidas**~~ | El diseño usa **Monument Extended**, **KH Interference TRIAL** y **TT Firs Neue Trl**, ninguna libre. | **Resuelta** (2026-09-20): los archivos estaban en `mateoLorenzo/sura-clans` y se trajeron los dos que usamos. **TT Firs Neue no se trajo**: el diseño lo usa en una sola card de Eventos y esa mezcla ya se había unificado en KH. Queda la licencia como riesgo si el proyecto alguna vez sale a producción. |
| **KH Interference es todo mayúsculas** | La fuente no tiene minúsculas: dibuja caps aunque el texto del nodo esté en minúscula. | **Cada texto en `font-techno` lleva `uppercase`.** Con la fuente real ya no cambia el render, pero se mantiene: es lo que protege el fallback del sistema mientras la fuente carga, y deja el markup explícito. Al traer la fuente real (2026-09-20) se completaron los tres call sites que no lo tenían: el CTA del hero y dos de `/styleguide`. |
| **Dos tipografías trial mezcladas** | En la fila de Eventos, 3 cards usan KH Interference y 1 usa TT Firs Neue — en mobile la mezcla cae en otra card. | Se unificó en KH (mayoritaria), o sea `font-techno`. Confirmar con diseño cuál es la definitiva. |
| **Restos en el frame de Eventos** | El slider del Figma tiene, después de las cuatro cards, **dos frames "Image" sueltos** de 246 × 205 que no son cards ni se parecen a ninguna: quedan fuera del viewport y no se ven en el render. | Se leen como descarte de trabajo y no se maquetaron. Confirmar que se pueden borrar del archivo. |
| **Hacen falta eventos y misiones reales** | El Figma trae 4 cards en cada sección; el usuario pidió 6 (2026-09-20). En **Eventos** las cuatro últimas se reescribieron con nombres, modalidades, fechas y premios inventados, para que no se lea como un error de duplicado — las dos primeras siguen siendo las del diseño. En **Misiones** las dos nuevas toman su portada de la sección Juegos (Minecraft y Wagmi Defense): a diferencia de Eventos, acá la portada **identifica el juego de la misión**, así que verla también en el catálogo es coherente y no lectura de duplicado. Encajan sin recorte visible — las dos son 16:9 y la card recorta a 229.456/128, o sea 1,79. | Es data de relleno. Pedir el listado real. |
| **Sólo hay dos personajes para las cards de Eventos** | El personaje que se sale por arriba de la card tiene que ser una **figura recortada**, y el diseño exportó dos: Domino y Squad. Se evaluó reusar las portadas de la sección Juegos y **no sirven**: medidas, tienen 0% de alfa, son rectángulos opacos. Puestas ahí se verían como una foto flotando, no como una silueta. | Los dos personajes alternan. Pedir a diseño más figuras recortadas si se quieren seis cards con arte distinto. |
| **Copy de misión en cards de evento** | Las cuatro cards describen "Para completar esta misión, debes hacer clic en el botón de abajo…", que es texto de la sección Misiones. | Es placeholder, no un estado: se replica tal cual hasta que llegue el copy real. Lo mismo con la fecha de la primera card, que en mobile dice "Comienza en 1 hr 30 min" y en desktop "Nov 28, 8:00 PM" — se unificó con la de desktop. |
| **Verde sin publicar** | `#A5E04A` no está como variable de Figma; sí están `Sura/Negro` y `Sura/Blanco`, que son del diseño viejo. | Pedir que se publique la variable del verde nuevo. |
| **Verde legacy en los bordes** | El verde **viejo** `#A0E500` sobrevive en dos lugares: el borde de la miniatura activa del hero (a full) y el de las cards de Torneos (al 20%). | Probable resto del rediseño a medio hacer. Se replica tal cual — `--color-brand-legacy` y `--color-brand-faint` — y se consulta si tiene que pasar al verde nuevo. |
| ~~**"Torneos" vs "EVENTOS"**~~ | La misma sección tenía distinto nombre en desktop y en mobile. | **Resuelto** (usuario, 2026-09-18): queda **"Eventos"** en los dos tamaños, y el ancla es `#eventos`. Cuando se maquete el bloque 8, el título de la sección también. |
| **Diseño mobile incompleto** | Falta el 60% de las secciones (ver sección 5). | Pendiente de que lleguen los frames. |
| **Íconos del menú en un solo estado** | El Figma exporta cada ícono del menú en un solo color: Home en negro (seleccionado) y los otros seis en blanco (default). | **Resuelto sin pedir assets**: el SVG se usa como máscara y el color lo ponen los tokens (ver Notas de implementación). Ya no hace falta la versión que falta. |
| ~~**Arte del hero escalado 1.81×**~~ | El asset medía 1440 × 811 y el diseño lo muestra a 2610 de ancho. | **Resuelta** (2026-09-20) con upscale de IA a 2880 × 1622, autorizado por el usuario. Si diseño entrega el arte original en grande, reemplaza al upscaleado: un upscale inventa detalle, no lo recupera. |
| ~~**Portadas del slider a tamaño completo**~~ | Las miniaturas se mostraban a 60px cargando las portadas originales: 4,5 MB entre las cuatro, y la de Fortnite (PNG de 1920 × 1080, 2,5 MB) llegaba última y se veía el placeholder negro antes que la imagen. | **Resuelta** (usuario, 2026-09-23): miniaturas propias `*-thumb.jpg`, a 120px de alto —el doble del tamaño en pantalla— y en la misma proporción que el original, así `object-cover` hace el mismo recorte. Salen de los mismos originales, con el mismo criterio que el `@2x` del arte. Pesan **5–9 KB** cada una y llegan juntas; visualmente idénticas (Δ medio 5, con picos sólo en el reescalado de los logos). Los originales se borraron el 2026-09-23 junto con el resto de los assets sin uso. |
| **El slider se aparta del Figma en desktop** | Decisión del usuario (2026-09-19): las no seleccionadas van atenuadas **también en desktop** (el frame las deja a full), el radio de la miniatura pasa de 4.8 a **8px** y el borde de la activa de 1.5 a **2px**. Mobile no se aparta: 1.6 → 2 y 0.8 → 1 caen dentro de la política de normalización. | Confirmar con diseño. |
| ~~**El slider no navega**~~ | — | **Resuelto** (2026-09-19): clickear una miniatura cambia el arte del hero. Ver las dos filas de abajo, que son lo que quedó abierto. |
| **Sin arte de hero propio por juego** | El Figma sólo compone el arte de Valorant. Los otros tres usan su propia portada de 16:9 como fondo full-bleed, que no es lo mismo: son portadas centradas en su logo, no key art pensado para tener texto encima. En Black Ops 6 el logo queda detrás del copy. | Pedir a diseño un arte de hero por juego, compuesto con aire a la izquierda como el de Valorant. Mientras tanto van con encuadre `cover`. |
| ~~**Black Ops 6 se ve blando de fondo**~~ | La portada mide 840 × 560 y el hero la mostraba a ~1820 de ancho: 2,2× de escalado. | **Resuelta** (2026-09-20) con el mismo upscale: el arte de fondo pasa a 3072 de ancho. La portada original sigue siendo la miniatura. |
| ~~**CTA desktop con caja de texto fija**~~ | El botón del Figma mide 181 porque el nodo de texto tiene un ancho fijo de 141 con el texto centrado; el texto real de KH a 14px mide 117,6. | **Resuelta** (2026-09-20): con la fuente real se fue al valor del diseño, `min-w` de **181** con el texto centrado. Da 181 × 46 exactos. La caja fija de 141 sigue siendo una rareza del archivo, pero ya no cambia nuestro render. |
| ~~**CTA mobile más alto que el diseño**~~ | El botón del Figma es 133 × 30 y con Tektur salía 143,4 de ancho, que a 30 de alto se veía chato. | **Resuelta** (2026-09-20): con KH real el botón hugea a **132,8 × 30**, o sea el diseño. El alto volvió de 32 a 30 y con eso el slider vuelve a y=400 y la sección a 456. |
| **Estados del menú flotante** | El componente del Figma solo define `Default` y `Selected`. No hay hover ni focus — y el sitio live tampoco cambia el color del ícono en hover (medido: se queda en `text-gray-300`). | **Resuelto por decisión propia** (usuario, 2026-09-18): tooltip con el nombre de la sección + tinte verde de marca en el ícono. Es lo único del bloque que no sale ni del Figma ni del live. Si diseño define un hover propio, esto se reemplaza. |
| ~~**El pill de puntaje tiene dos fuentes**~~ | El header lo tenía en Inter y el Leaderboard en `font-techno`. | **Resuelta** (usuario, 2026-09-23): gana la del Leaderboard, que el usuario encontró más copada. Los dos contadores del header —racha y puntos— pasan a `font-techno`, en Regular (de KH no hay Bold y el `font-bold` de la racha sería negrita sintética). Las alturas no cambian: header 106 / 56 y contadores de 40. |
| **El podio trae usuarios distintos en cada tamaño** | Desktop dice `DesenfrenadO_ / BretasNFT / SabooMafoo` con 7.015 / 6.890 / 6.755; mobile dice `KoibitoSura / Madness9891 / Gasstiel` con 999 / 888 / 800. Los avatares también difieren. | Se unificó en los de desktop (prioridad del proyecto, y el mismo criterio que la fecha de Eventos). Confirmar cuál es la data buena. |
| **El título del Leaderboard mobile dice "eventos"** | Es un typo del frame (lo confirmó el usuario, 2026-09-19): repite el título de la sección de arriba. | Se maquetó **"Leaderboard"** en los dos tamaños. Corregir en el archivo. |
| **Ícono vacío en el título mobile** | Al lado del título hay un frame de 16px llamado "Icon / info" **sin contenido**: no tiene ícono adentro ni en el render. | No se maquetó. Si tiene que existir, hace falta el asset (regla 10: no se redibuja). |
| **La barra de progreso de Misiones es un error** | El frame mobile dibuja una barra de progreso en las tres cards y una card destacada en verde; el desktop no tiene ninguna de las dos. | Confirmado como error de diseño (usuario, 2026-09-19): se maquetó la card de desktop en los dos tamaños. Si el progreso tiene que existir, hace falta definirlo también en desktop. |
| **Tercer título mobile con el texto de otra sección** | El frame mobile de Misiones vuelve a decir "eventos", igual que el de Leaderboard. | Se maquetó "Misiones". Van tres: conviene revisar los títulos de todos los frames mobile de una sola pasada. |
| **Misiones distintas en cada frame** | Desktop trae cuatro misiones reales (Fortnite, Valorant, Assassin's Creed, Mario) y mobile repite "Conecta tu cuenta de X" tres veces. | Se unificó en las de desktop, mismo criterio que el podio. Confirmar cuál es la data buena. |
| **Portadas chicas** | La de Valorant mide 295 × 171 y su card la muestra a 236; la de Cyberpunk, 480 × 270 en una card de 256. En pantallas retina las dos se ven blandas. La de Assassin's Creed Valhalla mide 199 × 253 en una card de 268 × 357. El resto va sobrado (1080 a 3840). | Pedir el export grande. Es la misma familia de deuda que el peso de los assets, pero al revés. |
| **La card de News mobile tenía UI vieja** | El frame mobile dibuja las noticias con el diseño anterior: sin fondo de card, título en otra familia y fechas en otro formato. | Confirmado por el usuario (2026-09-19): se adaptó la card de desktop al tamaño mobile. El frame mobile queda desactualizado. |
| **Cuarto título mobile equivocado** | El frame mobile de Sura News dice "EVENTOS". Van cuatro: Eventos, Leaderboard, Misiones y este. | Se maquetó "Sura News". |
| **Las cards de Juegos no coinciden con su arte** | La titulada "Assassin's Creed Syndicate" muestra la portada de **Mario**; otra muestra **Minecraft**; una "Call of Duty Modern Warfare" muestra un juego de **carreras**. Además dos títulos se repiten y una card lleva el badge "Free-To-Play" **dos veces**. | Se replicó tal cual (regla 10) y los archivos se nombraron por lo que muestran (`mario.png`, `minecraft.png`, `racing.png`). Es data de relleno: confirmar el catálogo real. |
| **Los badges de tienda no se pueden exportar** | Los componentes `Footer/Google Play` y `Footer/App Store` (`91:7253`, `91:7262`) viven fuera de la página visible y su export vuelve **en blanco** (PNG 384 × 128 vacío, SVG sin salida). Están armados con texto en **SF Compact** y **Product Sans**, que no son libres. | Se compusieron en código con los SVG que sí exporta el nodo (ícono de cada tienda y el wordmark de Google Play) y el texto en Inter. Como Inter es más ancha que SF Compact, "App Store" no entraba centrado en los 96 × 32 del diseño (quedaba a 3px del borde): por decisión del usuario (2026-09-19) los dos badges pasaron a **104 × 36** con el contenido centrado. En mobile van `flex-1` y quedan en 163 × 36 para llenar la fila (2026-09-20); el contenido sigue centrado, así que el ancho no es crítico. Si diseño exporta los dos badges como asset entero, se reemplazan y vuelven a 96 × 32. |
| ~~**Hero en video**~~ | Veo y Kling no pudieron animar la ilustración sin romperla. | **Resuelta** (2026-09-24): se armó por capas sobre el arte original. Ver *Hero en video*, arriba. |
| **El banner de Juegos no navega** | La card y su CTA "Jugar ahora" son una sola acción, pero el destino no está ni en el Figma ni en el mapa de rutas. | Van como dos `<button>` sin handler, el mismo criterio que el footer y "Ver todo". Cuando exista la ruta, los dos pasan a `<Link href>` al mismo destino y nada más cambia. |
| **El footer no navega** | Los cuatro links, las redes y los badges no tienen destino ni en el Figma ni en el mapa de rutas; las URLs de las redes tampoco se conocen. | Van como `<button>` sin handler, el mismo criterio que "Ver todo" en `section-header.tsx`. Cuando existan las rutas y los handles, pasan a `<a href>`. |
| **Footer mobile adaptado del desktop** | No hay frame mobile. | Decisión del usuario (2026-09-19), mismo criterio que Medallas y Juegos: ver § 5. |
| **La grilla del Home no es la de las rutas** | El Home usa 1144 centrado con gutters de 148; una ruta interna usa una columna fluida de 155 a *ancho − 40*, y gutter mobile 16 contra 24. Sale de los frames (Misiones y Mi Perfil coinciden), pero se ven distintas en el mismo sitio. | Confirmar con diseño cuál manda. Si gana una sola, es cambiar tres tokens. |
| **Arriba de 1440 la columna de ruta estira** | No hay frame de ninguna ruta por encima de 1440 y la columna es fluida, así que a 1920 las cards crecen a ~412. El Home, en cambio, capea en 1144. | Pedir un frame ancho, o decidir un tope. |
| **Datos de torneos inventados** | Los dos primeros son los del diseño; los otros seis se escribieron para que la grilla no se lea como un duplicado. Las portadas salen de la sección Juegos: no hay arte propio de torneos. | Pedir el listado real y un lote de portadas. |
| **El buscador y el paginador no hacen nada** | Los dos son maqueta: el input acepta texto y no filtra, y el paginador no cambia de página. Decisión del usuario, alineada con § 1. | Salen de Fase 1. |
| **Eventos no tiene filtros en ningún tamaño** | Ni el Eventos viejo ni el rediseño ponen filtros en el desktop de esta ruta; el `FILTRAR` de mobile se sacó por eso (ver changelog). Misiones sí los tiene y ya define el patrón: chips en desktop, colapsados en `FILTRAR` en mobile. | Pedir los criterios de filtrado de Eventos. Cuando existan, entran como chips en desktop y `FILTRAR` vuelve en mobile — el shell de ruta recupera su slot de acción en tres líneas. |
| **`/tournaments/:id` no existe** | Las ocho cards no linkean desde el 2026-09-23 (ver *Rutas de detalle apagadas*, § 6). | Se enciende en `lib/routes.ts` cuando lleguen los frames del detalle. Ojo al hacerlo: la portada lleva el mismo `ring-inset` debajo de una imagen con zoom que hizo flashear la de misión (notas de implementación) — revisarlo junto. |
| **La card de misión describe en dos colores** | La misma instancia de Figma usa `#a5a5a5` en el Home y blanco en `/missions`. Se unificó en gris. | Confirmar cuál es el bueno. |
| **`/missions/:id` no existe** | Las cards de la ruta y del Home no linkean desde el 2026-09-23 (ver *Rutas de detalle apagadas*, § 6). | Se enciende en `lib/routes.ts` cuando lleguen los frames del detalle. |
| **Tabs y chips de Misiones no filtran** | Los dos son maqueta. Además el diseño no dice qué relación tienen entre sí: los tabs son categorías y los chips estados, pero no está definido si se combinan. | Pedir el comportamiento. |
| **Misiones de relleno** | Las 16 de la grilla y las 3 destacadas son inventadas, y las portadas salen de las secciones Misiones y Juegos del Home. | Pedir el listado real. |
| **El favicon es blanco** | Desde el 2026-09-23 la pestaña usa el mismo ícono que `app.suragaming.com` (`app/icon.svg`, copia de su `faviconsura.svg`) en vez del default de Next, que se borró; el `favicon.ico` del sitio oficial resultó ser ese mismo default. El logo es blanco sobre transparente, así que en una barra de pestañas clara casi no se ve — le pasa igual al sitio oficial. | Si molesta, el SVG admite una `@media (prefers-color-scheme: light)` interna que lo pase a negro. El `apple-touch-icon` ya existe desde el 2026-09-23 (`app/apple-icon.png`, logo blanco sobre `#202020`). |
| **Resto suelto en el frame de Juegos** | Después de la octava card hay un `Image` de 1 × 0,56px, igual que los dos frames sueltos del slider de Eventos. | No se maquetó. Confirmar que se puede borrar del archivo. |

### Hero en video ✅ (2026-09-24)

El arte del slide de Valorant es un **loop de 5 s** en vez de una imagen fija. No salió de un
modelo de video: se armó **por capas sobre el arte original**, en código, después de que Veo y
Kling fallaran por el mismo motivo (el modelo necesita mover algo y lo mueve de más). El clip
de Kling del usuario sirvió para diagnosticar qué molestaba —el pelo se agitaba 6 veces en 5 s,
de golpe, y era lo único vivo—, no como material.

**Qué se mueve** (todo cierra exacto a los 150 frames, 30 fps, porque cada movimiento es
periódico en ciclos enteros del loop):

| Elemento | Técnica | Detalle |
|---|---|---|
| **Pelo de Jett** | Capa recortada (SAM 2.1) sobre un fondo sin pelo (LaMa) + campo de desplazamiento | Tres grupos con raíz propia —cola, flequillo, mechones derechos— que se mecen desde la raíz y se curvan hacia las puntas, con desfase entre grupos. Una ida y vuelta cada 5 s; las puntas llegan a ~26 px |
| **Orbe de Omen** | Latido de brillo + bandas de luz que recorren la pintura | Las bandas cambian brillo y tono sobre los azules que ya están pintados; nada se deforma. La intensidad cae hacia la derecha (100 % en centro y mano, ~42 % en la cola, 25 % en el animalito, 16 % al borde) |
| **Flujo del orbe hacia la derecha** | Textura de vetas que se desliza en radial desde el centro | Sólo entre **Y 930 y 1080** del arte, la franja del bloque de energía, con 14 px de desvanecido |
| **Máscara de Omen** | Vetas verticales que bajan por los cristales + halo | X 160–310 · Y 542–709; el halo acompaña el mismo flujo |

Se descartaron, y quedaron guardadas por si vuelven: la chaqueta de Phoenix (v26, el usuario
prefirió sin ella), una deformación real de la pintura del remolino (v13/v14, "muy malo"),
espirales de luz dibujadas encima (v11, se leían pegadas) y el relevo de dos capas de flow-map
(v10, se veía a saltos). La lección que dejaron: **con un arte de trazos duros, mover luz
funciona y mover pintura no.**

**Encuadre.** Desktop pasa al encuadre **D1** (el arte 17,7 % más arriba que el diseño, elegido
por el usuario para que se vea el orbe); mobile se queda en **M0**, el del diseño. Los dos van
**pre-recortados** en el propio archivo: desktop es la franja `x 0–1588 · y 286–1622` del arte y
ocupa el 100 % del ancho; mobile, `x 555–1689`, también al 100 % de la columna. Por eso el
encuadre ya no necesita `background-position` y el video y el poster calzan igual.

**Archivos** (`public/assets/home/hero-loop/`):

| | Desktop 1588 × 1336 | Mobile 864 × 1236 |
|---|---|---|
| Video AV1 (principal) | 650 KB | 370 KB |
| Video H.264 (respaldo) | 676 KB | 360 KB |
| Poster AVIF 4:4:4 | 252 KB | 152 KB |
| Poster WebP (respaldo) | 189 KB | 118 KB |

Cada tamaño baja **sólo lo suyo** —poster y un video—. Contra lo que había (la imagen de 245 KB),
el Home suma ~0,65 MB en desktop y ~0,37 MB en mobile. La calidad es la del arte: la densidad
del recorte desktop es la misma que tenía la imagen, y PSNR 37,8 dB contra el master sin
pérdida, el techo que pone el 4:2:0 de cualquier video web.

**Cómo carga sin tocar el rendimiento:**

1. El poster es el fondo CSS de siempre (`image-set` AVIF → WebP), así que el primer pintado no
   cambia. Medido en build de producción: **LCP ~70 ms en desktop** (el H1) y **~78 ms en mobile**
   (el poster); CLS igual que antes.
2. El `<video>` recién se monta **después del evento `load`**, así no compite con nada de la
   primera carga, y aparece recién en `playing`: como el poster *es* su primer frame, el cambio
   no se ve.
3. **No se monta** con `prefers-reduced-motion` ni con `Save-Data`: queda el poster.
4. Se **pausa fuera de pantalla** (`IntersectionObserver`) y se **desmonta** al pasar a otro slide.
5. Elige el archivo por el breakpoint real —lee `--breakpoint-desktop` del CSS— y cambia si la
   ventana cruza los 1100.

**Verificado:** 8 anchos entre 390 y 1920 (archivo correcto, reproduce, sin scroll lateral, sin
errores de consola); movimiento reducido sin video; pausa al scrollear y reanuda al volver;
cambio de slide ida y vuelta; el carrusel ya no avanza solo.

**El master no vive en el repo.** El master sin pérdida (`lossless-v25.mkv`), los scripts del
pipeline y las máscaras están en `~/Desktop/hero-loop-fuente/` de la máquina del usuario; los
cuatro videos de la entrega salen de ahí con `final_enc.py`, y los posters son el frame 0 tal
como lo pinta Chrome (ver notas de implementación). Para regenerar el master hace falta Python
con `numpy`, `opencv-python-headless`, `ultralytics` (SAM 2.1) y `simple-lama-inpainting`.

### Intro de PROJECT: Yi ✅ (2026-09-24)

Idea del usuario, a partir del feedback del equipo ("más dinámico", "tipo el launcher del LoL").
El slide default es el login screen de **PROJECT: Master Yi** (League of Legends): en la
primera visita de la sesión se ve **sólo el video** —robots en silueta— y a 1 s Yi los destruye;
con el destello aparece toda la interfaz del Home, y el video queda en loop sobre el estado final.

**La fuente.** El stream público de Mux que pasó el usuario, a **1280 × 800, 25 fps, 188 s**. No
existe una versión más grande: 1280 × 800 es la ventana del cliente del LoL de 2014, y la mejor
subida de YouTube llega a 1280 × 720. **Se escaló 4× con IA** (2026-09-25): Real-ESRGAN
`realesrgan-x4plus` —el binario oficial, local y gratis, 77 min para los 195 frames que se usan—.
Se eligió sobre `realesr-animevideov3`, el modelo "de video", porque ése aplana la lluvia y el
grano del metal; el parpadeo agregado es el mismo en los dos (+7–8 % de cambio entre frames).
Los originales a 1280 están en `~/Desktop/hero-yi-original-1280/`, con la fuente.

**El análisis frame por frame** (del original):

| Tramo | Frames | Qué pasa |
|---|---|---|
| 0 – 1,4 s | 0 – 35 | Fundido desde negro a los robots |
| 1,4 – 4,0 s | 35 – 100 | Espera: la cámara empuja sola y la luz sube |
| 4,0 – 4,6 s | 100 – 116 | Entra Yi y ataca |
| 4,6 – 5,0 s | 116 – 124 | Destello, el frame más brillante |
| 5,0 – 5,8 s | 124 – 144 | Se asienta el estado final |
| 5,8 s → | 145 → | Estado final, con un **loop propio de 5 s** (145 – 269) |

**Por qué no hay corte.** En la espera la cámara nunca está quieta —medido con flujo óptico, se
corre ~22 px y la luz sube— así que saltar del fundido al ataque se veía. En vez de empalmar, la
intro **arranca en el frame 75** y el fundido lo hace la web: el video entra de opacidad 0 a 1
en 500 ms sobre el `#202020` de la página. El ataque cae a 1 s del arranque y el movimiento de
cámara es continuo.

**El loop venía hecho:** el estado final se repite cada 125 frames. El salto del frame 269 al
145 (Δ 0,82) es menor que el de dos frames seguidos (Δ 1,41), y la intro termina en el 144, así
que el paso intro → loop es continuo. Codificados: seam del loop Δ 1,95 contra 2,14 de mediana;
intro → loop Δ 2,91 contra 4,08.

**Archivos** (`public/assets/home/hero-yi/`), AV1 q32 con H.264 de respaldo, etiquetas de color
dentro del stream y posters del frame 145 tal como lo pinta Chrome (ver notas de implementación):

| | Desktop 1920 × 1200 | Mobile 984 × 1200 |
|---|---|---|
| Intro AV1 · H.264 (2,8 s, sólo primera visita) | 642 KB · 1,42 MB | 409 KB · 878 KB |
| Loop AV1 · H.264 (5 s) | 947 KB · 1,79 MB | 539 KB · 1,01 MB |
| Poster AVIF · WebP | 144 KB · 115 KB | 83 KB · 68 KB |

**Variante retina** (2026-09-25): desktop suma un tercer juego de archivos a **2560 × 1600**
—intro 917 KB, loop 1,40 MB en AV1; H.264 2,13 / 2,77 MB; poster AVIF 201 KB— sacado de los
mismos frames escalados. Se elige cuando **ancho de ventana × `devicePixelRatio` ≥ 2200**: una
MacBook a 1440 @2x, 1100 @2x o un monitor de 2560 @1x la bajan; 1440 @1x sigue con la de 1920 y
mobile no cambia. El poster desktop pasa a `image-set` con 1x y 2x. Verificado en los cinco casos,
poster 2x contra video 2x Δ 0,88.

**Limpiar la fuente antes de escalar no suma** (probado el 2026-09-25 en 3 frames): quitar bloques
con `deblock` + `hqdn3d` deja el detalle igual y apenas limpia zonas planas; `nlmeans` suaviza
de más y se come la lluvia. `x4plus` ya limpia la compresión él solo. Se descartó.

**El escalado pasa a 4x-UltraSharp** (2026-09-25). Comparado en 3 frames contra `x4plus`, Remacri,
4xNomos8kSC y NMKD-Siax —modelos ncnn del repo de Upscayl, corren con el mismo binario—: el más
nítido (+9 % de varianza del laplaciano), el más fiel reducido a 1280 (Δ 1,45 contra 1,97) y sin
más parpadeo (2,52 contra 2,54). Remacri y Siax salen más blandos. 75 min para los 195 frames.
La versión `x4plus` quedó en `~/Desktop/hero-yi-x4plus/`.

**El salto al reiniciar el loop era la compresión, no el contenido.** El frame 269 → 145 del
original cambia lo mismo que dos frames seguidos (Δ 1,86 contra 1,89), y en Chrome el intervalo
al reiniciar (48–61 ms) cae dentro de la variación normal (33–72 ms). El salto venía de que el
keyframe del archivo se ve más limpio que los frames que lo siguen: el error sube de 1,40 a ~2,0
a lo largo del loop y al volver al frame 0 la imagen "se aclara" de golpe, 2,4× un paso normal.
Se corrige codificando AV1 en **calidad constante con predicción low-delay**
(`rc=0:qp=38:pred-struct=1`): el salto queda en **0,4–0,7×** en los tres tamaños. H.264 y HEVC
no lo logran con ninguna configuración razonable (1,5–2,8×), así que el H.264 de respaldo —Safari
sin AV1— conserva el salto de antes. El paso intro → loop, que ocurre una vez por sesión, baja de
4,8× a 3,3×: la intro y el loop son archivos distintos y el primer frame del loop no hereda nada
de la intro.

| AV1 (intro · loop) | Desktop 1920 | Retina 2560 | Mobile 984 |
|---|---|---|---|
| UltraSharp, qp 38 low-delay | 937 KB · 1,14 MB | 1,30 · 1,66 MB | 595 · 708 KB |

AV1 a **q40** (H.264 a 25): contra los frames escalados sin pérdida da 38,1 dB, y comparado a
tamaño de pantalla no se distingue de q32, que pesaba 70 % más. Contra los 1280 originales, el
hero suma 23 % en desktop y 17 % en mobile. Empalmes medidos de nuevo: loop Δ 1,96 contra 2,18 de
mediana; intro → loop Δ 2,92 contra 4,07.

**Encuadre.** Yi usa `fit: "cover"` —a diferencia de Jett, que va pre-recortado al ancho—:
desktop es el video entero en *cover* anclado al **75 %** horizontal, así Yi queda a la derecha;
mobile es un recorte vertical de 656 × 800 centrado en el 58 % del original, que deja adentro a
Yi (55–80 % del ancho) y al ataque (30–70 %). El foco vive en la data (`focus`) y llega al CSS
como custom property, igual para el poster y para el `object-position` del video.

**Cómo corre** — la decisión se toma **antes del primer pintado**:

1. Un script inline en el `<head>` del layout raíz (`introBootScript`, `lib/hero-intro.ts`) marca
   `<html data-intro="pending">` sólo si: es `/` sin hash, no hay `prefers-reduced-motion` ni
   `Save-Data`, y la sesión no la vio (`sessionStorage`). No es `next/script` con
   `beforeInteractive`: ése no garantiza correr antes de pintar.
2. Con `pending`, `intro-veil` (header, riel, bottom bar, contenido del hero y footer) e
   `intro-veil-sections` (las secciones del Home salvo `#home`) quedan en opacidad 0 sin
   interacción; el poster se oculta (`intro-pending:invisible`) y el escaneo del título y la
   cascada de miniaturas quedan **pausados** en su primer frame.
3. Al hidratar se monta la intro (`IntroVideo`). Cuando arranca, el loop empieza a bajar, pausado
   en su frame 0. A los **1,7 s** de intro —el destello— `data-intro="reveal"` y la interfaz
   entra en 600 ms (`--hero-intro-reveal-duration`), con el escaneo corriendo encima.
4. Al terminar la intro se saca el atributo y arranca el loop; el poster, que es su frame 0,
   cubre el instante del cambio.

**Salidas de emergencia**, todas verificadas:

| Caso | Qué pasa |
|---|---|
| Click, tecla, rueda o toque durante la intro | Salta al estado final al instante |
| La intro no arrancó a los **2 s** de abrir la página (red lenta, JS lento) | El script de arranque la cancela: interfaz visible, sin intro |
| No arrancó a los 1,5 s de hidratar, o `play()` falla | La cancela el componente |
| JS no carga nunca | A los 2 s el script inline la cancela; failsafe final a los 7 s |
| Recarga, vuelta al Home desde otra ruta, ruta interna directa | Sin intro |
| Movimiento reducido · `Save-Data` | Sin intro ni video: poster |
| Cambio de slide durante la aparición | Termina la intro; el slide nuevo entra normal |

**El costo, medido en build de producción:** la primera visita de la sesión tiene un LCP de
**~2,5 s en desktop y ~1,9 s en mobile**, porque el H1 recién aparece con el golpe. Es el
concepto —la interfaz no está hasta que llega el ataque—, no un problema de carga: la visita
siguiente vuelve a **~72 ms**. El CLS no cambió.

### Diferido hasta que el scope esté maquetado

Decisión del usuario, 2026-09-20, al cerrar el Home: estas tres **no se encaran ahora**. No es
deuda olvidada — es trabajo que rinde más cuando estén todas las pantallas, o que depende de un
tercero. Se retoman en la pasada de fixes chicos, con el scope completo.

| Tema | Por qué espera | Qué hace falta para retomarlo |
|---|---|---|
| **Accesibilidad de toda la UI** | Hacerla pantalla por pantalla sale inconsistente; de una pasada, no. Lo que salía gratis del markup ya está (`sr-only` en los ítems del menú, `aria-current`, listas y encabezados reales). Falta lo que el diseño no dice: estados que hoy sólo se comunican por color —una medalla bloqueada se anuncia igual que una obtenida, porque el candado es decorativo—, orden de foco, contraste, y el indicador de "hay más abajo" que se perdió al ocultar la barra de scroll | Nada — sólo que el scope esté maquetado. **Sigue diferida** por decisión del usuario (2026-09-25), aunque las pantallas actuales ya están maquetadas |
| ~~**El pill de puntaje tiene dos fuentes**~~ | El header lo tenía en Inter y el Leaderboard en `font-techno`. | **Resuelta** (usuario, 2026-09-23): gana la del Leaderboard, que el usuario encontró más copada. Los dos contadores del header —racha y puntos— pasan a `font-techno`, en Regular (de KH no hay Bold y el `font-bold` de la racha sería negrita sintética). Las alturas no cambian: header 106 / 56 y contadores de 40. |
| ~~**Peso de los assets**~~ | `public/assets/home/` iba por 30 MB y el Home descargaba **22,7 MB**: sprites de medallas de 1024² mostrados a 86px, portadas de 3 MB en cards de 268. Al recargar, los assets pesados aparecían de golpe medio segundo después que el resto. | **Resuelta** (usuario, 2026-09-23), sin fade: se atacó la causa. Los 46 assets de 40 KB o más pasaron a **WebP al doble del tamaño en que se pintan** (medido en las cinco rutas a 390 / 1440 / 1920, teniendo en cuenta el `object-fit` y el zoom de 1,05 del hover), y los que ya se pintaban a su tamaño nativo sólo cambiaron de formato. 26,6 MB → **1,56 MB**; el Home descarga **2,8 MB** en vez de 22,7, `/leaderboard` 0,09 en vez de 4,4. Las diez páginas completas dan Δ medio ≤ 0,63 contra el render anterior. Los originales sin referencias **se borraron** el 2026-09-23 (56 archivos, 35,4 MB), cada uno con su derivado verificado; siguen en el historial de git. `public/assets` pasó de 38 a **3,2 MB**. |


### Notas de implementación que salieron del maquetado

| Tema | Qué pasó | Cómo se resolvió |
|---|---|---|
| **Un `notFound()` desde una página devuelve un HTML vacío** | La primera versión de la 404 era un catch-all `(site)/[...slug]` que llamaba a `notFound()`, para heredar el layout `(site)`. Daba 404, pero el servidor mandaba `<html id="__next_error__">` con el `<body>` vacío: la pantalla la dibujaba el JS, sin JS quedaba en blanco y la función corría en cada pedido. De ahí salían también dos síntomas: la pestaña perdía el título al hidratar y en dev aparecía el aviso *Encountered a script tag* (con el badge “1 Issue”), porque React volvía a renderizar el `<head>` entero con el `<script>` de la intro. | Lo encontró la revisión de código y se reprodujo en una app de Next 16.3.5 mínima: pasa con cualquier `notFound()` llamado desde una página. **La 404 de URLs sin ruta va en `app/not-found.tsx`**, que se renderiza completa en el servidor. Con el cambio desaparecieron los dos síntomas. |
| **Chrome apaga la salida de Web Audio después de 30 s de silencio** | El usuario notaba que, después de un rato sin sonidos, el siguiente no sonaba o sonaba bajo. El motor no suspende nada por inactividad, así que la causa estaba afuera. | En Chromium, `SilentSinkSuspender` pasa a una salida falsa cuando el `AudioContext` renderiza ceros exactos durante 30 s, y el primer sonido lo devuelve a la real con demora. Los dispositivos Bluetooth y HDMI hacen lo suyo en menos tiempo. Se resuelve con una señal continua de -80 dBFS que nunca es cero (ver § 5, *La salida de audio no se duerme*). **Un `AudioContext` en `running` no garantiza que la salida esté despierta.** |
| **En Chromium, `page.evaluate` cuenta como gesto del usuario** | Los primeros tests del sonido daban el audio habilitado sin haber tocado nada. `page.evaluate()`, `page.hover()` y `page.focus()` de Playwright prenden `userActivation`. | Para probar lo que pasa antes del primer gesto hay que usar sólo `page.mouse` y `page.keyboard` y leer los resultados con `console.log` desde la propia página. **Y el flag `--autoplay-policy=user-gesture-required` no es la política de desktop**: es la vieja de mobile y deja el `AudioContext` corriendo al cargar. La política real es la que viene sin flags. |
| **El navegador dispara `pointerover` cuando la página scrollea debajo de un mouse quieto** | Con el hover sonoro en elementos que scrollean, la rueda hacía sonar todo lo que pasaba debajo del cursor. | El evento que causa el scroll trae exactamente las coordenadas del último `pointermove`; uno real, no. El listener descarta los que coinciden. |
| **Un `onPointerEnter` de React se entera del puntero que entra a un portal hijo** | Pasar del ítem del riel a su tooltip volvía a animar el ícono: el contenido del tooltip vive en un portal, pero en React sigue siendo hijo del `<li>`. | El handler ignora el evento si `currentTarget` no contiene de verdad al `target` en el DOM. **Cualquier handler de entrada sobre un elemento con tooltip, popover o menú en portal tiene el mismo problema.** |
| **Reiniciar una animación con `fill-mode: both` salta a su primer keyframe durante el delay** | Clickear un ítem del riel justo después del hover cortaba la animación: la marca de "activo" la reiniciaba con 140ms de delay y durante ese tiempo el ícono volvía al primer cuadro. | Si la animación de hover sigue corriendo, el cambio a activo no la reinicia. |
| **React cancela la animación de la captura `root` nueva** | La pill del riel aparecía sobre la ruta antes de que la persiana llegara, y el `::view-transition-new(root)` no figuraba entre las animaciones aunque su estilo computado decía `route-swap-in`. | React cancela esa animación cuando arranca la transición, así que la `root` nueva se pinta a opacidad plena desde el primer cuadro, encima de la vieja. Lo que no esté cubierto por otra captura muestra el estado nuevo de entrada. **Todo lo que tenga que controlar su propio tiempo durante una View Transition necesita su propio `view-transition-name`.** |
| **`scale: -1` espeja también el `transform` que el navegador le pone al grupo** | La persiana de vuelta se trababa al final y dejaba sin tapar la franja izquierda en el momento del cambio: la pill verde del riel aparecía antes de que pasara el panel. | La vuelta reusaba la ida espejada con `scale: -1 1`. Pero el `::view-transition-group` trae un `transform` propio (la posición del elemento, acá −360px por el `left: -25%`), y el `scale` se aplica encima, alrededor del centro: el −360 se volvía +360. El panel quedaba 360px corrido, así que a la mitad no cubría el borde izquierdo y al final seguía en pantalla hasta que la transición se cortaba. Se reescribió sin espejo, con los polígonos del grupo y del filo invertidos para la vuelta. Medido en video, la cobertura baja de 720 a 48 píxeles de columna sin quedarse quieta, igual que la ida. **En un pseudo-elemento de View Transition, nada de `scale` o `rotate` para reusar una animación.** |
| **`cn()` borra una utility propia si su nombre empieza con un prefijo de Tailwind** | El barrido de los chips no animaba: el relleno aparecía de golpe. Medido, el `::before` saltaba de `-100%` a `0` sin pasos intermedios, y agregando la clase a mano sí animaba. | Las utilities se llamaban `fill-wipe` y `fill-wipe-on`. tailwind-merge las tomó por dos colores de `fill-*` y, al llegar `fill-wipe-on`, borró `fill-wipe`: el `::before` se quedaba sin `content` y lo que se medía era un pseudo-elemento inexistente. Pasaron a `wipe` / `wipe-on`. Es la misma familia que *`cn()` borra los tokens de tamaño de texto con nombre propio*: **una utility propia no puede empezar con un prefijo que tailwind-merge conozca** (`fill-`, `text-`, `bg-`, `border-`, `shadow-`…) si va a convivir con otra en el mismo `cn()`. |
| **Un `group` sin nombre en un contenedor grande enciende todos los `group-hover` de adentro** | Hacer hover sobre Reclamar encendía el velo del botón de perfil. Pasaba en producción. | El `<header>` llevaba `group` para que el header mobile leyera `data-scrolled`. `group-hover:` es "descendiente de **cualquier** `.group` con hover", así que el header entero actuaba de grupo para el velo del perfil. Pasa a `group/header`. **Un `group` en un contenedor que envuelve a otros grupos va siempre con nombre.** |
| **Las capturas de Playwright no muestran una View Transition** | Los screenshots tomados durante la persiana mostraban la página nueva sin panel, y parecía que la transición no corría. | `getAnimations()` mostraba las seis animaciones corriendo en orden. Lo que no captura el panel es `page.screenshot()`. Para ver una View Transition hay que **grabar video** (`recordVideo`) y sacar cuadros con ffmpeg. |
| **Un plazo que corre desde la hidratación no protege una red lenta** | Con la red a 40 KB/s, la intro esperaba a que React hidratara para empezar a contar su timeout de 1,5 s: la página quedaba en blanco hasta el failsafe de 7 s. | El plazo principal lo pone **el script inline**, que corre con el HTML: si a los 2 s nadie marcó `data-intro-started`, cancela la intro. Medido: con la red lenta la interfaz aparece 2 s después de que llega la página, y con JS bloqueado también. **Cualquier estado que oculte la página tiene que poder deshacerse sin depender del bundle.** |
| **Bloquear `/_next/static/chunks/` también bloquea el CSS** | La primera prueba "sin JS" mostraba la interfaz visible con la intro pendiente, y parecía que el velo no funcionaba. | En Next 16 el CSS vive en la misma carpeta que los chunks de JS. Para simular "sin JS" hay que bloquear por tipo de recurso (`script`), no por ruta. |
| **Chrome decodifica un AV1 sin etiquetas de color con la matriz bt601** | El video del hero salía más magenta que su poster en los rojos: Δ medio 4 contra la imagen. `ffprobe` decía `bt709`, pero ese dato vivía sólo en el contenedor: SVT-AV1 ignora los `-color_*` de ffmpeg y no los escribe en el bitstream. | Se pasan dentro del encoder (`-svtav1-params color-primaries=1:transfer-characteristics=1:matrix-coefficients=1`) y en x264 con `-x264-params colorprim=…`. **Y el poster se arma desde el frame 0 tal como lo pinta Chrome**, no desde un decode de ffmpeg: la reconstrucción del color del navegador no es la de ffmpeg y en bordes saturados difiere hasta 17 niveles. Con eso el cambio poster → video da Δ medio 0,7 en desktop. En mobile queda ~1 en bordes finos por el reescalado (864 → 390), que es un cambio único al cargar. |
| **El poster en WebP no alcanzaba para empalmar con el video** | Aun sacado del frame del navegador, el WebP a q85 se iba 14 niveles en el p99: su color va a media resolución y los rojos saturados del arte lo exponen. | AVIF a q80 con **4:4:4**, que pesa lo mismo que la imagen vieja (252 KB) y deja p99 9. El WebP queda de respaldo en el `image-set`. |
| **El loop de un video web salta en el keyframe** | Al volver al frame 0, el fondo quieto cambiaba hasta 6 niveles (p99,9): el encoder va reescribiendo las zonas quietas durante el clip y el keyframe no las repite igual. | En SVT-AV1, `enable-tf=0` (sin filtrado temporal) baja el salto a p99,9 4, y lo que queda está pegado al borde del pelo, que cambia en cada frame igual. La estructura *low-delay* y el `ipratio` alto de x264 lo empeoraban. |
| **17 de los `.png` del repo son JPEG, y uno trae orientación EXIF** | Al pasar los assets a WebP, el banner de Juegos salió **espejado** respecto del render aprobado: Δ medio 5,6 en `/games`, con la misma foto recortada distinta. | `juegos/banner.png` es un JPEG con `orientation = 2` (espejo horizontal). El navegador aplica la orientación EXIF por default, así que lo aprobado era la foto espejada; `sharp` no la aplica salvo que se le pida, y el derivado salía derecho. Se regeneró con `.rotate()` (auto-orienta) y el banner volvió a Δ 0,6. Es el único con orientación, pero hay 17 `.png` que son JPEG por dentro. **Cualquier derivado de un asset del diseño se genera con `.rotate()`, y ante una imagen que sale distinta, mirar `file`, no la extensión.** |
| **Un anillo inset debajo de una imagen asoma cuando la imagen se anima** | En las cards de misión (Home y `/missions`), al sacar el mouse aparecía por menos de un segundo una línea gris de 1px bajo la portada. Medido a DPR 2 sobre la card roja: una fila gris neutra (45,45,45 y 41,41,41) a +22 y +120ms del mouse-out, que no existe ni en reposo ni en hover. | La portada llevaba `ring-1 ring-inset ring-border-muted/50`. Un `ring` es `box-shadow` inset, que se pinta en el fondo del contenedor, **debajo** de la imagen: en reposo la imagen lo tapa y nunca se veía. Mientras la imagen vuelve de `scale-105` y la card baja sus 2px, la imagen va en su propia capa de compositor, que se rasteriza alineada a píxel de dispositivo, mientras que el contenedor está en y fraccionaria (la portada mide 131,64 / 145,73): queda una fila sin tapar y asoma el anillo. **El render del Figma no tiene ningún trazo en la portada** —muestreado en los cuatro bordes, pasa directo de la imagen al `#222`—, así que el anillo se borró en vez de subirlo encima. Medido después: 0 frames con línea en 80 capturas de la card roja, contra 5 antes. En reposo el único cambio es el píxel antialiaseado de los bordes y las esquinas, que queda **más oscuro** porque el anillo también asomaba ahí medio píxel. Home 4156 / 4046 sin cambios. **Un borde decorativo que vive debajo de una imagen animada no es decorativo: o va encima o no va.** |
| **El pill no seguía el scroll al volver al Home desde otra ruta** | Desde `/tournaments`, clickear un ítem llevaba al Home, pero al scrollear el pill quedaba clavado. | `Nav` vive en el layout `(site)`, que **no se desmonta al cambiar de ruta**. El efecto del spy dependía sólo de `[ids]`: en `/tournaments` corría una vez, no encontraba ninguna sección y volvía; al llegar al Home no tenía motivo para volver a correr, así que nunca se suscribía a las secciones nuevas. Ahora recibe el `pathname` y lo tiene en las dependencias. **Cualquier hook del layout que mida el DOM de la página tiene que re-suscribirse con el `pathname`.** Verificado en 1440 / 390 / reduced-motion: tras volver desde `/tournaments` y `/missions` el pill sigue a Misiones, Sura News, Eventos y Home. |
| **Un anillo enmascarado en `z-0` lo tapa cualquier hermano absoluto que venga después** | El borde degradado del banner de `/games` no se veía: medido, el píxel del borde daba el olivo del scrim (49,73,39) en vez del verde. | El `::before` del anillo estaba en `z-index: 0` y el scrim es un `<span absolute inset-0>` **posterior en el DOM**, con `z-index: auto`: a igual nivel, gana el que se pinta después. Las otras utilities de borde degradado (`-row`, `-card`, `-nav`) no lo sufren porque no tienen un hermano que cubra todo. Acá el anillo sube a **`z-index: 30`**, arriba del contenido (z-20), que además es lo que hace el Figma: el stroke se pinta sobre el scrim. Medido después: el borde reproduce el render del nodo con Δ≤4 en 11 de 14 puntos. |
| **Una constante exportada desde un módulo `"use client"` llega vacía al server component** | El buscador de `/games` salía sin fondo, sin padding y sin gap. `SearchField` exportaba `SEARCH_FIELD_ROUTE` (un string de clases) y la página lo pasaba por `cn()`. Medido: el `className` final era `"flex items-center rounded-pill min-w-px flex-1"` — las clases del string **no estaban**. | Con el compilador de RSC, **todo** export de un módulo cliente se convierte en una referencia de cliente: lo que llega al server component es un objeto, no el string. `clsx` recorre los objetos como mapas `{clase: booleano}`, no encuentra ninguna clave verdadera y devuelve `""` — **falla en silencio, sin error de tipos ni de runtime**. El chrome por defecto pasó a vivir dentro del propio componente y quien necesita otro lo pisa por `className`. **Ninguna constante de estilo puede cruzar el borde cliente→servidor.** |
| **Figma interpola el alfa de un degradé sin premultiplicar; CSS sí lo premultiplica** | Las filas del podio de `/leaderboard` van de `rgba(c, 0.75)` a `#222`. Traducido literal a CSS, el medio del recorrido quedaba 13 niveles más oscuro que el render del Figma. | Verificado con dos muestras del render: el modelo no premultiplicado clava el valor (Δ ≤1) y el premultiplicado se va 12. Como CSS no permite elegir, el degradé se reescribe **opaco**, compuesto a mano sobre `#222` en cinco stops. Medido después: Δ ≤2 en todo el barrido. **Cualquier degradé con un stop semitransparente tiene este problema; con dos stops opacos no.** |
| **El render de un nodo se recorta contra el frame que lo contiene** | `get_screenshot` sobre la grilla de `/games` (1245 × 1278) devolvía 1269 × 311. No es un error del MCP: el frame padre mide 1024 de alto y recorta. `contentsOnly: true` tampoco lo destraba. | Los valores se sacaron de `get_design_context` fila por fila, que sí devuelve el subárbol entero. **Para una pantalla larga, el render sirve para la parte de arriba y nada más.** |
| **Las cards de `/games` reusan los mismos siete archivos del Home** | Las 12 cards del frame parecían necesitar 12 artes nuevos. | Comparados byte a byte, seis de los siete fills del frame son exactamente los de `public/assets/home/juegos/`. El único nuevo es *The Plooshies*. Lo mismo con el banner desktop, que es el `banner.png` del Home; el banner **mobile** sí trae una foto propia. **Antes de bajar un asset, comparar el tamaño en bytes con los que ya están en el repo.** |
| **Un scroller horizontal recorta el subrayado del tab activo** | El tab seleccionado de Misiones se veía sin su línea: el `<ul>` lleva `overflow-x-auto` —que fuerza `overflow-y: auto`— y el botón colgaba su `border-b-2` 2px por debajo con `-mb-0.5` para tapar la línea del contenedor. Esos 2px caen fuera del content box del scroller y se recortan. Medido: `scrollHeight` 44 contra `clientHeight` 42, y la línea bajo el activo daba `#444` en vez de `#a5a5a5`. | La línea gris pasa a un `<span>` absoluto en el `<nav>` y **todos** los botones llevan su propio `border-b-2` —transparente los inactivos— dentro de su caja. Los bordes quedan a la misma altura que el span y lo tapan sin salirse de nadie. Se fue el margen negativo. **Nada que dependa de desbordar un contenedor con `overflow` sobrevive**: si hay que pisar un borde, el borde tiene que estar fuera del scroller. |
| **El MCP esconde el diseño detrás de un `<img>`** | El chevron del carrusel de Misiones volvió de `get_design_context` como un `<div>` con una sola imagen. Parecía un chevron pelado y se maquetó así; el usuario avisó que le faltaban el fondo y el tamaño. | El SVG exportado traía todo: `<rect rx=20 fill=#303030>`, `<rect stroke=#A5A5A5>`, el `<path>` del glifo y un `<filter>` con la sombra. **Cuando el MCP devuelve un nodo como una sola imagen, abrir el SVG antes de darlo por simple** — sobre todo si el nodo tiene nombre de control (`chevron`, `button`, `badge`). Es la misma familia que los degradés aplanados: el MCP simplifica y hay que ir al asset o al render. |
| **`cn()` borra los tokens de tamaño de texto con nombre propio** | El badge de SP salía **38 de alto** contra los 28 del diseño, en la ruta **y en el Home**. El span computaba 16/24 en vez de los 14/14 de `--text-reward`: la clase no estaba. | `cn` es tailwind-merge, que resuelve conflictos por grupo. Los tamaños de la escala estándar y los de talle (`text-sm`, `text-2xs`, `text-3xs`) los reconoce como font-size y conviven con un color; los de **nombre propio** (`text-reward`, `text-card-title`, `text-note`, `text-cta`…) no los puede clasificar, los toma por color y **los borra** cuando en el mismo `cn()` viene un `text-<color>` después. La salida es que no compartan bloque: el color se pone en el contenedor y se hereda, y el tamaño queda estático en el hijo. **Se rompió al refactorizar un `className` estático a `cn()`** —el string literal nunca pasa por el merge— y no se detectó antes porque el badge es absoluto y no mueve la caja de la card. Barrido el repo: los únicos dos casos eran éste y el specimen de `/styleguide`. |
| **La sombra de elevación necesita más aire que el glow, y el aire no puede mover el layout** | `--shadow-card-hover` es `0 8px 24px`: pide 18px por arriba (con los 2 del salto) y 30 por abajo, contra los 12 que difundía el glow verde. Los dos carruseles recortan —`overflow-x-auto` obliga al eje Y— así que la sombra se cortaba con una línea dura. | Se le da el aire con padding y se devuelve con margen negativo, el mismo truco que el `-mx-3 px-3` que ya tenía `card-slider`. **Ojo con cuánto se devuelve:** el viewport de Misiones tenía `py-3` sin compensar, o sea 12px de alto real que el bloque aprobado ya incluía. Compensarlo entero (`-my-8 py-8`) subía todo lo de abajo 24px. Va `-my-5 py-8`: 32 de aire para pintar y los mismos 12 netos de antes. Verificado: el banner de Juegos vuelve a y=2403,328125 en mobile y 2869,640625 en desktop, al subpíxel. El `<ul>` de Sura News mobile no tenía padding, así que ahí sí se compensa entero. **Y el eje X tampoco alcanzaba:** los 12px de `-mx-3 px-3` que había puesto el glow verde dejaban la sombra de la última card cortada con una línea vertical dura. Pasaron a **24**, pero ahí aparece el conflicto de fondo — ver la fila de abajo. Verificado que las cards no se movieron: la primera sigue en 24 en mobile y 148 en desktop. |
| **En un carrusel, el aire de la sombra ES área visible** | Al subir el aire horizontal a 24px, en el otro extremo del scroll ese aire mostraba 24px de la card siguiente **por fuera de la columna** — y en Misiones desktop, donde las cuatro cards cierran los 1144 exactos, eso rompe la grilla. Lo vio el usuario. El `overflow` de un carrusel no distingue entre la sombra y el contenido: los dos se pintan en el mismo lugar. | Se separaron las dos cosas. El viewport conserva sus 24px de aire y **`lift-clip`** lo recorta en el borde de la columna, salvo del lado donde el carrusel ya llegó a la punta: ahí el recorte se abre a 0 y la sombra sale entera, que es justo cuando no hay card siguiente que mostrar. El estado entra como custom property (`--clip-start` / `--clip-end`) desde el `atStart`/`atEnd` que el slider ya tenía — la excepción de la regla 6, igual que `--nav-index`. **Primero se probó taparlo con dos capas opacas y estuvo mal:** bajo Eventos asoma el fondo del hero, así que pintaban un rectángulo gris sobre el arte. `clip-path` recorta sin pintar. |
| **Un overlay clickeable se come el `hover` de lo que tapa** | Con la card entera cubierta por un botón estirado, el CTA quedaba fuera del hit-test: `:hover` sólo alcanza al target y a sus ancestros, así que el glow verde no se encendía nunca por sí solo y hubo que dispararlo con `group-hover` — o sea que hoverear el CTA y hoverear la card se volvían indistinguibles. Lo vio el usuario. | El overlay baja a `z-10` y el contenido sube a `z-20` con `pointer-events-none`; el CTA vuelve a `pointer-events-auto` y así hit-testea él. Medido: sobre la card se enciende sólo el violeta, sobre el CTA se encienden los dos, y el click del título lo toma el overlay y el del CTA el CTA. **Un overlay que cubre una card anula el hover de todo lo que hay debajo: si algo adentro necesita estado propio, tiene que hit-testearse.** |
| **El scrim del banner no se puede correr sin perder el copy** | Se pidió apagar el violeta al 40% del ancho para ver más el arte. | En desktop el copy vive en una caja de 530 sobre 1144 y termina en el 49%, así que el violeta puede morir en el 40%; en mobile es **de borde a borde** y no hay ningún x que sirva. Se implementó desktop, se miró y el usuario lo revirtió: **el scrim queda como el diseño en los dos tamaños**. Si el tema vuelve, la salida no es el degradé sino el texto — darle al título la sombra que hoy sólo tiene la bajada. |
| **El panel de la card no necesitó compensar el píxel del borde** | Al pasar de `border` a anillo enmascarado se esperaba perder 2px de alto y había que devolverlos. | No hizo falta: el `min-h` ya era el que mandaba. Medido antes y después, el panel da **126 en desktop y 94 en mobile** en las ocho cards, y la card sigue en 357 / 219,78. El contenido más padding entra en 124, así que el borde nunca estuvo definiendo el alto. |
| **`justify-between` llena el ancho con agujeros** | Primer intento del footer mobile: para que dejara de verse centrado se estiraron las filas con `justify-between`. Quedó peor — el logo a un extremo y los íconos de comunidad al otro, la etiqueta del idioma lejísimos de sus íconos. Lo vio el usuario. | **Un hueco en el medio de una fila se lee como error; el espacio que sobra al final de una fila alineada a la izquierda, no.** Se volvió a agrupar denso contra el gutter y el ancho se gana donde sí suma: envolviendo los links en dos renglones y estirando los badges con `flex-1`. |
| **Un separador en una fila envuelta queda colgando** | Al pasar los links de columna a fila envuelta, la barrita que precede a "Soporte:" se fue al final del primer renglón y quedó un `|` suelto. | En mobile no van separadores: alcanza con `gap-x-6`. El `Divider` vuelve a ser `hidden desktop:block`. De paso: envolverlo en un `<span class="block">` le rompía el alto en desktop —un `<span>` inline ignora `h-6`— y el footer perdía 8px. |
| **Los íconos del footer salen en blanco en un screenshot** | Sacando la foto del `<footer>` con Playwright, los íconos de redes aparecían vacíos y parecía una regresión del layout. No lo era: el DOM estaba completo y midiendo daban sus 16 × 16. | `next/image` va `loading="lazy"` por default y el footer vive al final de una página de 4156px: `element.screenshot()` lo scrollea a la vista pero dispara la foto antes de que las imágenes bajen, y `networkidle` ya había pasado. **Para fotografiar cualquier cosa del fondo de la página hay que scrollear y esperar** (~1,2s alcanza). Vale para el footer y para cualquier sección baja. |
| **El stop transparente de un degradé va con el color al 0, nunca `transparent`** | Salió en el scrim del hero. La palabra clave `transparent` es `rgba(0,0,0,0)`: el navegador interpola hacia el **negro** y el degradé pasa por un gris sucio antes de desaparecer. | Se escribe el mismo color con alfa 0 — `rgb(32 32 32 / 0)` en vez de `transparent` — y la interpolación queda dentro del color. Vale para todos los scrims del proyecto. |
| **`items-end` y `h-full` se anulan** | En el podio mobile las tres cards tienen que apoyar en la misma base y crecer cada una lo suyo. | Van con `items-end`: los hermanos `flex-1` siguen repartiendo ancho pero dejan de estirarse en alto, que es justo lo que se busca. **No combinar con `h-full`**, que vuelve a estirarlas y tira el escalonado. |
| **La flecha derecha del carrusel no llegaba a apagarse** | `scrollLeft` no cae nunca en el valor exacto de `scrollWidth - clientWidth`: queda a una fracción de píxel. | La comparación lleva 1px de margen. Sin eso el carrusel nunca se da por terminado y la flecha queda encendida sobre un scroll que ya no avanza. |
| **El hover de una fila de tabla no puede ser un glow** | Las filas del Leaderboard van pegadas y con 5 a la vista; el resplandor que usan las cards las habría hecho parpadear en bloque. | Las cards de News sí llevan glow —están separadas y son pocas—, pero la fila no. La capa de fondo va como `<span>` absoluto y no como `bg-*` del propio link, porque el `::before` del borde ya ocupa ese lugar y el degradé del anillo compondría contra el color nuevo. |
| **El hover de la fila pasó por tres versiones hasta funcionar** | La primera era capa de fondo más nombre en verde: "muy plano y simple". La segunda sumó cinco señales de color y seguía sin convencer. | La que funcionó agrega **movimiento real**: con el puntero encima la fila **se agranda y empuja a las de abajo**. La tabla no cambia de alto y la sección tampoco — las cinco filas se reparten los mismos 329 con `flex-1`, así que subirle el `grow` a una se lo quita a las otras (medido: 59,4 → **70,7** la activa y 56,6 las demás, sección clavada en 486). Eso es lo que mantiene la alineación con Medallas, que comparte la fila de 486. **No rebota**: la fila crece bajo el puntero, nunca se achica, así que el puntero no puede quedar afuera — verificado fila por fila y con seis saltos rápidos. El `min` de 56 no es casual: es el avatar de 32 más los dos `p-3`. |
| **El podio quedó sin link cuando las filas sí lo tenían** | La tarea decía "filas como link" y se implementó literal: los puestos 4 a 8 llevaban al perfil y el podio no, siendo los mismos usuarios. Lo detectó el usuario. | Las tres cards del podio son links, en los dos componentes. **No se elevan igual que las filas**: las tres comparten una fila horizontal, así que crecer las desalinearía; suben 2px con `translate`, que no toca el layout. Verificado que las medidas no se movieron: 211 × 97 en desktop y el escalonado de mobile (144 × 168 el primero, 91 × 140 los otros). El `order` y el ancho se quedan en el `<li>` —son cosa del escalonado— y todo lo visual baja al link. |
| **El verde en el hover de la fila no funcionó** | Se probó el borde encendido en verde de marca, con el nombre y el anillo del avatar acompañando. Con tres elementos del mismo verde la fila se leía como un bloque; bajarlos por opacidad (75% y 45%) tampoco convenció. | Decisión del usuario (2026-09-20): **sin verde**. El nombre y el anillo del avatar no cambian de color, y el borde se queda en su gris — sólo sube un escalón de contraste, con `--color-border-muted` a opacidad baja y el mismo desvanecido hacia abajo. Medido: de 71/57/44 en reposo a **109/88/48** con el puntero encima. El movimiento de la fila es la señal fuerte; el color sólo acompaña. El anillo del hover vive en un `::after` aparte y no cambiando el fondo del `::before`: **un `background` con degradé no transiciona, la opacidad sí**. |
| **El carrusel recortaba el glow del hover en las puntas** | Al pasar el mouse por la última card de Misiones, el resplandor verde se veía en tres lados y se cortaba en el derecho. | Un contenedor con `overflow` recorta lo que se sale del área scrolleable, y `--shadow-brand-glow` difunde 12px. Se le da ese aire al viewport con `px-3` y se devuelve con `-mx-3`, así las cards quedan donde el diseño las pone — verificado, la primera sigue alineada con la columna y el scroll máximo no cambia. Va en `card-slider.tsx`, o sea para cualquier carrusel; el aire de arriba y abajo lo declara cada sección, que es la que sabe cuánto necesita. |
| **Tailwind v4 anima `scale`, no `transform`** | El zoom de la portada al pasar el mouse parecía no funcionar: `getComputedStyle(img).transform` devolvía `none` con y sin hover. | La utility `scale-105` de v4 genera la propiedad **`scale`**, que es independiente de `transform`. Medida la correcta, el hover pasa de `none` a `1.05` y la imagen de 236 a 247,8px de ancho. **Era un error de medición, no del código.** Ojo también al probar utilities creando un `<div>` en runtime: Tailwind sólo genera las clases que encuentra en el código fuente, así que una clase inventada en la consola nunca va a tener CSS. |
| **Las flechas del carrusel corrían las miniaturas 22px** | Al envolver el `<ul>` en un contenedor con las dos flechas, las miniaturas de desktop se fueron de x=1336 a 1358. | El `<ul>` de 60 quedaba centrado en los 104 que deja la columna de 148 menos el `pl-11`. Se arregla con `items-start` en el contenedor y **flechas del mismo ancho que las miniaturas** (`desktop:w-15`), para que el chevron se centre sobre ellas sin mover nada. Verificado: título, copy y miniaturas vuelven al píxel exacto de antes. |
| **El puntero sobre el slider pausa el autoplay, y eso confunde al medirlo** | Un test daba "el click no reinicia la cuenta": tras clickear una miniatura el carrusel no avanzaba nunca. | No era un bug: al clickear, el puntero queda sobre el slider y la pausa por hover es justamente lo que se pidió. Para medir el reinicio hay que **mover el puntero fuera después del click**. Con eso el siguiente avance cae a los 3046ms. |
| **El fade del hero no era un cruce: era un fundido contra el fondo** | Al cambiar de juego, la capa del arte se remontaba con `key` para repetir el keyframe. Eso **destruye la capa anterior en el mismo frame**, así que durante la animación la imagen nueva se fundía sobre `--color-background`, no sobre la imagen que estaba. De ahí el parpadeo oscuro entremedio. | Se mantienen **dos capas** mientras dura el cruce: la saliente queda opaca abajo y sólo la entrante anima de 0 a 1, así el compuesto es exactamente `nueva × α + vieja × (1−α)` y el fondo no participa. La saliente se desmonta en `animationend`. Medido sobre el frame del medio, la distancia a la mezcla ideal de las dos imágenes pasó de **53,6 a 26** niveles. Dos detalles que lo sostienen: la atenuación del 75% de mobile subió al contenedor —si viviera en cada capa, el fondo se colaría entre las dos— y con `prefers-reduced-motion` la animación dura **1ms en vez de `none`**, porque sin `animationend` la capa saliente no se desmontaría nunca. |
| **Un `IntersectionObserver` no avisa cuando la intersección se achica a cero** | El pill volvía a Home al clickear Eventos. El hero mide 826 y Eventos arranca en 826, así que el click deja el scroll en 720 y el **fondo del hero cae exactamente en y=106**, la línea del header. Chrome reporta eso como `isIntersecting: true` con un rect de **altura 0**, y como el scroll se detiene ahí, la transición nunca cruza el umbral: el observer **no vuelve a disparar** para el hero. El `Set` que acumulaba quién estaba en la franja se quedaba con el dato viejo, y como ganaba el primero en orden de DOM, ganaba Home. Filtrar por `intersectionRect.height > 0` en el callback **no alcanza**: ese callback no corre. | La franja se **mide en el momento de decidir**, con `getBoundingClientRect()` sobre las secciones, y el observer queda sólo como disparador. Son 6 mediciones por evento del observer, no por píxel, así que la virtud del diseño original se mantiene. De paso desaparece el `Set` y con él toda una clase de bugs de sincronización. **Un observer sirve para saber *cuándo* mirar, no para llevar la cuenta de *qué* está visible.** |
| **Un `desktop:` le gana al `hover:` dentro del breakpoint** | El CTA del hero lleva `shadow-cta-mobile` con `hover:shadow-cta-hover`, y en desktop `desktop:shadow-cta`. Arriba de 391 el hover no se veía: las dos clases tienen la misma especificidad y `desktop:shadow-cta` viene después en el CSS generado. | El hover se repite con el prefijo: `desktop:hover:shadow-cta-hover`. **Cada vez que una propiedad tiene override por breakpoint y también estado de hover, el hover hay que escribirlo en los dos niveles.** |
| **Stroke de Figma vs `border` de CSS** | En Figma el stroke se dibuja **hacia adentro** y no agrega tamaño; en CSS `border` sí. Los contadores quedaban 2px más altos y el botón Reclamar 1.3px más ancho. | Los bordes que no deben afectar el layout van como **`ring-1 ring-inset`** (box-shadow, cero impacto en layout). El anillo del avatar va en una capa **encima** de la foto, para que la imagen ocupe los 40px completos. |
| **`next/image` rompía el alfa** | El optimizador re-encodeaba los PNG a paleta y ensuciaba la transparencia: el ícono de fuego pasaba de 33×37 px de tinta a 35×48 y se veía recortado. | `images.unoptimized: true` en `next.config.ts`. Los assets ya vienen de Figma en su tamaño final; en un clon pixel-perfect la fidelidad manda sobre la optimización. |
| **Exports opacos** | El export de un nodo hornea el fondo del padre. El PNG de las estrellitas salía 100% opaco con el verde del botón adentro y tapaba el cofre. | Para un asset que se superpone a otro se usa la **imagen original** del fill (que sí tiene alfa), no el export del nodo. |
| **Un ícono, dos colores** | El menú flotante necesita cada ícono en blanco (default) y en `#0C0C0C` (sobre el pill verde), pero el Figma exporta uno solo de los dos por ícono. Pedir los 12 archivos era la salida obvia. | El SVG se usa como **`mask-image`** (`@utility nav-icon-*` en `globals.css`) y el color lo pone un token de fondo: `bg-foreground` en default, `bg-background` en el activo. Un solo export sirve para los dos estados. El asset no se toca: se referencia por URL igual que en un `<img>`, con la misma geometría — verificado midiendo los dos renders. Solo sirve para íconos de **un color**; si entra uno multicolor, ese vuelve a `<img>`. |
| **El pill activo cambiaba de tamaño** | El Figma define el seleccionado como padding alrededor del ícono (`px-10 py-8` sobre 26 px = 46 × 42). Con íconos de 18, 20 y 24 px el pill salía más chico en cada ítem, y el diseño solo define el caso de Home. | Se fija el pill en **46 × 42** y el ícono se centra adentro. Reproduce exacto el caso que el Figma sí define y unifica el resto (§ 6, normalización, punto 4). |
| **El ícono desaparecía en pleno viaje** | Si el ícono de destino se ponía negro al instante, quedaba negro sobre fondo negro hasta que el pill llegaba. | El cambio a negro espera al pill (`delay-150` + 75 ms); el que se apaga vuelve a blanco de inmediato. Mientras el pill pasa por encima de los íconos intermedios, quedan blancos sobre verde — legibles. |
| **El color llegaba tarde en los saltos cortos** | Con `ease-out` el pill se posaba a los ~140 ms en un salto de una celda pero a los ~215 ms en uno de cinco: un solo timing de color no podía servir para los dos, y en los cortos se veía el ícono blanco sobre el pill verde. | Se cambió la curva a **`ease-in-out`** y la duración a 250 ms. Medido: al terminar el fade del color (225 ms) al pill le faltan **0,1 px** en un salto de una celda y **0,5 px** en uno de cinco — llega igual sin importar la distancia. La tolerancia es ±10 px, que es el juego del ícono de 26 dentro del pill de 46. |
| **El MCP aplana los degradés** | `get_design_context` devolvió el borde de la bottom bar como `border-[#494949]` sólido. El diseño real tiene un degradé vertical y la barra "se sentía distinta". | Se muestrearon los píxeles del render del nodo (canvas + `getImageData`): borde superior `#484848`, inferior `#2E2E2E`, y los laterales idénticos entre sí a cada altura — o sea degradé vertical lineal. **Ante la duda sobre un color, medir el render, no leer el código del MCP.** Como no existe `border-image` con radio, el anillo se dibuja en un `::before` enmascarado (`border-gradient-nav`), que además no tapa el `backdrop-blur`. |
| **El copy iba en minúscula** | El Figma muestra el copy del hero en MAYÚSCULAS, pero el texto del nodo está en minúscula y no tiene `text-transform`: las caps las pone la propia KH Interference, que no tiene minúsculas. Con un sustituto que sí las tiene, el render no se parecía. | `uppercase` en el call site. Salió al cambiar de fuente, pero el desvío existía desde antes. |
| **`drop-shadow` no admite varias capas** | El CTA mobile lleva dos sombras (glow verde + caída). Con `--drop-shadow-cta-mobile: a, b` Tailwind genera `drop-shadow(a, b)` — un solo `drop-shadow()` con dos valores adentro, que es CSS inválido: el filtro se descarta entero y el botón salía sin sombra. | Las dos sombras del CTA pasaron a **`box-shadow`**, que sí es multicapa nativo. El botón es un pill opaco, así que se ve idéntico, y encima el override de desktop cae sobre la misma propiedad. |
| **El arte del hero está escalado 1.81×** | El asset original mide **1440 × 811**, pero el Figma lo estira a 2610 de ancho. O sea que el arte se ve blando ya en el diseño. | Se replica tal cual: reproducirlo fiel implica esa misma blandura. Si se quiere nitidez hay que pedirle a diseño el arte a 2610+ de ancho. Anotado como deuda. |
| **Scroll horizontal en la franja sin diseño** | Entre 391 y ~860px el título de 64px no entra y la fila del hero desbordaba, empujando la página entera de costado. | `overflow-x-clip` en la `<section>`: recorta solo en X y deja pasar el desborde vertical del fondo, que es el que tiene que verse. El PRD § 4 ya aceptaba que esa franja se recorte; lo que no se acepta es que scrollee. |
| **Unificar el tamaño de caja desbalanceó los íconos** | La bottom bar del Figma usa todos sus íconos en 24 px, así que se unificaron los nuestros. El de Misiones quedó visiblemente más grande. | Los exports tienen **padding interno distinto**: medida la tinta con canvas, en una caja de 24 Misiones pinta 24 × 24 y Home 18 × 18. Los tamaños nativos existen para igualar la **tinta**, no la caja — con ellos los dos pintan 18 × 18. Se revirtió a nativos. **Antes de unificar cajas, medir la tinta.** |
| **El menú flotante se comía el puntero de media pantalla** | La flecha izquierda del slider de Eventos no tomaba ni el hover; la derecha sí. | El `<nav>` de desktop mide 148 × 720 y está **fijo**, así que al scrollear tapa el gutter izquierdo de cualquier sección que pase por debajo. Se le puso `pointer-events-none` y los eventos los toma el riel, que es lo único que se ve — el menú mobile ya venía así. **Cualquier overlay fijo que ocupe más que su parte visible necesita lo mismo.** |
| **El borde de la card no se mezclaba con su propio fondo** | Las cuatro cards llevan el mismo borde, `rgba(160,229,0,0.2)`, pero en el Figma el de la card de fondo claro se ve naranja a la izquierda y turquesa a la derecha: el verde al 20% toma el degradé de abajo. En el clon salía verde plano en las cuatro. | El `background` shorthand resetea `background-origin` a `padding-box`, así que `cover` escalaba la imagen a la caja de padding y el anillo de 1px del borde quedaba sin fondo: el verde componía contra el fondo de página. Se cierra el shorthand con `border-box`. Medido después: el borde superior de la card 1 da `32,62,25` contra `32,62,26` del Figma. |
| **El personaje pisaba el borde inferior de la card** | En la card de fondo claro quedaba una franja clara sobre el borde de abajo, que en el Figma no está. | El borde se dibuja en el píxel exterior de la card y el personaje llegaba a `bottom-0`, o sea encima; el scrim y el tinte, que lo taparían, arrancan un píxel más adentro. El piso del personaje pasó a `bottom-px`. Se ve sólo en ese arte porque es el único opaco hasta abajo. |
| **El mobile de Eventos es el desktop al 57.4%** | El Figma no dibujó un mobile propio: escaló la card entera. Eso deja bordes de 0.287px, radios de 6.887 y un badge con tipografía de **4.59px**, que es ilegible. | Se normalizó todo según la política de § 6 en vez de replicarlo: radio 8, bordes 1, tipografías al piso de la escala (`--text-3xs`, 8px). Consecuencia visible: en la primera card los badges entran en **una** fila y no en dos, porque los del Figma estaban a tamaño sin escalar. |
| **Las flechas del slider no estaban donde parecía** | El nodo de la sección (`6008:26364`) no trae ningún control, así que se iban a inventar. | Aparecen en el **frame compuesto del Home**, apoyadas en los gutters: son chevrons pelados, sin círculo ni fondo. Se midieron sobre el render a resolución completa — tinta 10 × 18, centro 33px por fuera de la columna y a 202 del tope del slider, `#FFFFFF` activa y `#444444` inactiva. **Antes de dar por inexistente un elemento, mirar el frame de la pantalla y no sólo el de la sección.** |
| **El recorte del personaje no podía ir en `background-position`** | Primero se resolvió como el arte del hero, convirtiendo el offset del Figma a posición porcentual con P = offset / (1 − tamaño). El personaje de la card 2 salió corrido: su divisor vale 0.0056, así que amplifica 180 veces cualquier redondeo del tamaño. | Ventana con `overflow-hidden` y la imagen posicionada adentro, con los porcentajes del Figma sin convertir. Como el Figma escala la card entera, los mismos valores sirven para los dos tamaños. |
| **La línea divisoria del Figma es un degradé degenerado** | `Line 22` se exporta como SVG con un degradé vertical definido **fuera** de la caja de la línea (de y=1 a y=2 sobre una línea de 1px en y=0.5). | Al renderizar queda plano en su primer stop: `#A1A1A1` al 50%. Se resuelve con `--color-border-muted` al 50%, a 4 niveles del medido — imperceptible a media opacidad. |
| **Revelado escalonado del slider** | Las portadas son los assets más pesados de la página (4,2 MB entre tres) y aparecían de golpe, cada una cuando terminaba de bajar — desordenadas y sin relación con el orden de la lista. | Las tres no activas van con `fetchPriority="low"` para que no compitan con el arte del hero (`loading="lazy"` ya es el default de `next/image`), y el `<li>` entra con un `@utility thumb-reveal`: sube 8px y se funde, escalonado 150ms por índice (90ms hasta el 2026-09-23). La última cierra a los 870ms (420ms por miniatura y 150 de escalón desde el 2026-09-23; antes 690), que es el colchón de carga; hasta entonces se ve `--color-thumb-dim` de placeholder. Sólo `opacity` y `transform`, que resuelve el compositor sin tocar layout — medido: las posiciones finales son idénticas y el `transform` queda en `none`. Con `prefers-reduced-motion: reduce` no hay animación, y el guard vive dentro de la utility para que no se pueda usar mal. **Es el segundo desvío consciente de AGENTS regla 16**, con el mismo criterio que el pill del menú: cero librerías de motion. |
| **El encuadre del Figma no sirve para las otras portadas** | Al hacer funcional el slider, los cuatro artes arrancaron con el encuadre medido del Figma (181,25% anclado arriba a la izquierda). Valorant y Modern Warfare III quedaron bien; Fortnite mostraba media letra de su logo a pantalla completa y Black Ops 6 un arma gigante. | El encuadre del Figma está compuesto **para el arte del Figma**. Cada entrada declara el suyo en `lib/data/hero.ts`: `design` para el arte del diseño, que conserva el hero aprobado intacto — verificado, `181.25% auto` en `0% 0%` y `254.174%` en `31.704% 0` —, y `cover` centrado para las otras tres, que así muestran su propia composición. |
| **Chrome trunca `border-width` a píxeles enteros** | El borde de 1.5px de la miniatura activa se pintaba de 1px: medido a `deviceScaleFactor: 2`, 2 píxeles de dispositivo en vez de 3. Pasa igual con un `border: 1.5px` literal. El anillo del avatar del header arrastraba el mismo redondeo desde el bloque 1. | Se probó con `ring` inset (`box-shadow`), que sí respeta el medio píxel, pero la decisión del usuario (2026-09-19) fue al revés: **los strokes de medio píxel se redondean al entero de arriba** y quedan como `border`. Un mecanismo menos que recordar, y un borde entero se pinta como se pide. La miniatura activa queda en 2px en desktop y 1 en mobile (donde el diseño pide 0.8, que redondea a entero igual), y el avatar en 2px. |
| **El MCP acertó la atenuación, pero igual se midió** | El frame mobile atenúa las miniaturas no seleccionadas (portada al 40% sobre `--color-thumb-dim`) y el desktop no. | Se muestrearon los dos renders antes de decidir, y la diferencia era real. Después el usuario resolvió unificar en el tratamiento de mobile (ver deuda). Misma política que el degradé de la bottom bar: **ante la duda, medir el render.** |
| **Assets con recorte interno** | El ícono de fuego es un sprite de 3072×2048 que el diseño clipea, y el logo de CS2 lleva un glow radial encima. Reproducir eso con porcentajes es frágil. | Se **exporta el nodo** desde Figma en vez de reproducir el recorte. Sigue siendo el asset del diseño, sin redibujarlo (regla 10). |
| **El MCP volvió a aplanar un degradé, ahora en el ángulo** | El podio desktop salía bien en casi toda la card pero la esquina inferior izquierda se iba 11 niveles. El MCP devuelve `170.7deg`, que es la conversión de la transformación de Figma — y Figma admite degradés con *skew*, que CSS no puede expresar. | Se barrieron ángulos comparando contra el render del nodo, punto por punto sobre el fondo de las tres cards: **162deg** deja la diferencia en **≤2 niveles**. En mobile, en cambio, los 140/132° del MCP dieron bien (2,4 de media). O sea que el valor del MCP no es confiable ni siquiera cuando el degradé es de una sola capa: **se mide siempre**. |
| **El borde del Figma volvió a sumar tamaño** | La fila de la tabla daba 60 en vez de 56 y el pill del puntaje 34 en vez de 32: el stroke del Figma se dibuja hacia adentro y el `border` de CSS hacia afuera. | Los dos pasaron a `ring-1 ring-inset`, que es la salida que ya estaba documentada arriba para el mismo problema. Los anillos de los avatares no: esos viven en una capa posicionada, donde el `border` no le saca tamaño a nada. |
| **Las tres medallitas no vienen iguales** | El emoji de oro y el de bronce traen la cinta y el diseño los recorta a la chapa con una ventana al 155,77%; el de plata ya viene recortado y se usa entero. | El recorte va declarado **por medalla** (`leaderboard-podium-style.tsx`) y no como regla del componente. Es el mismo patrón de ventana que usan los personajes de las cards de Eventos. |
| **El 59,4 de las filas no es un alto** | La tabla desktop parecía pedir filas de 59,4px, un número que no normaliza a nada. | Es el reparto de los 329 que deja la fila de 486 entre 5 filas y 4 gaps. Se fija el alto de la **fila** y las `<li>` van `desktop:flex-1`: el 59,4 no se escribe en ningún archivo y la cuenta cierra sola. En mobile los 56 salen del contenido (`p-12` × 2 + avatar 32). |
| **La corona cambia de naturaleza entre tamaños** | En desktop, 14 + 4 + 56 = 74 no entra en los 65 de contenido de una card de 97: puesta en el flujo, la card se iba a ~106. En mobile la card sí la contempla en su alto. | Desktop la posiciona `absolute` sobre el avatar (`bottom-full mb-1`); mobile la deja en el flujo. Es una de las razones por las que los dos podios son componentes distintos. |
| **La card del podio lleva alto fijo** | Nuestro nombre de usuario mide 16 de interlineado (`--text-xs`) contra los 15 del diseño, así que la card daba 98 y la tabla se quedaba con 328. | Se fijó `--spacing-podium-card: 97px` y el píxel sobrante se reparte dentro de la card, que centra su contenido. Con eso la tabla vuelve a 329 y la fila cierra en los 486 del Figma. |
| **El MCP infló la opacidad de un brillo** | El brillo gris de las medallas bloqueadas salía 10 niveles más claro que el render. El ángulo no era el problema: barrido entero, todos los de la familia -52.74° puntuaban igual. | Barriendo la opacidad del stop medio contra el render, la que reproduce el diseño es **0.28**, no el 0.4 del MCP — 0.4 × 0.7 da 0.28, así que lo más probable es una opacidad de grupo que el MCP aplanó dentro del color. Con eso la mediana del anillo pasa de 48 a 41 contra los 40 del Figma. El brillo verde, en cambio, sí va al 0.32 que reportó: medido, Δ 3,2. |
| **Las medallas doradas son dos sprites de 2 × 2** | Nueve celdas y sólo siete archivos: tres doradas salen del mismo PNG y una cuarta de otro, recortando un cuadrante distinto por celda. Las grises sí vienen sueltas. | Se replica el recorte con la ventana de siempre (`overflow-hidden` + imagen posicionada), con los porcentajes del Figma sin convertir. Pedir nueve exports habría sido cambiar el asset del diseño por otro. |
| **El círculo de 86 vive en una caja de 82** | El Figma le pone `p-12` a la celda y un círculo de 86 en una caja de 82: sobresale 2px por lado. Copiado literal, eso obliga a un desborde que después hay que recortar. | Se usa `p-10` con el círculo al ancho completo: el render es idéntico —86 de círculo a 10px del borde, celda de 130— y todo lo de adentro puede ir en porcentajes, que es lo que hace que la misma celda funcione en mobile a 98. |
| **La grilla de Medallas se cuelga del alto de la fila** | Repartir 335 entre 3 columnas da celdas de 106,33 y no de 106: el panel se iba a 439 contra una fila de 486 que ya estaba cerrada. | El panel toma el alto que le deja la fila (`flex-1`) y `grid-rows-3` reparte las tres filas en los 130 exactos. Los 0,33 de ancho quedan: son el redondeo simétrico del píxel que el Figma deja suelto a la derecha. |
| **El interlineado del badge no se ve hasta que se mide** | El badge de puntos salía 4px más alto que el del Figma con todos los paddings correctos. | El texto: `--text-sm` trae interlineado 20 y el diseño le pone 14. Se agregó `--text-reward`. **Cuando una caja chica no cierra en alto y los paddings están bien, el sospechoso es el interlineado del token de texto.** |
| **La card de misión queda 4px más baja que el Figma** | El diseño pone la descripción en 10/14 y el token más cercano, `--text-2xs`, es 10/12. | Se reusa el token, que es lo que manda la política de normalización (≤2px). Sobre dos líneas eso deja la card en 237,6 contra los 241,4 del Figma. Es una consecuencia conocida de la regla, no un error: nada se alinea contra el borde inferior de la card. |
| **La franja sin diseño volvió a scrollear** | Entre 391 y ~860px la página se iba de costado: la columna fija de 657 del Leaderboard más el gap de 120 y el mínimo de Medallas suman 960. Apareció al revisar Misiones, pero venía del bloque 9. | `overflow-x-clip` en la `<section>`, igual que el hero. **Conviene medir `scrollWidth` contra `clientWidth` en 500 / 700 / 860 al cerrar cada bloque**: el desborde no se ve en los dos tamaños que sí tienen diseño. |
| **Una caja con `aspect-ratio` toma el tamaño del PNG** | La galería de Sura News se fue a 1575px de alto: la card ancha define su imagen por proporción y altura, y sin altura definida arriba la caja cayó en el tamaño intrínseco del archivo (1280px). | La imagen va `absolute inset-0` dentro del contenedor `relative`: así no aporta tamaño intrínseco y la caja con `aspect-ratio` toma el que le da el layout. **Toda caja con `aspect-*` necesita que su imagen esté fuera del flujo.** |
| **El Figma recorta el interlineado del título** | La card grande de News da 301 de alto contra los 291 del Figma, y las chicas 144,5 contra 139,5. | El diseño usa `text-box-trim`, que recorta el aire sobre las mayúsculas y bajo la línea base: 2 líneas de 20 le quedan en ~30. Tailwind 4.3 no tiene la utility y la propiedad todavía no está en Firefox, así que meterla haría que el layout difiera entre navegadores para ganar 10px. Se deja el alto natural. Revisar cuando Tailwind la incorpore. |
| **La card de News se volvía invisible en mobile** | Su fondo es `--color-background`, el mismo color de la página: en desktop se ve porque el panel de la sección es más oscuro, y en mobile ese panel no existe. | En mobile la card pasa a `--color-surface-3` (#282828), que ya existía en el DS: la deja **8 niveles** sobre el fondo de página, que es el mismo salto que el diseño le da en desktop (card #202020 sobre panel #191919, 7 niveles). Con `--color-surface` (#222) el salto era de 2 y no se veía. |
| **El aire del bloque Juegos no es el `title-gap` de siempre** | Entre el título, el banner y la grilla hay 50,5px y no los 16 del resto de las secciones. | El Figma usa gap 16 entre frames, pero el frame del banner mide 357 con la imagen de 288 **centrada**: los 34,5 de arriba y abajo se suman al gap. Se reprodujo como una columna con gap 50 en desktop (24 en mobile). |
| **El scrim del banner no alcanza en mobile** | El degradé está compuesto para una caja de 1144 donde el texto ocupa sólo el tercio izquierdo. A 342 el texto cae sobre los jugadores y no se lee. | Variante `--gradient-promo-scrim-mobile`, mismo violeta, que cubre de izquierda a derecha en vez de en diagonal. Es decisión nuestra: no hay frame mobile de este bloque. Por pedido del usuario (2026-09-19) se apaga al **70% del ancho**, para que se vea más el arte sin dejar el copy sobre la foto. |
| **El wordmark de Google Play viene espejado** | El SVG `path90` que exporta el Figma está dibujado al revés en Y: puesto tal cual, "Google Play" salía cabeza abajo. | El nodo lleva `scale-y -1` en el propio diseño, que el MCP sí reportó. Se replica con `-scale-y-100` sobre la imagen: el asset no se toca (regla 10). |
| **Los separadores del footer miden 0 en el Figma** | Las líneas verticales son frames de `w-0` con el trazo dibujado 1px por fuera, así que no ocupan lugar en la fila: link · 16 · [0] · 16 · link. | En CSS un `w-px` sí ocupa: la fila de links queda 3px más ancha (598 contra 595) y la de redes 2px (502 contra 500), repartidos alrededor del centro. Dentro de la tolerancia de § 6; no vale la pena un margen negativo por eso. |
| **El footer también desbordaba en la franja sin diseño** | La fila de arriba mide 941 en desktop y entre 391 y ~940 no entra. | `overflow-x-clip`, como el hero y el Leaderboard. Medido después: `scrollWidth` = `clientWidth` en 390 / 500 / 700 / 860 / 1440. |
| **Los paneles de las cards de Juegos tienen que medir todos igual** | Con el título en una o dos líneas y los badges en una o dos filas, cada card daba un alto distinto y la grilla se veía ruidosa. | El `min-h` de 126 del Figma **es** el caso de dos líneas: 20 + 48 + 16 + 22 + 20. Con el gap interno en 16 —no en 24, que era el error— todos los paneles cierran en 126 en desktop y en 94 en mobile. En mobile además los badges van en una sola fila (del tercero en adelante se ocultan) y anclados abajo con `justify-between`, así coinciden entre columnas; desktop mantiene el alineado al tope del diseño. |

### Vocabulario de hover

El diseño no define ningún hover: todos son decisión nuestra. Para que no haya uno distinto
por sección, hay **dos recetas con nombre**. Cuando se pide "un hover como el de X", es una
de estas dos.

**Hover de elevación** — cards de Juegos, Misiones y Sura News. El default para una card
con imagen.

1. La card **sube 2px** con `translate`. Nunca con margin ni con alto: no toca el layout.
2. Sombra **negra** de profundidad (`--shadow-card-hover`), no un glow de color.
3. La card sube **un escalón en su propio gris**, sin cambiar de tono. Dónde depende de
   lo que la card tenga:
   - **con borde** → sube el borde, con el mismo desvanecido que en reposo
     (Juegos: `--gradient-card-border` → `-active`; Misiones: `ring-border` →
     `ring-border-muted/60`).
   - **sin borde** → sube la **superficie**, un nivel del DS (Sura News: `--color-background`
     → `--color-surface-3` en desktop, `--color-surface-3` → `--color-surface-2` en mobile).
     Los dos saltos son de 8 niveles, que es el mismo que el diseño usa para separar la card
     de su panel.
4. La imagen hace **zoom 1.05** con `--ease-reveal`, dentro del `overflow-hidden` que ya existe.
5. **Cero color**: ni el título ni los badges cambian de hue; a lo sumo suben de gris
   (`--color-muted-foreground` → `--color-subtle-foreground`).
6. **Corchetes de mira** (`CardBrackets`, desde el 2026-09-25) en Misiones, destacadas, Sura News,
   Torneos y Eventos. Es la única excepción al punto 5: cuatro trazos cortos de `--color-brand` por
   fuera de la card, que marcan el objetivo sin teñirla. Juegos no los lleva: su panel de vidrio con
   borde degradado ya es la señal de esa card.

**Hover de crecimiento** — filas del Leaderboard. Para ítems de una lista densa, donde
elevar una fila entre otras pegadas no se lee.

La fila **crece y empuja a las de abajo** sin que la tabla cambie de alto (`flex-1`), y el
borde sube un escalón de contraste. Tampoco hay color.

**Glow de link** — "Ver todo" de cada sección, "Ir a Sura News" y los íconos del footer.

Es la excepción a la regla del verde, y por eso está acotada: son elementos chicos **que ya
son verdes**, o sea lo accionable explícito. Los íconos de redes del footer entran por lo
mismo: el Figma los dibuja en `#A5E04A` y son `<Image>`, así que no se pueden recolorear sin
tocar el asset. Los dos íconos blancos de Soporte comparten el glow para que la fila tenga
una sola receta; sobre blanco el halo verde se lee como iluminación, no como tinte. Una sombra negra sobre texto verde en fondo
oscuro no se vería, y moverlo se leería como un salto. Se enciende con
`--drop-shadow-link-hover`, el mismo `#97F300` de la familia de glows.

Va como **`drop-shadow` y no `text-shadow`** porque la flecha es un `<img>`: `text-shadow`
la dejaría apagada mientras el texto brilla. Un solo valor, que es todo lo que `drop-shadow`
admite (ver notas de implementación).

**Lo que las tres comparten**, y vale para cualquier hover nuevo:

- **El movimiento es la señal fuerte; el color sólo acompaña.** Un cambio de color solo se
  lee plano — está probado tres veces en este proyecto.
- El verde de marca queda para lo **accionable explícito**: el CTA del hero, Reclamar, el
  CTA del banner. En una card entera lee como alarma.
- Siempre `focus-visible:` en pareja con `hover:`, siempre `motion-reduce:transition-none`.
- Duraciones: **200 ms** para sombra, color y borde; **250 ms** con `--ease-reveal` para el
  zoom de una imagen. El lift de 2px de cards y podios va en **200 ms con `--ease-reveal`**
  (unificado el 2026-09-24).
- Al apretar, la card baja a `scale-98`: es la única señal que existe en touch, donde `hover:`
  no corre.

### Vocabulario de entrada

Pedido del usuario (2026-09-23). La primera versión —máscara por palabra en el título más
*fade-rise* del copy— funcionaba, pero el usuario la encontró genérica, y tenía razón: la puede
tener cualquier sitio. Se reemplazó por dos recetas que salen de la identidad de la app —la
tipografía de HUD, el verde neón y el tono arcade de puntos y rankings—, elegidas por el usuario.
Lo que se sigue evitando a propósito: blur-in, rebotes, parallax, un efecto por elemento y animar
el arte.

**Escaneo HUD del hero** (`hud-scan`, sobre el bloque de título + copy + CTA): una línea de
`--hud-scan-line` (2px) en `--color-brand-vivid`, con `--shadow-brand-glow`, baja por el bloque en
700ms con `--ease-scan` (un *ease-in-out* mecánico, no de desaceleración) y lo va revelando con
`clip-path`. La máscara deja `--hud-scan-bleed` (24px) de aire alrededor para no cortar la sombra
del CTA ni el halo del copy, y la línea viaja 2px por delante del borde de la máscara, así queda
siempre visible. **El apagado es una animación aparte** (`hud-scan-fade`, usuario 2026-09-23): arranca a los 550ms (`--hud-scan-fade-delay`), dura 400ms (`--hud-scan-fade-duration`) con `--ease-scan`, y el recorrido termina con `forwards`, así la línea queda quieta en el borde de abajo mientras se funde. Antes se apagaba en el último 15% del recorrido —unos 105ms, todavía en movimiento— y se sentía brusco. El barrido no cambió: misma duración, curva y recorrido. Las miniaturas conservan su revelado. **No toca el
LCP** —medido, el H1 sigue pintando a ~165ms en desktop y el arte a ~285ms en mobile—, a diferencia
de la máscara por palabra, que lo llevaba a ~350ms.

**Puntaje arcade en el Leaderboard del Home**: las filas entran con el *fade-rise* en cascada
(`row-reveal`, 60ms entre filas) y **los puntos cuentan desde 0 hasta su valor** (`CountUp`, 700ms
con *ease-out* cúbico). El conteo arranca **cuando su fila terminó de aparecer** (retraso de la fila +
`--row-reveal-duration`): la primera versión contaba durante el *fade* y, cuando la fila se veía, el
número ya estaba en ~90% — el usuario no notaba ningún cambio. Por lo mismo las cinco filas del Home
dejaron de repetir los 473 del Figma: contar cinco veces hasta el mismo número se leía como un
parpadeo. Desde el 2026-09-23 son **los puestos 04 a 08 de `/leaderboard`** —nombre, avatar,
nivel y puntos—, derivados de `standings` en `lib/data/leaderboard.ts` en vez de los cinco
"NombreUsuario" del Figma: una sola fuente de verdad, y el podio del Home ya coincidía con el top 3
de la ruta. `RevealList` es el `<ul>` con un
`IntersectionObserver` de una sola pasada, y expone su estado por contexto: si al hidratar la lista
ya está a la vista, o si el usuario pidió *reduced motion*, no hace nada; si está fuera, la marca
`armed` (filas ocultas, números en 0) y al cruzar el 85% del viewport pasa a `shown`. El número
animado se apila sobre el valor final invisible en una grilla, así **el ancho del pill no cambia
durante el conteo** (medido: 21,61px fijo) y la fila no salta. El valor final es el string ya
formateado de la data, así que no hay riesgo de hidratación; los intermedios se formatean con el
punto de miles. Sólo las filas: el podio y Medallas se quedan quietos.

**Verificado:**
- estado final **idéntico al píxel** en el hero y el leaderboard, a 390 y 1440;
- reduced motion: cero animaciones y valores finales. Sin JS: valores finales;
- recarga con el leaderboard a la vista: no anima. Click del menú a Leaderboard: anima;
- hover de crecimiento intacto después del reveal;
- Home 4156 / 4046 y 0 de scroll lateral en los cinco anchos.

### Micro-animaciones HUD ✅ (2026-09-24)

Feedback del equipo (Ema): la web necesitaba más micro-animaciones. Se relevó todo lo que se mueve,
se investigaron 17 referencias (Ink Games, Arknights: Endfield, THE FINALS, Valorant Flashback,
Tesoro, Igloo Inc) y dos listas de *AI-slop*, y se armó una página de propuestas con demos en vivo:
**[Movimiento SURA](https://claude.ai/artifact/EAcECZqs8TnnHvYWPFeZsP)**. El criterio de fondo: un
solo lenguaje, la interfaz como el HUD de un juego que se enciende, apunta y suma puntos; curvas que
frenan en seco (`--ease-lock`), sin rebotes, y un efecto protagonista por zona.

| # | Qué | Dónde | Cómo |
|---|---|---|---|
| P3 | **Decodificado de labels**: en hover o foco las letras giran por glifos al azar y se asientan de izquierda a derecha en 350ms | "Ver todo", "Ir a Sura News", tabs de ruta, CTA del hero y los dos "Jugar ahora" | `ScrambleText`. Fija su ancho mientras corre, así nada se corre; el texto real va en un `sr-only` y el animado es `aria-hidden` |
| P4 | **Barrido en diagonal**: el relleno entra desde la izquierda con el borde cortado | CTA del hero y los dos "Jugar ahora" (luz blanca al 20%); chips y paginador (`--color-surface-2`) | `wipe` + `wipe-on`. Los CTAs además bajan 1px al apretar. **El CTA del hero estrena `focus-visible`**, que no tenía |
| P5 | **Subrayado que viaja** entre tabs, como el pill del menú | `route-tabs` | Una capa medida con `ResizeObserver`; antes de medir, el tab activo conserva su borde, así el SSR ya se ve bien |
| P6 | **Odómetro de puntos** y momento de **Reclamar**: el saldo rueda dígito por dígito y aparece un `+50` con parpadeo | Contadores de SP de los dos headers | `lib/use-daily-claim.ts` (store de módulo: sobrevive a la navegación, se reinicia al recargar) + `Odometer` + `PointsValue`. El `+50` sólo aparece si el reclamo pasó con el header montado |
| P6 | **Cascada y conteo en `/leaderboard`**, iguales a los del Home | Tabla desktop y mobile | `RevealList` + `CountUp`. Como en el Home, si la tabla ya está a la vista al hidratar no anima |
| P8 | **Destello del 1º puesto** una sola vez al entrar en pantalla; **medallas obtenidas** que se inclinan hasta 6° hacia el cursor con un brillo que lo sigue; **bloqueadas** con "acceso denegado" (el candado tiembla y el label parpadea) | Podios del Home y de `/leaderboard`; Medallas | `PodiumSheen`, `medal-tilt`, `medal-glint`, `deny-shake`, `flicker`. La inclinación sólo se aplica con el puntero encima: en reposo la medalla no lleva `transform` |
| P9 | **Luz de borde** que sigue al cursor | Banner de `/games` (verde) y banner del Home (violeta) | `BorderLight`, un anillo enmascarado en z-30 que lee `--light-x/y` |
| P7 | **Persiana entre rutas**: un panel oscuro con filo verde cruza en diagonal en 640ms y la pantalla cambia a la mitad, tapada. Hacia el Home cruza al revés, con los polígonos invertidos | Todas las navegaciones entre rutas | View Transitions nativas: `<ViewTransition enter="route-in" exit="route-out">` alrededor del `<main>` (Home y `RouteShell`) y un `<div class="route-shutter">` persistente en el layout, que sólo existe para que su `::view-transition-group` dibuje el panel. La dirección sale del tipo `nav-back`, que mandan `goTo` y `goBack` al volver al Home |
| P1 B | **Corchetes de mira que se dibujan**: en hover o foco, cada esquina se traza desde su vértice en sentido horario (300ms, 40ms entre una y otra), 5px por fuera de la card. El zoom de la imagen se queda | Misiones, destacadas, Sura News, Torneos y las cards de Eventos del Home, que hasta ahora no tenían ningún hover | `CardBrackets`: cuatro `card-bracket` que se revelan con `clip-path: inset()` desde el vértice, así el grosor del trazo no cambia mientras crece. En reposo están recortados a cero: no mueven un píxel |
| P2 C | **Barrido de luz en los títulos**: el título arranca gris (`--color-border-dim`), pasa una franja `--color-brand-vivid` y queda blanco, una sola vez | Títulos de sección del Home (al entrar scrolleando) y H1 de ruta (al llegar navegando, apenas termina la persiana) | `TitleSweep`, con `background-clip: text`. Un título que ya se ve al cargar no se barre: el SSR lo pintó blanco y pasarlo a gris sería un salto. El H1 de ruta arranca gris desde el primer render, así ya sale gris en la captura de la persiana y se enciende cuando el panel terminó de pasar; en una carga directa no se barre |

**Tabs, chips y paginador ahora cambian de selección al click**, sin filtrar ni paginar nada: sin eso
el barrido y el subrayado nunca se verían. El contenido de la pantalla no cambia (§ 1, Fase 1).

**El chrome durante la persiana** (usuario, 2026-09-25). El header, el riel y la bottom bar viven en la captura `root`, que queda debajo de las capturas del `<main>`: desaparecen apenas arranca la persiana y vuelven cuando termina. En desktop el usuario lo aprobó como efecto, y desde el arreglo de la vuelta pasa igual en los dos sentidos. La bottom bar se acomoda a eso: **al salir del Home** cambia en el acto mientras dura la transición (`[:root:active-view-transition_&]:transition-none`), así la captura nueva ya no la tiene y no reaparece; **al volver al Home** espera la persiana (`delay-(--route-shutter-duration)`) y sube recién cuando el panel pasó.

**El header y el riel se funden** (usuario, 2026-09-25). Durante la persiana tienen su propia captura (`vt-header` / `vt-rail` les ponen `view-transition-name` sólo mientras `:root:active-view-transition`): la vieja se funde en 220ms al arrancar y la nueva aparece con otros 220ms recién cuando el panel terminó. Antes vivían en la captura `root`, y React cancela la animación de la `root` nueva: el chrome nuevo se veía desde el primer cuadro donde la captura del `<main>` era transparente. Por eso al volver al Home la pill se prendía sobre la ruta antes de que llegara el panel, mientras que a la ida el arte opaco del hero lo tapaba de golpe. El nombre va sólo durante la transición porque un `view-transition-name` permanente convierte al riel en *backdrop root* y le rompe el blur. Los dos grupos van en `z-index: 50`, entre las capturas del `<main>` y el panel (100): las capturas se apilan por su propio orden, no por el `z-index` de la página, y al volver al Home la captura opaca del hero tapaba al riel mientras se fundía, que después aparecía de golpe al terminar la transición.

**Volver al Home desde la flecha también dispara la persiana.** `router.back()` no la disparaba: Next aplica esas navegaciones de forma síncrona. Si la pantalla anterior era el Home, `goBack` hace un `push` al Home con el tipo `nav-back` y restaura a mano el scroll que tenía (medido: 1945 → 1945). El scroll se guarda en cada click mientras estás en el Home, que es el último momento seguro antes de que Next suba la página nueva al tope. Consecuencia aceptada: el historial suma una entrada en vez de retroceder.

**Arreglos de la tanda 0**, salidos del audit:
- el anillo de foco del buscador no animaba: transicionaba `--tw-ring-color`, que no es interpolable. Pasa a `transition-shadow`;
- el tooltip del menú y las flechas del carrusel ignoraban `prefers-reduced-motion`;
- las miniaturas del hero no tenían estado de foco;
- el `:hover` crudo de `border-gradient-row` / `-card` quedaba pegado en touch: va dentro de `@media (hover: hover)`;
- los badges de la card de Juegos reaccionaban a su propio hover y no al de la card;
- **el header entero era un `group`** (por el vidrio al scrollear), así que hacer hover sobre Reclamar encendía el velo del perfil. Estaba en producción. Pasa a `group/header`.

**Verificado:**
- `npm run verify` limpio; todos los tokens nuevos resuelven en `/styleguide`;
- reposo contra producción en las cuatro rutas internas, a 390 y 1440: mismo alto, y las únicas diferencias son de antialiasing (bordes de las pills con relleno, dígitos del odómetro), entre 177 y 828 píxeles por captura. El Home no se puede comparar: producción todavía no tiene la intro de Yi;
- persiana en video, ida y vuelta; tipos `nav-back` llegando a `startViewTransition`; sin scroll lateral por el panel;
- movimiento reducido: tooltip sin animación, decodificado y odómetro instantáneos, persiana apagada;
- mobile: vidrio del header intacto, bottom bar que vuelve después de la persiana.

### Notas de arquitectura

Decisiones de código que no son medidas del diseño y que el código ya no explica al
costado (`AGENTS.md` regla 19). Son las que se rompen con un cambio que parece inocente.

**Las rutas del sitio viven en el route group `app/(site)/`.** Su `layout.tsx` monta `Nav` y
`Footer`, que son idénticos en todas; `/styleguide` queda afuera a propósito, porque no los
quiere. El `Header`, en cambio, lo monta cada `page.tsx` junto con su `<main>`: la variante
`solid` depende de la ruta y de este modo el árbol entero sigue siendo server component, sin un
wrapper cliente que lea el pathname sólo para elegir un fondo.

**El fondo del hero es frágil por diseño.** Se apoya en `-z-10` y eso funciona sólo porque
su `<section>` **no** crea contexto de apilado: si alguien le agrega `isolate`, `z-*`,
`transform` u `opacity`, el fondo pasa a pintarse encima del contenido de las secciones
siguientes. Por lo mismo, ningún ancestro puede tener fondo propio. Y el `overflow-hidden`
va en la capa de fondo, nunca en la `<section>`: ahí recortaría el desborde vertical, que
es justo lo que tiene que verse.

**La capa base sólida del hero no es decorativa.** El arte mide 101,95% del ancho del
contenedor de alto, así que por debajo de ~1004px de viewport no llega a cubrir los 1024 y
quedaría una franja sin pintar; en mobile además va al 75% y deja pasar lo que tenga
debajo. Es también lo que se ve mientras el arte nuevo todavía no bajó.

**El CTA del hero y "Reclamar" no usan `components/ui/button.tsx`.** El cva de shadcn trae
`text-sm`, `rounded-lg`, `border` y un `active:translate-y-px` que el diseño no define
(regla 16). Son elementos nativos con las clases del diseño. La regla 8 sigue en pie: se
usa el primitive cuando aporta comportamiento, no cuando sólo aporta estilos que hay que
deshacer.

**El estado del slider del hero va en context y no en props.** Los dos consumidores están
en ramas distintas del árbol —el fondo es una capa absoluta detrás de todo y el slider vive
adentro de la fila de contenido—, así que pasarlo por props obligaría a `HeroContent`, que
es estático, a recibir y reenviar algo que no usa y a volverse client component sin motivo.

**`/styleguide` lee los valores en runtime.** `lib/data/design-tokens.ts` lista sólo
nombres y utilities; el valor sale del CSS ya compilado con `getComputedStyle`. Duplicarlo
haría que la página pueda mentir si alguien edita `globals.css`. Por eso el `@theme` es
**`static`**: sin eso Tailwind poda los tokens sin uso y la página los leería vacíos.

**Puntajes y fechas van como string ya formateado.** Formatear en runtime arriesga un
desajuste de hidratación por locale y no aporta nada en Fase 1.

**`homeSections` es constante de módulo.** El scroll-spy la recibe estable y no re-suscribe
el `IntersectionObserver` en cada render. Lo que sí lo re-suscribe es el `pathname`, a propósito
(ver notas de implementación).

**El estado del menú vive en el layout `(site)`, no en `Nav`.** `SectionNavProvider` envuelve
`Nav`, las páginas y el footer, porque el logo vive en el `Header` que monta cada `page.tsx` y
necesita el mismo `goTo` que el menú. El `Header` sigue siendo server component: los únicos clientes
son la hoja `SectionLink` y `HeaderShell`, el `<header>` que escribe `data-scrolled` (con
`useScrolled`, un `useSyncExternalStore` sobre el evento `scroll`) y recibe los dos headers como
`children`, así que ellos no se vuelven cliente.

**`dark:` está atado a una clase, no a `prefers-color-scheme`.** El diseño es dark-only y
no hay ninguna `.dark` en el proyecto, así que las utilities `dark:` que arrastran los
primitives de shadcn quedan inertes y hay un solo camino de render.

**Rutas de detalle apagadas.** `lib/routes.ts` arma la URL de cada detalle y lleva un
registro de cuáles están vivas (`LIVE_DETAIL_ROUTES`); hoy las cinco están en `false`, así que
`detailHref()` devuelve `null`. `CardLink` (`components/layout/card-link.tsx`) renderiza un `<Link>`
si hay destino y un `<div>` con las mismas clases si no. **La UI no cambia** aunque no haya link
(decisión del usuario, 2026-09-23): el `<div>` conserva el hover y suma `cursor-pointer`, que el
`<a>` daba solo. Lo único que se pierde es el foco de teclado y la navegación. Encender una ruta es cambiar su `false` a `true` en ese archivo. Verificado: 0 links a
destinos inexistentes en las cinco rutas, en 390 y 1440, y el reposo idéntico al píxel en nueve
de las diez capturas de página completa; la décima (`/missions` mobile) difiere Δ3 dentro de una
sola portada.

**Ninguna imagen se selecciona ni se arrastra**: son assets del diseño, no contenido.

**El chrome del sitio vive en `SiteChrome`** (`components/layout/site-chrome.tsx`): provider de navegación, persiana, `Nav` y footer. Lo montan el layout `(site)` y `app/not-found.tsx`, porque el `not-found` raíz no pasa por el layout `(site)`. Consecuencia: si se entra a la 404 navegando dentro del sitio, el chrome se vuelve a montar y el provider arranca de cero. Hoy sólo pasa con atrás y adelante del navegador, porque ningún link apunta a una ruta inexistente.

**El sonido se cablea con atributos, no con handlers.** Un único listener delegado
(`components/layout/sfx-listener.tsx`, montado en `SiteChrome`) lee `data-sfx-hover` y
`data-sfx="<evento>"` de los elementos, y detecta solo los links a otra ruta para la ida y la vuelta.
Así ningún componente se volvió cliente por el sonido y cablear un botón nuevo es sumar un
atributo. El motor (`lib/sfx.ts`) es un módulo sin React, y los volúmenes, carriles y límites son
data tipada en `lib/data/sfx.ts`. La excepción son los ticks del odómetro, que dependen del
tiempo de cada dígito y viven en `points-value.tsx`: suenan sólo desde el contador visible, así el
header mobile oculto no los duplica.

**Las guardas vivas.** `AGENTS.md` regla 19 habilita una línea de `no tocar` donde una
edición local y aparentemente inocente rompe algo no local y en silencio. Son estas, y la
lista se mantiene acá para que no se expanda sola:

| Dónde | Qué protege |
|---|---|
| `hero.tsx` · `hero-background.tsx` | El apilado del fondo: nada de `isolate`, `z-*`, `transform` u `opacity` en la `<section>`; el `-z-10` y el `overflow-hidden` viven en la capa |
| `hero.tsx` · `leaderboard.tsx` · `sura-news.tsx` · `juegos.tsx` · `footer.tsx` | `overflow-x-clip`: la red de seguridad contra el scroll lateral en los anchos sin diseño |
| `card-slider.tsx` · `sura-news.tsx` · `misiones.tsx` · `eventos.tsx` | El aire de la sombra del hover de elevación y de los corchetes —24px en los dos ejes— y el `lift-clip` que evita que ese aire muestre la card siguiente |
| `leaderboard-podium-mobile.tsx` | `items-end`, que hace el escalonado; `h-full` lo anula |
| `event-card.tsx` | El piso del personaje en `bottom-px`; con `bottom-0` pisa el borde de la card |
| `globals.css` | `@theme static` (sin él `/styleguide` lee vacío), el `border-box` del shorthand de las cards de Eventos y el `1ms` del cruce con `prefers-reduced-motion` |
| `components/layout/site-chrome.tsx` | `Nav` tiene que quedar hermano anterior del footer: el footer lee el estado de la bottom bar con `peer/bar` |
| `globals.css` · `intro-veil-sections` | Veila todo hijo de `<main>` salvo `#home`: si el hero cambia de id, la intro esconde el propio hero |
| `next.config.ts` | `images.unoptimized` y `devIndicators: false` |

**Dos se encodearon en vez de comentarse**, que es lo que la regla pide intentar primero:
el aire de la sombra pasó a `@utility lift-room` —el nombre dice para qué está, así que
borrarlo deja de parecer limpieza— y el margen de subpíxel del carrusel a la constante
`SUBPIXEL_SLACK`. En Misiones eso además separó las dos cosas que el `-my-5 py-8` mezclaba:
`lift-room` es aire de pintura y el `py-3` del contenedor es el espaciado real.

**El `Tooltip` se aparta de lo que genera el CLI de shadcn** en cuatro cosas: `cn` sale de
`@/lib/utils` y no del paquete `cn`, los colores y la geometría pasan a nuestros tokens, no
lleva flecha (el elemento de referencia no tiene; queda disponible con `arrow`) y la
transición es sólo fade de 200ms, sin zoom ni slide.

### Política de normalización de valores

El diseño trae algunos valores sucios. La regla es **números enteros, y medios píxeles sólo si
hacen falta**:

1. Si el valor cae a **≤ 2 px** de un token que ya existe → se usa ese token, no se crea nada.
2. Si no, se redondea al entero más cercano (o a `.5`) y se agrega token + fila en el changelog.
3. El tracking va en `em`, no en px: `-0.24px` sobre 12px = `-0.02em`.
4. Cards hermanas que difieren entre sí se unifican al valor de la primera.
5. Nunca fijar anchos de hijos dentro de una fila: se fija el contenedor y el resto se reparte
   con `flex-1` / `grid`, así el redondeo no se acumula.

Ejemplos ya aplicados: `1.667px` → `2` · `7.5px` → `8` · `3.763px` → `4` · `0.941px` → `1` ·
`9.769px` → `10`.


## 7. Loop de implementación

La unidad de trabajo es el **bloque** (Header, Hero, una sección), no la pantalla entera.
Una pantalla se completa encadenando bloques. Ver `AGENTS.md` reglas 11 y 12.

### Por bloque

1. El usuario pasa **los dos links de Figma** del bloque (desktop + mobile).
   Si falta uno → frenar y pedirlo.
2. Cargar la skill `figma-design-to-code`; llamar `get_design_context` **con screenshot**
   para ambos frames. **Se miran siempre los dos**, aunque se implemente uno solo.
3. Descargar los assets a `public/assets/<pantalla>/`.
   Cero URLs temporales de Figma en el código.
4. Revisar qué componentes y tokens ya existen y **reusar**.
   Agregar primitives de shadcn solo si hacen falta.
5. Si falta algún token: agregarlo al `@theme`, **catalogarlo en `lib/data/design-tokens.ts`**
   (si no, no aparece en `/styleguide`) y anotarlo en el changelog de arriba.
6. **Decidir cómo se reparte desktop/mobile** (decisión del agente, ver `AGENTS.md` regla 12):
   los dos juntos · dos componentes separados · dos pases mobile→desktop.
   Se informa qué se eligió y por qué.
7. Implementar, con el único prefijo responsive `desktop:`.
8. Verificar (sección 8) y corregir hasta que coincida.
9. Mostrar el resultado y **esperar aprobación del usuario**.
10. Pasar al bloque siguiente. Nunca avanzar con el anterior a medias.

### Por pantalla

11. Con todos los bloques aprobados, la pantalla está completa.
12. Entregar el mensaje de commit. **Commitea el usuario** (regla 1).
13. Recién ahí, encarar las rutas hijas que salgan de esa pantalla.

> **Prioridad:** desktop. Mobile también tiene que quedar impecable, pero ante un
> trade-off irreconciliable, gana desktop.

---

## 8. Verificación

```bash
npm run verify        # typecheck + lint + build
```

Y para los screenshots, con el dev server corriendo aparte:

```bash
npm run dev
npm run shot -- /                 # mobile + desktop
npm run shot -- /styleguide desktop
```

Salen a `screenshots/` (ignorado por git). Los widths viven en `scripts/shot.mjs`
y **tienen que coincidir exactamente con los frames de Figma**.

Más:

- Comparar cada screenshot contra el render del diseño. Iterar hasta que coincida.
- Chequeo de assets: cada uno existe localmente, en la posición correcta y con la
  geometría correcta. Un asset mal proporcionado cuenta como fallo.
- `/styleguide` revisado contra el diseño.
- **Aprobación visual del usuario** antes de cualquier commit.

---

## 9. Estado

### Por pantalla

| Pantalla | Desktop | Mobile | Estado |
|---|---|---|---|
| Setup (skills, PRD, reglas, shadcn, Playwright) | — | — | ✅ Listo |
| Design System | — | — | 📦 Aprobado y commiteado |
| Home | ✅ | ✅ | ✅ **Aprobada el 2026-09-20.** 14 bloques más el lote de ajustes post-maquetado: carrusel del hero, seis cards en Eventos y Misiones, links y hovers en todas las secciones, fuentes reales y la limpieza de comentarios. Lo que queda son mejoras diferidas a propósito, no trabajo pendiente — ver *Diferido hasta que el scope esté maquetado* |
| Eventos (`/tournaments`) | ✅ | ✅ | 👀 Esperando aprobación — bloques 15–20 |
| Misiones (`/missions`) | ✅ | ✅ | 👀 Esperando aprobación — bloques 21–25 |
| Leaderboard (`/leaderboard`) | ✅ | ✅ | 👀 Esperando aprobación — bloques 26–30 |
| Juegos (`/games`) | ✅ | ✅ | 👀 Esperando aprobación — bloques 31–34 |
| Micro-animaciones HUD | ✅ | ✅ | ✅ **Aprobadas el 2026-09-25** — P1 B, P2 C, P3–P9, la tanda 0 y los fixes posteriores |
| Sonido e íconos del menú | ✅ | ✅ | 👀 Esperando aprobación — bloques 39–41. Propuesta [Sonido SURA](https://claude.ai/artifact/FtyLwp9kX6guF4FCEek39E). Paleta mixta con uisfx en prueba desde el 25 sep: ver *Paleta mixta con uisfx*, § 5 |
| 404 (`not-found`) | ✅ | ✅ | 👀 Esperando aprobación — bloques 35–38. Sin frames: diseño propio (concepto A de [SURA 404](https://claude.ai/artifact/6G4urUtxnPWsrbxDuLCAyW)) |

**Leyenda:** ⏳ Pendiente · 🚧 En progreso · 👀 Esperando aprobación · ✅ Aprobada · 📦 Commiteada · 🚫 Bloqueada

### Registro de bloques

La referencia de Figma contra la que se validó cada bloque. Se completa **apenas llega el
link**, antes de implementar — así queda registrado aunque el bloque no se termine.

| Bloque | Pantalla | Archivo | Figma desktop | Figma mobile | Estado |
|---|---|---|---|---|---|
| Home completo (fuente del DS) | Home | — | [`3628:74971`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-74971&m=dev) | [`3567:88242`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3567-88242&m=dev) | ✅ Escaneado → Design System |
| 1 · Header | Home | `components/layout/header*.tsx` | [`6008:26313`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26313&m=dev) | [`6008:23224`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-23224&m=dev) | 📦 Aprobado y commiteado |
| 2 · Menú flotante (desktop) | Home | `components/layout/nav-desktop.tsx` | [`6008:26347`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26347&m=dev) (frame `col-izq`; el menú suelto es [`3628:75011`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-75011&m=dev)) | — (no existe en mobile) | 📦 Aprobado y commiteado |
| 3 · Menú mobile | Home | `components/layout/nav-mobile.tsx` | — | [`3567:92009`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3567-92009&m=dev) (la caja; los ítems y el activo son nuestros). Contexto usado para ubicarlo: hero [`6008:23211`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-23211&m=dev) y su fondo [`6008:23122`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-23122&m=dev) | 📦 Aprobado y commiteado |
| 4 · Drawer lateral | Home | `components/layout/` | — **falta** | — **falta** | 🚫 Sin frame |
| 5 · Hero — fondo | Home | `components/sections/hero-background.tsx` | [`6008:26309`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26309&m=dev) | [`6009:35215`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6009-35215&m=dev) | 📦 Aprobado y commiteado |
| 6 · Hero — contenido | Home | `components/sections/hero-content.tsx` | [`6008:26350`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26350&m=dev) | [`3567:88332`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3567-88332&m=dev) · [`6008:23211`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-23211&m=dev) | 📦 Aprobado y commiteado |
| 7 · Hero — slider de miniaturas | Home | `components/sections/hero-slider.tsx` + `hero-slide-context.tsx` | [`6008:26358`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26358&m=dev) | [`3567:88340`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3567-88340&m=dev) | 📦 Aprobado y commiteado |
| 8 · Eventos | Home | `components/sections/eventos.tsx`, `event-card.tsx`, `events-slider.tsx` | [`6008:26364`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26364&m=dev) | [`6009:35218`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6009-35218&m=dev) | 📦 Aprobado y commiteado. Reemplazan a `3628:75027` / `3567:88246`, que son copias idénticas del escaneo inicial. Las flechas salen del frame compuesto [`3628:74971`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-74971&m=dev) |
| 9 · Leaderboard | Home | `components/sections/leaderboard*.tsx`, `section-header.tsx`, `value-pill.tsx` | [`6008:26479`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26479&m=dev) | [`6011:77868`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6011-77868&m=dev) | 📦 Aprobado y commiteado. Reemplazan a `3628:75142`, copia del escaneo inicial. El desktop es la **columna izquierda** de [`6008:26478`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26478&m=dev), que también contiene Medallas |
| 10 · Medallas | Home | `components/sections/medallas.tsx`, `medal-card.tsx` | [`6008:26535`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26535&m=dev) | — **no existe**: el mobile se adapta del desktop (decisión del usuario, 2026-09-19) | 📦 Aprobado y commiteado. Comparte fila con el bloque 9 y entra en su misma `<section>` |
| 11 · Misiones | Home | `components/sections/misiones.tsx`, `mission-card.tsx` | [`6008:26612`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26612&m=dev) | [`6015:78190`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6015-78190&m=dev) | 📦 Aprobado y commiteado. Salen del Home completo — desktop [`6008:26308`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26308&m=dev), mobile [`6009:35214`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6009-35214&m=dev) — y reemplazan a `3628:75275` |
| 12 · Sura News | Home | `components/sections/sura-news.tsx`, `news-card.tsx` | [`6008:26623`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26623&m=dev) | [`6015:78134`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6015-78134&m=dev) | 📦 Aprobado y commiteado. Reemplazan a `3628:75287`. En mobile la card trae **UI vieja** y se adapta la de desktop (usuario, 2026-09-19) |
| 13 · Juegos | Home | `components/sections/juegos.tsx`, `game-card.tsx`, `game-banner.tsx` | [`6008:26667`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26667&m=dev) | — **no existe**: el mobile se adapta del desktop (usuario, 2026-09-19) | 📦 Aprobado y commiteado. Reemplaza a `3628:75330` |
| 14 · Footer | Home | `components/layout/footer.tsx` | [`6008:26693`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26693&m=dev) | — **no existe**: el mobile se adapta del desktop (usuario, 2026-09-19), con aire abajo para que la bottom bar no lo tape | 📦 Aprobado y commiteado. Reemplaza a `3628:75356`, copia del escaneo inicial |
| 15 · Andamiaje de la ruta | Eventos | `app/(site)/layout.tsx`, `app/(site)/tournaments/page.tsx` | [`407:10565`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=407-10565&m=dev) | [`407:11651`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=407-11651&m=dev) | ✅ Aprobado (2026-09-20). Los dos frames son del **diseño viejo**: se toma la UX, no la UI (ver § 5, *La ruta `/tournaments`*) |
| 16 · Chrome de ruta | Todas las rutas | `components/layout/route-shell.tsx` | Misiones [`6008:29000`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-29000&m=dev) · Mi Perfil [`6140:118274`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6140-118274&m=dev) | Misiones [`6008:29689`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-29689&m=dev) · Mi Perfil [`6140:117864`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6140-117864&m=dev) | ✅ Aprobado (2026-09-20). **No sale del Eventos viejo**: son los dos únicos frames del rediseño de una ruta interna, y definen el mismo chrome al píxel. Es reusable para las 13 rutas que faltan |
| 17 · Buscador | Eventos | `components/sections/tournaments-search.tsx` | [`407:10565`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=407-10565&m=dev) | [`407:11651`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=407-11651&m=dev) | 👀 Esperando aprobación. Inerte. El `FILTRAR` de mobile se implementó y **se sacó** (ver changelog) |
| 18 · Card de torneo | Eventos | `components/sections/tournament-card.tsx` | [`407:10565`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=407-10565&m=dev) | [`407:11651`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=407-11651&m=dev) | 👀 Esperando aprobación. Card **nueva**, no reusa la del Home |
| 19 · Grilla y paginador | Eventos | `components/sections/tournaments-grid.tsx`, `pagination.tsx` | [`407:10565`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=407-10565&m=dev) (grilla) · Misiones [`6008:29000`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-29000&m=dev) (paginador) | [`407:11651`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=407-11651&m=dev) | 👀 Esperando aprobación. El paginador es el del **rediseño**, no los círculos del Eventos viejo |
| 20 · Puerta de entrada desde el Home | Eventos | `components/sections/section-header.tsx` | — | — | 👀 Esperando aprobación. "Ver todo" de Eventos → `/tournaments` |
| 21 · Tabs y chips de filtro | Misiones | `components/sections/mission-tabs.tsx`, `filter-chips.tsx` | [`6008:29000`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-29000&m=dev) | [`6008:29689`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-29689&m=dev) | 👀 Esperando aprobación. Los dos inertes. En mobile van scrolleables en vez de `FILTRAR` (ver changelog) |
| 22 · Card de misión en grilla | Misiones | `components/sections/mission-card.tsx` | [`6008:29000`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-29000&m=dev) | [`6008:29689`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-29689&m=dev) | 👀 Esperando aprobación. **Es la card del Home**: mismo `#222`, borde `#494949`, sombra, aspect 229.456/128 y badge de SP. Se refactoriza para que el ancho lo ponga la grilla, y se le suma el estado *completada* |
| 23 · Carrusel de destacadas | Misiones | `components/sections/mission-feature-card.tsx` | [`6008:29000`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-29000&m=dev) | [`6008:29689`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-29689&m=dev) | 👀 Esperando aprobación. Card grande propia (`--color-surface-2`, radio 12, título 20/28). Reusa `card-slider.tsx` |
| 24 · Grilla y paginador | Misiones | `components/sections/missions-grid.tsx` | [`6008:29000`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-29000&m=dev) | [`6008:29689`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-29689&m=dev) | 👀 Esperando aprobación. 4×4 en desktop, 2 columnas en mobile |
| 25 · Puerta de entrada desde el Home | Misiones | `components/sections/misiones.tsx` | — | — | 👀 Esperando aprobación. "Ver todo" de Misiones → `/missions` |
| 26 · Controles de la ruta | Leaderboard | `components/sections/route-tabs.tsx`, `filter-chips.tsx`, `search-field.tsx` | [`6010:45762`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6010-45762&m=dev) | [`6010:45504`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6010-45504&m=dev) | 👀 Esperando aprobación. Tabs y chips salen de `mission-tabs`/`mission-filters`, generalizados. El buscador es nuevo y ahora lo comparten las tres rutas |
| 27 · Podio | Leaderboard | `components/sections/standings-podium.tsx` | [`6010:45762`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6010-45762&m=dev) | [`6010:45504`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6010-45504&m=dev) | 👀 Esperando aprobación. Desktop es componente propio (293 × 136/128, avatar 80, ícono de nivel); mobile **reusa** el podio del Home sin cambios de estilo |
| 28 · Tabla de posiciones | Leaderboard | `components/sections/standings-table.tsx`, `standings-row.tsx`, `leaderboard-row.tsx` | [`6010:45762`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6010-45762&m=dev) | [`6010:45504`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6010-45504&m=dev) | 👀 Esperando aprobación. Dos componentes: `standings-row` (desktop, 7 columnas) y `leaderboard-row` (mobile, el del Home con `tone`) |
| 29 · Paginador y "Tu posición" | Leaderboard | `components/sections/pagination.tsx`, `app/(site)/leaderboard/page.tsx` | [`6010:45762`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6010-45762&m=dev) | [`6010:45504`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6010-45504&m=dev) | 👀 Esperando aprobación. El paginador estrena la variante compacta de mobile (`‹ 1 / 5 ›`) |
| 30 · Puerta de entrada desde el Home | Leaderboard | `components/sections/leaderboard.tsx` | — | — | 👀 Esperando aprobación. "Ver todo" de Leaderboard → `/leaderboard` |
| 31 · Controles de la ruta | Juegos | `components/sections/route-tabs.tsx`, `search-field.tsx` | [`6137:82821`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6137-82821&m=dev) | [`6137:82953`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6137-82953&m=dev) | 👀 Esperando aprobación. Buscador compartido + 4 dropdowns inertes en desktop; en mobile el ícono de filtro del frame, inerte |
| 32 · Grilla de juegos | Juegos | `components/sections/game-card.tsx` | [`6137:82821`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6137-82821&m=dev) | [`6137:82953`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6137-82953&m=dev) | 👀 Esperando aprobación. **Es la card del Home**: sólo cambia el tamaño del título (20/24) vía prop `largeTitle` |
| 33 · Paginador | Juegos | `components/sections/pagination.tsx` | [`6137:82821`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6137-82821&m=dev) | [`6137:82953`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6137-82953&m=dev) | 👀 Esperando aprobación. 5 páginas, compacto en mobile |
| 34 · Puerta de entrada desde el Home | Juegos | `components/sections/juegos.tsx` | — | — | 👀 Esperando aprobación. "Ver todo" de Juegos → `/games` |
| 35 · Andamiaje de la 404 | 404 | `app/not-found.tsx`, `components/layout/site-chrome.tsx`, `components/layout/nav-desktop.tsx` | — **sin frame, diseño propio** | — **sin frame, diseño propio** | 👀 Esperando aprobación. Excepción a la regla 2 autorizada por el usuario (2026-09-25). Propuesta: [SURA 404](https://claude.ai/artifact/6G4urUtxnPWsrbxDuLCAyW) |
| 36 · Columna de texto y salidas | 404 | `components/sections/off-map.tsx`, `lib/data/not-found.ts` | — **sin frame, diseño propio** | — **sin frame, diseño propio** | 👀 Esperando aprobación. Eyebrow, título, ruta tipeada, copy, CTA y “Volver atrás” |
| 37 · Puntos de reaparición | 404 | `components/sections/off-map.tsx` | — **sin frame, diseño propio** | — **sin frame, diseño propio** | 👀 Esperando aprobación. Las cuatro rutas, con su distancia en el mapa |
| 38 · Minimapa | 404 | `components/sections/off-map.tsx`, `app/globals.css` | — **sin frame, diseño propio** | — **sin frame, diseño propio** | 👀 Esperando aprobación. Zona, nodos, tu punto y la línea al destino |
| 39 · Motor de sonido y toggle | Todas las rutas | `lib/sfx.ts`, `lib/data/sfx.ts`, `lib/sfx-boot.ts`, `components/layout/sfx-listener.tsx`, `sound-toggle.tsx`, `site-chrome.tsx`, `header-desktop.tsx`, `header-mobile.tsx` | — **sin frame**: [Sonido SURA](https://claude.ai/artifact/FtyLwp9kX6guF4FCEek39E) | — **sin frame**: [Sonido SURA](https://claude.ai/artifact/FtyLwp9kX6guF4FCEek39E) | 👀 Esperando aprobación |
| 40 · Cableado de los eventos | Todas las rutas | `components/sections/*` (hero, carruseles, tabs, chips, paginador, banners, medallas, headers de sección), `claim-button.tsx`, `back-button.tsx`, `points-value.tsx` | — **sin frame** | — **sin frame** | 👀 Esperando aprobación |
| 41 · Íconos del menú por partes | Todas las rutas | `components/layout/nav-icon.tsx`, `nav-desktop.tsx`, `nav-mobile.tsx`, `lib/data/navigation.ts` | — **sin frame**: opción D de [Sonido SURA](https://claude.ai/artifact/FtyLwp9kX6guF4FCEek39E) | — **sin frame** | 👀 Esperando aprobación |

> **Bloque 4 (drawer) sigue bloqueado**: no tiene frame en ningún tamaño. El botón de perfil del header ya es su trigger, inerte.
>
> La numeración es el orden en que se atacan, y es continua: si entra un bloque nuevo
> en el medio, se renumeran los de abajo en vez de repetir un número.

---


## 10. Skills instaladas

Viven en `.agents/skills/` (versionadas con el repo), con symlinks en `.claude/skills/`.
Lockfile: `skills-lock.json`.

`find-skills` · `next-best-practices` · `vercel-react-best-practices` ·
`vercel-composition-patterns` · `tailwind-design-system` · `typescript-advanced-types` ·
`shadcn` · `remotion-best-practices` · `git-guardrails-claude-code` · `supabase` ·
`libraries-dev`

> `remotion-best-practices` y `supabase` no aplican a la Fase 1.

---

## 11. Riesgos abiertos

| Riesgo | Mitigación |
|---|---|
| Seat de Figma en **"View" / plan Starter** — `get_design_context` (Dev Mode) puede estar restringido. | Se descubre en la primera llamada. Fallback: `get_screenshot` + `get_metadata` + `get_variable_defs` con más medición manual. |
| Fuentes licenciadas sin archivos disponibles. | Implementar con fallback de métricas similares y marcar la pantalla como no-aprobable hasta tener los `.woff2`. |
| El DS derivado del Home queda corto en pantallas futuras. | Esperado y contemplado: se extiende on-demand y queda en el changelog. |
| `next dev` reescribe su bloque en `AGENTS.md`. | Las reglas del proyecto viven fuera de los marcadores. El bloque auto-generado se commitea tal cual. |

---

## 12. Cambiar de target

Si el proyecto pasa a clonar otra app, `AGENTS.md` **no se toca**: es puro proceso.
Se reescribe este archivo y se resetean los artefactos del diseño anterior.

### Qué me tenés que dar

1. Links de Figma del Home — **desktop y mobile**.
2. Los widths de los frames (o los confirmo leyéndolos del Figma).
3. **Cómo navega el diseño**: ¿el menú va a rutas reales o scrollea a secciones?
   Es lo único que no se deduce del proceso.
4. Los `.woff2`, si las fuentes son licenciadas.

Lo demás (stack, breakpoints, shadcn, loop, verificación, prohibiciones) ya está definido
y no cambia.

### Qué se reescribe en este archivo

Bloque **Target actual** · sección 3 (Referencia) · sección 4 (widths de los frames) ·
sección 5 (Navegación y rutas) · changelog del Design System · sección 9 (Estado por pantalla).

### Qué se resetea en código

```
app/globals.css          tokens del @theme
app/                     rutas del target anterior
components/sections/     secciones compuestas
components/layout/       header, footer, nav
lib/data/                data hardcodeada
public/assets/           assets exportados de Figma
scripts/shot.mjs         widths de los viewports
```

Sobreviven sin cambios: `AGENTS.md`, `components/ui/` (primitives shadcn, se re-estilan
con los tokens nuevos), `lib/utils.ts`, configs, scripts de npm y las skills.
