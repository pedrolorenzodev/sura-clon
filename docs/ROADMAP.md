# Roadmap

## Estado actual

> Se sobrescribe al terminar cada sesión. Máximo 15 líneas.

**2026-10-08.** La Fase 1 (UI) está cerrada: la UI congelada es la de `f447a97`, y el sistema de docs, los hooks y la regresión visual entran en el commit siguiente. El PRD pasó a `docs/archive/PRD-fase1.md`, `AGENTS.md` quedó corto y las reglas de UI viven en `.claude/rules/ui.md`. Quedaron activos los hooks de `.claude/settings.json` (git y archivos congelados) y `npm run visual`, con la referencia de la Fase 1 capturada en esta máquina (no viaja en git: ver GOTCHAS para rehacerla).
La Fase 2 no empezó: no hay proyecto de Supabase ni dependencias instaladas.
**Siguiente paso:** resolver con el usuario las cinco decisiones abiertas de `docs/features/supabase.md` (provisión, dónde se lee, materializar, cache, escrituras) y arrancar por el bloque 0 (infra).

## Ahora

1. **Fase 2 · Supabase**: `docs/features/supabase.md`.
   - [ ] 0 · Infra
   - [ ] 1 · Juegos
   - [ ] 2 · Noticias
   - [ ] 3 · Leaderboard y usuario
   - [ ] 4 · Torneos
   - [ ] 5 · Misiones
   - [ ] 6 · Lo que queda
   - [ ] 7 · Cierre

## Próximo

- **Fase D del feedback de Ema** (barrido de lo inerte): "Jugar ahora" del detalle de juego, "Sociales" del detalle de juego y los links, redes y badges del footer. A cada uno: un destino, una acción, o dejar de parecer clickeable. Toca UI: necesita autorización y, si no está definido, propuesta con demos.
- **Probar sonido, música y volumen en Safari (macOS e iOS) y Firefox reales.** Hasta hoy, sólo Chromium y los builds de Playwright; el respaldo AAC para Safari viejo nunca se ejercitó.

## Después

- **Accesibilidad de toda la UI**, de una pasada (diferida por el usuario el 2026-09-25): estados que sólo se comunican por color (una medalla bloqueada se anuncia igual que una obtenida), orden de foco, contraste y el indicador de "hay más abajo" sin barra de scroll nativa.
- **Si el sitio se publica más allá de conocidos:** reemplazar o licenciar el arte de juegos de terceros, la música y los dos sonidos de Riot, y las fuentes TRIAL (Monument Extended, KH Interference).
- **Deuda de comportamiento conocida y aceptada:** nada suena antes del primer gesto (política de autoplay) · con auriculares Bluetooth baratos el primer sonido tras un rato puede perderse · el zoom del navegador rinde menos entre 768 y 1099 · sin JS o en Firefox < 126 el tramo 768–1099 no se escala · un iPad en ese tramo baja los videos de desktop · volver con el navegador *hacia* una 404 recarga el documento · entrar a la 404 navegando remonta el chrome · a 320 px el nombre del usuario desaparece en las rutas internas · en mobile la intro ocupa sólo la franja del hero · la racha diaria casi no ordena · "Tu posición" no te inserta en la tabla cuando caés en el top 10 · la columna de ruta estira arriba de 1440 (no hay frame ancho) · `text-box-trim` cuando entre a Tailwind (las cards de News miden 10 px más que el Figma).
- **Preguntas pendientes para diseño** (detalle en `docs/archive/PRD-fase1.md`, tabla *Deuda de diseño abierta*): grilla del Home (1144/148) contra la de las rutas (40/40) · H1 de `/leaderboard` y `/games` en TT Firs Neue según el frame contra Monument de `RouteShell` · lado del ícono del buscador · caja del banner de `/games` (530 contra 486) · card de `/games` mobile adaptada de desktop · bloque "Mini juego" de `/games` mobile no maquetado · hover de la card de `/games` del diseño no implementado · data contradictoria del Figma (nivel de SabooMafoo, "Racha de 0 días", podios distintos por tamaño, títulos mobile que dicen "eventos") · verde de marca sin publicar como variable y verde legacy en bordes · badge "¡Novedad!" con dos colores de texto · ícono "info" vacío en títulos mobile · barra de progreso de Misiones del frame mobile · card de misión que describe en dos colores · slider del hero apartado del Figma en desktop · sin arte de hero propio por juego · Eventos sin filtros · footer sin destinos · badges de tienda compuestos en código · favicon blanco · restos sueltos en frames de Eventos y Juegos.
- **Orden menor:** `search.svg` vive en `public/assets/tournaments/` aunque lo usan tres rutas.

## Hecho

- 2026-10-08 · Sistema de docs nuevo, hooks de guarda y regresión visual.
- 2026-10-05 · Dominio `sura.elpepo.dev`.
- 2026-10-01 · Code-review pre-demo, Paisanos en el leaderboard, volúmenes, sin chip de la intro, scroll más ágil, bottom bar al ancho del contenido, carruseles de a una card.
- 2026-09-30 · Música de fondo, paleta LoL, volumen de la música, smooth scroll y scrollbar propia, link de volver en los detalles, 404 "Sin señal" con sonido, persiana con atrás y adelante.
- 2026-09-28/29 · Feedback de Ema: colecciones reales con estado en la URL y reacomodo FLIP, modal de jugador, Mi Perfil editable, detalle de misión, detalle de juego, detalle de evento, Sura News, filtros de `/games`, catálogo sin repetidos.
- 2026-09-25/27 · Sonido e íconos del menú, breakpoint 768 con el desktop escalado, mobile fluido, 404 "Fuera del mapa".
- 2026-09-24 · Micro-animaciones HUD, hero en video, intro de PROJECT: Yi.
- 2026-09-20/23 · `/tournaments`, `/missions`, `/leaderboard` y `/games`; fuentes reales; assets a WebP; preview al compartir.
- 2026-09-18/20 · Design System y Home completo.
