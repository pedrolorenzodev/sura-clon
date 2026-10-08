# Proyecto

## Qué es

Clon de la UI de **SURA Gaming** (`app.suragaming.com`), el ecosistema gaming de Sura GG Corp. para LATAM. *Sin relación con la aseguradora SURA.* Proyecto de portfolio: se comparte entre conocidos, no es producto.

- **Producción:** [sura.elpepo.dev](https://sura.elpepo.dev). Vercel, proyecto `sura-clon` en la cuenta `pedrolorenzo`. DNS en Cloudflare (`aspen` / `max.ns.cloudflare.com`): `sura` es un CNAME a `c323c109bce0fd04.vercel-dns-017.com` en DNS only, más tres CAA (Sectigo, Google, Let's Encrypt); sin wildcard. El registro del dominio sigue en Vercel. `sura-demo.com` y `www` redirigen 308 ahí. `metadataBase` vive en `app/layout.tsx`.
- **Diseño:** Figma `uuh0qonxt0qkmKJku7jSUd` (*Sura Gaming UX/UI · Copy*). Home desktop `3628:74971`, mobile `3567:88242`. Los nodos de cada bloque están en el registro de bloques de `docs/archive/PRD-fase1.md`. El archivo viejo `9XB4HoW0POtA24p3AXuj7I` no se consulta. El sitio live muestra el diseño anterior: no es referencia.

## Fases

**Fase 1, cerrada el 2026-10-07.** UI pixel-perfect a 390 y 1440 desde Figma, con data hardcodeada y tipada en `lib/data/`. Incluye: Home completo, `/tournaments`, `/missions`, `/leaderboard`, `/games`, `/news`, `/profile` y los detalles de juego, evento y noticia; modales de jugador y de misión; búsqueda, filtros y paginado en memoria con el estado en la URL; 404 propia; micro-animaciones HUD, persiana entre rutas, intro en video, sonido y música de fondo. Las pantallas sin frames (404, Sura News, detalle de evento mobile) se diseñaron con propuestas aprobadas por el usuario.

**Fase 2, actual.** Supabase como fuente de la data, con **la misma data** y **cero cambio visual o de comportamiento**. Plan, inventario y decisiones abiertas: `docs/features/supabase.md`.

**Fuera del alcance de la Fase 2:** cualquier cambio de diseño o de interacción; autenticación real (hay un único usuario hardcodeado, `Cerdo_Capitalista`); i18n; tablet; pantallas nuevas; pasar los assets a Storage; la Fase D de inertes (ver `ROADMAP.md`).

**Rutas del live descartadas a propósito** (usuario, 2026-09-19): `/levels`, `/achievements`, `/store`, `/wallet`, `/faq`, `/privacy-policy` y `/about` (esta última es del sitio de marketing).

## Stack

| | |
|---|---|
| Framework | Next.js **16.3.5** (App Router, Turbopack) |
| React | **19.2.8** |
| TypeScript | **5.9** (`strict`) |
| Estilos | Tailwind **4.3** CSS-first, tokens en `app/globals.css` (`@theme static`), sin `tailwind.config` |
| Primitives | shadcn estilo `base-nova` sobre **Base UI** (no Radix): los triggers usan `render`, no `asChild` |
| Íconos | `lucide-react` |
| Fuentes | Monument Extended y KH Interference (locales, TRIAL) e Inter (Google), vía `next/font` |
| Scroll | Lenis, sólo con ancho ≥ 768 y sin movimiento reducido |
| Audio | Web Audio propio (`lib/sfx.ts`), sin librerías |
| Verificación | Playwright: `scripts/shot.mjs` (capturas sueltas) y `tests/visual/` (regresión) |

**Next 16 muerde:** `params` y `searchParams` son `Promise`; los layouts usan el tipo global `LayoutProps<"/ruta">`; Turbopack es el default; `middleware` pasó a llamarse `proxy`. Antes de escribir código Next, la guía de `node_modules/next/dist/docs/`.

**Herramientas:** skills en `.agents/skills/` (con symlinks en `.claude/skills/`): `supabase`, `next-best-practices`, `vercel-react-best-practices`, `vercel-composition-patterns`, `tailwind-design-system`, `typescript-advanced-types`, `shadcn`, `find-skills`, `git-guardrails-claude-code`, `libraries-dev`, `remotion-best-practices`. MCPs disponibles: Supabase, Vercel y Figma.

## Arquitectura

```
app/                    rutas. (site)/ agrupa las del sitio; styleguide/ queda afuera (sin chrome)
  globals.css           todos los tokens y las utilities propias
  not-found.tsx         la 404 de cualquier URL sin ruta (monta su propio SiteChrome)
components/ui/          primitives shadcn re-estilados
components/layout/      header, menú flotante, bottom bar, footer, navegación, sonido
components/sections/    secciones del Home, cards, colecciones, detalles, modales
lib/                    hooks, motor de sonido, zoom, scroll, helpers
lib/data/               data tipada por dominio (negocio) y config de UI
public/assets/          assets del diseño, por pantalla
scripts/shot.mjs        captura suelta (BASE_URL=http://localhost:3100)
tests/visual/           regresión visual
docs/                   este sistema
```

**Dependencias en un solo sentido:** `app → components → lib`. `lib/data` no importa de `components`. El motor de sonido no depende de React. Server components por defecto; cliente sólo donde hay estado o eventos. Alias `@/*` → raíz.

**Cómo está armado** (lo que no se deduce rápido leyendo el código):

- **Chrome.** `SiteChrome` (provider de navegación, persiana, `Nav`, footer) lo montan el layout `(site)` y `app/not-found.tsx`. El `Header` lo monta cada `page.tsx`, así el árbol sigue siendo server. `Nav` va antes que el footer porque el footer lee el estado de la bottom bar con `peer/bar`.
- **Navegación del Home.** El menú flotante y la bottom bar **scrollean a secciones del Home** (`#home`, `#eventos`, `#leaderboard`, `#misiones`, `#sura-news`, `#juegos`), no rutean. `SectionNavProvider` es la única fuente del ítem activo; lo escriben el click (`SectionLink` + `goTo`) y el scroll-spy (`lib/use-section-spy.ts`). La URL queda en `/`. Fuera del Home el riel y la bottom bar se van.
- **Entre rutas.** View Transitions nativas: la persiana es un `<div class="route-shutter">` persistente; `nav-back` invierte el sentido. Atrás y adelante del navegador pasan por un `popstate` interceptado con una pila propia (`sura-nav-stack` en `sessionStorage`) que también guarda el scroll.
- **Estado en la URL.** Filtros, búsqueda, página, tab y modales (`?jugador=`, `?mision=`) viven en la URL con `history.replaceState` y `useSyncExternalStore` (`lib/use-url-state.ts`). En el server devuelve `""` a propósito: el HTML sale con el estado por defecto y la URL se aplica al hidratar. No se usa `useSearchParams` (obligaría a un `Suspense`).
- **Colecciones.** Hoy la lista entera viaja al cliente y se filtra en memoria (`lib/collection.ts`). El reacomodo al filtrar es FLIP (`lib/use-flip-list.ts`, `FlipList`), que asocia claves por posición.
- **Escrituras simuladas.** Reclamar, unirse a un torneo, completar el perfil, reseñas y "me gusta" viven en stores de módulo (`use-daily-claim`, `use-tournament-join`, `use-profile-fields`) o en estado local: duran la sesión y se reinician al recargar.
- **Detalles.** `/games/[id]`, `/tournaments/[id]`, `/news/[id]` con `generateStaticParams` y `dynamicParams = false`. `lib/routes.ts` arma los links y sabe qué detalle está encendido; `CardLink` renderiza un `<Link>` o un `<div>` con las mismas clases.
- **Sonido.** Un único listener delegado (`components/layout/sfx-listener.tsx`) lee `data-sfx` y `data-sfx-hover`; el motor (`lib/sfx.ts`) y su config (`lib/data/sfx.ts`) no dependen de React. La preferencia vive en `localStorage` y un script del `<head>` la aplica antes de pintar.
- **Anchos.** Dos layouts: mobile fluido hasta 767 y desktop desde 768; entre 768 y 1099 el desktop de 1100 se escala con CSS `zoom` (`lib/desktop-zoom.ts`). Toda medición que mezcle rects y scroll pasa por `lib/css-zoom.ts`.
- **Intro del Home.** Un script inline en el `<head>` decide antes de pintar si corre la intro de PROJECT: Yi (`lib/hero-intro.ts`); tiene plazos propios para no dejar la página oculta si el bundle tarda.
- **`/styleguide`** lee los tokens en runtime con `getComputedStyle` (por eso el `@theme` es `static`) desde la lista de `lib/data/design-tokens.ts`.
- **Formato.** Puntajes y fechas viajan como string ya formateado, para no arriesgar desajustes de hidratación por locale. No hay `Intl` en el repo.
- **Imágenes.** `images.unoptimized: true`: el optimizador ensuciaba el alfa de los PNG.
- **Terceros.** Arte de juegos (Steam, Riot, Epic y otros), música y dos sonidos de Riot: aceptado para compartir entre conocidos; no sirve para producción sin licencias o reemplazo.

## Rutas

| Ruta | Qué es | Cómo se entra |
|---|---|---|
| `/` | Home: hero, Eventos, Leaderboard + Medallas, Misiones, Sura News, Juegos | logo, ítems del menú desde otra ruta |
| `/tournaments` · `/tournaments/:id` | Eventos y su detalle (tabs Acerca, Participantes, Ganadores por `?tab=`) | "Ver todo" de Eventos, cards de Eventos |
| `/leaderboard` | Ranking con métrica (`?metrica=`) y período (`?rango=`); modal de jugador `?jugador=` | "Ver todo" del Leaderboard |
| `/missions` | Misiones por categoría y estado; detalle como modal `?mision=` | "Ver todo" de Misiones, cards |
| `/games` · `/games/:id` | Catálogo con filtros por faceta y su detalle; la promo es `/games/mundial-fifa-2026` | "Ver todo" de Juegos, cards, banners del Mundial |
| `/news` · `/news/:id` | Sura News (`?categoria=`) y la nota | "Ir a Sura News", "Ver todo", cards |
| `/profile` | Mi Perfil (datos editables, medallas, reclamar) | avatar del header, "Tu posición" |
| `not-found` | 404 "Fuera del mapa", con llegada "Sin señal" | cualquier URL sin ruta |
| `/styleguide` | Referencia visual del Design System (interna) | directo |

Data de relleno, pero coherente entre pantallas: el Home muestra adelantos de las mismas colecciones (Juegos = primeros 8 de `/games`, Sura News = primeras 3 notas, filas del Leaderboard = puestos 04–08).
