# SURA Gaming — clon

Clon pixel-perfect de la UI de [SURA Gaming](https://app.suragaming.com), el ecosistema gaming de Sura GG Corp., maquetado desde el rediseño en Figma. La UI está terminada (Fase 1). La Fase 2 reemplaza la data hardcodeada de `lib/data/` por Supabase sin cambiar la interfaz.

Producción: **[sura.elpepo.dev](https://sura.elpepo.dev)**

## Stack

- Next.js 16 (App Router, Turbopack) y React 19
- TypeScript estricto
- Tailwind CSS v4, con todos los tokens en `app/globals.css`
- shadcn/ui sobre Base UI
- Lenis para el scroll suave en desktop
- Web Audio para los efectos y la música
- Playwright para las capturas de verificación

## Correrlo

```bash
npm install
npm run dev -- -p 3100   # http://localhost:3100
npm run verify           # typecheck + lint + build
npm run visual           # regresión visual contra la referencia de la Fase 1
BASE_URL=http://localhost:3100 npm run shot -- /   # capturas 390 y 1440 en screenshots/
```

## Dónde está cada cosa

```
app/                  rutas, layout raíz y tokens (globals.css)
components/ui/        primitives de shadcn re-estilados
components/layout/    header, menús, footer, navegación y sonido
components/sections/  secciones y componentes de pantalla
lib/                  hooks, motor de sonido y helpers
lib/data/             data tipada, un archivo por dominio
public/assets/        assets exportados del diseño
tests/visual/         regresión visual
docs/                 documentación
```

- [`AGENTS.md`](./AGENTS.md): reglas de trabajo para agentes y personas.
- [`docs/`](./docs): proyecto, roadmap, decisiones, trampas conocidas, sistema de diseño y la feature en curso. El PRD de la Fase 1 quedó archivado en `docs/archive/`.
- `/styleguide`: referencia visual del design system.
