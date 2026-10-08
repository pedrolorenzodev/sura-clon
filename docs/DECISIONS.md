# Decisiones

> Registro de decisiones vigentes, la más nueva arriba. Se agrega en el momento en que se toma, incluidas las que el agente tomó sin consultar. Una decisión revertida no se borra: se marca `Reemplazada por <fecha · título>` y se agrega la nueva. El detalle largo de las anteriores al 2026-10-07 está en `docs/archive/PRD-fase1.md`.

## 2026-10-08 · El Home queda estático, sin ISR
**Se eligió:** `app/(site)/page.tsx` sin `revalidate`: la data del Home (por ahora, los 8 juegos) se actualiza en cada deploy. Las rutas internas (`/games`) siguen con ISR de 60 s. Ajusta la decisión 4 de *Cómo se integra Supabase*.
**Por qué:** Vercel regenera el Home como `/index`; el menú se renderiza como ruta interna, la hidratación falla y se pierde la intro (ver GOTCHAS).
**Se descartó:** aceptar `/index` como Home en `SectionNavProvider` (archivo congelado y parche del síntoma); revalidación on-demand (`revalidatePath`) por ahora.

## 2026-10-07 · Fase 2 es sólo backend; la UI queda congelada
**Se eligió:** lista de archivos congelados calculada (todo lo que no consume data de negocio, en `.claude/hooks/frozen-paths.txt`), deny rules en `.claude/settings.json` y `npm run visual` idéntico al píxel contra la referencia de la Fase 1.
**Por qué:** "no tocar archivos de UI" no se puede cumplir: 64 archivos de `app/`, `components/` y `lib/` importan data de negocio. La frontera real es cero cambio visual o de comportamiento.
**Se descartó:** congelar carpetas enteras; tolerancia de píxeles.

## 2026-10-08 · Cómo se integra Supabase
**Se eligió:** proyecto creado a mano desde el dashboard (plan gratis, `us-east-1`), sin stack local; lectura en el server con props hacia los client components; materializar la data derivada como columnas; prerender estático con ISR (~60 s); Fase 2 sólo de lectura. Los bloques 0 y 1 los hace el usuario a mano con el agente de guía.
**Por qué:** es lo que mantiene el HTML del server idéntico (cero cambio), deja las claves fuera del navegador y evita que un cálculo portado difiera en un decimal. El usuario quiere aprender la integración.
**Se descartó:** Vercel Marketplace (esconde el cableado de las claves), lectura desde el cliente (la página llegaría vacía), portar `seeded()`, render dinámico, persistir acciones del usuario sin auth.

## 2026-10-08 · Guardas endurecidas tras la auditoría
**Se eligió:** `site-chrome.tsx` y `header.tsx` salen de la lista de congelados (son padres de composición en el camino de la data: modales y headers). Entran `tests/visual/routes.ts`, `tests/visual/__snapshots__/**`, `.claude/rules/**`, `lib/use-url-state.ts`, `lib/routes.ts` y `lib/collection.ts`. Los hooks bloquean además: carpetas que contienen archivos congelados (`rm -rf components`), formateadores (`--write`, `--fix`), regenerar la referencia (`visual:baseline`, `--update-snapshots`, `-u`), rutas con `./` o `../`, `git` invocado como `\git`, `/usr/bin/git` o dentro de `bash -c`, aliases de git, `checkout`, `switch`, `restore`, `rm`, `mv` y `config`. El hook deja pasar `git stash list` y `show`, pero la regla `deny` `Bash(git stash *)` de `settings.json` los corta igual. `routes.ts` pasa de 70 a 117 rutas y estados.
**Por qué:** una auditoría independiente encontró que los padres congelados impedían el patrón documentado y que el hook se esquivaba borrando carpetas o regenerando la referencia.
**Se descartó:** pasar data por wrappers server con el mismo export para no descongelar (más código, mismo riesgo); congelar `package.json` (bloquearía instalar `@supabase/*`).

## 2026-10-07 · Las `page.tsx` de las rutas quedan tocables
**Se eligió:** las `page.tsx` de `app/(site)/` no están en la lista de congelados aunque hoy no importen data: van a ser las que hagan el query y pasen props. Sí están congeladas `app/layout.tsx`, `app/(site)/layout.tsx`, `app/not-found.tsx` y `app/styleguide/**`.
**Por qué:** el patrón recomendado para la Fase 2 es leer en el server desde la página; congelarlas obligaría a meter el fetch en componentes de más abajo.
**Se descartó:** congelarlas y que el usuario las libere una por una.

## 2026-10-07 · Documentación: `AGENTS.md` corto + `docs/` a demanda
**Se eligió:** `CLAUDE.md` → `AGENTS.md` (< 200 líneas) + `docs/` que se leen cuando hacen falta + reglas por ruta (`.claude/rules/ui.md`).
**Por qué:** el PRD (2.635 líneas, ~100k tokens) se importaba en cada sesión, tenía secciones desactualizadas y reglas de la Fase 1 que contradicen la Fase 2.
**Se descartó:** curar el PRD línea por línea (se archivó entero en `docs/archive/`); el formato DESIGN.md de Google (alfa); mover el código a `src/`.

## 2026-10-07 · Regresión visual con `@playwright/test`
**Se eligió:** 390 y 1440 a DPR 2, `reducedMotion: "reduce"`, reloj fijo, todas las rutas y estados por URL. Las referencias van en `.gitignore`.
**Por qué:** es la única forma de garantizar cero cambio al tocar decenas de componentes. Con movimiento reducido y reloj fijo, dos corridas dan idéntico al píxel.
**Se descartó:** commitear las referencias (cientos de MB); DPR 1 (no ve los assets 2x).

## 2026-10-07 · Git bloqueado por hook
**Se eligió:** `.claude/hooks/guard-git.sh` corta commit, push, merge, rebase, reset, tag, stash, cherry-pick, worktree y sus variantes con `-C`, además de la regla escrita.
**Por qué:** la regla dependía de que el agente se acordara.

## 2026-10-05 · Dominio `sura.elpepo.dev`
**Se eligió:** subdominio del portfolio del usuario. Registro en Vercel, DNS en Cloudflare con un CNAME en DNS only, sin wildcard. `sura-demo.com` y `www` redirigen 308 conservando ruta y query; `sura-clon.vercel.app` se quitó. `metadataBase` en `app/layout.tsx`.
**Por qué:** cada proyecto del portfolio va en un subdominio de `elpepo.dev`. Vercel sólo emite wildcard con sus propios nameservers.
**Se descartó:** proxy de Cloudflare; transferir el dominio (bloqueado 60 días).

## 2026-10-01 · Scroll suave más ágil
**Se eligió:** `SMOOTH_LERP` 0,25 en `smooth-scroll.tsx` (opción *Intermedio* de [Scroll SURA](https://claude.ai/artifact/V5JRGEfWBFbVwzYAaEgRLB)).
**Por qué:** con trackpad se sentía flotante.
**Se descartó:** nativo, 0,32 y el 0,18 anterior.

## 2026-10-01 · Sin chip "Escuchar la intro"
**Se eligió:** si el navegador deja sonar al cargar, la intro suena desde el inicio; si no, corre muda y el primer gesto arranca el sonido de la intro desde la posición del video (o el tramo calmo si ya terminó).
**Por qué:** pedido del usuario; es lo que veía en localhost, donde Chrome ya le daba autoplay al origen.
**Se descartó:** el chip de la opción C de *Intro con sonido*. En una primera visita no hay forma de sonar sin gesto.

## 2026-10-01 · Paisanos en el leaderboard
**Se eligió:** los 10 jugadores del Figma pasan a ser el equipo de Paisanos con los mismos puntos y avatares por puesto. `gauchopaisano` es #1 en las 16 combinaciones de pestaña y período; `nays1` y `emalorenzo` se turnan 2º y 3º en damero (`PINNED_LEADER`, `PINNED_RUNNERS_UP` en `lib/data/leaderboard.ts`). El podio del Home sale de `standings`.
**Por qué:** demo para Paisanos.
**Abierto:** "Tu posición" no te inserta en la tabla; si quedás en el top 10, tu puesto coincide con la fila de otro.

## 2026-10-01 · Volumen de los efectos
**Se eligió:** todos ×1,4, salvo ida, vuelta y llegada a la 404, ×0,75. Valores en `lib/data/sfx.ts`.
**Por qué:** más presencia antes de la demo, con la persiana más baja.

## 2026-10-01 · Bottom bar al ancho del contenido
**Se eligió:** `px-gutter`, a 24 px de cada borde en cualquier ancho mobile.
**Por qué:** pedido del usuario. Desvío consciente del Figma (375 sobre 390) y del tope anterior de 430.

## 2026-10-01 · Carruseles de a una card y swipe horizontal sin scroll vertical
**Se eligió:** `snap-x snap-mandatory` con `snap-always`; en Lenis, si la primera rueda de un gesto cae sobre `[data-carousel]` y es horizontal, el gesto entero lo resuelve el navegador.
**Por qué:** un swipe de trackpad bajaba la página y el carrusel no se movía.
**Abierto:** en mobile un arrastre largo puede pasar más de una card.

## 2026-10-01 · Arreglos del code-review pre-demo
**Se eligió:** los 11 de [Revisión SURA pre-demo](https://claude.ai/artifact/ABjn2XoZ8g8VPrpLVccybE). Los que son decisión: el pozo de premios se reparte 40 / 22 / 13 / 8 / 6 / 5 / 4 / 2 %; las fechas van en 24 h sin "PM"; Sura News mobile muestra 3 notas como desktop; Lenis con `stopInertiaOnNavigate`; `<html data-scroll-behavior="smooth">`.
**Abierto:** la lista *después de la demo* y la *limpieza* del reporte.

## 2026-09-30 · Música de fondo (M4)
**Se eligió:** opción C + M4 de [Intro con sonido](https://claude.ai/artifact/REZFZZ3By4Lh3geUyU6qEd). El tema de PROJECT: Yi desde 3,064 s cruza a los 11,52 s al loop calmo (`bgm-yi-calm`). Dos botones (música y efectos), la M apaga y prende los dos. Volumen 0,15. **Sin música en mobile.** La persiana baja la música 8 dB. Con movimiento reducido hay música pero no intro.
**Por qué:** la intro con sonido sólo tiene sentido con música, como el launcher del LoL. Ningún sitio relevado suena al cargar.
**Se descartó:** M1 (primer gesto), M2 (apagada), M3 (puerta de entrada); pistas CC0 (*Pondering the Cosmos*, *Airy*); un solo botón.

## 2026-09-30 · Un gesto durante la intro suena la intro
**Se eligió:** el motor recibe el reloj de la intro (`setIntroClock`) y `startBackgroundMusic` es el único punto que decide qué suena: con la intro corriendo, el tema desde la posición del video; sin intro, el calmo. También arranca solo si el `AudioContext` ya está en `running`.
**Por qué:** antes un click en medio de la intro disparaba el calmo encima de ella, y la música no volvía en navegaciones que el navegador deja sonar.

## 2026-09-30 · Paleta LoL
**Se eligió:** Pieza 4 de [Intro con sonido](https://claude.ai/artifact/REZFZZ3By4Lh3geUyU6qEd): para cada evento el sonido CC0 más parecido al del cliente del LoL; ida y vuelta son los originales de Riot (visor del ranked). Tecleo muy bajo.
**Por qué:** Arcade y las paletas enteras probadas no combinaban con la música.
**Se descartó:** Libre, la mixta con uisfx, Arcade, Chip propio, Ventana, madera de balsa sintetizada.
**Riesgo:** la música, la ida y la vuelta son de Riot. Para compartir entre conocidos se acepta; para publicar, reemplazar por CC0.

## 2026-09-30 · Volumen de la música
**Se eligió:** opción A de [Volumen de la música](https://claude.ai/artifact/VTy1HD5zvhgi6G6sDza6Dh): slider en un Popover de shadcn sobre el botón de música, abre con hover o foco. Rango interno 0–0,30, paso de teclado 0,05, la UI muestra 0–100 %. Slider a 0 apaga; subir desde 0 prende.
**Por qué:** en el motor era trivial; la UI no estaba definida.
**Se descartó:** B (click que recorre niveles), C (flechas); volumen de efectos (desbalancea la jerarquía); control en mobile.

## 2026-09-30 · Smooth scroll con Lenis y scrollbar propia
**Se eligió:** Lenis sólo con ancho ≥ 768 y sin movimiento reducido. Scrollbar propia fija a la derecha, del alto del riel y centrada con él, a 20 px del borde en el Home y 8 px fuera. Se esconde al navegar y vuelve cuando termina la persiana. En mobile, barra nativa fina.
**Por qué:** pedido del usuario, sin propuesta previa por indicación suya.
**Se descartó:** espejar el riel exacto (tapaba las cards en rutas internas).

## 2026-09-30 · Link de volver en los detalles
**Se eligió:** opción A de [Volver SURA](https://claude.ai/artifact/PWTwe5bS1xZrtJ9RFXsQdt): botón de ícono que se expande con el destino ("Volver a Eventos") en `/games/:id`, `/tournaments/:id` y `/news/:id`. En mobile va siempre abierto. `DetailBackLink`.
**Se descartó:** texto suelto con sombra; la pastilla del chip de la intro.

## 2026-09-30 · `goBack` y persiana con atrás y adelante
**Se eligió:** pila de navegación propia (`sura-nav-stack`, en `sessionStorage`) que guarda ruta y scroll por entrada. Atrás y adelante del navegador pasan por un `popstate` interceptado que dispara la persiana en el sentido correcto y restaura el scroll, entre cualquier par de rutas, y suenan como un click. `goBack` salta las 404 y usa `router.back()` sólo si el destino es la entrada anterior del mismo documento; si no, `push` con `nav-back`.
**Por qué:** React aplica síncrono lo que arranca en un `popstate` y no había View Transition; tras una recarga, `router.back()` cruzaba de documento sin persiana.
**Costo aceptado:** en esos casos el historial suma una entrada en vez de retroceder.

## 2026-09-30 · La intro de Yi no se saltea
**Se eligió:** ningún click, tecla, rueda ni toque corta la intro. Lenis queda en `stop()` mientras está pendiente.
**Por qué:** pedido del usuario.

## 2026-09-30 · Llegada a la 404: Sin señal, con sonido S2
**Se eligió:** opción B lenta de [Sector sin señal](https://claude.ai/artifact/KVYgC2hqrGgFjC6FsJECRa) (1,8 s, sólo CSS, sólo en carga completa) y sonido S2 "corte de energía" de [Sin señal con sonido](https://claude.ai/artifact/VTaLGkWCiv91mZmkkNccCb), al volumen de la ida. Todos los links de la 404 son "volver" (`nav-back`).
**Por qué:** cambio de pantalla propio para "te perdiste". A la 404 se llega casi siempre con carga completa, así que es una llegada, no un cruce.
**Se descartó:** A, C, D, E, F; el tipo `nav-lost` (ningún link lleva a una 404).

## 2026-09-29 · Catálogo sin repetidos con arte oficial
**Se eligió:** ninguna card se repite dentro de una sección y ningún asset o copy aparece en dos registros distintos. Arte oficial de Steam, `valorant-api.com`, `fortnite-api.com`, Data Dragon. Dos páginas por colección. Las dos primeras cards de Eventos son las del Figma; las otras cuatro, renders oficiales sobre fondos del mismo juego.
**Por qué:** las cards se veían repetidas y el título contradecía al arte.
**Riesgo aceptado:** arte de terceros sirve para compartir entre conocidos, no para producción.
**Se descartó:** fondos de Unsplash; "Wagmi Defense" y "The Plooshies" (su arte era de Valorant); Free Fire (sin arte en alta); R.E.P.O. (reemplazado por League of Legends).

## 2026-09-29 · Sura News: N1 y D2
**Se eligió:** [Noticias y filtros SURA](https://claude.ai/artifact/GtCFDG6WMzyj8F6HeH8wwz). `/news` con tabs por categoría y nota destacada; `/news/:id` con la plantilla del detalle de juego y columna de lectura. Sin frames.

## 2026-09-29 · Filtros de `/games`: F2
**Se eligió:** dropdowns multiselección en desktop, hoja desde abajo en mobile, chips activos, estado en la URL. O dentro de un grupo, Y entre grupos. **"Redes" son redes sociales.** El detalle de juego lee las mismas facetas.
**Se descartó:** redes como blockchains (error de la propuesta).

## 2026-09-29 · Mi Perfil editable: P1
**Se eligió:** edición en la fila; el primer guardado suma +20 SP. Fecha con máscara numérica. Usuario y avatar no se editan. Dura la sesión.
**Se descartó:** editar usuario y avatar (los usan header, leaderboard y modal).

## 2026-09-29 · Estado vacío con radar (E3) y evento mobile con panel compacto (B)
**Se eligió:** [Evento mobile SURA](https://claude.ai/artifact/84ucddHccEw5DzBPFQ8J1v). El estado vacío es un ítem más de la lista (entra con el reacomodo) y ofrece limpiar. En mobile, cuenta regresiva e inscriptos lado a lado con barra de cupo; desktop no cambia.

## 2026-09-29 · Filas del detalle de evento
**Se eligió:** [Filas SURA](https://claude.ai/artifact/1EfbM4DELzVC2Pmv9K4KeW): Participantes opción B (grilla de cards de jugador), Posición / Premio opción C (tabla pulida).
**Se descartó:** la A de premios, que se implementó y se cambió al verla.

## 2026-09-29 · Sponsors quietos
**Se eligió:** los seis logos del frame, centrados y sin movimiento.
**Se descartó:** marquesina con 12 logos; se implementó y se revirtió entera.

## 2026-09-29 · Reclamar con el fondo del nodo `317:1335`
**Se eligió:** degradé y borde del [nodo](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=317-1335&m=dev); cofre con la imagen original con alfa. El texto sigue en `--color-brand`.

## 2026-09-29 · Efectos de carga en cada carga
**Se eligió:** el barrido del H1 corre también en cargas directas (desde el SSR, sólo CSS). Los carruseles del detalle de juego y la descripción del evento animan en cada carga. La intro sube al tope al recargar.
**Por qué:** pedido del usuario.

## 2026-09-28 · Colecciones reales con estado en la URL
**Se eligió:** búsqueda, filtros y paginado en memoria en las cuatro rutas. Estado en la URL con `history.replaceState` y `useSyncExternalStore` (`lib/use-url-state.ts`). Búsqueda sin tildes ni mayúsculas, con 250 ms de espera antes de reacomodar.
**Por qué:** feedback de Ema: quien mira rápido concluye que sólo existe el Home.
**Se descartó:** `useSearchParams` (obliga a `Suspense` y saca la colección del HTML); `push` (cada filtro sumaría historial).

## 2026-09-28 · Reacomodo FLIP al filtrar
**Se eligió:** opción C de [Filtrado SURA](https://claude.ai/artifact/GTM5LEeudtRTj12NwJEvTd), también al paginar. Web Animations en `lib/use-flip-list.ts`.
**Se descartó:** A cascada, B barrido, D decodificado; View Transitions (header y riel se fundirían con cada filtro).

## 2026-09-28 · Modales por URL para usuario y misión
**Se eligió:** el detalle de usuario (`?jugador=`) y el de misión (`?mision=`) son modales sobre la ruta, no rutas. `/missions/:id` y `/profile/:id` no existen.
**Por qué:** el frame de misión es un modal; el de usuario lo pidió el usuario.

## 2026-09-28 · Rutas hijas con los padres en revisión
**Se eligió:** abrir los detalles sin esperar la aprobación de las pantallas padre, y diseñar sin frames el detalle de evento mobile y Sura News.
**Por qué:** autorizado por el usuario para el feedback de Ema. Excepción a las reglas de "padre antes que hijas" y "nunca sin los dos frames".

## 2026-09-28 · Detalle de evento: UX vieja, UI nuestra
**Se eligió:** de los frames viejos [`412:4384`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=412-4384&m=dev), [`412:18445`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=412-18445&m=dev) y [`412:19980`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=412-19980&m=dev) se toma la estructura; tabs, tipografía y componentes son los del rediseño. Unirse dura la sesión.

## 2026-09-28 · Detalle de juego: título en Monument y grilla del Home
**Se eligió:** `/games/:id` desde [`2867:7612`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=2867-7612&m=dev) / [`3168:13133`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3168-13133&m=dev). Título en Monument como el banner; columna de 1144 centrada; reseñas en memoria; carruseles con fundido como máscara del viewport.
**Se descartó:** TT Firs Neue; el bloque "Lorem Ipsum"; sugerencias con artes fuera del catálogo.

## 2026-09-28 · El usuario es `Cerdo_Capitalista`
**Se eligió:** una sola fuente, `currentUser.name`.
**Se descartó:** el "Skell 22" del frame de Mi Perfil (tomado como error).

## 2026-09-27 · Mobile fluido hasta 767
**Se eligió:** el layout mobile se estira y sólo se ajustan las piezas que se veían mal (grillas `card-grid`, medallas topadas, podio, banner de `/games`), con fórmulas que hasta 430 dan lo mismo que antes.
**Se descartó:** columna centrada de 430; escalar con `zoom` (parecía un teléfono ampliado).

## 2026-09-26 · Breakpoint 768 con el desktop escalado hasta 1100
**Se eligió:** ≤ 767 mobile; 768–1099 el desktop maquetado a 1100 y escalado con CSS `zoom` (`lib/desktop-zoom.ts`, `lib/css-zoom.ts`); ≥ 1100 desktop fluido. Sigue habiendo dos layouts.
**Por qué:** con DevTools abierto la ventana queda en ~850–1050 y saltaba a mobile.
**Se descartó:** un layout intermedio (tablet sigue fuera de scope); corte en 1100 o en 391.
**Regla que salió:** bajo `zoom`, en WebKit, nada de `calc()` que mezcle `%` y `px` en un ancho.

## 2026-09-26 · Riel y bottom bar se van fuera del Home
**Se eligió:** fuera del Home la bottom bar baja y el riel se corre a la izquierda, animados e `inert`. La columna de ruta pasa a 40 / 40. En mobile, flecha de volver en el header.
**Por qué:** son indicadores de sección del Home; fuera de él no marcan nada.

## 2026-09-26 · Las cards suenan, y la ida y la vuelta suenan con la persiana
**Se eligió:** hover de card al 60 % del hover normal más clic (opción C de [Sonido SURA](https://claude.ai/artifact/FtyLwp9kX6guF4FCEek39E)), cableado en `CardLink`. La ida y la vuelta esperan a la animación del panel, no al click.

## 2026-09-26 · La intro corre en cada recarga
**Se eligió:** sin `sessionStorage`: cada carga completa de `/` sin hash la muestra.
**Por qué:** es el efecto "wow". Costo: LCP de ~2,5 s en desktop con intro.

## 2026-09-26 · Arte del hero precargado
**Se eligió:** capas de todos los slides montadas y decodificadas tras la carga; el cruce espera al arte (tope 300 ms); los videos se pausan, no se desmontan.

## 2026-09-26 · Pill sin paradas con clicks rápidos
**Se eligió:** un click nuevo cancela el lock anterior sin recalcular; el lock se suelta cuando el destino llega a su ancla.

## 2026-09-25 · 404 "Fuera del mapa"
**Se eligió:** concepto A de [SURA 404](https://claude.ai/artifact/6G4urUtxnPWsrbxDuLCAyW), en `app/not-found.tsx` con `SiteChrome`. Copy en `lib/data/not-found.ts`.
**Por qué:** excepción a "nunca sin frames", autorizada por el usuario.
**Se descartó:** B "Práctica de puntería" y C "Eliminado" (guardados en la propuesta); un catch-all `[...slug]` con `notFound()` (devuelve HTML vacío).

## 2026-09-25 · Sonido
**Se eligió:** [Sonido SURA](https://claude.ai/artifact/FtyLwp9kX6guF4FCEek39E): prendido por defecto, toggle en el header (T1), preferencia en `localStorage`, tecla M, hover sólo en lo accionable. Un listener delegado lee `data-sfx` y `data-sfx-hover` (`sfx-listener.tsx`). Señal de -80 dBFS para que Chrome no duerma la salida.
**Mudos a propósito:** chips y footer en hover, scroll-spy, barridos, conteos, perfil, odómetro, medallas obtenidas, el toggle.
**Se descartó:** Howler; pantalla de entrada para desbloquear el audio.

## 2026-09-25 · Íconos del menú por partes
**Se eligió:** opción D de [Sonido SURA](https://claude.ai/artifact/FtyLwp9kX6guF4FCEek39E): SVG inline (`nav-icon.tsx`) con la misma geometría de los assets, partidos por sus `M`.
**Por qué:** desvío consciente de "no redibujar assets", aceptado por el usuario.

## 2026-09-25 · Header y riel con captura propia en la persiana
**Se eligió:** `vt-header` / `vt-rail` les ponen `view-transition-name` sólo durante la transición: se funden al salir y aparecen cuando pasó el panel.
**Por qué:** React cancela la animación de la `root` nueva y el chrome nuevo se veía antes del panel.

## 2026-09-25 · Corchetes de mira y barrido de títulos
**Se eligió:** P1 B (corchetes que se dibujan en el hover de cards) y P2 C (barrido de luz en títulos de sección y H1 de ruta). Juegos no lleva corchetes.

## 2026-09-24 · Micro-animaciones HUD
**Se eligió:** siete de las nueve propuestas de [Movimiento SURA](https://claude.ai/artifact/EAcECZqs8TnnHvYWPFeZsP): decodificado de labels, barrido diagonal, subrayado que viaja, odómetro y "+50" de Reclamar, destello del podio e inclinación de medallas, luz de borde en banners, persiana entre rutas con View Transitions nativas.
**Por qué:** feedback de Ema. Desvío consciente de "sin animaciones"; cero librerías de motion.

## 2026-09-24 · PROJECT: Yi como slide default, con intro
**Se eligió:** slides Yi (default, con intro), Valorant, Fortnite, Black Ops 6. La intro oculta la interfaz hasta el golpe a 1,7 s; script inline en el `<head>` decide antes de pintar y la cancela a los 2 s si no arrancó. Video escalado con 4x-UltraSharp.
**Se descartó:** Modern Warfare III (se sacó para hacer lugar).
**Riesgo:** video de Riot; aceptado para compartir entre conocidos.

## 2026-09-24 · Hero de Valorant en video por capas
**Se eligió:** loop de 5 s armado sobre el arte original (pelo, orbe, máscara); se monta tras `load`, no con movimiento reducido ni `Save-Data`. Desktop con encuadre D1.
**Se descartó:** Veo y Kling (deforman la ilustración); mover pintura (sólo funciona mover luz).

## 2026-09-24 · Autoplay del hero apagado
**Se eligió:** `autoplayMs: null` en `lib/data/hero.ts`. El código sigue; vuelve con 3000.
**Por qué:** que siempre se vea el slide con video.

## 2026-09-24 · Lift unificado
**Se eligió:** cards y podios suben 2 px en 200 ms con `--ease-reveal`; al apretar, `scale-98`.

## 2026-09-23 · La URL no guarda la sección
**Se eligió:** todo lo que scrollea a una sección pasa por `SectionLink`: `href` real a `/#seccion`, pero `onNavigate` cancela y llama a `goTo`. La URL queda en `/`.
**Por qué:** la URL seguía diciendo Eventos aunque el usuario estuviera en otra sección. Sin JS y con Cmd+click el hash sigue funcionando.

## 2026-09-23 · Header mobile con vidrio al scrollear, en todas las rutas
**Se eligió:** blur de la bottom bar + `bg-background/60` al scrollear; mismo header en todas las rutas mobile. Desktop no cambia.

## 2026-09-23 · Filas del Home = puestos 04–08 de `/leaderboard`
**Se eligió:** derivadas de `standings`.
**Se descartó:** los cinco "NombreUsuario" iguales del Figma.

## 2026-09-23 · Assets a WebP a tamaño de uso
**Se eligió:** WebP al doble del tamaño en que se pintan, generados con `.rotate()`; `images.unoptimized: true`. Los originales se borraron (siguen en git).
**Se descartó:** un fade global para disimular la carga.

## 2026-09-23 · Preview al compartir
**Se eligió:** `opengraph-image.png`, `twitter-image.png` y `apple-icon.png` con el logo sobre `--color-background`. Favicon del sitio oficial (blanco).

## 2026-09-23 · Contadores del header en `font-techno`
**Se eligió:** racha y puntos en KH, como el pill del leaderboard.

## 2026-09-23 · Rutas de detalle detrás de un registro
**Se eligió:** `LIVE_DETAIL_ROUTES` en `lib/routes.ts`; `CardLink` renderiza `<div>` si la ruta está apagada. Hoy `tournaments`, `games` y `news` están encendidas.
**Por qué:** con el sitio público no se manda a nadie a una 404.

## 2026-09-23 · Sin over-scroll
**Se eligió:** `overscroll-behavior: none` en la página y `overscroll-x-none` en los scrollers horizontales. Se pierde el pull-to-refresh de Chrome Android.

## 2026-09-21 · H1 de ruta en Monument
**Se eligió:** el de `RouteShell` en todas las rutas, aunque `/leaderboard` y `/games` lo dibujen en TT Firs Neue.
**Por qué:** los tamaños coinciden; `RouteShell` salió de los dos frames del rediseño de ruta.

## 2026-09-21 · Controles compartidos entre rutas
**Se eligió:** `route-tabs`, `filter-chips`, `search-field` y `pagination` genéricos. Buscador con el ícono a la izquierda en todos los tamaños. Paginador compacto `‹ 1 / 5 ›` en mobile. En mobile, tabs y chips scrolleables en vez de `FILTRAR`.
**Se descartó:** un componente por pantalla; el `FILTRAR` (el panel que abriría no está diseñado).

## 2026-09-21 · `/games`: card adaptada, sin "Mini juego", sin hover verde
**Se eligió:** la card mobile es la de desktop adaptada; el bloque "Mini juego" del frame mobile no se maqueta (está oculto en desktop); la card mantiene el hover de elevación.
**Se descartó:** el hover del frame (glow verde + botón "Ver Juego"): el usuario descartó el verde en estas cards y la card ya es un link.

## 2026-09-21 · Leaderboard: data del frame desktop y degradés opacos
**Se eligió:** podio y tabla con la data desktop; SabooMafoo es "Héroe"; podio unificado en gap 8; las filas 1–3 con degradés opacos de cinco stops; hover de fila como velo.
**Por qué:** Figma interpola el alfa sin premultiplicar y CSS sí; en una tabla de 11 filas el crecimiento empujaría la página.

## 2026-09-21 · Banners en Monument
**Se eligió:** el título del banner de `/games` en `font-display`, caja de 530 como el del Home. Los dos banners son un solo destino (botón estirado).

## 2026-09-21 · Card de misión completada según el frame mobile
**Se eligió:** el nodo [`6008:29730`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=6008-29730&m=dev) en los dos tamaños. La destacada usa el tratamiento de desktop en mobile.
**Se descartó:** la barra de progreso del frame mobile (error de diseño confirmado).

## 2026-09-20 · Fuentes reales
**Se eligió:** Monument Extended y KH Interference vía `next/font/local`, traídas de `sura-clans`. Todo texto en `font-techno` lleva `uppercase`.
**Riesgo:** son versiones TRIAL; no sirven para producción.
**Se descartó:** Anybody, Tektur, Martian Mono; TT Firs Neue (se unificó en KH).

## 2026-09-20 · Comentarios sólo `TODO` y guardas
**Se eligió:** se borraron todos los comentarios explicativos; el porqué va a la documentación. Las guardas de una línea están listadas en las notas de arquitectura.

## 2026-09-20 · Recetas de hover
**Se eligió:** dos recetas con nombre, más el glow de link. *Elevación* para cards (sube 2 px, sombra negra, un escalón de gris, zoom 1.05, sin color); *crecimiento* para filas del Leaderboard; glow verde sólo en lo que ya es verde ("Ver todo", íconos del footer). El movimiento es la señal fuerte; el color acompaña.
**Se descartó:** glow verde en cards y nombre en verde en filas.

## 2026-09-20 · Seis cards en Eventos y Misiones
**Se eligió:** carrusel compartido `card-slider.tsx`, que mide el paso en vez de recibirlo. Las cards de ruta se miden en fracción de la columna.

## 2026-09-20 · Hero como carrusel
**Se eligió:** flechas que dan la vuelta; cruce real de dos capas en 500 ms `ease-in-out`.

## 2026-09-20 · `/tournaments`: UX del diseño viejo, UI nuestra
**Se eligió:** de [`407:10565`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=407-10565&m=dev) / [`407:11651`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=407-11651&m=dev) se toman la arquitectura de información y el flujo; nada de su UI. Fuera del Home el menú no marca nada.
**Se descartó:** traer el arte de trofeos del diseño viejo como banner.

## 2026-09-20 · Chrome de ruta interna
**Se eligió:** `RouteShell`, sacado de Misiones y Mi Perfil, que coinciden al píxel. Gutter mobile 16. Header sólido en desktop.

## 2026-09-20 · Scrollbar de la página oculta en desktop
**Se eligió:** se oculta la nativa. Desde el 2026-09-30 la reemplaza la scrollbar propia; en mobile vuelve la nativa estilizada.

## 2026-09-19 · Scroll-spy
**Se eligió:** `IntersectionObserver` como disparador y medición en el momento de decidir; franja al 40 % y gana la última; una sección posada en su ancla gana. Los ítems sin sección no mueven el pill.
**Se descartó:** listener de scroll; llevar la cuenta con un `Set`.

## 2026-09-19 · Medallas, Juegos y Footer mobile adaptados del desktop
**Se eligió:** adaptar sin frame; separación entre secciones mobile de 40. Sura News y Misiones mobile usan la card de desktop.
**Por qué:** pedido del usuario; desvío acotado de "nunca sin los dos frames".

## 2026-09-19 · Strokes de medio píxel hacia arriba
**Se eligió:** los bordes de 0,5 se redondean al entero de arriba y van como `border`.
**Por qué:** Chrome trunca `border-width` a enteros.

## 2026-09-19 · Fondo `#202020`
**Se eligió:** `--color-background` medido en los frames compuestos.
**Se descartó:** el `#0C0C0C` de la variable `Sura/Negro` (diseño viejo).

## 2026-09-19 · Rutas del live descartadas
**Se eligió:** no hacer `/levels`, `/achievements`, `/store`, `/wallet` y subrutas, `/faq`, `/privacy-policy`. `/about` es externo (sitio de marketing).
**Por qué:** sin sección ni entrada en el Home, o fuera del alcance visual. Auth fuera de scope: no se replica `(protected)`.

## 2026-09-18 · Dos breakpoints, permanente
**Se eligió:** sólo mobile y desktop; los breakpoints de Tailwind deshabilitados y `desktop:` como único prefijo. Tablet fuera de scope.

## 2026-09-18 · El menú scrollea a secciones, no rutea
**Se eligió:** anchors contra `<section id>` del Home. Seis ítems: Home, Eventos, Leaderboard, Misiones, Sura News, Juegos, en ese orden (no el del Figma).
**Se descartó:** Niveles (sin sección en el Home).

## 2026-09-18 · Pill que viaja
**Se eligió:** una sola capa que se mueve con `transform` y `--nav-index`, 250 ms `ease-in-out`, compartida entre los dos menús.
**Por qué:** desvío consciente de "sin animaciones", pedido del usuario.

## 2026-09-18 · Bottom bar del Figma con nuestros ítems
**Se eligió:** la caja de [`3567:92009`](https://www.figma.com/design/uuh0qonxt0qkmKJku7jSUd/Sura-Gaming-UX-UI--Copy-?node-id=3567-92009&m=dev) con las seis secciones y el pill verde de desktop (48 × 48). Íconos en su tamaño nativo para igualar la tinta.
**Se descartó:** los cinco destinos de app y el botón circular de 70 que sobresale; riel lateral en mobile.

## 2026-09-18 · Tooltip y hover del menú desktop
**Se eligió:** tooltip copiado del live (`app.suragaming.com`), sin flecha, con shadcn; hover del ícono a `--color-brand`. Texto en español.
**Por qué:** el Figma no define hover; el live es la única referencia para ese elemento.

## 2026-09-18 · Header fijo
**Se eligió:** fijo y siempre visible, casi transparente sobre el hero.

## 2026-09-18 · "Eventos" en los dos tamaños
**Se eligió:** "Eventos" y ancla `#eventos`, aunque desktop diga "Torneos".

## 2026-09-18 · Política de normalización
**Se eligió:** si un valor cae a ≤ 2 px de un token existente, se usa el token; si no, entero (o `.5`) y token nuevo. Tracking en `em`. Cards hermanas se unifican a la primera. Anchos de hijos con `flex-1` / `grid`.
