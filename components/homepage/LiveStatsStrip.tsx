interface Stats {
  totalArticles: number;
  todayPublished: number;
  activeReaders: number;
}

export function LiveStatsStrip({ stats, children }: { stats: Stats; children?: React.ReactNode }) {
  return (
    <div className="border-y border-hairline bg-obsidian-grey/[0.02]">
      <div className="max-w-page mx-auto px-6 h-9 flex items-center gap-6 overflow-x-auto">
        <span className="font-ui text-xs text-obsidian-grey tabular-nums whitespace-nowrap">
          <strong className="text-aksum-black">{stats.totalArticles.toLocaleString()}</strong> stories published
        </span>
        <span className="w-px h-3 bg-obsidian-grey/20 flex-shrink-0" />
        <span className="font-ui text-xs text-obsidian-grey tabular-nums whitespace-nowrap">
          <strong className="text-aksum-black">{stats.todayPublished}</strong> today
        </span>
        <span className="w-px h-3 bg-obsidian-grey/20 flex-shrink-0" />
        <span className="font-ui text-xs text-obsidian-grey tabular-nums whitespace-nowrap flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-manuscript-red rounded-full animate-pulse" />
          <strong className="text-aksum-black">{stats.activeReaders}</strong> reading right now
        </span>
        {children}
      </div>
    </div>
  );
}
