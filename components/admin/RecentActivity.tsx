import Link from "next/link";
import { FileText } from "lucide-react";
import { Panel, Empty } from "./DashboardWidgets";

interface ActivityArticle {
  id: string;
  title_en: string;
  status: string;
  updatedAt: Date;
  author: { name: string | null; email: string | null };
  category: { name_en: string };
}

const STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  DRAFT: { label: "Draft", bg: "#f1efe9", fg: "#5b564c" },
  IN_REVIEW: { label: "In review", bg: "#e8f0fa", fg: "#245a8d" },
  SCHEDULED: { label: "Scheduled", bg: "#fbf1d9", fg: "#8a6414" },
  PUBLISHED: { label: "Published", bg: "#e7f5ee", fg: "#1b6b4a" },
  ARCHIVED: { label: "Archived", bg: "#eeeeec", fg: "#6b665c" },
};

function ago(d: Date) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000),
    h = Math.floor(diff / 3600000),
    days = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
export const initials = (name: string | null, email: string | null) =>
  (name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : (email ?? "?")
  )
    .slice(0, 2)
    .toUpperCase();

export function RecentActivity({ articles }: { articles: ActivityArticle[] }) {
  return (
    <Panel
      title="Recent activity"
      aside={`${articles.length} ${articles.length === 1 ? "article" : "articles"}`}
    >
      {articles.length === 0 ? (
        <Empty>
          <FileText className="mx-auto mb-2" size={22} />
          Articles will appear here once created.
        </Empty>
      ) : (
        <ul className="divide-y divide-[#f0ece1]">
          {articles.map((a) => {
            const s = STATUS[a.status] ?? STATUS.DRAFT;
            return (
              <li
                key={a.id}
                className="flex items-center gap-3.5 px-5 py-3.5 transition hover:bg-[#faf8f3]"
              >
                <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-aksum-black text-[11px] font-extrabold text-[#c79a45]">
                  {initials(a.author.name, a.author.email)}
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/articles/${a.id}`}
                    className="block truncate text-sm font-semibold hover:text-[#8a6414]"
                  >
                    {a.title_en}
                  </Link>
                  <div className="truncate text-xs text-[#6b665c]">
                    {a.author.name ?? a.author.email} · {a.category.name_en}
                  </div>
                </div>
                <span
                  className="hidden items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wide sm:inline-flex"
                  style={{ background: s.bg, color: s.fg }}
                >
                  <i className="h-1.5 w-1.5 rounded-full bg-current" />{" "}
                  {s.label}
                </span>
                <span className="w-16 flex-none text-right text-xs text-[#6b665c]">
                  {ago(a.updatedAt)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
