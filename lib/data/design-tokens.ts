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
  /** Fuente comercial del Figma que este token sustituye. */
  replaces: string;
  specimen: string;
};

export const fontTokens: FontToken[] = [
  {
    name: "--font-display",
    utility: "font-display",
    usage: "Título del hero y de Sura News. Siempre en mayúsculas.",
    replaces: "Monument Extended Ultrabold",
    specimen: "Bienvenidos a la comunidad de Sura",
  },
  {
    name: "--font-techno",
    utility: "font-techno",
    usage: "Títulos de sección, títulos de card, links, botones, fechas.",
    replaces: "KH Interference TRIAL",
    specimen: "Unite a Sura, desbloqueá niveles completando misiones",
  },
  {
    name: "--font-sans",
    utility: "font-sans",
    usage: "Números de la nav, descripciones de card, badges, títulos de Juegos.",
    replaces: "— (Inter ya está en el diseño)",
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
  { name: "--text-title", utility: "text-title", family: "font-techno", usage: "Título de sección", specimen: "Torneos" },
  { name: "--text-card-title", utility: "text-card-title", family: "font-techno", usage: "Título de card de Torneos", specimen: "Valorant Champions Tour" },
  { name: "--text-link", utility: "text-link", family: "font-techno", usage: '"VER todo", "ir a sura news"', specimen: "Ver todo" },
  { name: "--text-cta", utility: "text-cta", family: "font-techno", usage: "Botón del hero, desktop — 14/14, tracking 0.5px", specimen: "Comenzar ahora" },
  { name: "--text-cta-sm", utility: "text-cta-sm", family: "font-techno", usage: "Botón del hero, mobile — 12/14, tracking 0.5px", specimen: "Comenzar ahora" },
  { name: "--text-note", utility: "text-note", family: "font-techno", usage: "Copy de News, fechas, valores", specimen: "Nov 28, 8:00 PM" },
  { name: "--text-sm", utility: "text-sm", family: "font-sans", usage: "Nombre de usuario en el header mobile", specimen: "RocketMan1989" },
  { name: "--text-copy", utility: "text-copy", family: "font-techno", usage: "Copy del hero desktop — 16/19, tracking 1px", specimen: "Unite a Sura, desbloqueá niveles" },
  { name: "--text-copy-sm", utility: "text-copy-sm", family: "font-techno", usage: "Copy del hero mobile — 12/14, tracking 1px", specimen: "Unite a Sura, desbloqueá niveles" },
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
  { name: "--shadow-thumb", utility: "shadow-thumb", usage: "Miniaturas del slider del hero, desktop" },
  { name: "--shadow-thumb-mobile", utility: "shadow-thumb-mobile", usage: "Miniaturas del slider del hero, mobile — escala con la miniatura" },
];

export const gradientTokens: Token[] = [
  { name: "--gradient-gold-text", utility: "bg-gold-text", usage: "Texto del premio (con bg-clip-text)" },
  { name: "--gradient-podium-gold", utility: "bg-podium-gold", usage: "Fondo del primer puesto del podio" },
  { name: "--gradient-badge", utility: "bg-badge", usage: "Fondo de los badges de Torneos" },
  { name: "--gradient-claim", utility: "bg-claim", usage: "Fondo del botón Reclamar" },
  { name: "--gradient-nav-border-mobile", utility: "border-gradient-nav-mobile", usage: "Borde de la bottom bar mobile — el Figma lo dibuja con degradé vertical" },
  { name: "--gradient-nav-border-desktop", utility: "border-gradient-nav-desktop", usage: "Borde del riel desktop — sólido arriba, se desvanece hacia abajo" },
  { name: "--gradient-hero-scrim", utility: "bg-hero-scrim", usage: "Scrim del hero desktop — funde el arte al fondo de página" },
  { name: "--gradient-hero-scrim-mobile", utility: "bg-hero-scrim-mobile", usage: "Scrim del hero mobile — cubre arriba y abajo" },
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
];

export const layoutTokens: Token[] = [
  { name: "--breakpoint-desktop", utility: "desktop:", usage: "Único prefijo responsive. El diseño mobile vive sólo hasta 390px" },
  { name: "--container-page", utility: "max-w-page", usage: "Columna de contenido desktop (4 × 268 + 3 × 24)" },
  { name: "--spacing-gutter", utility: "px-gutter", usage: "Padding lateral de sección, mobile" },
  { name: "--spacing-gutter-desktop", utility: "desktop:px-gutter-desktop", usage: "Gutter desktop; el izquierdo aloja el menú flotante" },
  { name: "--spacing-nav-x", utility: "px-nav-x", usage: "Padding lateral de la nav" },
  { name: "--spacing-header-desktop", utility: "top-header-desktop", usage: "Alto del header desktop: offset del menú flotante y scroll-margin de las secciones" },
  { name: "--blur-nav", utility: "backdrop-blur-nav", usage: "Blur del menú flotante desktop" },
  { name: "--spacing-hero-desktop", utility: "h-hero-desktop", usage: "Alto del fondo del hero desktop; define dónde se solapa la sección siguiente" },
  { name: "--spacing-hero-mobile", utility: "h-hero-mobile", usage: "Alto del fondo del hero mobile" },
  { name: "--spacing-hero-content-desktop", utility: "h-hero-content-desktop", usage: "Alto de la fila de contenido del hero desktop" },
  { name: "--spacing-hero-gap", utility: "gap-hero-gap", usage: "Contenido del hero ↔ gutter derecho" },
  { name: "--spacing-section-gap", utility: "gap-section-gap", usage: "Separación entre secciones" },
  { name: "--spacing-title-gap", utility: "gap-title-gap", usage: "Título de sección → contenido" },
];
