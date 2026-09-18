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

---

## 4. Widths de los frames

La **estrategia** de dos breakpoints es permanente y vive en `AGENTS.md` (regla 7).
Acá van solo los valores, que sí dependen del target.

| | Width del frame Figma | Alto del frame | Estado |
|---|---|---|---|
| Mobile | **390 px** | 844 px (una pantalla, ver sección 5) | ✅ Confirmado |
| Desktop | **1440 px** | 4138 px | ✅ Confirmado |

De acá salen dos cosas que tienen que coincidir siempre:

- `--breakpoint-desktop` en `app/globals.css` → **1440px**
- `VIEWPORTS` en `scripts/shot.mjs` → mobile 390 · desktop 1440

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
| **Desktop** | Nav superior (logo + saldo + perfil) **y** menú flotante vertical a la izquierda: 60 × 322, 7 ítems (nodo `3628:75011`) |
| **Mobile** | **Bottom bar flotante**: 375 × 80, radio 16, `backdrop-blur`, borde `#494949`, con 5 ítems y un botón circular verde de 70 px al centro (nodo `3567:88398`). No hay menú lateral ni hamburguesa |

> ⚠️ **Modelo de navegación: a confirmar.** El diseño anterior scrolleaba a secciones del Home.
> La bottom bar nueva (Home · Search · + · Medallas · Menú) parece de app con **rutas reales**.
> No se asume: se decide en el bloque 2, con el diseño a la vista, y se documenta acá.

Si resulta ser scroll a sección: anchors (`href="#seccion"`) contra `<section id="seccion">`
con `scroll-margin-top` y respeto de `prefers-reduced-motion`.

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
| 2026-09-18 | `--breakpoint-desktop: 1440px` | Home | Ancho del frame desktop. Único prefijo responsive del proyecto. |
| 2026-09-18 | Fuentes: `--font-display`, `--font-techno`, `--font-sans` | Home | Tres familias. Las dos primeras son **sustitutos libres** de fuentes comerciales (ver deuda). |
| 2026-09-18 | Tipografía: `--text-display(-sm/-xs)`, `--text-title`, `--text-card-title`, `--text-link`, `--text-cta`, `--text-note`, `--text-base`, `--text-ui`, `--text-xs/2xs/3xs` | Home | Escala relevada sección por sección. Cada token lleva su familia, line-height y tracking. |
| 2026-09-18 | `--text-sm` (14/20, Inter) | — | **No sale del diseño.** Lo exige `components/ui/button.tsx`, que trae `text-sm` hardcodeado en su clase base. Marcado como tal en `/styleguide`. |
| 2026-09-18 | Marca: `--color-brand #A5E04A`, `--color-brand-deep`, `--color-brand-faint` | Home | El verde cambió respecto del diseño viejo y **no está publicado como variable de Figma**: se tomó del uso real. |
| 2026-09-18 | Superficies y bordes: `--color-surface(-2/-3)`, `--color-overlay`, `--color-border(-muted/-light/-dim)` | Home | Nav, cards, badges, bottom bar. |
| 2026-09-18 | **Familia dorada**: `--color-gold`, `--color-gold-deep`, `--color-gold-bright` + gradientes | Home | Nueva en el rediseño: premios, podio y medallas. No existía antes. |
| 2026-09-18 | Radio: `--radius-xs…2xl`, `--radius-pill` | Home | De 2 px (badges) a 30 px (CTA del hero). |
| 2026-09-18 | Sombra: `--shadow-bar`, `--shadow-badge`, `--shadow-gold-glow`, `--drop-shadow-claim`, `--drop-shadow-cta` | Home | `--shadow-bar` es la variable "Shadow 3" del Figma. |
| 2026-09-18 | Layout: `--container-page 1144px`, `--spacing-gutter(-desktop)`, `--spacing-nav-x`, `--spacing-section-gap`, `--spacing-title-gap` | Home | La grilla del rediseño cierra exacta (ver sección 4). |

### Deuda de diseño abierta

| Tema | Detalle | Qué hacer |
|---|---|---|
| **Fuentes comerciales sustituidas** | El diseño usa **Monument Extended** (títulos), **KH Interference TRIAL** (títulos de sección, cards, botones) y **TT Firs Neue Trl**. Ninguna es libre y las dos últimas están en versión de prueba. | Decisión tomada: se usan sustitutos libres (`Anybody` y `Martian Mono`) y se acepta que **los textos no coinciden ancho por ancho** con el Figma. Si aparecen los `.woff2` reales, el swap son 3 líneas en `layout.tsx`. |
| **Dos tipografías trial mezcladas** | En la misma fila de Torneos, 3 cards usan KH Interference y 1 usa TT Firs Neue. | Se unificó en KH (mayoritaria). Confirmar con diseño cuál es la definitiva. |
| **Verde sin publicar** | `#A5E04A` no está como variable de Figma; sí están `Sura/Negro` y `Sura/Blanco`, que son del diseño viejo. | Pedir que se publique la variable del verde nuevo. |
| **Verde legacy en los bordes** | Las cards de Torneos tienen borde `rgba(160, 229, 0, 0.2)` — el verde **viejo** al 20%, no el nuevo. | Probable resto del rediseño a medio hacer. Se replica tal cual (`--color-brand-faint`) y se consulta. |
| **"Torneos" vs "EVENTOS"** | La misma sección tiene distinto nombre en desktop y en mobile. | Se respeta cada frame. Confirmar cuál queda. |
| **Diseño mobile incompleto** | Falta el 60% de las secciones (ver sección 5). | Pendiente de que lleguen los frames. |

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
| Design System | — | — | 👀 Rehecho sobre el rediseño, esperando aprobación |
| Home | ⏳ | ⏳ | ⏳ Pendiente — bloques 1 a 4 desbloqueados, 5 a 10 sin diseño mobile |

**Leyenda:** ⏳ Pendiente · 🚧 En progreso · 👀 Esperando aprobación · ✅ Aprobada · 📦 Commiteada · 🚫 Bloqueada

### Registro de bloques

La referencia de Figma contra la que se validó cada bloque. Se completa **apenas llega el
link**, antes de implementar — así queda registrado aunque el bloque no se termine.

| Bloque | Pantalla | Archivo | Figma desktop | Figma mobile | Estado |
|---|---|---|---|---|---|
| Home completo (fuente del DS) | Home | — | [`3628:74971`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-74971&m=dev) | [`3567:88242`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3567-88242&m=dev) | ✅ Escaneado → Design System |
| 1 · Nav / Header | Home | `components/layout/` | [`3628:74976`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-74976&m=dev) | [`3567:88345`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3567-88345&m=dev) | ⏳ Dos componentes separados |
| 2 · Menú flotante · Bottom bar | Home | `components/layout/` | [`3628:75011`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3628-75011&m=dev) | [`3567:88398`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3567-88398&m=dev) | ⏳ Dos componentes separados |
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
