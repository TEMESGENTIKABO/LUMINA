import Link from "next/link";
import { Panel, Empty } from "./DashboardWidgets";
import { initials } from "./RecentActivity";

interface InReviewArticle {
  id: string;
  title_en: string;
  updatedAt: Date;
  author: { name: string | null; email: string | null };
}
interface RecentComment {
  id: string;
  content: string;
  articleSlug: string;
  createdAt: Date;
  user: { name: string | null; email: string | null };
}

const Avatar = ({
  name,
  email,
}: {
  name: string | null;
  email: string | null;
}) => (
  <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-aksum-black text-[11px] font-extrabold text-[#c79a45]">
    {initials(name, email)}
  </span>
);

export function NeedsAttention({
  inReview,
  recentComments,
}: {
  inReview: InReviewArticle[];
  recentComments: RecentComment[];
}) {
  if (inReview.length === 0 && recentComments.length === 0) return null;

  return (
    <div className="mb-6 grid gap-5 lg:grid-cols-2">
      <Panel
        title="Awaiting review"
        aside={inReview.length}
        className={
          inReview.length
            ? "border-[#e2cf9f] bg-gradient-to-b from-[#fbf6e8] to-white"
            : ""
        }
      >
        {inReview.length === 0 ? (
          <Empty>Nothing is waiting for review.</Empty>
        ) : (
          <ul className="divide-y divide-[#f0ece1]">
            {inReview.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-3.5 px-5 py-3.5 transition hover:bg-white/70"
              >
                <Avatar name={a.author.name} email={a.author.email} />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/articles/${a.id}`}
                    className="block truncate text-sm font-semibold hover:text-[#8a6414]"
                  >
                    {a.title_en}
                  </Link>
                  <div className="truncate text-xs text-[#6b665c]">
                    {a.author.name ?? a.author.email}
                  </div>
                </div>
                <Link
                  href={`/admin/articles/${a.id}`}
                  className="rounded-lg border border-[#e6e1d6] bg-white px-3 py-1.5 text-xs font-semibold transition hover:border-[#c79a45]"
                >
                  Review
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Recent comments" aside={recentComments.length}>
        {recentComments.length === 0 ? (
          <Empty>No comments yet.</Empty>
        ) : (
          <ul className="divide-y divide-[#f0ece1]">
            {recentComments.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3.5 px-5 py-3.5 transition hover:bg-[#faf8f3]"
              >
                <Avatar name={c.user.name} email={c.user.email} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">
                    {c.content}
                  </div>
                  <div className="truncate text-xs text-[#6b665c]">
                    {c.user.name ?? c.user.email} on {c.articleSlug}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
