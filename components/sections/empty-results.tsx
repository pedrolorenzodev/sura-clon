export const EMPTY_RESULTS_KEY = "empty-results";

export function EmptyResults({ children }: { children: React.ReactNode }) {
  return <li className="col-span-full py-10 text-center text-sm text-muted-foreground">{children}</li>;
}
