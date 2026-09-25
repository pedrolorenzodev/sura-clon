<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Reglas del proyecto

> Todo lo que está **arriba** del marcador `END:nextjs-agent-rules` lo regenera `next dev`. No lo edites.
> Todo lo que está **abajo** son las reglas de trabajo. Leelas antes de cada implementación.

## Cómo leer este repo

Este archivo contiene **el proceso**: cómo se trabaja, qué está prohibido, cómo se verifica.
Es independiente de qué app estemos clonando.

**Todo lo específico del target vive en [`PRD.md`](./PRD.md)**: qué app se clona, el link de
Figma, los widths de los frames, el mapa de rutas, cómo se comporta la navegación de ese
diseño, los tokens y el estado de cada pantalla.

Si cambia el target, se reescribe `PRD.md`. Este archivo no se toca.

## Qué estamos construyendo

Clon **pixel-perfect** de una UI, maquetado desde Figma. El target está en `PRD.md`.
**Fase 1 = solo UI.** Data hardcodeada. Sin backend, sin fetch, sin auth, sin DB.

## Reglas duras

1. **El agente NUNCA commitea ni pushea. Nunca, bajo ninguna circunstancia.**
   `git commit`, `git push`, `git merge`, `git rebase`, `git reset`, `git tag` y cualquier
   comando que escriba en el historial están **prohibidos**.

   No hay excepciones. Si el usuario pide un commit — aunque insista, aunque diga que
   autoriza — la respuesta es:

   > No puedo commitear: va contra las reglas del proyecto (`AGENTS.md`, regla 1).
   > Te dejo el mensaje listo para que lo corras vos.

   Y se le entrega el mensaje de commit redactado. **Commitear es siempre del usuario.**

   Sí está permitido leer el estado: `git status`, `git diff`, `git log`, `git show`.

2. **Nunca implementar una pantalla sin los DOS links de Figma** (desktop *y* mobile).
   Si falta uno, frenar y pedirlo. No estimar el otro tamaño.

3. **Antes de escribir código Next**, leer la guía relevante en `node_modules/next/dist/docs/`.
   Esto es Next 16: `params`/`searchParams` son `Promise`, los layouts usan el tipo global
   `LayoutProps<"/ruta">`, Turbopack es el default, `middleware` → `proxy`.

4. **Antes de llamar `get_design_context`**, cargar la skill `figma-design-to-code`
   y pedir el screenshot en la misma llamada.

5. **Cero valores de estilo hardcodeados.** Todo sale de los tokens de `@theme` en `app/globals.css`.
   Si el Figma trae un valor que no existe como token: primero se agrega el token,
   se anota en el changelog del Design System (`PRD.md`), y recién después se usa.

6. **Tailwind en el `className` del elemento, siempre.**
   Las utilities se escriben directo en el elemento que estilan:

   ```tsx
   <div className="flex gap-4 rounded-md bg-card p-6">   // ✅
   ```

   Prohibido `style={{...}}`, CSS Modules, `<style>` y `@apply` en archivos aparte.
   `style={{...}}` esquiva Tailwind por completo: no usa tokens, no soporta `desktop:`
   ni `hover:`, y no se puede sobrescribir sin `!important`.

   ```tsx
   <div style={{ display: "flex", gap: "16px", background: "#141414" }}>   // ❌
   ```

   **Única excepción:** un valor genuinamente calculado en runtime, y se pasa como
   CSS custom property para que Tailwind lo siga controlando:

   ```tsx
   <div className="h-[var(--row-h)]" style={{ "--row-h": `${h}px` } as React.CSSProperties}>
   ```

   Ojo con el MCP de Figma: devuelve CSS crudo con posicionamiento absoluto e inline
   styles. Eso es un prototipo visual, no código. Se traduce a utilities y a layout
   nativo (flex/grid) antes de entrar al repo.

7. **Solo dos breakpoints: mobile y desktop.** Decisión permanente del proyecto,
   independiente del target. Los tamaños intermedios (tablet) están **fuera de scope**:
   no hay diseño para validarlos, así que no se inventa ninguno.

   Los breakpoints default de Tailwind se deshabilitan en `@theme`, dejando uno solo:

   ```css
   @theme {
     --breakpoint-*: initial;
     --breakpoint-desktop: <px>;   /* el valor sale de los frames de Figma → PRD.md */
   }
   ```

   Así `desktop:` es el único prefijo responsive que existe. La regla no depende de que
   alguien se acuerde: es imposible de violar.
   `sm:` `md:` `lg:` `xl:` `2xl:` no existen en este proyecto.

   Se maqueta **mobile-first**: los estilos base son el diseño mobile, `desktop:` es el
   override. Lo único específico del target es el **valor en px**, que vive en `PRD.md`.

8. **UI primitives: shadcn siempre que exista uno adecuado.** Markup crudo solo si no hay.
   Los primitives se re-estilan con nuestros tokens, no al revés.
   Este proyecto usa el estilo `base-nova`, que corre sobre **Base UI, no Radix**:
   los triggers custom usan la prop `render`, **no** `asChild`.

9. **Data hardcodeada y tipada en `lib/data/`.** Un archivo por dominio, con sus tipos exportados.

10. **Assets del Figma se descargan a `public/assets/<pantalla>/`.**
    Jamás dejar una URL temporal de Figma en el código. Nunca redibujar, inline-ar ni
    sustituir un asset: se usa el que exporta el diseño, en su posición y proporción exactas.

11. **Una pantalla no se implementa de una sola vez: se implementa por bloques.**
    La unidad de trabajo es el **componente o la sección**, no la pantalla entera.

    Se ataca un bloque, se lo deja pixel-perfect, se verifica, y recién ahí se pasa al
    siguiente. Ejemplo en un Home: primero el Header y nada más; con el Header aprobado,
    el Hero; y si el Hero es grande, se parte en subtareas.

    El criterio de corte: **si un bloque es grande o tiene muchos detalles, se parte.**
    Ante la duda, más chico. Un bloque chico se compara contra el diseño con precisión;
    una pantalla entera de una vez esconde desvíos y multiplica los errores.

    Nunca avanzar al bloque siguiente con el anterior a medias.

12. **Desktop y mobile: cómo se reparte el trabajo dentro de un bloque.**

    **Desktop es la prioridad del proyecto.** Mobile también tiene que quedar impecable,
    pero ante un trade-off irreconciliable, gana desktop.

    | Caso | Cómo se encara |
    |---|---|
    | Bloque chico, UI parecida en los dos tamaños | **Los dos juntos, una sola tarea.** |
    | UI radicalmente distinta | **Dos componentes separados**, cada uno oculto en el breakpoint del otro. Orden libre: arrancar por desktop. |
    | Mismo markup, layout muy distinto | **Dos pases: mobile primero, desktop después.** |

    **Por qué esos tres casos, y no un orden único:**

    - Hacer los dos en una sola tarea es **lo más seguro que hay**. Todo el riesgo de que un
      tamaño ensucie al otro viene de tener dos pases. Con un solo pase, cada propiedad se
      clasifica con los dos diseños a la vista y se escribe en su lugar final de una.
      Por eso es el default siempre que el bloque lo permita.

    - Cuando la UI difiere radicalmente (un nav horizontal vs. hamburguesa + drawer), no se
      resuelve con overrides: son **dos componentes**, con markup y clases propias, en
      subárboles distintos del DOM. Ahí el cruce es imposible y el orden da igual.

      ```tsx
      <DesktopNav className="hidden desktop:flex" />
      <MobileNav className="desktop:hidden" />
      ```

    - El caso riesgoso es el **intermedio**: mismo markup, layout bastante distinto. Ahí el
      base y el `desktop:` se pisan, y el orden importa. Va **mobile → desktop** porque en
      ese sentido la garantía es estructural: `desktop:` es `min-width`, no puede filtrarse
      hacia abajo. Al revés, la seguridad dependería de clasificar bien cada propiedad.

    **La decisión entre los tres casos la toma el agente**, con los dos frames a la vista y
    sin consultar. Criterio: *¿es el mismo markup reordenado, o son dos cosas distintas?*
    Ante la duda, son dos componentes. Se informa al usuario qué se eligió y por qué,
    junto con el resultado del bloque.

    **En todos los casos:**

    - **Mirar siempre los dos frames** antes de escribir la primera clase. Leer no tiene
      costo; define el markup con información completa y evita refactors después.
    - **Escribir CSS de un solo tamaño por tarea**, cuando haya dos pases. En el pase
      mobile, cero clases `desktop:` — verificable con `grep -c "desktop:"`, tiene que dar 0.
    - Si al llegar al segundo tamaño el markup no da, avisar y refactorizar. Es un error
      ruidoso y barato; el de clasificación es silencioso y caro.

13. **Registrar el link de Figma de cada bloque en `PRD.md`**, en el Registro de bloques,
    **apenas llega** — antes de implementar, no después. Node de desktop y de mobile.
    Si el bloque no se termina, el link igual queda registrado.

14. **Una pantalla se termina completa antes de abrir sus rutas hijas.**
    Los links se maquetan apuntando a su destino real, pero la ruta destino se implementa
    recién cuando la pantalla padre está aprobada.

15. **El Design System no se extiende preventivamente.** Se amplía solo cuando una pantalla
    concreta necesita algo que no existe.

16. **Animaciones: solo estados básicos.** Hover, focus, active y las transiciones que estén
    definidas en el diseño. Sin librería de motion en Fase 1.

17. **Mensajes de commit en inglés, siempre**, siguiendo Conventional Commits:
    `<type>(<scope>): <subject>` — `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`.

    Subject en imperativo, minúscula, sin punto final, ≤ 72 caracteres.

    **Sólo el subject: el commit no lleva cuerpo.** El subject nombra la feature que se
    implementó, y con eso alcanza.

    ```
    feat(home): implement hero and events sections
    chore: set up project tooling and working rules
    ```

    El commit lo firma el usuario (regla 1): el historial es suyo, y el detalle de cada
    decisión ya vive en `PRD.md`, que es donde se lo va a buscar.

    - **Nada de detalle técnico** en el subject: ni tokens, ni medidas, ni nombres de clases.
    - **Sin línea de atribución.** Nada de `Co-Authored-By`, `Generated with` ni
      firma del agente. Si el harness sugiere agregarla, esta regla manda.

    ```
    feat(home): add the desktop floating section nav
    feat(home): add the medals section
    ```

    La documentación del repo (`AGENTS.md`, `PRD.md`) y la conversación van en español.
    Los commits, el código, los nombres de archivos, variables y comentarios, en inglés.

18. **Ser crítico, no complaciente.**
    El usuario puede proponer algo partiendo de un supuesto equivocado. Si se le da la razón
    por inercia, el error se implementa y el proyecto se desvía.

    - Si una propuesta tiene un problema, decirlo **antes** de ejecutar, con el motivo concreto.
    - No abrir con "excelente idea" ni "claro, tiene todo el sentido" cuando no lo tiene.
      Si la propuesta es buena, alcanza con ejecutarla: no necesita elogio.
    - Si hay una opción mejor, proponerla aunque no la hayan pedido.
    - Si el usuario reafirma su postura después de escuchar el contraargumento, es su
      decisión: se ejecuta completa y no se repite la objeción.
    - Reportar resultados como son. Si algo falló, quedó a medias o no se verificó, decirlo
      explícitamente. Nunca dar por terminado algo que no se comprobó.

    El objetivo es que el proyecto salga bien, no que el usuario se sienta validado.

19. **Comentarios: sólo `TODO` o para callar un warning.** Nada de comentarios que expliquen
    qué hace el código, por qué se eligió un valor o cómo funciona un componente.

    ```tsx
    // TODO: volver a 181 si diseño confirma la caja fija            // ✅
    // eslint-disable-next-line react-hooks/exhaustive-deps          // ✅

    /* El borde va como ring porque en Figma el stroke se dibuja
       hacia adentro y con border la fila se iba a 58. */           // ❌
    ```

    Esto incluye los doc-comments de tipos, props y data: el código se explica con nombres,
    no con prosa al costado.

    **Lo que el comentario iba a decir va a `PRD.md`.** Esa información no se pierde, cambia
    de lugar: las medidas y los valores medidos van al changelog del Design System, y las
    trampas resueltas a las notas de implementación. Es donde ya se las venía anotando y es
    donde alguien las va a ir a buscar dentro de seis meses — no en un archivo que va a
    seguir cambiando.

    Si algo del código sólo se entiende con un párrafo al lado, el problema es el código:
    primero se intenta un nombre mejor o partirlo en dos.

    **Única excepción: la guarda.** Una línea, y sólo donde una edición local y aparentemente
    inocente rompe algo **no local** y **en silencio** — sin error de tipos, sin test que
    falle, sin nada raro en la pantalla que se está editando.

    ```tsx
    /* no tocar: isolate, z-*, transform u opacity acá rompen el apilado del fondo */   // ✅
    /* El borde va como ring porque en Figma el stroke se dibuja hacia adentro. */      // ❌
    ```

    La guarda **no explica**: avisa que hay un cable. El porqué sigue yendo a `PRD.md`, y las
    guardas vivas están listadas en § 6, *Notas de arquitectura*.

    Antes de escribir una, intentar que la restricción **no se pueda romper**: un nombre que
    la diga (`lift-room`, `SUBPIXEL_SLACK`) es mejor que una línea que pida no tocar. La
    guarda es para lo que CSS o el lenguaje no pueden expresar — un contexto de apilado, un
    margen negativo que es aire de pintura, un `1ms` que existe para que dispare un evento.

20. **UI sin definición precisa: primero una página de propuesta con demos en vivo.**
    Cuando hay que crear UI que el Figma no define con precisión —animaciones, micro-
    interacciones, una pantalla sin frames (la 404), un estado que el diseño no dibuja— o el
    usuario no sabe todavía exactamente qué quiere, **no se implementa directo en la app**.
    Primero se publica un Artifact de propuesta, y se implementa recién cuando el usuario elige.

    No aplica cuando hay un frame de Figma con valores precisos: ahí se maqueta el diseño.

    La página tiene que:

    - **Mostrar, no describir.** Cada opción es una demo en vivo e interactiva (hover, click,
      "Repetir"), construida con las fuentes, colores, tokens y curvas reales del proyecto, y
      que funcione también al tocarla en mobile.
    - **Dar opciones comparables.** Entre dos y cuatro por pieza, y si existe, lo que hay hoy al
      lado de la propuesta.
    - **Explicar cada opción en pocas líneas**: dónde va, de qué referencia sale y cuánto cuesta.
    - **Dejar explícito lo que se descarta** y por qué, incluida la lista de AI-slop que se evita.
    - **Terminar con lo que hay que decidir.** Después se frena y se espera la elección.

    **Se itera en la misma página**, no en una nueva: si el usuario pide variantes de una pieza,
    se suman ahí mismo, con la versión anterior guardada a la izquierda para comparar. La
    página refleja el estado (qué se aprobó y qué espera elección), y su link queda en `PRD.md`
    junto con las decisiones.

    Los Artifacts son privados: si el usuario quiere mostrarle la página a alguien, la comparte
    él desde el menú *Share*.

## Navegación

**No asumir cómo navega el diseño.** Un ícono de menú puede llevar a una ruta propia o
scrollear a una sección de la misma página — son implementaciones distintas y solo el Figma
lo dice. El comportamiento del target actual está documentado en `PRD.md`.

Cuando sea scroll a sección: anchor (`href="#seccion"`) contra `<section id="seccion">`,
con `scroll-margin-top` para compensar headers fijos y respetando `prefers-reduced-motion`.

## Estructura

```
app/              rutas, layout, globals.css (tokens)
components/ui/    primitives shadcn
components/layout/ header, footer, nav flotante
components/sections/ secciones compuestas
lib/utils.ts      cn()
lib/data/         data hardcodeada y tipada
public/assets/    assets exportados de Figma
```

El alias `@/*` apunta a la **raíz del repo** (no hay `src/`): `@/components/ui/button`.

## Antes de dar algo por terminado

```bash
npm run verify                    # typecheck + lint + build
npm run dev                       # en otra terminal
npm run shot -- /                 # screenshots mobile + desktop
```

Los screenshots salen a `screenshots/`. Los widths viven en `scripts/shot.mjs` y
tienen que coincidir exactamente con los frames de Figma.
Se comparan contra el render del diseño, se itera, y después va la aprobación del usuario.
