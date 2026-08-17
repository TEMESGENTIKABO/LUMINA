import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  trend?: {
    direction: "up" | "down" | "flat";
    value: string;
    label?: string;
  };
  accent?: "default" | "gold" | "blue" | "red";
}

const accentMap = {
  default: "border-[#e5e3df]",
  gold: "border-l-[3px] border-l-[#c9a227] border-t border-r border-b border-[#e5e3df]",
  blue: "border-l-[3px] border-l-[#4a7c9b] border-t border-r border-b border-[#e5e3df]",
  red: "border-l-[3px] border-l-[#9b4a4a] border-t border-r border-b border-[#e5e3df]",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "default",
}: StatCardProps) {
  return (
    <div className={`bg-white p-5 ${accentMap[accent]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-ui text-[11px] font-medium uppercase tracking-wider text-[#8b8f99]">
            {label}
          </p>
          <p className="font-headline-en text-2xl mt-2 text-[#1a1c23] tracking-tight">
            {value}
          </p>
        </div>
        {Icon && (
          <div className="w-8 h-8 flex items-center justify-center bg-[#faf9f7] border border-[#e5e3df] flex-shrink-0 ml-3">
            <Icon size={15} className="text-[#8b8f99]" />
          </div>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#f0eeea]">
          <TrendIndicator direction={trend.direction} />
          <span
            className={`font-ui text-xs font-medium tabular-nums ${
              trend.direction === "up"
                ? "text-[#4a7c6b]"
                : trend.direction === "down"
                  ? "text-[#9b4a4a]"
                  : "text-[#8b8f99]"
            }`}
          >
            {trend.value}
          </span>
          {trend.label && (
            <span className="font-ui text-[11px] text-[#a5a39e]">
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function TrendIndicator({ direction }: { direction: "up" | "down" | "flat" }) {
  if (direction === "up")
    return <TrendingUp size={13} className="text-[#4a7c6b]" />;
  if (direction === "down")
    return <TrendingDown size={13} className="text-[#9b4a4a]" />;
  return <Minus size={13} className="text-[#8b8f99]" />;
}
