import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageAllArticles } from "@/lib/admin/permissions";
import { ArticlesFilterBar } from "./ArticlesFilterBar";
import { ArticlesTable } from "./ArticlesTable";
import { SavedFilterPresets } from "@/components/admin/SavedFilterPresets";
const PAGE_SIZE = 20;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; category?: string; author?: string; page?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  const canSeeAll = session?.user && canManageAllArticles(session.user.role);
  const page = Number(params.page ?? "1");

  const where: Prisma.ArticleWhereInput = canSeeAll ? {} : { authorId: session?.user?.id };
  if (params.q) where.title_en = { contains: params.q, mode: "insensitive" };
  if (params.status && ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"].includes(params.status)) {
    where.status = params.status as Prisma.ArticleWhereInput["status"];
  }
  if (params.category) where.categoryId = params.category;
  if (params.author) where.authorId = params.author;

  const [articles, total, categories, authors] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: { author: true, category: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.article.count({ where }),
    prisma.category.findMany({ orderBy: { name_en: "asc" }, select: { id: true, name_en: true } }),
    prisma.user.findMany({
      where: { role: { in: ["AUTHOR", "EDITOR", "ADMIN"] } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const buildPageUrl = (p: number) => {
    const usp = new URLSearchParams();
    if (params.q) usp.set("q", params.q);
    if (params.status) usp.set("status", params.status);
    if (params.category) usp.set("category", params.category);
    if (params.author) usp.set("author", params.author);
    usp.set("page", String(p));
    return `/admin/articles?${usp.toString()}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-en text-2xl">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2"
        >
          New Article
        </Link>
      </div>
      <SavedFilterPresets />
      <ArticlesFilterBar
        categories={categories.map((c) => ({ id: c.id, label: c.name_en }))}
        authors={authors.map((a) => ({
          id: a.id,
          label: a.name ?? a.email ?? "Unknown",
        }))}
      />

      <p className="font-ui text-xs text-obsidian-grey mb-3">
        {total} article{total !== 1 ? "s" : ""} found
      </p>

      {articles.length === 0 ? (
        <p className="font-ui text-sm text-obsidian-grey">
          No articles match these filters.
        </p>
      ) : (
        <>
          <ArticlesTable articles={articles} />
          {totalPages > 1 && (
            <div className="flex items-center gap-4 mt-6">
              {page > 1 && (
                <Link
                  href={buildPageUrl(page - 1)}
                  className="font-ui text-sm text-obsidian-grey hover:text-aksum-black"
                >
                  Previous
                </Link>
              )}
              <span className="font-ui text-xs text-obsidian-grey">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={buildPageUrl(page + 1)}
                  className="font-ui text-sm text-obsidian-grey hover:text-aksum-black"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
