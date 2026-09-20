/**
 * Inventario del Design System, derivado del Home del rediseño de Figma
 * (archivo `uuh0qonxt0qkmKJku7jSUd`).
 *
 * Acá viven sólo los NOMBRES y la utility que genera cada token: el valor se lee
 * en runtime desde el CSS (ver `components/styleguide/token-value.tsx`). Duplicar
 * los valores acá haría que /styleguide pueda mentir si alguien edita globals.css.
 */

export type Token = {
  /** Custom property, tal cual se declara en `@theme`. */
  name: string;
  /** Utility de Tailwind que genera. Literal, para que Tailwind la detecte. */
  utility: string;
  /** Dónde aparece en el diseño. */
  usage: string;
  /** Marca los tokens que NO salen del Figma. */
  offDesign?: boolean;
};

export type TokenGroup = {
  title: string;
  description?: string;
  tokens: Token[];
};

/* ---------------------------------------------------------------- fuentes */

export type FontToken = Token & {
  /** Nombre de la familia tal cual la nombra el Figma. */
  designName: string;
  specimen: string;
};

export const fontTokens: FontToken[] = [
  {
    name: "--font-display",
    utility: "font-display",
    usage: "Título del hero y de Sura News. Siempre en mayúsculas.",
    designName: "Monument Extended Ultrabold",
    specimen: "Bienvenidos a la comunidad de Sura",
  },
  {
    name: "--font-techno",
    utility: "font-techno",
    usage: "Títulos de sección, títulos de card, links, botones, fechas.",
    designName: "KH Interference",
    specimen: "Unite a Sura, desbloqueá niveles completando misiones",
  },
  {
    name: "--font-sans",
    utility: "font-sans",
    usage: "Números de la nav, descripciones de card, badges, títulos de Juegos.",
    designName: "Inter",
    specimen: "RocketMan1989 · Nivel: Novato · 473",
  },
];

/* ---------------------------------------------------------------- colores */

export const brandColors: TokenGroup = {
  title: "Marca",
  description:
    "El verde cambió en el rediseño y no está publicado como variable de Figma: se tomó del uso real.",
  tokens: [
    { name: "--color-brand", utility: "bg-brand", usage: "CTA, links, bordes activos, acentos" },
    { name: "--color-brand-deep", utility: "bg-brand-deep", usage: "Fondo del gradiente del botón Reclamar" },
    { name: "--color-brand-legacy", utility: "bg-brand-legacy", usage: "Borde de la miniatura activa del hero — es el verde VIEJO, a full" },
    { name: "--color-brand-faint", utility: "bg-brand-faint", usage: "Borde de las cards de Torneos — el mismo verde viejo, al 20%" },
  ],
};

export const surfaceColors: TokenGroup = {
  title: "Superficies y bordes",
  tokens: [
    { name: "--color-background", utility: "bg-background", usage: "Fondo de la app" },
    { name: "--color-surface", utility: "bg-surface", usage: "Pill de la nav, panel de las cards de Juegos" },
    { name: "--color-surface-2", utility: "bg-surface-2", usage: "Ítems de la nav" },
    { name: "--color-surface-3", utility: "bg-surface-3", usage: "Chip interno de los contadores" },
    { name: "--color-overlay", utility: "bg-overlay", usage: "Panel translúcido sobre imagen (Juegos)" },
    { name: "--color-nav-glass", utility: "bg-nav-glass", usage: "Menú flotante desktop — casi transparente, el efecto lo hace el blur" },
    { name: "--color-nav-icon", utility: "bg-nav-icon", usage: "Íconos de la bottom bar mobile — gris azulado, no blanco como en desktop" },
    { name: "--color-tooltip", utility: "bg-tooltip", usage: "Tooltip del menú flotante — tomado del sitio live, no del Figma" },
    { name: "--color-thumb-dim", utility: "bg-thumb-dim", usage: "Fondo de las miniaturas no seleccionadas del hero, sólo en mobile" },
    { name: "--color-border", utility: "bg-border", usage: "Bottom bar mobile" },
    { name: "--color-border-muted", utility: "bg-border-muted", usage: "Badges de Juegos" },
    { name: "--color-border-light", utility: "bg-border-light", usage: "Badges de Torneos" },
    { name: "--color-border-dim", utility: "bg-border-dim", usage: "Separadores" },
  ],
};

export const textColors: TokenGroup = {
  title: "Texto",
  tokens: [
    { name: "--color-foreground", utility: "bg-foreground", usage: "Texto principal" },
    { name: "--color-muted-foreground", utility: "bg-muted-foreground", usage: "Copy de Sura News, badges de Juegos" },
    { name: "--color-subtle-foreground", utility: "bg-subtle-foreground", usage: "Badges de Torneos" },
  ],
};

export const goldColors: TokenGroup = {
  title: "Familia dorada",
  description: "Nueva en el rediseño: premios, podio y medallas. No existía en el diseño anterior.",
  tokens: [
    { name: "--color-gold", utility: "bg-gold", usage: "Borde del premio de una card" },
    { name: "--color-gold-deep", utility: "bg-gold-deep", usage: "Fondo del valor en el podio" },
    { name: "--color-gold-bright", utility: "bg-gold-bright", usage: "Borde y glow del primer puesto" },
  ],
};

export const podiumColors: TokenGroup = {
  title: "Plata y bronce",
  description:
    "Los otros dos puestos del podio. Misma estructura que la dorada: -bright para el borde de la card y el anillo del avatar, -deep para el fondo del pill, y el base para su borde.",
  tokens: [
    { name: "--color-silver", utility: "bg-silver", usage: "Borde del pill del segundo puesto" },
    { name: "--color-silver-deep", utility: "bg-silver-deep", usage: "Fondo del pill del segundo puesto" },
    { name: "--color-silver-bright", utility: "bg-silver-bright", usage: "Borde de la card y anillo del segundo puesto" },
    { name: "--color-bronze", utility: "bg-bronze", usage: "Borde de la card y del pill del tercer puesto" },
    { name: "--color-bronze-deep", utility: "bg-bronze-deep", usage: "Anillo del avatar del tercer puesto" },
  ],
};

export const missionColors: TokenGroup = {
  title: "Misiones",
  description: "Badge del premio de una misión.",
  tokens: [
    { name: "--color-sp-foreground", utility: "text-sp-foreground", usage: "Número del premio, sobre el verde del badge" },
  ],
};

export const promoColors: TokenGroup = {
  title: "Banner de Juegos",
  description: "El violeta del banner promocional: borde, scrim y texto del CTA.",
  tokens: [
    { name: "--color-promo", utility: "border-promo", usage: "Borde del banner y color del scrim" },
    { name: "--color-promo-foreground", utility: "text-promo-foreground", usage: "Texto del CTA, sobre el verde" },
    { name: "--color-brand-vivid", utility: "border-brand-vivid", usage: "Borde y glow del CTA del banner" },
  ],
};

export const medalColors: TokenGroup = {
  title: "Medallas",
  description: "Panel de la grilla y estado bloqueado.",
  tokens: [
    { name: "--color-surface-deep", utility: "bg-surface-deep", usage: "Fondo del panel de Medallas" },
    { name: "--color-locked-foreground", utility: "text-locked-foreground", usage: "Label de una medalla bloqueada" },
    { name: "--color-medal-veil", utility: "bg-medal-veil", usage: "Velo que apaga la medalla bloqueada (mix-blend-darken)" },
  ],
};

export const semanticColors: TokenGroup = {
  title: "Alias de shadcn",
  description: "Mismos valores, con los nombres que consumen los primitives.",
  tokens: [
    { name: "--color-primary", utility: "bg-primary", usage: "= brand" },
    { name: "--color-primary-foreground", utility: "bg-primary-foreground", usage: "Texto sobre verde" },
    { name: "--color-secondary", utility: "bg-secondary", usage: "= surface-2" },
    { name: "--color-muted", utility: "bg-muted", usage: "= surface-2" },
    { name: "--color-card", utility: "bg-card", usage: "= surface" },
    { name: "--color-input", utility: "bg-input", usage: "= surface-2" },
    { name: "--color-ring", utility: "bg-ring", usage: "Focus ring", offDesign: true },
    { name: "--color-destructive", utility: "bg-destructive", usage: "Estado de error", offDesign: true },
  ],
};

/* ------------------------------------------------------------ tipografía */

export type TextToken = Token & {
  /** Utility de familia con la que se usa este tamaño. */
  family: string;
  specimen: string;
};

export const textTokens: TextToken[] = [
  { name: "--text-display", utility: "text-display", family: "font-display", usage: "Título del hero, desktop", specimen: "Bienvenidos a la comunidad" },
  { name: "--text-display-sm", utility: "text-display-sm", family: "font-display", usage: "Título de Sura News", specimen: "Sura News" },
  { name: "--text-display-xs", utility: "text-display-xs", family: "font-display", usage: "Título del hero, mobile", specimen: "Bienvenidos a la comunidad" },
  { name: "--text-title", utility: "text-title", family: "font-techno", usage: "Título de sección, desktop", specimen: "Eventos" },
  { name: "--text-title-sm", utility: "text-title-sm", family: "font-techno", usage: "Título de sección, mobile", specimen: "Eventos" },
  { name: "--text-card-title", utility: "text-card-title", family: "font-techno", usage: "Título de card de Torneos", specimen: "Valorant Champions Tour" },
  { name: "--text-link", utility: "text-link", family: "font-techno", usage: '"VER todo", "ir a sura news"', specimen: "Ver todo" },
  { name: "--text-cta", utility: "text-cta", family: "font-techno", usage: "Botón del hero, desktop — 14/14", specimen: "Comenzar ahora" },
  { name: "--text-cta-sm", utility: "text-cta-sm", family: "font-techno", usage: "Botón del hero, mobile — 12/14", specimen: "Comenzar ahora" },
  { name: "--text-note", utility: "text-note", family: "font-techno", usage: "Fechas y valores de las cards", specimen: "Nov 28, 8:00 PM" },
  { name: "--text-news-copy", utility: "text-news-copy", family: "font-techno", usage: "Bajada de Sura News en desktop", specimen: "Todo lo que está pasando" },
  { name: "--text-reward", utility: "text-reward", family: "font-techno", usage: "Premio de una misión", specimen: "+120" },
  { name: "--text-legal", utility: "text-legal", family: "font-sans", usage: "Copyright del footer — 12/18, tracking 0.24px", specimen: "© 2026 Sura GG Corp." },
  { name: "--text-sm", utility: "text-sm", family: "font-sans", usage: "Nombre de usuario en el header mobile", specimen: "RocketMan1989" },
  { name: "--text-copy", utility: "text-copy", family: "font-techno", usage: "Copy del hero desktop — 16/19", specimen: "Unite a Sura, desbloqueá niveles" },
  { name: "--text-copy-sm", utility: "text-copy-sm", family: "font-techno", usage: "Copy del hero mobile — 12/14", specimen: "Unite a Sura, desbloqueá niveles" },
  { name: "--text-base", utility: "text-base", family: "font-sans", usage: "Nav, título de card de Juegos", specimen: "Wagmi Defense" },
  { name: "--text-ui", utility: "text-ui", family: "font-sans", usage: "Nombre de usuario", specimen: "RocketMan1989" },
  { name: "--text-xs", utility: "text-xs", family: "font-sans", usage: "Usuario del podio", specimen: "DesenfrenadO_" },
  { name: "--text-2xs", utility: "text-2xs", family: "font-sans", usage: "Descripción de card, badges de Juegos", specimen: "Free-To-Play" },
  { name: "--text-3xs", utility: "text-3xs", family: "font-sans", usage: "Badges de Torneos, nivel del podio", specimen: "15 participantes" },
];

/* ------------------------------------------------------ radio y sombra */

export const radiusTokens: Token[] = [
  { name: "--radius-xs", utility: "rounded-xs", usage: "Badges de Torneos y de Juegos" },
  { name: "--radius-sm", utility: "rounded-sm", usage: "Premio, valor del podio" },
  { name: "--radius-md", utility: "rounded-md", usage: "Chip interno de los contadores" },
  { name: "--radius-lg", utility: "rounded-lg", usage: "Podio, ítems de la nav, botón Reclamar" },
  { name: "--radius-xl", utility: "rounded-xl", usage: "Cards, pill de la nav" },
  { name: "--radius-2xl", utility: "rounded-2xl", usage: "Bottom bar mobile" },
  { name: "--radius-pill", utility: "rounded-pill", usage: "CTA del hero" },
];

export const shadowTokens: Token[] = [
  { name: "--shadow-bar", utility: "shadow-bar", usage: 'Bottom bar mobile — es la variable "Shadow 3" del Figma' },
  { name: "--drop-shadow-badge", utility: "drop-shadow-badge", usage: "Badge de nivel en el header (PNG con alpha)" },
  { name: "--shadow-gold-glow", utility: "shadow-gold-glow", usage: "Glow del primer puesto del podio" },
  { name: "--shadow-nav", utility: "shadow-nav", usage: "Menú flotante desktop" },
  { name: "--drop-shadow-claim", utility: "drop-shadow-claim", usage: "Botón Reclamar" },
  { name: "--shadow-cta", utility: "shadow-cta", usage: "CTA del hero, desktop" },
  { name: "--shadow-cta-mobile", utility: "shadow-cta-mobile", usage: "CTA del hero, mobile — suma un glow verde" },
  { name: "--text-shadow-banner", utility: "text-shadow-banner", usage: "Bajada del banner de Juegos en mobile, que cae sobre la foto", offDesign: true },
  { name: "--shadow-promo", utility: "shadow-promo", usage: "Glow violeta del banner de Juegos" },
  { name: "--shadow-promo-cta", utility: "shadow-promo-cta", usage: "Glow verde del CTA del banner" },
  { name: "--shadow-mission-card", utility: "shadow-mission-card", usage: "Card de una misión" },
  { name: "--shadow-sp-badge", utility: "shadow-sp-badge", usage: "Badge de premio de una misión" },
  { name: "--shadow-thumb", utility: "shadow-thumb", usage: "Miniaturas del slider del hero, desktop" },
  { name: "--shadow-thumb-mobile", utility: "shadow-thumb-mobile", usage: "Miniaturas del slider del hero, mobile — escala con la miniatura" },
];

export const gradientTokens: Token[] = [
  { name: "--gradient-gold-text", utility: "bg-gold-text", usage: "Texto del premio (con bg-clip-text)" },
  { name: "--gradient-promo-scrim", utility: "bg-promo-scrim", usage: "Scrim del banner de Juegos, desktop" },
  { name: "--gradient-promo-scrim-mobile", utility: "bg-promo-scrim-mobile", usage: "Scrim del banner en mobile — no sale del diseño", offDesign: true },
  { name: "--gradient-promo-cta", utility: "bg-promo-cta", usage: "Fondo del CTA del banner" },
  { name: "--gradient-sp-badge", utility: "bg-sp-badge", usage: "Fondo del badge de premio de una misión" },
  { name: "--gradient-medal-sheen", utility: "bg-medal-sheen", usage: "Brillo diagonal de una medalla obtenida — verde legacy" },
  { name: "--gradient-medal-sheen-locked", utility: "bg-medal-sheen-locked", usage: "Brillo de una medalla bloqueada" },
  { name: "--gradient-podium-gold", utility: "bg-podium-gold", usage: "Fondo del primer puesto del podio, desktop" },
  { name: "--gradient-podium-silver", utility: "bg-podium-silver", usage: "Fondo del segundo puesto, desktop" },
  { name: "--gradient-podium-bronze", utility: "bg-podium-bronze", usage: "Fondo del tercer puesto, desktop" },
  { name: "--gradient-podium-gold-mobile", utility: "bg-podium-gold-mobile", usage: "Primer puesto, mobile — otro ángulo y sin el negro al 20%" },
  { name: "--gradient-podium-silver-mobile", utility: "bg-podium-silver-mobile", usage: "Segundo puesto, mobile" },
  { name: "--gradient-podium-bronze-mobile", utility: "bg-podium-bronze-mobile", usage: "Tercer puesto, mobile" },
  { name: "--gradient-badge", utility: "bg-badge", usage: "Fondo de los badges de Torneos" },
  { name: "--gradient-claim", utility: "bg-claim", usage: "Fondo del botón Reclamar" },
  { name: "--gradient-nav-border-mobile", utility: "border-gradient-nav-mobile", usage: "Borde de la bottom bar mobile — el Figma lo dibuja con degradé vertical" },
  { name: "--gradient-nav-border-desktop", utility: "border-gradient-nav-desktop", usage: "Borde del riel desktop — sólido arriba, se desvanece hacia abajo" },
  { name: "--gradient-hero-scrim", utility: "bg-hero-scrim", usage: "Scrim del hero desktop — funde el arte al fondo de página" },
  { name: "--gradient-hero-scrim-mobile", utility: "bg-hero-scrim-mobile", usage: "Scrim del hero mobile — cubre arriba y abajo" },
  { name: "--gradient-event-scrim", utility: "bg-event-scrim", usage: "Scrim de la card de Eventos" },
  { name: "--gradient-event-scrim-strong", utility: "bg-event-scrim-strong", usage: "Scrim de la card de Eventos de fondo claro" },
];

/**
 * Movimiento. El diseño no define ninguna animación: el vocabulario lo fuimos
 * armando nosotros y está justificado bloque por bloque en PRD § 5 y § 6.
 */
export const motionTokens: Token[] = [
  { name: "--ease-reveal", utility: "ease-reveal", usage: "Curva de entrada del slider del hero — desacelera y no vuelve", offDesign: true },
  { name: "--thumb-reveal-duration", utility: "thumb-reveal", usage: "Cuánto tarda en entrar una miniatura del slider", offDesign: true },
  { name: "--thumb-reveal-stagger", utility: "thumb-reveal", usage: "Retraso de cada miniatura respecto de la anterior", offDesign: true },
  { name: "--thumb-reveal-shift", utility: "thumb-reveal", usage: "Cuánto sube la miniatura al entrar", offDesign: true },
  { name: "--hero-art-fade-duration", utility: "hero-art-fade", usage: "Fundido del arte del hero al cambiar de juego", offDesign: true },
];

export const layoutTokens: Token[] = [
  { name: "--breakpoint-desktop", utility: "desktop:", usage: "Único prefijo responsive. El diseño mobile vive sólo hasta 390px" },
  { name: "--container-page", utility: "max-w-page", usage: "Columna de contenido desktop (4 × 268 + 3 × 24)" },
  { name: "--spacing-gutter", utility: "px-gutter", usage: "Padding lateral de sección, mobile" },
  { name: "--spacing-gutter-desktop", utility: "desktop:px-gutter-desktop", usage: "Gutter desktop; el izquierdo aloja el menú flotante" },
  { name: "--spacing-nav-x", utility: "px-nav-x", usage: "Padding lateral de la nav" },
  { name: "--spacing-header-desktop", utility: "top-header-desktop", usage: "Alto del header desktop: offset del menú flotante y scroll-margin de las secciones" },
  { name: "--blur-nav", utility: "backdrop-blur-nav", usage: "Blur del menú flotante desktop" },
  { name: "--blur-card", utility: "backdrop-blur-card", usage: "Blur del panel de la card de Juegos" },
  { name: "--spacing-hero-desktop", utility: "h-hero-desktop", usage: "Alto del fondo del hero desktop; define dónde se solapa la sección siguiente" },
  { name: "--spacing-hero-mobile", utility: "h-hero-mobile", usage: "Alto del fondo del hero mobile" },
  { name: "--spacing-hero-content-desktop", utility: "h-hero-content-desktop", usage: "Alto de la fila de contenido del hero desktop" },
  { name: "--spacing-hero-gap", utility: "gap-hero-gap", usage: "Contenido del hero ↔ gutter derecho" },
  { name: "--spacing-section-gap", utility: "gap-section-gap", usage: "Separación entre secciones" },
  { name: "--spacing-title-gap", utility: "gap-title-gap", usage: "Título de sección → contenido" },
  { name: "--spacing-event-card", utility: "w-event-card", usage: "Ancho de la card de Eventos, desktop" },
  { name: "--spacing-event-card-mobile", utility: "w-event-card-mobile", usage: "Ancho de la card de Eventos, mobile" },
  { name: "--spacing-event-surface", utility: "h-event-surface", usage: "Alto de la superficie de la card, desktop — el personaje se sale por arriba" },
  { name: "--spacing-event-surface-mobile", utility: "h-event-surface-mobile", usage: "Alto de la superficie de la card, mobile" },
  { name: "--spacing-section-gap-mobile", utility: "mt-section-gap-mobile", usage: "Separación entre secciones en mobile — no sale del diseño", offDesign: true },
  { name: "--spacing-mission-card-mobile", utility: "w-mission-card-mobile", usage: "Ancho de la card de misión en el carrusel mobile" },
  { name: "--spacing-leaderboard-col", utility: "w-leaderboard-col", usage: "Ancho de la columna del Leaderboard (657 + 120 + 367 = 1144)" },
  { name: "--spacing-podium-card", utility: "h-podium-card", usage: "Alto de la card del podio desktop" },
  { name: "--spacing-leaderboard-row", utility: "h-leaderboard-row", usage: "Alto de la fila Leaderboard + Medallas" },
  { name: "--spacing-nav-bar", utility: "h-nav-bar", usage: "Alto de la bottom bar mobile; el footer le deja ese aire abajo" },
];
