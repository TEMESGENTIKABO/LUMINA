import Link from "next/link";
import { Clock, MessageSquare, CheckCircle2 } from "lucide-react";

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

function Panel({
  title,
  count,
  icon,
  tone,
  children,
}: {
  title: string;
  count?: number;
  icon: React.ReactNode;
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-[#e5e3df] shadow-[0_1px_2px_rgba(26,28,35,0.04)] overflow-hidden">
      <header className="flex items-center justify-between px-5 py-4 border-b border-[#f0eeea]">
        <div className="flex items-center gap-3">
          <span
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${tone}`}
          >
            {icon}
          </span>
          <h2 className="font-headline-en text-sm font-semibold text-[#1a1c23]">
            {title}
          </h2>
        </div>
        {count !== undefined && count > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-[#f5f4f2] font-ui text-xs font-medium text-[#6b6f7a] tabular-nums">
            {count}
          </span>
        )}
      </header>
      <div className="p-2">{children}</div>
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-8">
      <CheckCircle2 size={20} className="text-[#b8b5b0]" />
      <p className="font-ui text-sm text-[#8b8f99]">{text}</p>
    </div>
  );
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Panel
        title="Awaiting Review"
        count={inReview.length}
        icon={<Clock size={15} />}
        tone="bg-[#eef4f8] text-[#4a7c9b]"
      >
        {inReview.length === 0 ? (
          <Empty text="Nothing waiting for review." />
        ) : (
          <ul>
            {inReview.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/articles/${a.id}`}
                  className="flex items-center justify-between gap-4 px-3 py-2.5 rounded-xl hover:bg-[#faf9f7] transition-colors group"
                >
                  <span className="font-ui text-sm font-medium text-[#1a1c23] group-hover:text-[#9a7b1a] truncate transition-colors">
                    {a.title_en}
                  </span>
                  <span className="font-ui text-xs text-[#8b8f99] flex-shrink-0">
                    {a.author.name ?? a.author.email}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel
        title="Recent Comments"
        count={recentComments.length}
        icon={<MessageSquare size={15} />}
        tone="bg-[#faf6e8] text-[#b08d1a]"
      >
        {recentComments.length === 0 ? (
          <Empty text="No comments yet." />
        ) : (
          <ul>
            {recentComments.map((c) => (
              <li
                key={c.id}
                className="px-3 py-2.5 rounded-xl hover:bg-[#faf9f7] transition-colors"
              >
                <p className="font-ui text-xs text-[#8b8f99]">
                  <span className="font-medium text-[#6b6f7a]">
                    {c.user.name ?? c.user.email}
                  </span>{" "}
                  on {c.articleSlug}
                </p>
                <p className="font-ui text-sm text-[#1a1c23] truncate mt-0.5">
                  {c.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
