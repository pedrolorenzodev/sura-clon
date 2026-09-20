# HOME-FIXES — Lote de ajustes del Home (post-maquetado)

> **Archivo temporal.** Vive hasta que la última tarea esté cerrada; ahí se borra (tarea 19).
> El proceso está en [`AGENTS.md`](./AGENTS.md); lo específico del target en [`PRD.md`](./PRD.md).

## Cómo se ejecuta

Para arrancar, decirle al agente: **"Empecemos a encarar el archivo `HOME-FIXES.md`"**.

El agente toma **una tarea por vez**, en el orden de la lista. Por cada una:

1. Implementa.
2. Corre `npm run typecheck && npm run lint`.
3. Saca screenshot de la sección afectada en 390 y 1440, y verifica
   `scrollWidth === clientWidth` en 390 / 500 / 700 / 860 / 1440.
4. Anota en `PRD.md` lo que corresponda (changelog de tokens, notas de implementación, deuda).
5. Frena con: **"Probalo, confirmame que está a punto y seguimos con la siguiente implementación."**
6. Con el OK del usuario, tilda la tarea acá y sigue con la siguiente. Nunca avanza con una a medias.

Los commits los hace el usuario (regla 1). Al cerrar cada tarea el agente deja el mensaje
listo (Conventional Commits, sólo subject, en inglés).

## Decisiones del usuario tomadas al planificar

| Fecha | Decisión |
|---|---|
| 2026-09-19 | Cards de Juegos → `/games/:id` (lo de `/news/:id` era un copy-paste). |
| 2026-09-19 | Limpieza de comentarios: **todo**, incluido `globals.css` (81 bloques CSS). |
| 2026-09-19 | Scroll-spy: lo que molesta es que **cambia tarde al bajar**. |
| 2026-09-19 | Fuentes reales: **volver a los valores del Figma** en todo lo que compensaba a Tektur. |
| 2026-09-19 | "Domino / Squad" son los personajes de **Eventos**: esa sección va a 6 cards alternadas. |
| 2026-09-19 | **Misiones también va a 6 cards**, con el mismo carrusel con flechas de Eventos. |
| 2026-09-19 | No hay push a producción: las fuentes `TRIAL` se usan igual. |
| 2026-09-20 | "Remover el scroll nativo" = **ocultar la barra de scroll**. |
| 2026-09-20 | Upscale del arte del hero con IA **autorizado** (desvío explícito de la regla 10). |
| 2026-09-20 | Video del hero **sin pagar ninguna herramienta**. |

## Tareas

Orden: primero lo que cambia la base sobre la que se mide todo (fuentes); después el menú
(bug + criterio); después las mejoras por sección de arriba a abajo del Home; la limpieza
de comentarios al final porque toca todos los archivos; el video del hero último porque es
experimental y depende del upscale.

- [x] **1 · Fuentes reales** (Monument + KH) y vuelta a los valores del Figma — `app/layout.tsx`, `app/fonts/`, `app/globals.css`, `hero-content.tsx`, `styleguide/page.tsx`, `design-tokens.ts`, `PRD.md`
- [x] **2 · Ocultar la barra de scroll** de la página — `globals.css`
- [x] **3 · Bug del pill** (Eventos medido; Juegos a confirmar en el navegador del usuario) — `lib/use-section-spy.ts`
- [ ] **4 · Scroll-spy más intuitivo**: activa al cruzar el 40% del viewport — `lib/use-section-spy.ts`
- [ ] **5 · Hero: resolución del arte** (upscale 2× con Real-ESRGAN, los cuatro artes) — `public/assets/home/`, `lib/data/hero.ts`, `PRD.md`
- [ ] **6 · Hero: slider → carrusel con flechas** (vertical en desktop, horizontal en mobile) + autoplay cada 3 s — `hero-slider.tsx`, `hero-slide-context.tsx`, `lib/data/hero.ts`
- [ ] **7 · Eventos: 6 cards** alternando Domino / Squad — `lib/data/events.ts`
- [ ] **8 · Misiones: 6 cards + carrusel con flechas** (slider compartido con Eventos) — `events-slider.tsx` → `card-slider.tsx`, `misiones.tsx`, `mission-card.tsx`, `lib/data/missions.ts`
- [ ] **9 · Leaderboard: borde inferior atenuado** en las filas — `leaderboard-row.tsx`, `globals.css`
- [ ] **10 · Leaderboard: filas como link** a `/profile/:id` + hover — `leaderboard-row.tsx`, `ROUTES.md`
- [ ] **11 · Misiones: cards como link** + hover con zoom de la imagen — `mission-card.tsx`
- [ ] **12 · Sura News: cards como link** a `/news/:id` + hover con zoom de la imagen — `news-card.tsx`, `news-card-wide.tsx`
- [ ] **13 · Juegos: scrim violeta** del banner al ~40% del eje X — `globals.css` (`--gradient-promo-scrim*`)
- [ ] **14 · Juegos: hover del CTA** "Jugar ahora" y sombra violeta on hover del banner — `game-banner.tsx`, `globals.css`
- [ ] **15 · Juegos: cards como link** a `/games/:id` + hover; hover de los badges — `game-card.tsx`
- [ ] **16 · Juegos: borde inferior atenuado** del panel de la card — `game-card.tsx`, `globals.css`
- [ ] **17 · Limpieza de comentarios** (ts/tsx, `scripts/shot.mjs`, `globals.css`) → lo útil migra al PRD — todos
- [ ] **18 · Hero en video** (experimental, gratis; go/no-go tras el primer clip) — `hero-background.tsx`, `public/assets/home/hero-art.{mp4,webm}`, `PRD.md`
- [ ] **19 · Cierre**: `npm run verify`, screenshots completos, borrar este archivo, commit message

## Hallazgos de la exploración

### Fuentes reales — repo `mateoLorenzo/sura-clans` (Expo, `assets/fonts/`)

| Archivo | Familia | Uso en nuestro DS |
|---|---|---|
| `MonumentExtended-Ultrabold.ttf` | Monument Extended Ultrabold | `--font-display` (hoy Anybody wdth 120 / wght 900) |
| `KHInterferenceTRIAL-Regular.otf` | KH Interference Regular | `--font-techno` (hoy Tektur wdth 100) |
| `KHInterferenceTRIAL-Bold.otf` | KH Interference Bold | sin uso: el diseño no usa bold en techno |
| `TTFirsNeue-{Regular,Medium,DemiBold}.ttf` | TT Firs Neue | **no se trae**: el diseño lo usa en una sola card de Eventos y ya se unificó en KH (PRD, deuda) |

Verificado: los archivos cargan con `@font-face`; Monument tiene minúsculas y acentos; KH
Interference no tiene minúsculas y las dibuja como mayúsculas por sí sola (el `uppercase`
de cada call site queda: es inofensivo y protege el fallback). Descarga raw:
`https://raw.githubusercontent.com/mateoLorenzo/sura-clans/main/assets/fonts/<archivo>`.

Consecuencias del swap:
- `app/layout.tsx`: `Anybody`/`Tektur` (`next/font/google`) → `localFont` (`next/font/local`)
  con `weight` (Monument `900`, KH `400`), variables `--font-monument` / `--font-kh`.
  `Inter` sigue en Google. Archivos en `app/fonts/`.
- `globals.css`: `--font-display` / `--font-techno` apuntan a las variables nuevas; borrar
  las dos líneas `--font-*--font-variation-settings` (son ejes de fuentes variables).
- `lib/data/design-tokens.ts`: `fontTokens[].replaces` → "— (fuente real)".
- Tres `font-techno` sin `uppercase`: `hero-content.tsx:65` (CTA mobile) y dos en
  `app/styleguide/page.tsx`. Se agrega.
- **Re-medir y volver al Figma**: tracking de `--text-copy`, `--text-copy-sm`, `--text-cta`,
  `--text-cta-sm`, `--text-news-copy`; `min-w` 168 del CTA desktop → caja del diseño (181);
  alto 32 del CTA mobile → 30. Cada vuelta atrás va al changelog del PRD y sus filas de
  deuda se marcan resueltas.
- Riesgo: KH real tiene otro ancho que Tektur → revisar en screenshots todo ancho fijo de
  botones y pills (`value-pill.tsx`, CTA, "Ver todo") y el corte de línea del título del hero.

### Scroll-spy — cómo funciona hoy y qué está roto (`lib/use-section-spy.ts`)

- Banda de decisión: `rootMargin: "-106px 0px -70% 0px"` → franja **[106, 30% vh]**. Entre
  las secciones que intersectan gana **la primera en orden de DOM**. Observer de cola sobre
  la última sección (`threshold [0.99, 1]`) + `scrollY + innerHeight >= scrollHeight - 4`.
  Click: lock hasta `scrollend` o 700 ms, después `resolve()` recalcula.
- **Por qué "cambia tarde"**: como gana la primera en la banda, la sección nueva recién se
  activa cuando la anterior **sale** por arriba (su fondo cruza los 106). Con el gap de 80
  entre secciones, el pill cambia cuando el top de la nueva está a 186 px del borde: ya
  ocupa el 80% de la pantalla.
- **Bug medido con Playwright (1440 × 900, doc 4132)**: el que falla es **Eventos**, no
  Juegos. Click en Eventos → scroll a 720 → el fondo del hero cae **exactamente** en y=106
  (el hero mide 826 y Eventos arranca en 826, sin gap) → Chrome reporta `isIntersecting`
  con un rect de **altura 0** → `home` queda en la banda y, como es la primera, gana: a los
  700 ms el pill vuelve a Home. Juegos no reproduce en ningún viewport (1280×720 →
  1920×1200, reduced motion, desde cualquier scroll): siempre queda en `#juegos`. El
  usuario lo ve en Juegos; se confirma en su navegador en la tarea 3.
- El fix del criterio (tarea 4) también mata el bug: si gana la **última** en la banda, un
  intersect degenerado de `home` no pesa. Igual se filtra `intersectionRect.height > 0`.

### Hero slider (`hero-slide-context.tsx`)

Único dueño de `activeSlide`; `select(i)` setea el índice y `hasSwitched` (que habilita el
fade de 320 ms en `hero-background.tsx`). No hay ningún timer en el repo. `matchMedia` no
se usa en ningún lado: el autoplay sería el primer JS que lee `prefers-reduced-motion`.

### Resolución del hero

`hero-art.jpg` es 1440 × 811 y se muestra a 2610 (1,81×); `black-ops-6.png` es 840 × 560
a ~1820 (2,2×). Figma no tiene originales más grandes. Real-ESRGAN (`realesrgan-ncnn-vulkan`,
binario macOS oficial v0.2.5.0, 49 MB, gratis, local) sube 4× y se baja a **2× del tamaño de
uso** (hero a 2880 de ancho). Los originales quedan en el repo; los nuevos van con sufijo
`@2x`. Comparación lado a lado antes de reemplazar. `next/image` sigue `unoptimized`.

### Hero en video — qué es y cómo se llega sin pagar

- `elayadesign/ai-design-skills` **no genera videos**: tiene una sola skill
  (`landing-page-design`: estructura, copy y sistema visual de una landing). Lo de los
  tweets es un clip de ~5–6 s hecho con un modelo image-to-video a partir de la imagen fija,
  con prompt tipo cinemagraph, puesto en loop en un `<video autoplay muted loop playsinline>`.
- **Local no va**: M1 Pro con 16 GB. Wan 2.2 / LTX-2 piden 24 GB+ y en Mac corren sin
  soporte Metal real (CPU-only o inestables).
- **Vía gratis**: créditos diarios de las herramientas hosteadas. Kling da 66 créditos/día
  (≈ 6 clips de 5 s) sin tarjeta; Hailuo y Luma también, con marca de agua y 720p. La marca
  de agua va en una esquina inferior: con nuestro encuadre (181% anclado arriba a la
  izquierda en desktop, 254% en mobile) la esquina inferior derecha del clip **queda fuera
  del recorte**. Se verifica con el primer clip; si asoma, se descarta esa herramienta.
- **Postproceso local y gratis**: `ffmpeg` (brew) para cerrar el loop con un crossfade
  entre el final y el principio (evita el salto), y Real-ESRGAN para subir los 720p del
  clip frame a frame (120 frames, minutos en M1 Pro) al mismo tamaño que el poster, así el
  arranque del video no se ve más blando que la imagen. Salida: `.mp4` (H.264) + `.webm`,
  ~2–4 MB cada uno.
- **Integración**: en `hero-background.tsx`, la capa `design` pasa a `<video>` con `poster`
  = la imagen upscaleada, mismo encuadre y el scrim encima. Con `prefers-reduced-motion:
  reduce` no se reproduce: queda el poster. Los otros tres slides siguen siendo imagen.
- **Go / no-go** después del primer clip: si el modelo deforma rostros o el logo, o el loop
  no cierra, se documenta en el PRD como deuda y se corta ahí.

### Eventos y Misiones

- `events-slider.tsx`: viewport `overflow-x-auto` con flechas absolutas en los gutters
  (`-left-13.25` / `-right-13.25`, `top-50.5`), paso fijo `STEP = {mobile: 234, desktop: 389}`,
  `padding-top` para el asomo del personaje. Los personajes están en `event-card.tsx`
  (`domino` / `squad`, assets `public/assets/home/eventos/char-*.png`); data en
  `lib/data/events.ts` (4 cards: domino, squad, domino, domino).
- `misiones.tsx`: `<ul>` carrusel en mobile (cards de 261) y `grid-cols-4` en desktop; 4
  entradas en `lib/data/missions.ts` (Fortnite, Valorant, Assassin's Creed, Mario; el asset
  de Valorant pesa 3 KB — probablemente placeholder, se revisa). Card = `<li>` con `ring-1
  ring-inset ring-border`.

### Bordes atenuados (Leaderboard y panel de la card de Juegos)

Medido sobre el render del Figma (canvas + `getImageData`); el MCP los aplana como sólido:

- **Fila del Leaderboard** (`6008:26530`): `#494949` arriba al 100%, ~50% a media altura,
  ~15% abajo. Vertical lineal.
- **Panel de la card de Juegos** (`6008:26683`): `rgba(161,161,161,.5)` arriba; se sostiene
  hasta ~40% de la altura y cae a ~10% abajo.

Se reusa la técnica de `globals.css` (`border-gradient-nav-mobile` / `-desktop`: anillo en
`::before` enmascarado con `mask-composite`, cero impacto en layout, no tapa el
`backdrop-blur`). Hoy la fila usa `ring-1 ring-inset ring-border` y el panel `border
border-border-muted/50` (ese `border` sí suma tamaño: al pasar al anillo se compensa 1 px
para que el panel siga en 126 / 94). Tokens nuevos: `--gradient-row-border`,
`--gradient-card-border` + utilities `border-gradient-row` / `border-gradient-card`. Stops
exactos se barren contra el render al implementar.

### Vocabulario de hover existente (reusar, no inventar)

- Siempre `cursor-pointer`; `hover:` en pareja con `focus-visible:` (o `group-hover:` con
  `group-focus-visible:`); siempre `motion-reduce:transition-none`; duraciones {75, 200, 250}.
- Precedentes: `hover:shadow-brand-glow` (Reclamar), `hover:bg-brand-bright hover:shadow-cta-hover`
  (CTA hero), capa `opacity-0 group-hover:opacity-100` de `bg-surface-2` (pill del header),
  `group-hover:opacity-70` (miniaturas), `hover:text-brand` (flechas).
- Tokens: `--color-brand-bright`, `--shadow-brand-glow`, `--shadow-cta-hover`, `--ease-reveal`.
- No hay hover violeta: para el CTA del banner hace falta `--shadow-promo-cta-hover`.

### Links que todavía no navegan

`ROUTES.md` define `/news/:id`, `/games/:id`, `/profile` (propio) y `/missions` (lista).
`/profile/:id` no existe: se agrega al mapa. No hay `next/link` en el repo. Las cards y
filas pasan a `<Link href>` reales (regla 14) con `prefetch={false}` para no pedir rutas
que hoy dan 404. La card de Misiones no tiene ruta de detalle en el mapa: va como
`<Link href={`/missions/${mission.id}`}>` y `/missions/:id` se agrega a `ROUTES.md`
marcado ❓, igual que `/games/:id`. Así las tres cards siguen el mismo patrón.

### Comentarios (regla 19)

146 bloques en `app/` + `components/` + `lib/` (los más cargados: `use-section-spy.ts` 12,
`design-tokens.ts` 12, `hero.ts` 10, `event-card.tsx` 9, `navigation.ts` 8,
`leaderboard.ts` 7), 3 en `scripts/shot.mjs` y **81 bloques CSS** en `globals.css`. Ya
limpios: `juegos.tsx`, `game-*.tsx`, `news-*.tsx`, `sura-news.tsx`, `footer.*`, `utils.ts`.

## Detalle por tarea

### 1 · Fuentes reales
1. Descargar los dos archivos a `app/fonts/`.
2. `layout.tsx`: `localFont({ src: "./fonts/MonumentExtended-Ultrabold.ttf", weight: "900",
   variable: "--font-monument", display: "swap" })` y lo mismo para KH (`400`, `--font-kh`).
3. `globals.css`: tokens de familia a las nuevas variables; borrar los `font-variation-settings`.
4. `uppercase` en los tres `font-techno` que no lo tienen.
5. Re-medición contra el Figma (tinta del título, copy y CTA del hero en los dos tamaños,
   título de sección, bajada de News): volver tracking, `min-w` del CTA y alto del CTA
   mobile a los valores del diseño. Verificar el corte de línea del título del hero.
6. `design-tokens.ts`, PRD (§ 2 stack, changelog, deuda "Fuentes comerciales" resuelta).

### 2 · Ocultar la barra de scroll
Regla base en `globals.css` sobre `html`: `scrollbar-width: none` + `::-webkit-scrollbar
{ display: none }` (lo mismo que ya hace `@utility no-scrollbar` en los carruseles). El
scroll con rueda, teclado y touch sigue igual; sólo desaparece el indicador. Verificar en
Chrome y Safari que la página sigue scrolleando y que el ancho de layout no cambia.

### 3 · Bug del pill
En `resolve()`/callback del observer: ignorar entradas con `intersectionRect.height === 0`.
Verificar con el script del scratchpad (click en cada ítem, leer `aria-current` a 1,5 s) y
pedirle al usuario que confirme Juegos en su navegador; si ahí sigue fallando, medir en su
viewport antes de seguir.

### 4 · Scroll-spy intuitivo
- `rootMargin` → `-106px 0px -60% 0px` (banda [header, 40% vh]) y gana la **última**
  sección en orden de DOM que intersecta (la que acaba de entrar). Efecto: el pill cambia
  cuando el top de la sección nueva cruza el 40% del viewport, bajando y subiendo simétrico.
- El observer de cola queda (Juegos al fondo). El click sigue mandando durante el scroll y
  al soltar el lock recalcula: el destino queda en 106 < 40%, así que no rebota.
- Mobile: mismo criterio; el header de 56 ya estaba absorbido por el 106.
- PRD § 5 "Scroll-spy": reescribir la descripción del criterio.

### 5 · Resolución del arte del hero
1. Bajar `realesrgan-ncnn-vulkan-20220424-macos.zip` (release oficial) al scratchpad.
2. Upscale 4× de `hero-art.jpg`, `slider/fortnite.png`, `slider/black-ops-6.png`,
   `slider/modern-warfare-3.png` (modelo `realesrgan-x4plus`), y bajar cada uno a 2× de
   su tamaño de uso (hero: 2880 de ancho; portadas: 2× del ancho del hero al que se
   muestran). Salida `<nombre>@2x.<ext>`; los originales no se tocan.
3. Comparación lado a lado (screenshot antes/después, recorte del rostro y del logo) y
   OK del usuario antes de apuntar `lib/data/hero.ts` a los nuevos archivos.
4. PRD: desvío de la regla 10 (decisión del usuario), peso de los archivos y la deuda
   "Arte del hero escalado 1.81×" / "Black Ops 6 se ve blando" → resueltas por upscale.

### 6 · Slider del hero → carrusel con flechas + autoplay
- Misma UI de las cuatro miniaturas. Se agregan dos flechas con el estilo de las de Eventos
  (chevron 32, trazo 1.5, blanco → verde en hover, `--color-border-dim` apagada): en
  desktop **arriba y abajo** de la columna (`ChevronUp` / `ChevronDown`), en mobile a los
  lados de la fila. Las flechas cambian el slide activo ±1 con vuelta (wrap): con cuatro
  miniaturas todas visibles no hay nada que scrollear, lo que "avanza" es la selección.
- Autoplay en `HeroSlideProvider`: `useEffect` con `setInterval` que llama
  `select((i + 1) % n)` cada `hero.autoplayIntervalMs` (3000, en `lib/data/hero.ts`),
  dependiente de `activeSlide` para que cualquier cambio (click, flecha o auto) reinicie
  los 3 s. Pausa con `document.hidden` y con hover/focus sobre el slider. Sin autoplay si
  `matchMedia("(prefers-reduced-motion: reduce)")` — primer uso de `matchMedia` para motion
  en el repo; se documenta como desvío consciente de la regla 16 (cero librerías).
- Verificación: esperar 3,5 s → cambió; click o flecha → reinicia; reduced motion → quieto;
  el fade del arte sigue corriendo en cada cambio.

### 7 · Eventos a 6 cards
`lib/data/events.ts`: 6 entradas con `art` alternado `domino, squad, domino, squad,
domino, squad`. Títulos/fechas de relleno consistentes con las existentes. El slider ya
avanza de a una card y las flechas ya se apagan en las puntas.

### 8 · Misiones a 6 cards con carrusel
- Generalizar `events-slider.tsx` en `card-slider.tsx` con props: `step` (ancho de card +
  gap por tamaño), `className` del viewport (el padding-top del asomo es sólo de Eventos),
  `labels` de las flechas. `Eventos` lo usa con los valores de hoy; `Misiones` con paso
  `{mobile: 261 + 12, desktop: 268 + 24}` y sin padding-top. La posición de las flechas
  (`top-50.5`, a 202 del tope) se vuelve prop o se centra en el alto del viewport.
- `misiones.tsx`: el `<ul>` deja el `grid` y pasa a flex con cards de ancho fijo en desktop
  (`desktop:w-67` = 268) y gap 24: cuatro visibles en los 1144, dos más al scrollear.
- `lib/data/missions.ts`: 6 entradas. Los dos nuevos reusan los assets existentes (no hay
  más exports); revisar `valorant.png` (3 KB).
- PRD: nota de que Misiones se aparta del Figma (una fila de 4) por pedido del usuario.

### 9 y 16 · Bordes atenuados
Fila: `ring-1 ring-inset ring-border` → `border-gradient-row`. Panel de Juegos: `border
border-border-muted/50` → `border-gradient-card` + compensación de 1 px. Verificación por
muestreo de píxeles contra el render del Figma en tres alturas.

### 10, 11, 12, 15 · Links + hover
- Leaderboard: el `<li>` envuelve un `<Link href={`/profile/${entry.id}`} prefetch={false}
  className="group …">` con las clases visuales (el `hidden desktop:flex` de la última fila
  sigue en el `li`). Hover: capa `bg-surface-2 opacity-0 group-hover:opacity-100` + nombre
  a `group-hover:text-brand`. `aria-label` con el usuario. `ROUTES.md`: agregar `/profile/:id`.
- Misiones y News: la superficie de la card pasa al `<Link>` (News: `/news/${item.id}`;
  Misiones: `/missions/${mission.id}`). Hover: portada `group-hover:scale-105` con
  `transition-transform duration-250 ease-reveal` dentro del `overflow-hidden` que ya
  existe, título a `brand`, `shadow-brand-glow`.
- Juegos: `<Link href={`/games/${game.id}`}>` con la misma receta (zoom + glow). Badges:
  `hover:border-brand hover:text-brand transition-colors duration-200`.
- Siempre `focus-visible:` en pareja y `motion-reduce:transition-none`.

### 13 y 14 · Banner de Juegos
- Scrim: desktop `--gradient-promo-scrim` (238,69°) y mobile (100°): correr el stop
  transparente para que el violeta se apague al ~40% del ancho de izquierda a derecha.
  Iterar con screenshots hasta que el personaje se vea y el copy siga legible.
- CTA: `hover:shadow-promo-cta-hover` (glow verde vivo más fuerte, token nuevo, misma
  familia que `--shadow-cta-hover`) con `focus-visible:` en pareja y `transition-shadow
  duration-200`. Sin gradiente nuevo: el relleno no cambia, sólo la luz.
- Banner: `hover:shadow-promo-hover` (token nuevo: el violeta de `--shadow-promo`, hoy
  `0 0 15px` al 20%, más extendido y al ~40%), `transition-shadow duration-200`. Como el
  banner no es link, el hover es sólo del contenedor; el CTA mantiene el suyo.

### 17 · Comentarios
Pasada archivo por archivo: borrar todo lo que no sea `// TODO` o supresión de lint. Antes
de borrar, verificar si el contenido ya está en el PRD; lo que no esté (medidas,
decisiones, trampas) va a las notas de implementación o al changelog. `globals.css`: los
81 bloques se migran igual; queda sólo el separador de secciones si ayuda a la lectura.
`scripts/shot.mjs`: queda el TODO, se borra el resto.

### 18 · Hero en video (experimental)
1. Entregarle al usuario el brief para generar el clip con los créditos gratis de Kling
   (o Hailuo): imagen de entrada = `hero-art@2x` de la tarea 5; prompt cinemagraph
   ("cámara fija, sin zoom; sólo el pelo, la ropa y las partículas se mueven con un viento
   suave; rostros, logo y fondo quietos; loop"); 5 s, 16:9, la mayor resolución del plan
   gratis; 3–4 variantes.
2. El usuario baja el mejor `.mp4` al scratchpad. Chequear que la marca de agua quede fuera
   del recorte en los dos encuadres; si asoma, no-go con esa herramienta.
3. Postproceso local: `brew install ffmpeg`; loop con crossfade de ~0,5 s entre cola y
   cabeza; si el clip vino a 720p, extraer frames → Real-ESRGAN 2× → re-encodear. Salida
   `hero-art.mp4` (H.264, `-movflags +faststart`) + `hero-art.webm` (VP9), ~2–4 MB.
4. `hero-background.tsx`: para el slide `design`, `<video autoPlay muted loop playsInline
   poster={artSrc}>` con el mismo encuadre que la utility `hero-art-desktop` /
   `hero-art-mobile` (ancho 181,25% / 254%, `object-position` equivalente), el scrim encima
   y el fade al cambiar de slide. Con `prefers-reduced-motion: reduce` no se monta el
   `<video>`: queda el poster. `preload="metadata"`; el poster es el LCP, no el video.
5. Verificación: sin salto en el loop (grabar dos ciclos con Playwright y comparar el
   frame de cierre con el de apertura), sin scroll horizontal, LCP no empeora, y mobile
   sigue mostrando la imagen si el autoplay es bloqueado por el navegador.
6. PRD: nueva fila en deuda/notas con la herramienta usada, el prompt y el costo (0).

## Verificación

- Por tarea: `npm run typecheck && npm run lint`, screenshot de la sección en 390 y 1440,
  `scrollWidth === clientWidth` en 390 / 500 / 700 / 860 / 1440.
- Bordes: muestreo de píxeles contra el render del Figma.
- Scroll-spy: script Playwright que scrollea de a 100 px registrando `aria-current`, y
  click en cada ítem con lectura a 1,5 s. Confirmación del usuario en su navegador.
- Autoplay: 3,5 s → cambió; click reinicia; reduced motion → quieto.
- Fuentes: tinta de título, copy y CTA contra el render del Figma (error medio ≪ 3%).
- Cierre: `npm run verify`, screenshots completos, borrar `HOME-FIXES.md`.
