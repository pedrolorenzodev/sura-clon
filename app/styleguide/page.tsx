import { Button } from "@/components/ui/button";
import { TokenValue } from "@/components/styleguide/token-value";
import { cn } from "@/lib/utils";
import {
  brandColors,
  fontTokens,
  goldColors,
  gradientTokens,
  layoutTokens,
  leaderboardColors,
  medalColors,
  missionColors,
  motionTokens,
  podiumColors,
  promoColors,
  radiusTokens,
  semanticColors,
  shadowTokens,
  surfaceColors,
  textColors,
  textTokens,
  type Token,
  type TokenGroup,
} from "@/lib/data/design-tokens";

export const metadata = {
  title: "Styleguide · Sura Gaming",
  description: "Referencia visual del Design System derivado del Home.",
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 border-t border-border-dim pt-8">
      <header className="flex flex-col gap-2">
        <h2 className="font-techno text-title uppercase text-foreground">{title}</h2>
        {description ? (
          <p className="text-base text-muted-foreground">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

function OffDesignTag() {
  return (
    <span className="rounded-xs border border-border-muted px-1.5 py-0.5 text-3xs text-muted-foreground">
      fuera del diseño
    </span>
  );
}

function ColorSwatch({ token }: { token: Token }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={cn("size-14 shrink-0 rounded-md border border-border", token.utility)}
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <code className="text-xs text-foreground">{token.name}</code>
          {token.offDesign ? <OffDesignTag /> : null}
        </div>
        <TokenValue name={token.name} />
        <p className="text-2xs text-muted-foreground">{token.usage}</p>
      </div>
    </div>
  );
}

function ColorGrid({ group }: { group: TokenGroup }) {
  return (
    <Section title={group.title} description={group.description}>
      <div className="grid grid-cols-1 gap-6 desktop:grid-cols-3">
        {group.tokens.map((token) => (
          <ColorSwatch key={token.name} token={token} />
        ))}
      </div>
    </Section>
  );
}

export default function StyleguidePage() {
  return (
    <main className="mx-auto flex w-full max-w-page flex-col gap-12 px-gutter py-12">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-display-xs uppercase text-foreground">
          Design System · Sura Gaming
        </h1>
        <p className="text-base text-muted-foreground">
          Derivado del Home del rediseño, desktop y mobile. Los valores se leen en runtime
          desde <code>app/globals.css</code>: esta página no puede desincronizarse del CSS.
        </p>
      </header>

      <Section
        title="Familias"
        description="Las tres familias del diseño, con sus archivos reales."
      >
        <div className="flex flex-col gap-8">
          {fontTokens.map((font) => (
            <div key={font.name} className="flex flex-col gap-2 text-foreground">
              <div className="flex flex-wrap items-baseline gap-3">
                <code className="text-xs text-foreground">{font.name}</code>
                <span className="text-2xs text-brand">{font.designName}</span>
              </div>
              <TokenValue name={font.name} />
              <p
                className={cn(
                  "text-card-title",
                  font.utility,
                  font.utility === "font-display" && "uppercase",
                )}
              >
                {font.specimen}
              </p>
              <p className="text-2xs text-muted-foreground">{font.usage}</p>
            </div>
          ))}
        </div>
      </Section>

      <ColorGrid group={brandColors} />
      <ColorGrid group={surfaceColors} />
      <ColorGrid group={textColors} />
      <ColorGrid group={goldColors} />
      <ColorGrid group={podiumColors} />
      <ColorGrid group={medalColors} />
      <ColorGrid group={leaderboardColors} />
      <ColorGrid group={missionColors} />
      <ColorGrid group={promoColors} />
      <ColorGrid group={semanticColors} />

      <Section
        title="Tipografía"
        description="Cada token lleva su tamaño, interlineado y tracking. La familia la pone el call site."
      >
        <div className="flex flex-col gap-8">
          {textTokens.map((token) => (
            <div key={token.name} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline gap-3">
                <code className="text-xs text-foreground">{token.name}</code>
                <TokenValue name={token.name} />
                <code className="text-2xs text-brand">{token.family}</code>
                <span className="text-2xs text-muted-foreground">{token.usage}</span>
                {token.offDesign ? <OffDesignTag /> : null}
              </div>
              <p
                className={cn(
                  "text-foreground",
                  token.family,
                  token.utility,
                  token.family === "font-display" && "uppercase",
                )}
              >
                {token.specimen}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radio">
        <div className="grid grid-cols-2 gap-6 desktop:grid-cols-4">
          {radiusTokens.map((token) => (
            <div key={token.name} className="flex flex-col gap-2">
              <div
                className={cn(
                  "h-20 w-full border border-border bg-surface-2",
                  token.utility,
                )}
              />
              <code className="text-xs text-foreground">{token.name}</code>
              <TokenValue name={token.name} />
              <p className="text-2xs text-muted-foreground">{token.usage}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Sombra">
        <div className="grid grid-cols-1 gap-8 desktop:grid-cols-3">
          {shadowTokens.map((token) => (
            <div key={token.name} className="flex flex-col gap-3">
              <div
                className={cn(
                  "h-20 w-full rounded-xl border border-border bg-surface",
                  token.utility,
                )}
              />
              <code className="text-xs text-foreground">{token.name}</code>
              <TokenValue name={token.name} />
              <p className="text-2xs text-muted-foreground">{token.usage}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Gradientes"
        description="No hay namespace de gradientes en Tailwind: van como custom property + @utility."
      >
        <div className="grid grid-cols-1 gap-8 desktop:grid-cols-4">
          {gradientTokens.map((token) => (
            <div key={token.name} className="flex flex-col gap-3">
              <div
                className={cn(
                  "h-20 w-full rounded-xl border border-border",
                  token.utility,
                )}
              />
              <code className="text-xs text-foreground">{token.name}</code>
              <p className="text-2xs text-muted-foreground">{token.usage}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Layout"
        description="El único prefijo responsive del proyecto es desktop:. Los demás no existen."
      >
        <ul className="flex flex-col gap-4">
          {layoutTokens.map((token) => (
            <li
              key={token.name}
              className="flex flex-col gap-1 border-b border-border-dim pb-4"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <code className="text-xs text-foreground">{token.name}</code>
                <TokenValue name={token.name} />
              </div>
              <div className="flex flex-wrap items-baseline gap-3">
                <code className="text-2xs text-brand">{token.utility}</code>
                <span className="text-2xs text-muted-foreground">{token.usage}</span>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Movimiento"
        description="Ninguna sale del diseño: el Figma no define animaciones. Cada una está justificada en el PRD."
      >
        <ul className="flex flex-col gap-4">
          {motionTokens.map((token) => (
            <li
              key={token.name}
              className="flex flex-col gap-1 border-b border-border-dim pb-4"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <code className="text-xs text-foreground">{token.name}</code>
                <TokenValue name={token.name} />
                <OffDesignTag />
              </div>
              <div className="flex flex-wrap items-baseline gap-3">
                <code className="text-2xs text-brand">{token.utility}</code>
                <span className="text-2xs text-muted-foreground">{token.usage}</span>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Button"
        description="El primitive de shadcn con los tokens de SURA. Todavía sin re-estilar: se ajusta cuando el primer bloque necesite un botón."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </Section>
    </main>
  );
}
