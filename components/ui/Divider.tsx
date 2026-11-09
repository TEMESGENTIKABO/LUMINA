import { cn } from "@/lib/cn";

type Variant = "hairline" | "strong" | "ornament";

const line = (strong = false): React.CSSProperties => ({
  background: strong
    ? "var(--hp-fg, #14110d)"
    : "var(--hp-line, rgba(20,17,13,.12))",
});

/**
 * Section separator.
 *  - hairline: quiet default between content blocks
 *  - strong:   2px rule to open a major section
 *  - ornament: rule with a small gold star, for the end of a story or a long page
 * Pass `label` to put text in the middle of the rule.
 */
export function Divider({
  orientation = "horizontal",
  variant = "hairline",
  label,
  className,
}: {
  orientation?: "horizontal" | "vertical";
  variant?: Variant;
  label?: string;
  className?: string;
}) {
  if (orientation === "vertical") {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        className={cn("inline-block w-px self-stretch", className)}
        style={line()}
      />
    );
  }

  if (variant === "ornament" || label) {
    return (
      <div
        role="separator"
        className={cn("flex items-center gap-4 my-8", className)}
      >
        <span className="h-px flex-1" style={line()} />
        {label ? (
          <span
            className="font-ui text-sm"
            style={{ color: "var(--hp-mut, #6b665c)" }}
          >
            {label}
          </span>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M7 0l1.9 5.1L14 7l-5.1 1.9L7 14l-1.9-5.1L0 7l5.1-1.9z"
              fill="var(--hp-accent, #f6c453)"
            />
          </svg>
        )}
        <span className="h-px flex-1" style={line()} />
      </div>
    );
  }

  return (
    <hr
      className={cn(
        "border-0 my-6",
        variant === "strong" ? "h-0.5" : "h-px",
        className,
      )}
      style={line(variant === "strong")}
    />
  );
}
