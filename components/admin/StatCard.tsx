import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  trend?: { direction: "up" | "down" | "flat"; value: string; label?: string };
  accent?: "default" | "gold" | "blue" | "red";
}

const accentMap = {
  default: { icon: "bg-[#f5f4f2] text-[#6b6f7a]", glow: "from-[#8b8f99]/10" },
  gold: { icon: "bg-[#faf6e8] text-[#b08d1a]", glow: "from-[#c9a227]/15" },
  blue: { icon: "bg-[#eef4f8] text-[#4a7c9b]", glow: "from-[#4a7c9b]/15" },
  red: { icon: "bg-[#fbeeee] text-[#9b4a4a]", glow: "from-[#9b4a4a]/12" },
};

export function StatCard({ label, value, icon: Icon, trend, accent = "default" }: StatCardProps) {
  const a = accentMap[accent];
  const trendColor =
    trend?.direction === "up" ? "text-[#4a7c6b] bg-[#eef5f2]"
    : trend?.direction === "down" ? "text-[#9b4a4a] bg-[#fbeeee]"
    : "text-[#6b6f7a] bg-[#f5f4f2]";

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-[#e5e3df] p-5 shadow-[0_1px_2px_rgba(26,28,35,0.04)] hover:shadow-[0_8px_24px_-8px_rgba(26,28,35,0.12)] hover:-translate-y-0.5 transition-all duration-200">
      <div className={`pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${a.glow} to-transparent blur-2xl`} />
      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <p className="font-ui text-xs font-medium text-[#6b6f7a]">{label}</p>
          <p className="font-headline-en text-3xl mt-2 text-[#1a1c23] tracking-tight tabular-nums">{value}</p>
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 ${a.icon}`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      {trend && (
        <div className="relative flex items-center gap-2 mt-4">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-ui text-xs font-medium tabular-nums ${trendColor}`}>
            {trend.direction === "up" ? <TrendingUp size={12} /> : trend.direction === "down" ? <TrendingDown size={12} /> : <Minus size={12} />}
            {trend.value}
          </span>
          {trend.label && <span className="font-ui text-[11px] text-[#a5a39e]">{trend.label}</span>}
        </div>
      )}
    </div>
  );
}
