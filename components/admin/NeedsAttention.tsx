import Link from "next/link";

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

export function NeedsAttention({
  inReview,
  recentComments,
}: {
  inReview: InReviewArticle[];
  recentComments: RecentComment[];
}) {
  if (inReview.length === 0 && recentComments.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="border border-lalibela-blue/30 bg-lalibela-blue/[0.03] p-5">
        <p className="section-label text-lalibela-blue mb-3">Awaiting Review ({inReview.length})</p>
        {inReview.length === 0 ? (
          <p className="font-ui text-sm text-obsidian-grey">Nothing waiting for review.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {inReview.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3">
                <Link href={`/admin/articles/${a.id}`} className="font-ui text-sm hover:text-manuscript-red truncate">{a.title_en}</Link>
                <span className="font-ui text-xs text-obsidian-grey flex-shrink-0">{a.author.name ?? a.author.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border border-obsidian-grey/10 p-5">
        <p className="section-label text-obsidian-grey/60 mb-3">Recent Comments</p>
        {recentComments.length === 0 ? (
          <p className="font-ui text-sm text-obsidian-grey">No comments yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {recentComments.map((c) => (
              <li key={c.id}>
                <p className="font-ui text-xs text-obsidian-grey">{c.user.name ?? c.user.email} on {c.articleSlug}</p>
                <p className="font-ui text-sm truncate">{c.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
