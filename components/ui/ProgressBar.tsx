import { cn } from "@/lib/cn";

const TONES = {
  gold: "bg-aksum-gold",
  red: "bg-manuscript-red",
  blue: "bg-lalibela-blue",
} as const;
const HEIGHTS = { sm: "h-1", md: "h-2", lg: "h-3" } as const;

/**
 * Determinate progress (pass `value`) or indeterminate (omit it).
 * `label` is the accessible name and, with `showValue`, the visible caption.
 */
export function ProgressBar({
  value,
  max = 100,
  label,
  tone = "gold",
  size = "md",
  showValue = false,
  className,
}: {
  value?: number;
  max?: number;
  label: string;
  tone?: keyof typeof TONES;
  size?: keyof typeof HEIGHTS;
  showValue?: boolean;
  className?: string;
}) {
  const indeterminate = value === undefined;
  const pct = indeterminate
    ? 100
    : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      {showValue && !indeterminate && (
        <div className="mb-1.5 flex justify-between font-ui text-xs text-obsidian-grey">
          <span>{label}</span>
          <span className="tabular-nums">{Math.round(pct)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
        className={cn(
          "w-full overflow-hidden rounded-full bg-obsidian-grey/10",
          HEIGHTS[size],
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none",
            TONES[tone],
            indeterminate && "animate-pulse motion-reduce:animate-none",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
