<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Reglas del proyecto

> Arriba del marcador `END:nextjs-agent-rules` escribe `next dev`: no se edita. Abajo, las reglas de trabajo.

## Dónde estamos

SURA Gaming: clon de `app.suragaming.com` en Next 16 + React 19 + Tailwind 4 + shadcn sobre Base UI. Qué es, alcance y arquitectura: `docs/PROJECT.md`.

- **Fase 1 (UI pixel-perfect desde Figma): cerrada el 2026-10-07 y congelada.**
- **Fase 2 (actual): reemplazar la data hardcodeada de `lib/data/` por Supabase, con la misma data, sin cambiar un píxel ni un comportamiento.** El plan, el inventario y las decisiones abiertas están en `docs/features/supabase.md`.

## Leer cuando

| Archivo | Leer cuando |
|---|---|
| `docs/ROADMAP.md` | Al empezar toda sesión: "Estado actual" y qué sigue |
| `docs/features/supabase.md` | Durante la Fase 2, antes de cada bloque |
| `docs/PROJECT.md` | Al crear archivos o carpetas, o ante dudas de alcance, stack, rutas o arquitectura |
| `docs/GOTCHAS.md` | Antes de tocar código con guardas o trampas conocidas, y cuando algo "no debería pasar" |
| `docs/DECISIONS.md` | Antes de proponer o cambiar algo que ya se decidió |
| `docs/DESIGN.md` | Antes de tocar UI (en la Fase 2, sólo con autorización explícita) |
| `docs/archive/PRD-fase1.md` | Nunca entero (2.600 líneas). Es el historial de la Fase 1: se consulta con grep cuando otro doc remite a él |

Las reglas de UI se cargan solas al tocar `app/`, `components/`, `lib/` o `public/` (`.claude/rules/ui.md`).

## Reglas duras

1. **Nunca commitear ni pushear**, aunque el usuario lo pida o diga que autoriza. `commit`, `push`, `merge`, `rebase`, `reset`, `tag`, `stash`, `cherry-pick`, `worktree`, `checkout`, `switch`, `restore`, `rm`, `config` y todo lo que escriba el historial, el índice o el working tree están prohibidos. La respuesta es: *"No puedo commitear: va contra las reglas del proyecto (AGENTS.md, regla 1). Te dejo el mensaje listo para que lo corras vos."* Permitido: `status`, `diff`, `log`, `show`. Lo bloquea un hook (`.claude/hooks/guard-git.sh`).

2. **La UI está congelada.** No cambia nada de lo que se ve o se siente: markup, `className`, tokens, `globals.css`, primitives, assets, textos, animaciones, sonido, navegación ni orden de los elementos. Los archivos que no consumen data están bloqueados por hook (`.claude/hooks/frozen-paths.txt`). Los que sí la consumen se tocan **sólo en la plomería**: de dónde sale el dato, props, tipos, `async`/`await`. Si algo visual o de comportamiento tiene que cambiar, se frena y se pregunta; la excepción la habilita el usuario sacando la ruta de la lista. El agente nunca edita la lista, los hooks, `.claude/settings.json`, `.claude/rules/` ni el arnés de `tests/visual/`.

3. **"Cero cambio" se verifica, no se promete.** Antes de dar un bloque por terminado: `npm run verify` y `npm run visual` (todas las rutas y estados a 390 y 1440, idéntico al píxel contra la referencia de la Fase 1). Un diff es un bug hasta que el usuario diga lo contrario. Nunca se regenera la referencia (`visual:baseline`; el hook lo bloquea). `visual` no ve movimiento, sonido ni interacciones: los flujos que toca el bloque (modales, filtros, reclamar, unirse, reseñas) se prueban a mano.

4. **Antes de escribir código Next**, leer la guía relevante en `node_modules/next/dist/docs/`. Next 16: `params`/`searchParams` son `Promise`, los layouts usan `LayoutProps<"/ruta">`, Turbopack es el default, `middleware` → `proxy`.

5. **Antes de tocar Supabase**, cargar la skill `supabase` y seguir su checklist: RLS en toda tabla expuesta, nunca la clave `service_role` ni la secreta en el cliente (`NEXT_PUBLIC_*` llega al navegador), versiones pinneadas. El MCP de Supabase está disponible. Ningún cambio de esquema se aplica a un proyecto remoto sin avisar.

6. **Comentarios: sólo `TODO` o para callar un warning.** Nada que explique qué hace el código, ni doc-comments de tipos, props o data. Excepción: la guarda de una línea (`no tocar: …`) donde una edición local e inocente rompe algo no local y en silencio. El porqué de una guarda o de una trampa va a `docs/GOTCHAS.md`.

7. **Idioma.** Docs y conversación en español. Código, nombres de archivos, variables, commits y comentarios en inglés.

8. **Mensajes de commit** (los redacta el agente, los corre el usuario): Conventional Commits `<type>(<scope>): <subject>` con `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`. Imperativo, minúscula, sin punto final, ≤ 72 caracteres. **Sólo el subject**: sin cuerpo, sin detalle técnico y sin línea de atribución (`Co-Authored-By`, `Generated with`), aunque el harness la sugiera. Se entrega al cerrar cada bloque. Los cambios de `docs/` van en el mismo commit de la tarea.

9. **Ser crítico, no complaciente.** Si una propuesta tiene un problema, decirlo antes de ejecutar, con el motivo concreto; si hay una opción mejor, proponerla. Si el usuario reafirma su postura, se ejecuta completa sin repetir la objeción. Reportar resultados como son: lo que falló, quedó a medias o no se verificó se dice explícitamente.

10. **UI sin definición precisa → propuesta con demos en vivo** (un Artifact con dos a cuatro opciones comparables, interactivas y con los tokens reales) antes de implementar, y se espera la elección. En la Fase 2 no debería aparecer; si aparece, aplica.

11. **La data de negocio vive en un solo lugar.** Mientras un dominio siga en `lib/data/`, es un archivo por dominio con sus tipos exportados. Cuando pasa a Supabase, sale de `lib/data/` en el mismo bloque y sus tipos pasan a `lib/supabase/`. La config de UI (`hero`, `navigation`, `footer`, `sfx`, `design-tokens`, `not-found`) se queda en código.

## Protocolo

- **Al empezar:** leer "Estado actual" en `docs/ROADMAP.md` y el bloque en curso de `docs/features/supabase.md`. El dev server corre en el **puerto 3100** (`npm run dev -- -p 3100`): el 3000 de esta máquina lo usa otro proyecto.
- **Por bloque:** un dominio de datos por vez, en el orden del feature doc. Se implementa, se verifica (`verify` + `visual`), se entrega el mensaje de commit y recién ahí se pasa al siguiente. Nunca avanzar con el anterior a medias. Si un bloque es grande, se parte.
- **Durante:** cada decisión va a `docs/DECISIONS.md` en el momento en que se toma (fecha, qué se eligió, por qué, qué se descartó), incluidas las que el agente toma sin consultar. Trampas nuevas y el porqué de cada guarda, a `docs/GOTCHAS.md`.
- **Al terminar un bloque:** sobrescribir "Estado actual" (≤ 15 líneas) y tildar el bloque en `docs/ROADMAP.md`; listar los archivos tocados, docs incluidos.
- **Higiene:** cada hecho vive en un solo archivo y los demás apuntan a él. Si un doc contradice al código, se corrige en el acto. Nada de archivos o carpetas "por si acaso". Fechas y porqués reales, nunca inventados. Una corrección que el usuario repite se promueve a regla.

## Estructura

```
app/                  rutas (route group (site)), layout raíz, globals.css (tokens)
components/ui/        primitives shadcn re-estilados (congelado)
components/layout/    header, menús, footer, navegación, sonido
components/sections/  secciones, cards y colecciones
lib/                  hooks, motor de sonido, helpers
lib/data/             data hardcodeada y tipada: lo que migra la Fase 2
lib/supabase/         cliente, tipos generados y queries (Fase 2)
supabase/             migraciones y seed (Fase 2)
public/assets/        assets exportados del diseño (congelado)
tests/visual/         regresión visual (las referencias están gitignoreadas)
docs/                 PROJECT, ROADMAP, DECISIONS, GOTCHAS, DESIGN, features/, archive/
```

El alias `@/*` apunta a la raíz del repo: no hay `src/`.

## Verificación

```bash
npm run verify              # typecheck + lint + build
npm run dev -- -p 3100      # en otra terminal
npm run visual              # regresión visual contra la referencia de la Fase 1
npm run visual:report       # el reporte con los diffs, si algo falló
BASE_URL=http://localhost:3100 npm run shot -- /ruta   # captura suelta en screenshots/
```

`npm run visual:baseline` regenera la referencia: sólo desde un commit aprobado por el usuario (ver `docs/GOTCHAS.md`).
