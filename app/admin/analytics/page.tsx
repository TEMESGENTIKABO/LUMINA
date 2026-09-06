import Link from "next/link";
import { getViewsOverTime, getTopArticles, getViewsByCategory } from "@/lib/admin/getAnalytics";
import { ViewsOverTimeChart, CategoryViewsChart } from "./AnalyticsCharts";

export default async function AnalyticsPage() {
  const [viewsOverTime, topArticles, categoryViews] = await Promise.all([
    getViewsOverTime(14),
    getTopArticles(10),
    getViewsByCategory(),
  ]);

  const totalViews = viewsOverTime.reduce((sum, d) => sum + d.views, 0);

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-2">Analytics</h1>
      <p className="font-ui text-sm text-obsidian-grey mb-6">{totalViews} article views in the last 14 days</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="border border-obsidian-grey/10 p-5">
          <p className="section-label text-obsidian-grey/60 mb-4">Views, Last 14 Days</p>
          {totalViews === 0 ? (
            <p className="font-ui text-sm text-obsidian-grey">No view data yet.</p>
          ) : (
            <ViewsOverTimeChart data={viewsOverTime} />
          )}
        </div>

        <div className="border border-obsidian-grey/10 p-5">
          <p className="section-label text-obsidian-grey/60 mb-4">Views by Category</p>
          {categoryViews.length === 0 ? (
            <p className="font-ui text-sm text-obsidian-grey">No view data yet.</p>
          ) : (
            <CategoryViewsChart data={categoryViews} />
          )}
        </div>
      </div>

      <div className="border border-obsidian-grey/10 p-5">
        <p className="section-label text-obsidian-grey/60 mb-4">Top Articles</p>
        {topArticles.length === 0 ? (
          <p className="font-ui text-sm text-obsidian-grey">No view data yet.</p>
        ) : (
          <div className="divide-y divide-hairline">
            {topArticles.map((a, i) => (
              <div key={a.slug} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <span className="font-ui text-xs text-obsidian-grey/40 tabular-nums w-4">{i + 1}</span>
                  <div>
                    <Link href={`/admin/articles`} className="font-ui text-sm hover:text-manuscript-red">{a.title}</Link>
                    <p className="font-ui text-xs text-obsidian-grey/60">{a.category}</p>
                  </div>
                </div>
                <span className="font-ui text-sm tabular-nums text-obsidian-grey">{a.views} views</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
