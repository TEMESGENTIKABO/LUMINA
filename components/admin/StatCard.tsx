import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

type Tone = "indigo" | "green" | "slate" | "amber" | "pink" | "cyan";
const TONES: Record<Tone, { tint: string; tc: string }> = {
  indigo: { tint: "#eef2ff", tc: "#4338ca" },
  green: { tint: "#ecfdf5", tc: "#047857" },
  slate: { tint: "#f5f5f4", tc: "#57534e" },
  amber: { tint: "#fffbeb", tc: "#b45309" },
  pink: { tint: "#fdf2f8", tc: "#be185d" },
  cyan: { tint: "#ecfeff", tc: "#0e7490" },
};
const LEGACY: Record<string, Tone> = {
  default: "slate",
  gold: "amber",
  blue: "indigo",
  red: "pink",
};

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  tone?: Tone;
  accent?: "default" | "gold" | "blue" | "red";
  trend?: { direction: "up" | "down" | "flat"; value: string; label?: string };
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  accent = "default",
  trend,
}: StatCardProps) {
  const t = TONES[tone ?? LEGACY[accent]];
  const up = trend?.direction === "up";
  const down = trend?.direction === "down";
  const Arrow = up ? TrendingUp : down ? TrendingDown : Minus;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#e6e1d6] bg-white p-4 shadow-[0_1px_2px_rgba(18,16,13,0.04)] transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-16px_rgba(18,16,13,0.35)]">
      <div className="flex items-center justify-between gap-2">
        {Icon ? (
          <span
            className="grid h-9 w-9 place-items-center rounded-xl"
            style={{ background: t.tint, color: t.tc }}
          >
            <Icon size={18} />
          </span>
        ) : (
          <span />
        )}
        {trend && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums"
            style={{
              color: up ? "#047857" : down ? "#b3201f" : "#6b665c",
              background: up ? "#ecfdf5" : down ? "#fdecec" : "#f5f4f0",
            }}
          >
            <Arrow size={12} /> {trend.value}
          </span>
        )}
      </div>
      <div>
        <div className="font-headline-en text-[32px] font-bold leading-none tracking-tight tabular-nums">
          {typeof value === "number" ? value.toLocaleString("en-US") : value}
        </div>
        <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-[#6b665c]">
          {label}
        </div>
        {trend?.label && (
          <div className="mt-1 text-[11px] text-[#a09a8c]">{trend.label}</div>
        )}
      </div>
    </div>
  );
}
