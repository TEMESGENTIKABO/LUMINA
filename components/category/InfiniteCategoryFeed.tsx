"use client";

import { useEffect, useRef, useState } from "react";
import { ArticleCard } from "@/components/ui/Card";
import type { Article } from "@/content/types/Article";

export function InfiniteCategoryFeed({
  categorySlug,
  locale,
  initialHasMore,
}: {
  categorySlug: string;
  locale: string;
  initialHasMore: boolean;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) loadMore();
      },
      { rootMargin: "400px" }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, page]);

  async function loadMore() {
    setLoading(true);
    const res = await fetch(`/api/category-feed?category=${categorySlug}&page=${page}`);
    const data = await res.json();
    setArticles((prev) => [...prev, ...data.articles]);
    setHasMore(data.hasMore);
    setPage((p) => p + 1);
    setLoading(false);
  }

  if (articles.length === 0 && !hasMore) return null;

  return (
    <>
      {articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 mt-8">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} locale={locale} />
          ))}
        </div>
      )}
      {hasMore && (
        <div ref={sentinelRef} className="py-8 text-center">
          <p className="font-ui text-xs text-obsidian-grey/50">{loading ? "Loading more..." : ""}</p>
        </div>
      )}
    </>
  );
}
