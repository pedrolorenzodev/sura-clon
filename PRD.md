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
| **Desktop** | Nav superior (logo + saldo + perfil) **y** menú flotante vertical a la izquierda: 60 de ancho, a 44 px del borde, centrado vertical dentro del gutter (`col-izq`, 148 × 720, nodo `6008:26347`). El Figma trae 7 ítems; se maquetan **6** (ver abajo) |
| **Mobile** | **Bottom bar del Figma** (`3567:92009`): 375 × 80, radio 16, borde `#494949`, `backdrop-blur`, `px-10` y sombra "Shadow 3". Con **nuestros ítems** (las 6 secciones) y el pill verde de desktop en vez de los destinos de app, ver abajo |

**El header va fijo arriba y siempre visible**, sin tomar fondo al scrollear: queda sobre el
hero con el fondo casi transparente del diseño. Decisión del usuario, 2026-09-18.

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

**Estado activo:** arranca en Home y se mueve con el click, aunque todavía no haya secciones
a donde scrollear. Eso hace que `nav-desktop.tsx` sea client component — es su única razón de
serlo. El **scroll-spy** (que el activo siga al scroll) queda pendiente para cuando existan
al menos dos secciones maquetadas.

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

El estado activo es **compartido** entre los dos menús (`components/layout/nav.tsx`): una sola
fuente de verdad, no dos.

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

### Mapa de rutas

| Ruta | Descripción | Estado |
|---|---|---|
| `/` | Home | ⏳ Pendiente (placeholder) |
| `/styleguide` | Referencia visual del Design System (solo dev) | 👀 Implementada |

**Secciones del Home desktop**, en orden:

`Nav` → `Hero` (full-bleed, 1024 de alto) → `Torneos` → `Leaderboard + Medallas` (dos columnas)
→ `Misiones` → `Sura News` → `Juegos` → `Footer`

### ⚠️ El diseño mobile está incompleto

El frame mobile mide **390 × 844: una sola pantalla**, no la página completa. Sólo contiene
status bar, header, Hero, la sección Eventos y la bottom bar.

**No hay diseño mobile de:** Leaderboard · Medallas · Misiones · Sura News · Juegos · Footer.

Por la regla 2 de `AGENTS.md`, esos bloques **no se maquetan** hasta que aparezcan sus frames.
Los bloques 1 a 4 sí tienen los dos tamaños.

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
  data/                data hardcodeada y tipada
public/assets/<pantalla>/   assets exportados de Figma
```

### Changelog del Design System

> **Reseteado el 2026-09-18** al migrar al Figma del rediseño. Las entradas del archivo
> anterior se descartaron: ningún token sobrevivió con el mismo valor.

| Fecha | Token | Pantalla que lo pidió | Motivo |
|---|---|---|---|
| 2026-09-18 | `--breakpoint-desktop: 391px` | Home | Único prefijo responsive. El diseño mobile vive sólo hasta 390px; de 391 para arriba manda desktop. |
| 2026-09-18 | Fuentes: `--font-display`, `--font-techno`, `--font-sans` | Home | Tres familias. Las dos primeras son **sustitutos libres** de fuentes comerciales (ver deuda). |
| 2026-09-18 | Tipografía: `--text-display(-sm/-xs)`, `--text-title`, `--text-card-title`, `--text-link`, `--text-cta`, `--text-note`, `--text-base`, `--text-ui`, `--text-xs/2xs/3xs` | Home | Escala relevada sección por sección. Cada token lleva su familia, line-height y tracking. |
| 2026-09-18 | `--text-sm` (14/20, Inter) | Header | Nombre de usuario en el header mobile. *(Antes estaba marcado como fuera del diseño: se corrigió al maquetar el bloque 1.)* |
| 2026-09-18 | `--border-thin: 1.5px` | Header | Anillo del avatar. Tailwind no tiene namespace de border-width, así que va como custom property y se referencia con `border-[length:var(--border-thin)]`. |
| 2026-09-18 | `--shadow-badge` → `--drop-shadow-badge` | Header | El badge de nivel es un PNG con alfa: la sombra tiene que seguir la silueta. `box-shadow` dibujaba un rectángulo. |
| 2026-09-18 | Marca: `--color-brand #A5E04A`, `--color-brand-deep`, `--color-brand-faint` | Home | El verde cambió respecto del diseño viejo y **no está publicado como variable de Figma**: se tomó del uso real. |
| 2026-09-18 | Superficies y bordes: `--color-surface(-2/-3)`, `--color-overlay`, `--color-border(-muted/-light/-dim)` | Home | Nav, cards, badges, bottom bar. |
| 2026-09-18 | **Familia dorada**: `--color-gold`, `--color-gold-deep`, `--color-gold-bright` + gradientes | Home | Nueva en el rediseño: premios, podio y medallas. No existía antes. |
| 2026-09-18 | Radio: `--radius-xs…2xl`, `--radius-pill` | Home | De 2 px (badges) a 30 px (CTA del hero). |
| 2026-09-18 | Sombra: `--shadow-bar`, `--shadow-badge`, `--shadow-gold-glow`, `--drop-shadow-claim`, `--drop-shadow-cta` | Home | `--shadow-bar` es la variable "Shadow 3" del Figma. |
| 2026-09-18 | Layout: `--container-page 1144px`, `--spacing-gutter(-desktop)`, `--spacing-nav-x`, `--spacing-section-gap`, `--spacing-title-gap` | Home | La grilla del rediseño cierra exacta (ver sección 4). |
| 2026-09-18 | `--color-nav-glass`, `--shadow-nav`, `--blur-nav` | Menú flotante desktop | Fondo `rgba(255,255,255,0.01)` + `backdrop-blur(10px)` + sombra `0 0 8px rgba(39,82,108,0.3)`. La sombra es distinta de `--shadow-bar`; el blur va al namespace `--blur-*`, que no está reseteado. |
| 2026-09-18 | `--color-tooltip: #1A1A1A` | Tooltip del menú flotante | Único token que **no sale del Figma**: el elemento solo existe en `app.suragaming.com`. El resto de sus valores ya eran tokens nuestros (`--color-border`, `--radius-xl`, `--shadow-nav`, `--text-sm`). |
| 2026-09-19 | `--color-nav-icon: #ABB7C2` | Bottom bar mobile | Los íconos de esta barra no son blancos en el Figma. Los del riel desktop sí: son dos sets distintos. |
| 2026-09-19 | `--gradient-nav-border` | Bottom bar mobile | El borde lleva degradé vertical, no color plano — el MCP lo devolvió aplanado a `#494949` y se detectó muestreando píxeles del render. El stop inferior medido (`#2E2E2E`) se resuelve con `--color-surface-2` (#303030), a 2 niveles: ver política de normalización. |
| 2026-09-18 | `--spacing-header-desktop: 106px` | Menú flotante desktop | Alto real del header (medido sobre el render, coincide con el diseño). El menú arranca justo debajo y las secciones lo van a usar como `scroll-margin-top`. |

### Deuda de diseño abierta

| Tema | Detalle | Qué hacer |
|---|---|---|
| **Fuentes comerciales sustituidas** | El diseño usa **Monument Extended** (títulos), **KH Interference TRIAL** (títulos de sección, cards, botones) y **TT Firs Neue Trl**. Ninguna es libre y las dos últimas están en versión de prueba. | Decisión tomada: se usan sustitutos libres (`Anybody` y `Martian Mono`) y se acepta que **los textos no coinciden ancho por ancho** con el Figma. Si aparecen los `.woff2` reales, el swap son 3 líneas en `layout.tsx`. |
| **Dos tipografías trial mezcladas** | En la misma fila de Torneos, 3 cards usan KH Interference y 1 usa TT Firs Neue. | Se unificó en KH (mayoritaria). Confirmar con diseño cuál es la definitiva. |
| **Verde sin publicar** | `#A5E04A` no está como variable de Figma; sí están `Sura/Negro` y `Sura/Blanco`, que son del diseño viejo. | Pedir que se publique la variable del verde nuevo. |
| **Verde legacy en los bordes** | Las cards de Torneos tienen borde `rgba(160, 229, 0, 0.2)` — el verde **viejo** al 20%, no el nuevo. | Probable resto del rediseño a medio hacer. Se replica tal cual (`--color-brand-faint`) y se consulta. |
| ~~**"Torneos" vs "EVENTOS"**~~ | La misma sección tenía distinto nombre en desktop y en mobile. | **Resuelto** (usuario, 2026-09-18): queda **"Eventos"** en los dos tamaños, y el ancla es `#eventos`. Cuando se maquete el bloque 4, el título de la sección también. |
| **Diseño mobile incompleto** | Falta el 60% de las secciones (ver sección 5). | Pendiente de que lleguen los frames. |
| **Íconos del menú en un solo estado** | El Figma exporta cada ícono del menú en un solo color: Home en negro (seleccionado) y los otros seis en blanco (default). | **Resuelto sin pedir assets**: el SVG se usa como máscara y el color lo ponen los tokens (ver Notas de implementación). Ya no hace falta la versión que falta. |
| **Estados del menú flotante** | El componente del Figma solo define `Default` y `Selected`. No hay hover ni focus — y el sitio live tampoco cambia el color del ícono en hover (medido: se queda en `text-gray-300`). | **Resuelto por decisión propia** (usuario, 2026-09-18): tooltip con el nombre de la sección + tinte verde de marca en el ícono. Es lo único del bloque que no sale ni del Figma ni del live. Si diseño define un hover propio, esto se reemplaza. |

### Notas de implementación que salieron del maquetado

| Tema | Qué pasó | Cómo se resolvió |
|---|---|---|
| **Stroke de Figma vs `border` de CSS** | En Figma el stroke se dibuja **hacia adentro** y no agrega tamaño; en CSS `border` sí. Los contadores quedaban 2px más altos y el botón Reclamar 1.3px más ancho. | Los bordes que no deben afectar el layout van como **`ring-1 ring-inset`** (box-shadow, cero impacto en layout). El anillo del avatar va en una capa **encima** de la foto, para que la imagen ocupe los 40px completos. |
| **`next/image` rompía el alfa** | El optimizador re-encodeaba los PNG a paleta y ensuciaba la transparencia: el ícono de fuego pasaba de 33×37 px de tinta a 35×48 y se veía recortado. | `images.unoptimized: true` en `next.config.ts`. Los assets ya vienen de Figma en su tamaño final; en un clon pixel-perfect la fidelidad manda sobre la optimización. |
| **Exports opacos** | El export de un nodo hornea el fondo del padre. El PNG de las estrellitas salía 100% opaco con el verde del botón adentro y tapaba el cofre. | Para un asset que se superpone a otro se usa la **imagen original** del fill (que sí tiene alfa), no el export del nodo. |
| **Un ícono, dos colores** | El menú flotante necesita cada ícono en blanco (default) y en `#0C0C0C` (sobre el pill verde), pero el Figma exporta uno solo de los dos por ícono. Pedir los 12 archivos era la salida obvia. | El SVG se usa como **`mask-image`** (`@utility nav-icon-*` en `globals.css`) y el color lo pone un token de fondo: `bg-foreground` en default, `bg-background` en el activo. Un solo export sirve para los dos estados. El asset no se toca: se referencia por URL igual que en un `<img>`, con la misma geometría — verificado midiendo los dos renders. Solo sirve para íconos de **un color**; si entra uno multicolor, ese vuelve a `<img>`. |
| **El pill activo cambiaba de tamaño** | El Figma define el seleccionado como padding alrededor del ícono (`px-10 py-8` sobre 26 px = 46 × 42). Con íconos de 18, 20 y 24 px el pill salía más chico en cada ítem, y el diseño solo define el caso de Home. | Se fija el pill en **46 × 42** y el ícono se centra adentro. Reproduce exacto el caso que el Figma sí define y unifica el resto (§ 6, normalización, punto 4). |
| **El ícono desaparecía en pleno viaje** | Si el ícono de destino se ponía negro al instante, quedaba negro sobre fondo negro hasta que el pill llegaba. | El cambio a negro espera al pill (`delay-150` + 75 ms); el que se apaga vuelve a blanco de inmediato. Mientras el pill pasa por encima de los íconos intermedios, quedan blancos sobre verde — legibles. |
| **El color llegaba tarde en los saltos cortos** | Con `ease-out` el pill se posaba a los ~140 ms en un salto de una celda pero a los ~215 ms en uno de cinco: un solo timing de color no podía servir para los dos, y en los cortos se veía el ícono blanco sobre el pill verde. | Se cambió la curva a **`ease-in-out`** y la duración a 250 ms. Medido: al terminar el fade del color (225 ms) al pill le faltan **0,1 px** en un salto de una celda y **0,5 px** en uno de cinco — llega igual sin importar la distancia. La tolerancia es ±10 px, que es el juego del ícono de 26 dentro del pill de 46. |
| **El MCP aplana los degradés** | `get_design_context` devolvió el borde de la bottom bar como `border-[#494949]` sólido. El diseño real tiene un degradé vertical y la barra "se sentía distinta". | Se muestrearon los píxeles del render del nodo (canvas + `getImageData`): borde superior `#484848`, inferior `#2E2E2E`, y los laterales idénticos entre sí a cada altura — o sea degradé vertical lineal. **Ante la duda sobre un color, medir el render, no leer el código del MCP.** Como no existe `border-image` con radio, el anillo se dibuja en un `::before` enmascarado (`border-gradient-nav`), que además no tapa el `backdrop-blur`. |
| **Unificar el tamaño de caja desbalanceó los íconos** | La bottom bar del Figma usa todos sus íconos en 24 px, así que se unificaron los nuestros. El de Misiones quedó visiblemente más grande. | Los exports tienen **padding interno distinto**: medida la tinta con canvas, en una caja de 24 Misiones pinta 24 × 24 y Home 18 × 18. Los tamaños nativos existen para igualar la **tinta**, no la caja — con ellos los dos pintan 18 × 18. Se revirtió a nativos. **Antes de unificar cajas, medir la tinta.** |
| **Assets con recorte interno** | El ícono de fuego es un sprite de 3072×2048 que el diseño clipea, y el logo de CS2 lleva un glow radial encima. Reproducir eso con porcentajes es frágil. | Se **exporta el nodo** desde Figma en vez de reproducir el recorte. Sigue siendo el asset del diseño, sin redibujarlo (regla 10). |

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
5. Si falta algún token: agregarlo al `@theme` y anotarlo en el changelog de arriba.
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
| Home | 🚧 | 🚧 | 🚧 En progreso — Header listo; menú de navegación (desktop + mobile) esperando aprobación. Sigue el Hero |

**Leyenda:** ⏳ Pendiente · 🚧 En progreso · 👀 Esperando aprobación · ✅ Aprobada · 📦 Commiteada · 🚫 Bloqueada

### Registro de bloques

La referencia de Figma contra la que se validó cada bloque. Se completa **apenas llega el
link**, antes de implementar — así queda registrado aunque el bloque no se termine.

| Bloque | Pantalla | Archivo | Figma desktop | Figma mobile | Estado |
|---|---|---|---|---|---|
| Home completo (fuente del DS) | Home | — | [`3628:74971`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-74971&m=dev) | [`3567:88242`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3567-88242&m=dev) | ✅ Escaneado → Design System |
| 1 · Header | Home | `components/layout/header*.tsx` | [`6008:26313`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26313&m=dev) | [`6008:23224`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-23224&m=dev) | 📦 Aprobado y commiteado |
| 2 · Menú flotante (desktop) | Home | `components/layout/nav-desktop.tsx` | [`6008:26347`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-26347&m=dev) (frame `col-izq`; el menú suelto es [`3628:75011`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-75011&m=dev)) | — (no existe en mobile) | 👀 Esperando aprobación |
| 3 · Menú mobile | Home | `components/layout/nav-mobile.tsx` | — | [`3567:92009`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3567-92009&m=dev) (la caja; los ítems y el activo son nuestros). Contexto usado para ubicarlo: hero [`6008:23211`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-23211&m=dev) y su fondo [`6008:23122`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-23122&m=dev) | 👀 Esperando aprobación |
| 4 · Drawer lateral | Home | `components/layout/` | — **falta** | — **falta** | 🚫 Sin frame |
| 3 · Hero | Home | `components/sections/` | [`3628:75013`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-75013&m=dev) | [`3567:88332`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3567-88332&m=dev) | ⏳ Dos pases, mobile → desktop |
| 4 · Torneos / Eventos | Home | `components/sections/` | [`3628:75027`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-75027&m=dev) | [`3567:88246`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3567-88246&m=dev) | ⏳ Los dos juntos |
| 5 · Leaderboard | Home | `components/sections/` | [`3628:75142`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-75142&m=dev) | — **falta** | 🚫 Falta el frame mobile |
| 6 · Medallas | Home | `components/sections/` | [`3628:75198`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-75198&m=dev) | — **falta** | 🚫 Falta el frame mobile |
| 7 · Misiones | Home | `components/sections/` | [`3628:75275`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-75275&m=dev) | — **falta** | 🚫 Falta el frame mobile |
| 8 · Sura News | Home | `components/sections/` | [`3628:75287`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-75287&m=dev) | — **falta** | 🚫 Falta el frame mobile |
| 9 · Juegos | Home | `components/sections/` | [`3628:75330`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-75330&m=dev) | — **falta** | 🚫 Falta el frame mobile |
| 10 · Footer | Home | `components/layout/` | [`3628:75356`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-75356&m=dev) | — **falta** | 🚫 Falta el frame mobile |

> **Bloques 5 a 10 bloqueados**: el frame mobile que existe cubre sólo Hero + Eventos.
> Por la regla 2, no se maquetan hasta tener su diseño mobile.

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
