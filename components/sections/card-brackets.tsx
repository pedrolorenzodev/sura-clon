const CORNERS = ["tl", "tr", "br", "bl"] as const;

export function CardBrackets() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {CORNERS.map((corner) => (
        <span key={corner} data-corner={corner} className="card-bracket" />
      ))}
    </span>
  );
}
