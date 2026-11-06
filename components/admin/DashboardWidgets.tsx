const STATUS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "#a39e91" },
  IN_REVIEW: { label: "In review", color: "#3b82c4" },
  SCHEDULED: { label: "Scheduled", color: "#d9a431" },
  PUBLISHED: { label: "Published", color: "#1f9d6b" },
  ARCHIVED: { label: "Archived", color: "#6b665c" },
};

export function Panel({
  title,
  aside,
  children,
  className = "",
}: {
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-[#e6e1d6] bg-white shadow-[0_1px_2px_rgba(18,16,13,0.04)] ${className}`}
    >
      <header className="flex items-center justify-between gap-3 border-b border-[#f0ece1] px-5 py-4">
        <h2 className="font-headline-en text-[17px] font-bold">{title}</h2>
        {aside && (
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#6b665c]">
            {aside}
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 py-10 text-center text-sm text-[#6b665c]">
      {children}
    </div>
  );
}

export function ActivityChart({
  days,
}: {
  days: { key: string; label: string; count: number }[];
}) {
  const max = Math.max(1, ...days.map((d) => d.count));
  return (
    <div
      className="flex h-44 items-end gap-1.5 px-5 pb-4 pt-6"
      role="img"
      aria-label="Articles created in the last 14 days"
    >
      {days.map((d) => (
        <div
          key={d.key}
          title={`${d.key}: ${d.count} article${d.count === 1 ? "" : "s"}`}
          className="group flex flex-1 flex-col items-center justify-end gap-1.5"
        >
          <span className="text-[10px] font-semibold text-[#6b665c] opacity-0 transition group-hover:opacity-100">
            {d.count}
          </span>
          <div
            className="w-full rounded-t-md bg-[#c79a45]/40 transition group-hover:bg-[#c79a45]"
            style={{ height: Math.max(4, (d.count / max) * 96) }}
          />
          <span className="text-[10px] text-[#6b665c]">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function StatusBreakdown({
  items,
}: {
  items: { status: string; count: number }[];
}) {
  const total = items.reduce((s, i) => s + i.count, 0);
  if (!total) return <Empty>No articles yet.</Empty>;
  return (
    <div className="p-5">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-[#f0ece1]">
        {items.map((i) => (
          <span
            key={i.status}
            style={{
              width: `${(i.count / total) * 100}%`,
              background: STATUS[i.status]?.color ?? "#999",
            }}
          />
        ))}
      </div>
      <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {items.map((i) => (
          <li key={i.status} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: STATUS[i.status]?.color ?? "#999" }}
            />
            {STATUS[i.status]?.label ?? i.status}
            <b className="ml-auto tabular-nums">{i.count}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TopCategories({
  items,
}: {
  items: { name: string; count: number }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  if (!items.length) return <Empty>No categories yet.</Empty>;
  return (
    <ul className="divide-y divide-[#f0ece1]">
      {items.map((i) => (
        <li key={i.name} className="px-5 py-3.5">
          <div className="mb-2 flex justify-between text-sm font-semibold">
            <span className="truncate">{i.name}</span>
            <span className="text-[#6b665c] tabular-nums">{i.count}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#f0ece1]">
            <div
              className="h-full rounded-full bg-[#c79a45]"
              style={{ width: `${(i.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
