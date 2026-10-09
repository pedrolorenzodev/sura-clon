# Fase 2 · Supabase reemplaza a `lib/data/`

> Escrito el 2026-10-07, antes de empezar. Al cerrar la fase, lo importante pasa a `DECISIONS.md` y este archivo se borra.

## Intención

Que la data de negocio salga de una base de datos real en vez de constantes en el bundle, para que el proyecto deje de ser sólo maqueta. **La data es la misma que hoy y la UI no cambia en nada**: ni un píxel, ni una animación, ni un comportamiento.

## Criterios de aceptación

- Toda la data de negocio (ver *Inventario*) se lee de Supabase. La config de UI se queda en código.
- `npm run visual`: 0 diferencias en todas las rutas y estados, a 390 y 1440, contra la referencia de la Fase 1.
- `npm run verify` limpio. Consola del navegador sin errores ni avisos de hidratación.
- El HTML que manda el server para cada ruta es equivalente al de hoy (mismo contenido en el primer pintado; hoy la página 1 de cada colección viene en el HTML).
- Las rutas que hoy son estáticas siguen sin pedirle nada a la base en cada request, salvo decisión explícita.
- RLS activo en cada tabla expuesta; ninguna clave secreta en el cliente; versiones de `@supabase/*` pinneadas.
- Ningún archivo de `.claude/hooks/frozen-paths.txt` tocado. El `git diff` de cada componente se lee como plomería.
- `lib/data/` queda sólo con la config de UI.

## Fuera de alcance

Autenticación real · cambios de diseño o de copy · data nueva o corregida (los errores del Figma se replican: ver `ROADMAP.md`) · pasar los assets a Storage (las rutas `/assets/...` siguen como están) · la Fase D de inertes.

## Decisiones (usuario, 2026-10-08)

1. **Provisión:** proyecto creado a mano desde el dashboard de Supabase, plan gratis, región `us-east-1` (cerca de Vercel, que es quien consulta). Claves a `.env.local` y a Vercel a mano. Sin stack local: no hay Docker; las migraciones van con la CLI (`npx supabase`) directo al proyecto remoto.
2. **Dónde se lee:** en el server. La `page.tsx` (o un server component) consulta y pasa props; el filtrado sigue en memoria en el cliente. El navegador nunca habla con Supabase.
3. **Qué se guarda:** se materializa la salida actual, incluidos los valores de `seeded()`, como columnas comunes. No se porta el PRNG.
4. **Cache:** estático con revalidación por tiempo (ISR, del orden de 60 s), **salvo el Home, que queda estático sin ISR** (ver GOTCHAS: Vercel lo regenera como `/index` y rompe la intro). No hay `cacheComponents` en `next.config.ts`, así que aplica `export const revalidate` (guía: `node_modules/next/dist/docs/01-app/02-guides/incremental-static-regeneration.md`).
5. **Escrituras:** fuera de la Fase 2. Sólo lectura; los stores de sesión quedan como están.

**Quién hace qué:** los bloques 0 y 1 los escribe el usuario a mano con el agente de guía; el script de seed (volcar `lib/data` a SQL) lo genera el agente. Después del bloque 1 se decide si sigue igual.

## Inventario

### Data de negocio (va a la base)

| Archivo | Qué tiene | Registros | Lógica que arrastra |
|---|---|---|---|
| `games.ts` | catálogo, facetas, promos | 24 juegos · 4 facetas (18 opciones) · Home = primeros 8 | `catalogArt(id)` arma rutas por plantilla · `imageClass` lleva clases Tailwind |
| `game-detail.ts` | detalle, reseñas, redes, red | 25 detalles (24 + promo `mundial-fifa-2026`) · 2 reseñas del Figma + pool de 10 | `rating` y `reviewsCount` salen de `seeded(\`${id}:detail\`)` · `gameReviews(id)` elige 2 del pool con `seeded` · `suggestedGames` = los 8 del Home menos el actual · `art.className` lleva Tailwind |
| `tournaments.ts` | eventos | 16 · 8 por página | `cover(id)` por plantilla · `contenders-training-center-110` con arte propio |
| `tournament-detail.ts` | detalle, sponsors, FAQs, participantes, premios | 16 · 6 sponsors · 3 FAQs | parsea el badge `"56/60"` → `joined`/`capacity` y lo reescribe a `"60 participantes"` · `startsInSeconds` sale de `seeded` · `tournamentPrizes("40 USDC")` parsea el string y reparte 40/22/13/8/6/5/4/2 % · participantes = `standings` rotados con `seeded` y cortados a `joined` |
| `events.ts` | cards de Eventos del Home | 6 | copia título, fecha, premio y badges del torneo al importarse; `throw` si el torneo no existe · `surface` y `art` son enums |
| `missions.ts` | misiones, destacadas, pasos | 32 (+ 6 destacadas fuera de `allMissions`) · Home = 6 por id | `missionById` junta las 38 · `missionSteps()` por plantilla de categoría · `rewardPoints("+120")` |
| `news.ts` | notas con cuerpo en bloques | 11 · 6 categorías | `relatedNews` por orden del array · Home = primeras 3 · destacada = primera de la categoría |
| `leaderboard.ts` | jugadores, niveles, ranking, perfil de jugador | 50 jugadores + `ME` · 4 métricas × 4 períodos = 16 vistas | **la más pesada**: 40 jugadores generados con un RNG secuencial; `statsFor` por período; `pinnedOrder` y `liftAbove` (gauchopaisano 1º, nays1 y emalorenzo 2º/3º en damero); desempate con `localeCompare`; todo se formatea a string; `playerProfile(id)` elige medallas con `seeded` |
| `medals.ts` | catálogo de medallas | 9 (5 obtenidas, 4 bloqueadas) | `art` es enum mapeado en `medal-card.tsx` |
| `profile.ts` | perfil propio, checklist, medallas reclamables | 7 campos · 21 países | mezcla datos con copy de UI (tabs, referidos, eliminar cuenta): decidir fila por fila |
| `user.ts` | el usuario y el reclamo diario | 1 | `points` 473 y `streak` 5 duplicados a mano en `ME` |
| `community-rules.ts` | reglas de la comunidad | 3 | — |
| `detail-art.ts` | tipo del arte de los heros | — | `className` no puede venir de la base |

### Config de UI (se queda en código)

`hero.ts` · `navigation.ts` · `footer.ts` · `sfx.ts` · `design-tokens.ts` · `not-found.ts`. Frontera gris dentro de los de negocio: `missionTabs`/`missionFilters`/`missionCopy`, `leaderboardTabs`/`Ranges`/`standingsColumns`/`levels`, `gamesPromo`/`gamesRoutePromo`, `newsIntro`, `tournamentFaqs`, `tournamentSponsors` (con `className`), `profileTabs`/`referral`/`deleteAccount`. Recomendado: copy de UI y catálogos de filtros quedan en código.

### Relaciones

```
user ──► leaderboard (ME) · profile (campo usuario) · use-daily-claim (puntos iniciales)
medals ──► profile (estado) · leaderboard (playerProfile)
tournaments ──► tournament-detail ──► events (tournamentId) ; leaderboard.standings ──► participantes
games ──► game-detail (24 + promo, sugeridos)
community-rules ──► game-aside (detalle de juego y de evento)
```

Ids que el código usa como contrato: `MY_PLAYER_ID = "cerdo-capitalista"`, `PROMO_GAME_ID = "mundial-fifa-2026"`, `FIGMA_ART_ID = "contenders-training-center-110"`, `PINNED_LEADER`/`PINNED_RUNNERS_UP`, `CLAIMABLE`, `FEATURED_CATEGORY`. La card `copa-latam` apunta al torneo `copa-latam-sura`.

### Consumidores

82 archivos `.ts`/`.tsx` de `app/`, `components/` y `lib/` son tocables (no están en `.claude/hooks/frozen-paths.txt`): los 13 de `lib/data/` de negocio, los que importan data de negocio (64, superpuestos con los anteriores), las páginas, dos padres de composición (`site-chrome.tsx`, `header.tsx`) y los stores de sesión. Los que hoy ejecutan data de negocio **en el cliente** y van a necesitar recibirla por props:

| Client component | Qué usa |
|---|---|
| `games-collection.tsx`, `game-filters.tsx` | `gamesCatalog`, `gameFacets` |
| `game-reviews.tsx` | `gameReviews(id)`, `currentUser` |
| `tournaments-collection.tsx` | `tournaments` |
| `tournament-tabs.tsx`, `join-panel.tsx` | `tournamentParticipants`, `tournamentPrizes`, `standings` |
| `leaderboard-collection.tsx` | `rankStandings` por cada métrica y período |
| `player-link.tsx`, `player-modal.tsx` | `playerProfile(id)` |
| `missions-collection.tsx`, `mission-modal.tsx`, `mission-card.tsx` | `allMissions`, `missionById` |
| `news-collection.tsx` | `news` |
| `profile-view.tsx`, `profile-fields.tsx` | `playerProfile(MY_PLAYER_ID)` **a nivel de módulo**, `profileFields`, `currentUser` |
| `medal-card.tsx` | `medals` |
| `claim-button.tsx` | `dailyClaim`, `currentUser` |

Páginas: todas son server components y estáticas. Las colecciones (`/tournaments`, `/leaderboard`, `/games`, `/news`, `/profile`) hoy no leen data en el server: la importa el client component. `/missions` lee `featuredMissions` en el server (el carrusel) y la grilla la importa el cliente. Los detalles usan `generateStaticParams` (16, 25 y 11 ids) con `dynamicParams = false`.

### Por dónde entra la data a lo que no cuelga de una página

- **Los dos modales** (`PlayerModalProvider`, `MissionModalProvider`) los monta `SiteChrome`, que es server y lo montan `app/(site)/layout.tsx` y `app/not-found.tsx` (los dos congelados, sin props). Camino: `SiteChrome` pasa a `async`, hace el query y pasa la data por props a los providers. `site-chrome.tsx` está descongelado para eso; sólo cambia la plomería.
- **Los headers** (`HeaderDesktop`, `HeaderMobile`) leen `currentUser`; los monta `Header`, server, que cada página renderiza. Camino: `Header` o los propios headers (server) pasan a `async`. `header.tsx` está descongelado.
- **`PointsValue`** (congelado) lee el saldo de `useDailyClaim`, que arranca en `currentUser.points` a nivel de módulo. Camino: el store recibe su valor inicial desde un componente que ya tenga la data (por ejemplo `HeaderDesktop`/`HeaderMobile` o `ClaimButton`), sin tocar `PointsValue`.
- **`MedalStack`** (server, tocable) lo monta `StatPill` (congelado) sin props: si necesita data, se vuelve `async` y la lee él.
- **`PlayerLink`** sólo usa `MY_PLAYER_ID` (constante, queda en código) y el contexto del modal: no necesita data.

### Estado de sesión que simula escrituras

| Store | Qué guarda | Escritura equivalente |
|---|---|---|
| `lib/use-daily-claim.ts` | reclamo diario (+50), medallas (+100), campos del perfil (+20), misiones iniciadas y completadas, puntos | claims por usuario e id de recompensa, saldo, estado de la misión |
| `lib/use-tournament-join.ts` | torneos a los que te uniste | inscripción |
| `lib/use-profile-fields.ts` | nombre, apellido, nacimiento, país, email | update del perfil |
| `game-reviews.tsx` (estado local) | reseñas nuevas, likes | reseña, like |

Todas duran la sesión y **suman sobre la data** al renderizar (`joined + 1`, `status` recalculado, `reviewsCount` ajustado): si la lectura ya trae el valor actualizado, se cuenta dos veces.

## Riesgos para "cero cambio"

El detalle de cada uno está en `docs/GOTCHAS.md`, sección *Fase 2: datos*. Los que más pesan:

1. **`seeded()`** (FNV-1a + xorshift en `lib/collection.ts`) alimenta el ranking, los perfiles, los ratings, las reseñas elegidas, los participantes y la cuenta regresiva. Por eso conviene materializar.
2. **Clases Tailwind y enums en la data.** Tailwind sólo genera las clases que ve en el código: `imageClass`, `className`, `iconSize` no pueden venir de la base. Los enums (`surface`, `art`, `MedalArt`, `LevelId`, `StandingTone`, `TournamentBadgeIcon`) tienen que traer exactamente los valores que los mapas de los componentes conocen.
3. **Orden.** Varias pantallas dependen de la posición en el array y el FLIP asocia claves por posición: cada tabla necesita una columna de orden y un `ORDER BY` determinístico.
4. **Strings ya formateados** (`"7.015"`, `"Ene 24, 14:00"`, `"+120"`, `"56/60"`, `"Hace 2 días"`) y quién los parsea. Sin `Intl`.
5. **Derivaciones en import-time y síncronas** (`events`, `standings`, `podium`, `missionById`, `const ME = playerProfile(...)` en `profile-view.tsx`): con una fuente async hay que mover la derivación al server y pasar el resultado.
6. **`events.ts` lanza al importarse** si falta un torneo; `dynamicParams = false` fija los ids en build.
7. **El countdown no es una fecha**: `startsInSeconds` (1–12 h) desde que monta la página. Guardar `starts_at` real cambia lo que se ve.

## Orden de bloques

Uno por commit. Cada uno: implementar, `npm run verify`, `npm run visual` (0 diffs), comparar el HTML del server de sus rutas contra el de antes, probar a mano en el navegador los flujos con interacción del dominio (abrir modales, filtrar, paginar, reclamar, unirse, reseñar: `visual` no los ve), `git diff` leído como plomería, `DECISIONS.md` y "Estado actual" al día, mensaje de commit.

0. **Infra.** Proyecto, env vars (`.env.local`, gitignoreado; en Vercel según la decisión 1), cliente (`@supabase/supabase-js` y, si hace falta, `@supabase/ssr`, versiones pinneadas), `lib/supabase/` (cliente server, tipos generados), `supabase/` (migraciones y `seed.sql` generado desde `lib/data` actual por un script), RLS de lectura pública. Ningún componente cambia todavía.
1. **Juegos**: `games` + `game-detail` (Home Juegos, banners, `/games`, `/games/:id`). Partido en pasos:
   - [x] 1a · tabla `games` (migración `create_games`, RLS de lectura, `check` de facetas)
   - [x] 1b · contenido (migración `seed_games`, generada desde `lib/data`)
   - [x] 1c · tipos generados + `getGames()` con mapper a `Game` (`lib/supabase/games.ts`)
   - [x] 1d-1 · Home `Juegos` y `/games` leen de Supabase (`/games` con ISR; el Home sin ISR)
   - [x] 1d-2 · detalle `/games/:id` y sugeridos desde la base (ISR 60 s; la promo sigue en `lib/data`)
   - [ ] 1e · promo `mundial-fifa-2026`, reseñas (pool de 10 + 2 del Figma), red y sociales: segunda tabla y relaciones; después `lib/data/game-detail.ts` y la parte de negocio de `lib/data/games.ts` se borran
2. **Noticias**: `news` (Home Sura News, `/news`, `/news/:id`).
3. **Leaderboard y usuario**: `leaderboard` + `medals` + `user` + `profile` (Home Leaderboard y Medallas, `/leaderboard`, modal, `/profile`, header).
4. **Torneos**: `tournaments` + `tournament-detail` + `events` (Home Eventos, `/tournaments`, `/tournaments/:id`; participantes dependen del 3).
5. **Misiones**: `missions` (Home Misiones, `/missions`, modal).
6. **Lo que queda**: `community-rules`, `detail-art`.
7. **Cierre**: `lib/data/` sólo con config de UI, `PROJECT.md` y `ROADMAP.md` al día, este archivo a `DECISIONS.md` y se borra.

## Verificación

```bash
npm run verify
npm run dev -- -p 3100
npm run visual                         # 0 diffs
curl -s localhost:3100/<ruta> > after.html   # contra el HTML de antes del bloque
```

Si `visual` falla, `npm run visual:report` muestra el diff. Nunca se regenera la referencia para que pase (el hook lo bloquea). `visual` no cubre movimiento, sonido, interacciones ni el tramo 768–1099: eso se prueba a mano.
