export function RouteShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 overflow-x-clip px-route-gutter pb-route-edge pt-header-mobile desktop:pl-route-inset desktop:pr-route-edge desktop:pt-header-desktop">
      <h1 className="pt-4 font-display text-page-title-sm uppercase text-foreground desktop:pt-6 desktop:text-page-title">
        {title}
      </h1>

      <div className="flex flex-col gap-6 pt-6 desktop:pt-10">{children}</div>
    </main>
  );
}
