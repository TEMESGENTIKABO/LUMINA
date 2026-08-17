"use client";

import Link from "next/link";
import { Clock, FileText, ArrowUpRight } from "lucide-react";

interface ActivityArticle {
  id: string;
  title_en: string;
  status: string;
  updatedAt: Date;
  author: { name: string | null; email: string | null };
  category: { name_en: string };
}

const statusConfig: Record<
  string,
  { label: string; dot: string; text: string; bg: string }
> = {
  DRAFT: {
    label: "Draft",
    dot: "bg-[#8b8f99]",
    text: "text-[#6b6f7a]",
    bg: "bg-[#f5f4f2]",
  },
  IN_REVIEW: {
    label: "In Review",
    dot: "bg-[#4a7c9b]",
    text: "text-[#4a7c9b]",
    bg: "bg-[#eef4f8]",
  },
  SCHEDULED: {
    label: "Scheduled",
    dot: "bg-[#c9a227]",
    text: "text-[#9a7b1a]",
    bg: "bg-[#faf6e8]",
  },
  PUBLISHED: {
    label: "Published",
    dot: "bg-[#4a7c6b]",
    text: "text-[#4a7c6b]",
    bg: "bg-[#eef5f2]",
  },
  ARCHIVED: {
    label: "Archived",
    dot: "bg-[#b8b5b0]",
    text: "text-[#8b8f99]",
    bg: "bg-[#f5f4f2]",
  },
};

function formatRelativeTime(d: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(d).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getInitials(name: string | null, email: string | null): string {
  if (name)
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  return email?.slice(0, 2).toUpperCase() ?? "??";
}

export function RecentActivity({ articles }: { articles: ActivityArticle[] }) {
  return (
    <div className="border border-[#e5e3df] bg-white">
      <div className="px-5 py-3.5 border-b border-[#e5e3df] bg-[#faf9f7] flex items-center justify-between">
        <h2 className="font-headline-en text-sm font-semibold text-[#1a1c23] tracking-tight">
          Recent Activity
        </h2>
        <span className="font-ui text-[11px] text-[#a5a39e] uppercase tracking-wider">
          {articles.length} {articles.length === 1 ? "article" : "articles"}
        </span>
      </div>

      {articles.length === 0 ? (
        <div className="px-5 py-10 flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-[#f5f4f2] border border-[#e5e3df] flex items-center justify-center">
            <FileText size={18} className="text-[#b8b5b0]" />
          </div>
          <div className="text-center">
            <p className="font-ui text-sm text-[#6b6f7a]">No recent activity</p>
            <p className="font-ui text-xs text-[#a5a39e] mt-1">
              Articles will appear here once created.
            </p>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-[#f0eeea]">
          {articles.map((article) => {
            const status = statusConfig[article.status] ?? statusConfig.DRAFT;

            return (
              <li
                key={article.id}
                className="px-5 py-3 flex items-center gap-4 hover:bg-[#faf9f7] transition-colors duration-100 group"
              >
                {/* Author Initials */}
                <div className="w-7 h-7 rounded-sm bg-[#1e2028] flex items-center justify-center flex-shrink-0">
                  <span className="font-ui text-[10px] font-semibold text-[#c9a227]">
                    {getInitials(article.author.name, article.author.email)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="font-ui text-sm font-medium text-[#1a1c23] hover:text-[#c9a227] transition-colors truncate"
                    >
                      {article.title_en}
                    </Link>
                    <ArrowUpRight
                      size={12}
                      className="text-[#d4d2cd] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    />
                  </div>
                  <p className="font-ui text-[11px] text-[#8b8f99] mt-0.5 truncate">
                    {article.author.name ?? article.author.email}
                    <span className="text-[#d4d2cd] mx-1.5">·</span>
                    <span className="text-[#a5a39e]">
                      {article.category.name_en}
                    </span>
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  {/* Status Pill */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm font-ui text-[10px] font-medium uppercase tracking-wider ${status.bg} ${status.text}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                    />
                    {status.label}
                  </span>

                  {/* Time */}
                  <div className="flex items-center gap-1.5 text-[#a5a39e] w-20 justify-end">
                    <Clock size={11} />
                    <span className="font-ui text-[11px] tabular-nums">
                      {formatRelativeTime(article.updatedAt)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
