import { cn } from "@/lib/utils";

const DIGITS = Array.from({ length: 10 }, (_, digit) => digit);

export function Odometer({ value, className }: { value: number; className?: string }) {
  const digits = String(value).split("");

  return (
    <span className={cn("inline-flex", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="inline-flex h-[1lh] overflow-hidden">
        {digits.map((digit, index) => {
          const position = digits.length - 1 - index;
          return (
            <span
              key={position}
              style={{ "--digit": digit, "--digit-pos": position } as React.CSSProperties}
              className="odometer-digit flex flex-col"
            >
              {DIGITS.map((option) => (
                <span key={option} className="block h-[1lh] text-center">
                  {option}
                </span>
              ))}
            </span>
          );
        })}
      </span>
    </span>
  );
}
