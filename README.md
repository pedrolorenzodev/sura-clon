# SURA Gaming — clon

Clon pixel-perfect de la UI de [SURA Gaming](https://app.suragaming.com), el ecosistema gaming de Sura GG Corp., maquetado desde el rediseño en Figma. Es sólo frontend: la data está hardcodeada en `lib/data/` y la búsqueda, los filtros y la paginación se resuelven en memoria.

Producción: **[sura-demo.com](https://sura-demo.com)**

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
npm run dev       # http://localhost:3000
npm run verify    # typecheck + lint + build
npm run shot -- / # capturas mobile (390) y desktop (1440) en screenshots/
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
```

- [`AGENTS.md`](./AGENTS.md): reglas de trabajo del proyecto.
- [`PRD.md`](./PRD.md): las decisiones de diseño y de implementación, pantalla por pantalla.
- `/styleguide`: referencia visual del design system.
