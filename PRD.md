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

## 0. Decisiones tomadas sin consulta (2026-09-21)

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

### Breakpoint: 391px, no 1440px

**El diseño mobile es exclusivo del frame de 390.** De 391px para arriba manda el diseño
desktop, en la pantalla que sea. Decisión del usuario (2026-09-18), tomada al ver que con el
corte en 1440 cualquier ventana de 1339px o menos caía al layout mobile.

`--breakpoint-desktop` en `app/globals.css` → **391px**.

Consecuencia aceptada: entre 391 y ~860px el header desktop **no entra y se recorta**. No hay
diseño para esa franja y no se inventa ninguno (`AGENTS.md` regla 7).

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
**no se apagan en las puntas**: el carrusel da la vuelta, así que siempre hay destino. Avanza
solo cada 3s (`hero.autoplayMs`), y se frena con el puntero o el foco encima, con la pestaña
oculta y con `prefers-reduced-motion`. Cualquier cambio manual reinicia la cuenta.

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
| `not-found` | 404 | ⏳ Pendiente |

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
| **El badge "¡Novedad!" cambia de color de texto entre tamaños** | Es el mismo texto sobre el mismo verde: el frame desktop lo escribe en **negro** y el mobile en **`#456215`** (`--color-border-done`), mientras el CTA del mismo banner usa `#354619`. | Se replicaron los tres tal cual. Parece un desliz: unificar, probablemente en `--color-sp-foreground`. |
| **El `search.svg` vive en `public/assets/tournaments/`** | El buscador ahora lo comparten tres rutas, así que el ícono quedó bajo la carpeta de la primera que lo usó. | Mover a una carpeta compartida cuando exista una; hoy `public/assets/home/` hace de eso para `sp-coin.png` y `arrow-right.svg`. |
| **La franja sin diseño de `/games` es más ancha que la del resto** | Los 4 dropdowns son `shrink-0` y necesitan 696px más el gap, así que la fila de controles sólo entra desde ~940px. Abajo de eso el buscador se colapsa a 32px y los pills se recortan contra el borde de la columna. **No hay scroll lateral** en ningún ancho. | Consecuencia conocida de § 4. Si molesta, los pills podrían scrollear como los chips de Misiones. |
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
| **Los assets de `/leaderboard` pesan 4,5 MB para íconos de 12 y 16px** | Las tres medallitas son PNG de 2048² (425–667 KB) mostradas a **12 × 12** en cada una de las 11 filas, y los cuatro íconos de nivel son de ~1080² mostrados a **16 × 16**. Es la peor relación tamaño/uso del repo. | Misma familia que la deuda de *Peso de los assets*: los assets no se editan (regla 10) y el optimizador de `next/image` está apagado. Pedir exports al tamaño de uso. |
| **La franja sin diseño recorta más que de costumbre en `/leaderboard`** | El podio necesita 927px y la fila de la tabla ~706 de ancho fijo, pero los dos aparecen desde 391px porque `desktop:` es `min-width: 391`. Verificado que **no hay scroll lateral** en 390 / 500 / 700 / 860 / 1440, pero abajo de ~1000px el podio se recorta de los dos lados. | Es la consecuencia conocida de § 4. Queda anotado por si esta pantalla justifica un breakpoint intermedio. |
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
| **Portadas del slider a tamaño completo** | Las miniaturas se muestran a 60px pero cargan las portadas originales: 1920 × 1080 (2,5 MB), 1536 × 864 y 840 × 560. Son 4,2 MB para tres cuadraditos. | Sigue abierta. El upscale del 2026-09-20 **no la toca**: creó archivos aparte para el arte de fondo y la miniatura quedó donde estaba. Ahora que el usuario autorizó editar assets, la salida barata sería generar miniaturas de 120px desde los mismos originales — son ~4 MB de los 30 que pesa `public/assets/home`. |
| **El slider se aparta del Figma en desktop** | Decisión del usuario (2026-09-19): las no seleccionadas van atenuadas **también en desktop** (el frame las deja a full), el radio de la miniatura pasa de 4.8 a **8px** y el borde de la activa de 1.5 a **2px**. Mobile no se aparta: 1.6 → 2 y 0.8 → 1 caen dentro de la política de normalización. | Confirmar con diseño. |
| ~~**El slider no navega**~~ | — | **Resuelto** (2026-09-19): clickear una miniatura cambia el arte del hero. Ver las dos filas de abajo, que son lo que quedó abierto. |
| **Sin arte de hero propio por juego** | El Figma sólo compone el arte de Valorant. Los otros tres usan su propia portada de 16:9 como fondo full-bleed, que no es lo mismo: son portadas centradas en su logo, no key art pensado para tener texto encima. En Black Ops 6 el logo queda detrás del copy. | Pedir a diseño un arte de hero por juego, compuesto con aire a la izquierda como el de Valorant. Mientras tanto van con encuadre `cover`. |
| ~~**Black Ops 6 se ve blando de fondo**~~ | La portada mide 840 × 560 y el hero la mostraba a ~1820 de ancho: 2,2× de escalado. | **Resuelta** (2026-09-20) con el mismo upscale: el arte de fondo pasa a 3072 de ancho. La portada original sigue siendo la miniatura. |
| ~~**CTA desktop con caja de texto fija**~~ | El botón del Figma mide 181 porque el nodo de texto tiene un ancho fijo de 141 con el texto centrado; el texto real de KH a 14px mide 117,6. | **Resuelta** (2026-09-20): con la fuente real se fue al valor del diseño, `min-w` de **181** con el texto centrado. Da 181 × 46 exactos. La caja fija de 141 sigue siendo una rareza del archivo, pero ya no cambia nuestro render. |
| ~~**CTA mobile más alto que el diseño**~~ | El botón del Figma es 133 × 30 y con Tektur salía 143,4 de ancho, que a 30 de alto se veía chato. | **Resuelta** (2026-09-20): con KH real el botón hugea a **132,8 × 30**, o sea el diseño. El alto volvió de 32 a 30 y con eso el slider vuelve a y=400 y la sección a 456. |
| **Estados del menú flotante** | El componente del Figma solo define `Default` y `Selected`. No hay hover ni focus — y el sitio live tampoco cambia el color del ícono en hover (medido: se queda en `text-gray-300`). | **Resuelto por decisión propia** (usuario, 2026-09-18): tooltip con el nombre de la sección + tinte verde de marca en el ícono. Es lo único del bloque que no sale ni del Figma ni del live. Si diseño define un hover propio, esto se reemplaza. |
| **El pill de puntaje tiene dos fuentes** | Es el mismo componente `Value` del Figma, pero el frame del header lo pone en Inter y el del Leaderboard desktop en KH Interference. El header se maquetó primero y quedó en Inter; el Leaderboard va en `font-techno` por decisión del usuario (2026-09-19). | Se ven los dos en la misma pantalla. Falta unificar: es una tarea aparte, fuera del bloque 9. |
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
| **Hero en video: dos modelos no pudieron con una ilustración estática** | Se probó animar el arte del hero como cinemagraph con los créditos gratis de Higgsfield (Veo 3.1 Lite, dos tiradas, 8 créditos). El primero dejó la cámara quieta y el logo intacto (Δ 4,85 sobre 255) pero llenó el cuadro de partículas blancas que se acumulan. El segundo sacó las partículas y metió un **push de cámara** descentrado (Δ del logo: 22,80). Ninguno cierra el loop. El patrón es el mismo: **el modelo necesita mover algo, y si se le cierra una puerta entra por otra.** Kling queda fuera del MCP —su plan free no habilita ningún modelo de video— y la web estaba saturada. | Queda **en pausa**, no descartado. El prompt para Kling 3.0 está redactado y validado contra su UI real — ver **Hero en video — brief en pausa**, en esta misma sección —, con la jugada que no se pudo probar: **cargar la misma imagen como primer y último frame**, que fuerza el loop por construcción. Dato útil para cualquier intento futuro: **el logo de Valorant no se ve nunca** en el hero (empieza en el 60,4 % del ancho y el recorte llega hasta 58,6 %), así que no hay que gastar instrucciones ni descartar clips por él. Mientras tanto el hero se queda con la imagen, que es lo que define el diseño. |
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
| **Resto suelto en el frame de Juegos** | Después de la octava card hay un `Image` de 1 × 0,56px, igual que los dos frames sueltos del slider de Eventos. | No se maquetó. Confirmar que se puede borrar del archivo. |

### Hero en video — brief en pausa

Idea del usuario (2026-09-20): que el arte del hero sea un **cinemagraph** en loop en vez de una
imagen fija, con el poster como fallback. Se intentó, no salió, y **queda pendiente con todo lo
necesario para retomarlo**. El hero mientras tanto sigue con la imagen, que es lo que define el
diseño.

**Lo que se probó y falló.** Dos tiradas en Higgsfield con **Veo 3.1 Lite** (los 10 créditos
gratis de la cuenta; Kling está fuera de ese MCP porque el plan free no habilita ningún modelo
de video):

| Intento | Qué se pidió | Qué pasó |
|---|---|---|
| 01 | cinemagraph con *"floating dust particles drift gently"* | Cámara quieta ✓ y logo intacto (Δ **4,85** sobre 255) · llenó el cuadro de partículas blancas que **se acumulan** → el loop no cierra |
| 02 | sin partículas, *"every character frozen"* | Partículas fuera ✓ · apareció un **push de cámara descentrado** → todo crece y se corre (Δ del logo: **22,80**) |

**El patrón, que es lo que hay que recordar: el modelo necesita mover algo.** Si se le cierra una
puerta, entra por otra. Por eso el prompt final no sólo prohíbe — le da un movimiento permitido,
chico y concreto, para que lo gaste ahí.

**Dos datos que ahorran trabajo la próxima:**

1. **El logo de Valorant no se ve nunca.** Empieza en el 60,4 % del ancho del arte y el hero
   recorta en 58,6 % (mobile) / 55,2 % (desktop). No hay que gastar instrucciones en él ni
   descartar un clip porque se deforme. Por lo mismo, una marca de agua en la esquina inferior
   derecha queda holgadamente fuera de cuadro.
2. **La jugada que quedó sin probar es el *end frame*.** Kling admite cargar primer y último
   frame; poniendo **la misma imagen en los dos** el loop queda forzado por construcción, en vez
   de pedirlo por prompt. Veo sólo aceptó `start_image`, y de ahí que ninguno de los dos cerrara.

#### El pedido, listo para pegar

**Imagen de entrada:** `public/assets/home/hero-art@2x.jpg` (2880 × 1622, 16:9) — el upscaleado,
no el original de 1440.

| Campo | Valor |
|---|---|
| Modelo | Kling **VIDEO 3.0**, pestaña *Video Generation* |
| Primer frame | `hero-art@2x.jpg` |
| **Último frame** | **la misma imagen** |
| Duración | 5 s |
| Multi-Shot · Native Audio | apagados |
| Number of Outputs | 1 (2–4 son VIP) |
| Calidad | **720p** para probar el prompt · **1080p** para la definitiva (VIP, 3 trials, 40 créditos) |

> A 2D painted video-game illustration, filmed as a still. The camera is locked on a tripod and
> the framing stays exactly the same from the first frame to the last: no zoom, no pan, no drift.
> Every character holds their exact pose, expression and gaze the entire time, frozen mid-action
> like a painting. The only motion in the scene: a few loose strands of the white-haired girl's
> hair sway very slightly in a faint breeze, and the blue energy glow on the left pulses softly
> and slowly. Everything else is perfectly still. The air is clear and empty; nothing floats,
> drifts or falls through the frame, and nothing new appears. Flat red background unchanged. Very
> subtle, slow, seamless loop: the video ends exactly as it begins.

**Kling 3.0 no tiene negative prompt ni slider de creatividad** — eran de las versiones 1.x y 2.x.
Por eso las prohibiciones van dentro del prompt y **sin nombrar lo prohibido**: si se escribe
"no snow, no sparks", el modelo lee *snow* y *sparks*. Se reescriben como afirmaciones de lo que
sí pasa ("the air is clear and empty"). *Bind elements* tampoco hace falta: sirve para
consistencia entre generaciones distintas y acá el end frame ya ancla todo.

**Por qué está redactado así.** *"2D painted illustration"* y *"filmed as a still"* para que no lo
vuelva 3D ni realista. *"Frozen mid-action"* porque la pose de Jett es de acción y sin eso el
modelo quiere completar el lanzamiento de los cuchillos. El movimiento permitido —mechones y
resplandor azul— es la válvula, y los dos están en el tercio izquierdo-centro, que es lo único
que se ve en el hero; son además los únicos elementos que se mueven *en la ficción* sin que
cambie la composición. La llama naranja se descartó a propósito: animar fuego invita humo y
chispas.

**Protocolo con los 66 créditos diarios de Kling:** una tirada en 720p con el prompt tal cual, y
revisar cuatro cosas — ¿el último frame es el primero?, ¿nada creció ni se corrió?, ¿la cara de
Jett no cambió?, ¿no aparece nada flotando? Si pasa, una en 1080p con los ajustes idénticos: esa
es la que se usa. Si falla, se itera el prompt al día siguiente con los 66 nuevos. **No gastar los
40 del 1080p hasta ver una de 720p que cierre.**

#### Lo que falta hacer cuando el clip exista

1. Cerrar el loop con un crossfade de ~0,5 s entre cola y cabeza (`ffmpeg`, ya instalado).
2. Si vino a 720p, subir los frames a 2× con Real-ESRGAN y re-encodear, para que el arranque no
   se vea más blando que el poster. Salida `.mp4` (H.264, `-movflags +faststart`) + `.webm` (VP9).
3. En `hero-background.tsx`, la capa `design` pasa a `<video autoPlay muted loop playsInline
   poster={artSrc}>` con el mismo encuadre de las utilities `hero-art-desktop` /
   `hero-art-mobile`, el scrim encima y el fade al cambiar de slide. Con
   `prefers-reduced-motion: reduce` no se monta el `<video>`: queda el poster. `preload="metadata"`,
   porque el LCP es el poster y no el video.
4. Verificar: que el loop no salte (grabar dos ciclos y comparar el frame de cierre con el de
   apertura), que no aparezca scroll horizontal, que el LCP no empeore, y que en mobile siga
   viéndose la imagen si el navegador bloquea el autoplay.
5. Anotar acá la herramienta usada, la versión del modelo, el prompt final y el costo.

**Go / no-go:** si el modelo vuelve a deformar rostros o el loop no cierra, se corta y el hero se
queda con la imagen. No se insiste con una tercera herramienta ni se paga ninguna — decisión del
usuario, 2026-09-20.

### Diferido hasta que el scope esté maquetado

Decisión del usuario, 2026-09-20, al cerrar el Home: estas tres **no se encaran ahora**. No es
deuda olvidada — es trabajo que rinde más cuando estén todas las pantallas, o que depende de un
tercero. Se retoman en la pasada de fixes chicos, con el scope completo.

| Tema | Por qué espera | Qué hace falta para retomarlo |
|---|---|---|
| **Accesibilidad de toda la UI** | Hacerla pantalla por pantalla sale inconsistente; de una pasada, no. Lo que salía gratis del markup ya está (`sr-only` en los ítems del menú, `aria-current`, listas y encabezados reales). Falta lo que el diseño no dice: estados que hoy sólo se comunican por color —una medalla bloqueada se anuncia igual que una obtenida, porque el candado es decorativo—, orden de foco, contraste, y el indicador de "hay más abajo" que se perdió al ocultar la barra de scroll | Nada — sólo que el scope esté maquetado |
| **El pill de puntaje tiene dos fuentes** | Es un fix chico y aislado: el del header quedó en Inter desde el bloque 1 y el del Leaderboard va en `font-techno`. Se ven los dos en la misma pantalla | Nada. Diez minutos cuando toque la pasada de fixes |
| **Peso de los assets** | `public/assets/home/` va por **30 MB**, y 7,5 son de Medallas: los PNG son los fills originales del Figma —sprites de 1024², una textura de 1920 × 1080— y el diseño los muestra a 86px. Lo mismo con las portadas del slider del hero: 4,2 MB para tres miniaturas de 60px. No se resuelve de nuestro lado: los assets no se editan (regla 10) y el optimizador de `next/image` está apagado desde el bloque 1 porque ensuciaba el alfa de los PNG recortados | Un lote de exports a tamaño de uso, de diseño |

Y una cuarta, que no depende de nosotros ni de diseño: el **hero en video** (ver el brief más
arriba). Sigue siendo un agregado de peso para la UI, pero está fuera de alcance por ahora.
Dato práctico para retomarlo: entre las **19 y las 22 hora argentina Kling rechaza los pedidos
por saturación**, así que conviene probar a la mañana.

### Notas de implementación que salieron del maquetado

| Tema | Qué pasó | Cómo se resolvió |
|---|---|---|
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
| **Revelado escalonado del slider** | Las portadas son los assets más pesados de la página (4,2 MB entre tres) y aparecían de golpe, cada una cuando terminaba de bajar — desordenadas y sin relación con el orden de la lista. | Las tres no activas van con `fetchPriority="low"` para que no compitan con el arte del hero (`loading="lazy"` ya es el default de `next/image`), y el `<li>` entra con un `@utility thumb-reveal`: sube 8px y se funde, escalonado 90ms por índice. La última cierra a los 690ms, que es el colchón de carga; hasta entonces se ve `--color-thumb-dim` de placeholder. Sólo `opacity` y `transform`, que resuelve el compositor sin tocar layout — medido: las posiciones finales son idénticas y el `transform` queda en `none`. Con `prefers-reduced-motion: reduce` no hay animación, y el guard vive dentro de la utility para que no se pueda usar mal. **Es el segundo desvío consciente de AGENTS regla 16**, con el mismo criterio que el pill del menú: cero librerías de motion. |
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
  zoom de una imagen.

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

**Las guardas vivas.** `AGENTS.md` regla 19 habilita una línea de `no tocar` donde una
edición local y aparentemente inocente rompe algo no local y en silencio. Son estas, y la
lista se mantiene acá para que no se expanda sola:

| Dónde | Qué protege |
|---|---|
| `hero.tsx` · `hero-background.tsx` | El apilado del fondo: nada de `isolate`, `z-*`, `transform` u `opacity` en la `<section>`; el `-z-10` y el `overflow-hidden` viven en la capa |
| `hero.tsx` · `leaderboard.tsx` · `sura-news.tsx` · `juegos.tsx` · `footer.tsx` | `overflow-x-clip`: es lo único que evita el scroll lateral entre 391 y 860 |
| `card-slider.tsx` · `sura-news.tsx` · `misiones.tsx` | El aire de la sombra del hover de elevación —24px en los dos ejes— y el `lift-clip` que evita que ese aire muestre la card siguiente |
| `leaderboard-podium-mobile.tsx` | `items-end`, que hace el escalonado; `h-full` lo anula |
| `event-card.tsx` | El piso del personaje en `bottom-px`; con `bottom-0` pisa el borde de la card |
| `globals.css` | `@theme static` (sin él `/styleguide` lee vacío), el `border-box` del shorthand de las cards de Eventos y el `1ms` del cruce con `prefers-reduced-motion` |
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
`shadcn` · `remotion-best-practices` · `git-guardrails-claude-code` · `supabase`

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
