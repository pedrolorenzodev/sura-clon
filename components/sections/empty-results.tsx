export const EMPTY_RESULTS_KEY = "empty-results";

export function EmptyResults({
  children,
  onClear,
  clearLabel = "Buscar de nuevo",
}: {
  children: React.ReactNode;
  onClear?: () => void;
  clearLabel?: string;
}) {
  return (
    <li className="col-span-full flex flex-col items-center gap-2.5 px-6 py-10 text-center">
      <span aria-hidden className="radar mb-1.5">
        <span className="blip-blink absolute left-1/2 top-1/2 size-2.5 -translate-1/2 rounded-full bg-brand outline-1 outline-offset-3 outline-brand outline-solid" />
      </span>
      <p className="font-techno text-title-sm uppercase text-foreground">Nada en este sector</p>
      <p className="text-balance text-sm text-muted-foreground">{children}</p>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          data-sfx-hover
          data-sfx="click"
          className="mt-1.5 cursor-pointer rounded-pill border border-border-dim px-4 py-2 text-sm text-subtle-foreground transition-colors duration-200 hover:border-brand/50 hover:text-brand focus-visible:border-brand/50 focus-visible:text-brand motion-reduce:transition-none"
        >
          {clearLabel}
        </button>
      )}
    </li>
  );
}
