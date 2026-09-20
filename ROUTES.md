# Mapa de rutas — SURA Gaming

> Definido el 2026-09-19. **Archivo temporal**: se mergea a la sección 5 de
> [`PRD.md`](./PRD.md) en cuanto el bloque Eventos libere ese archivo.
> El proceso vive en [`AGENTS.md`](./AGENTS.md).

**URLs en inglés**, igual que `app.suragaming.com`. La UI va en español y los anchors
del menú flotante también (`#eventos`, `#misiones`, `#sura-news`): son ids de sección,
no rutas, y conviven sin conflicto.

## Rutas del proyecto

| Ruta | Pantalla | Estado |
|---|---|---|
| `/` | Home | 🚧 En progreso |
| `/tournaments` | Lista de eventos | ⏳ Pendiente |
| `/tournaments/:id` | Detalle de evento | ⏳ Pendiente |
| `/leaderboard` | Leaderboard | ⏳ Pendiente |
| `/missions` | Misiones | ⏳ Pendiente |
| `/missions/:id` | Detalle de misión | ⏳ Pendiente ❓ a confirmar |
| `/news` | Lista de Sura News | ⏳ Pendiente |
| `/news/:id` | Detalle de noticia | ⏳ Pendiente |
| `/games` | Lista de juegos | ⏳ Pendiente |
| `/games/:id` | Detalle de juego | ⏳ Pendiente ❓ a confirmar |
| `/profile` | Perfil propio | ⏳ Pendiente ❓ a confirmar |
| `/profile/:id` | Perfil de otro usuario | ⏳ Pendiente ❓ a confirmar |
| `/styleguide` | Referencia visual del DS (solo dev) | ✅ Implementada |
| `not-found` | 404 | ⏳ Pendiente |

**Ninguna se maqueta sin sus dos frames de Figma** (`AGENTS.md` regla 2), y ninguna se
abre hasta que el Home esté aprobado completo (regla 14).

### Cómo se entra a cada una

Los 6 ítems del menú flotante **scrollean a las secciones del Home**, no rutean
(decisión del usuario, 2026-09-18 — ver `PRD.md` § 5). Así que las rutas necesitan su
propia puerta de entrada:

- `/tournaments`, `/news`, `/games`, `/leaderboard`, `/missions` → presumiblemente un
  **"Ver todos"** en el título de cada sección del Home. **Sin confirmar**: hay que
  mirarlo en el frame de cada bloque a medida que se maquetan.
- `/tournaments/:id`, `/news/:id`, `/games/:id` → click en la card correspondiente.
- `/profile` → avatar del header.

Hasta que exista la puerta, el link se maqueta apuntando a su destino real (regla 14).

## Rutas descartadas a propósito

Existen en `app.suragaming.com` y se decidió **no** hacerlas (usuario, 2026-09-19).
Quedan acá por si alguna vuelve a entrar en scope.

| Ruta | Qué es | Por qué queda afuera |
|---|---|---|
| `/levels` | Niveles | Es el 7º ítem del menú flotante del Figma, ya excluido del menú por no tener sección en el Home. |
| `/achievements` | **Medallas** | Destino natural de la sección Medallas del Home. Confirmado por la API del live (`/medal/list`, `/medal/claim/`). |
| `/store` · `/store/:slug` | Tienda | No hay sección de tienda en el Home ni ítem en el menú: no hay por dónde entrar. |
| `/wallet` · `/wallet/tokens` · `/wallet/nfts` · `/wallet/transactions` | Billetera web3 | Fuera del alcance visual del rediseño. Ojo: el **saldo del header** podría apuntar acá. |
| `/faq` | Preguntas frecuentes | Link del footer, baja prioridad. |
| `/privacy-policy` | Política de privacidad | Link del footer, baja prioridad. |
| `/about` | "Sobre nosotros & Partnerships" | **No es una ruta de la app**: vive en el sitio de marketing, `suragaming.com/es/about`. El link del footer es externo. |

## Anexo — el mapa real del live

Relevado el 2026-09-19 sobre `app.suragaming.com` (Next.js App Router), enumerando los
chunks `static/chunks/app/**/page-*.js` que sirve cada página. Es la lista completa, no
una inferencia por status code.

```
app/
  page                          /
  tournaments/page              /tournaments
  tournaments/[id]/page         /tournaments/:id
  leaderboard/page              /leaderboard
  games/page                    /games
  games/[id]/page               /games/:id
  faq/page                      /faq
  privacy-policy/page           /privacy-policy
  not-found
  (protected)/
    missions/page               /missions
    profile/page                /profile
    levels/page                 /levels
    achievements/page           /achievements
    store/page                  /store
    store/[slug]/page           /store/:slug
    wallet/page                 /wallet
    wallet/tokens/page          /wallet/tokens
    wallet/nfts/page            /wallet/nfts
    wallet/transactions/page    /wallet/transactions
```

Tres cosas que conviene tener presentes:

1. **`/news` no existe en el live.** Devuelve 200 pero sirve el `not-found` dentro del
   layout `(protected)`. O sea que la sección Sura News del Home no tiene pantalla
   propia hoy. Nuestras `/news` y `/news/:id` son una decisión del rediseño, no una
   réplica — no hay nada upstream contra qué validarlas.
2. **Nombres de params**: el live usa `[id]` en tournaments y games, y `[slug]` sólo en
   store. Seguimos `:id`.
3. **`(protected)`** separa lo público (`/`, tournaments, games, leaderboard, faq,
   privacy-policy) de lo que pide sesión (missions, profile, levels, achievements,
   store, wallet). Como auth está fuera de scope (`PRD.md` § 1), **no replicamos el
   route group**: todas nuestras rutas son públicas.
4. **No quedó ninguna ruta sin relevar.** Las únicas del live que no están en nuestra
   lista son las siete descartadas arriba.
