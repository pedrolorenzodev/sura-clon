---
paths:
  - "app/**"
  - "components/**"
  - "lib/**"
  - "public/**"
---

# UI congelada (desde el 2026-10-07)

Estás tocando un archivo de la app. La Fase 1 está cerrada y aprobada pixel-perfect: **nada de lo que se ve o se siente cambia en la Fase 2**.

- Si el archivo está en `.claude/hooks/frozen-paths.txt`, no se edita: el hook lo bloquea. Si de verdad hace falta, se frena y se le pregunta al usuario, que es el único que saca rutas de esa lista.
- Si no está en la lista, es un consumidor de data: se cambia **sólo** de dónde sale el dato (import → prop, query en el server, tipo de `lib/supabase/`). Prohibido tocar markup, `className`, textos, handlers, hooks de animación o de sonido, atributos `data-sfx`, orden de los elementos y `key`s.
- Patrón por defecto: la `page.tsx` (server) hace el query y pasa la data por props; un server component puede volverse `async`; un client component recibe props y sigue filtrando en memoria con `useUrlState`. No usar `useSearchParams` (obliga a `Suspense` y cambia el HTML del server). Las trampas de datos están en `docs/GOTCHAS.md`, sección *Fase 2: datos*.
- El `git diff` de cada componente tocado tiene que leerse como plomería: imports, props, tipos, `async`/`await`. Nada más.
- Verificación obligatoria: `npm run visual` idéntico al píxel. Un diff es un bug.

## Reglas de UI (rigen sólo si el usuario autoriza una excepción)

- Cero valores de estilo hardcodeados: todo sale de los tokens de `@theme` en `app/globals.css`. Un token nuevo se agrega ahí, se cataloga en `lib/data/design-tokens.ts` (si no, no aparece en `/styleguide`) y se anota en `docs/DECISIONS.md`.
- Tailwind en el `className` del elemento, siempre. Prohibido `style={{}}`, CSS Modules, `<style>` y `@apply` en archivos aparte. Única excepción: un valor calculado en runtime, pasado como custom property (`style={{ "--row-h": … }}` con `h-[var(--row-h)]`).
- Dos breakpoints y nada más: la base es mobile y `desktop:` (768px) el override. `sm:`, `md:`, `lg:`, `xl:` no existen. Mobile-first.
- Primitives de shadcn (estilo `base-nova`, sobre **Base UI**: los triggers usan la prop `render`, no `asChild`), re-estilados con nuestros tokens. Markup crudo sólo si no hay uno adecuado.
- Hover siempre en pareja con `focus-visible:` y con `motion-reduce:transition-none`. Las recetas (elevación, crecimiento, glow de link, corchetes) están en `docs/DESIGN.md`. Sin librerías de motion.
- Todo texto en `font-techno` lleva `uppercase`. Ninguna constante de estilo se exporta desde un módulo `"use client"`. Ninguna utility propia empieza con un prefijo que tailwind-merge conozca (`fill-`, `text-`, `bg-`, `border-`, `shadow-`).
- Assets: los del diseño, en `public/assets/<pantalla>/`, nunca redibujados, inline-ados ni sustituidos; cualquier derivado se genera con `.rotate()` (orientación EXIF).
- Maquetado desde Figma: nunca sin los dos links (desktop y mobile); pedir el screenshot en la misma llamada a `get_design_context` (y cargar la skill de Figma, si está instalada); el MCP devuelve CSS absoluto y aplana degradés: se traduce a flex/grid y se mide el render.
