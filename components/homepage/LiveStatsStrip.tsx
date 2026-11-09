import "./home.css";
import "./home-next.css";

interface Stats {
  totalArticles: number;
  todayPublished: number;
  activeReaders: number;
}

export function LiveStatsStrip({
  stats,
  children,
}: {
  stats: Stats;
  children?: React.ReactNode;
}) {
  return (
    <div className="hp-stats">
      <div className="hp-w hp-stats-in">
        <span>
          <b>{stats.totalArticles.toLocaleString("en-US")}</b> stories published
        </span>
        <span>
          <b>{stats.todayPublished}</b> today
        </span>
        <span className="hp-live">
          <i aria-hidden /> <b>{stats.activeReaders}</b> reading now
        </span>
        {children && <div className="hp-stats-end">{children}</div>}
      </div>
    </div>
  );
}
