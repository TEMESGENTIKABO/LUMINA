import Link from "next/link";
import { getFlagshipArticles } from "@/content/cms/fetchers/getFlagshipArticles";
import { ArticleCard } from "@/components/ui/Card";

export default async function MagazinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [opinion, investigations] = await Promise.all([
    getFlagshipArticles("opinion"),
    getFlagshipArticles("investigations"),
  ]);

  return (
    <main className="max-w-page mx-auto px-6 pt-8 pb-16">
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
        Magazine
      </h1>
      <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-2 max-w-content">
        Opinion, investigations, and long-form journalism — the work that
        doesn&apos;t chase the news cycle.
      </p>

      {/* Opinion section */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between border-b border-obsidian-grey/10 pb-3">
          <h2 className="font-headline-en text-[length:var(--text-headline-lg)]">
            Opinion
          </h2>
          <Link
            href={`/${locale}/opinion`}
            className="font-ui text-sm text-obsidian-grey hover:text-aksum-black"
          >
            View all →
          </Link>
        </div>
        {opinion.length === 0 ? (
          <p className="font-ui text-sm text-obsidian-grey mt-6">
            No opinion pieces published yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mt-8">
            {opinion.slice(0, 3).map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                locale={locale}
              />
            ))}
          </div>
        )}
      </section>

      {/* Investigations section — dark treatment, same prestige logic as its own hub */}
      <section className="mt-16 -mx-6 px-6 py-12 bg-aksum-black">
        <div className="max-w-page mx-auto">
          <div className="flex items-baseline justify-between border-b border-parchment-white/10 pb-3">
            <h2 className="font-headline-en text-[length:var(--text-headline-lg)] text-parchment-white">
              Investigations
            </h2>
            <Link
              href={`/${locale}/investigations`}
              className="font-ui text-sm text-parchment-white/60 hover:text-parchment-white"
            >
              View all →
            </Link>
          </div>
          {investigations.length === 0 ? (
            <p className="font-ui text-sm text-parchment-white/60 mt-6">
              No investigations published yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mt-8 [&_h3]:text-parchment-white [&_p]:text-parchment-white/70">
              {investigations.slice(0, 3).map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Digital Editions */}
      <section className="mt-16 border-t border-obsidian-grey/10 pt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-headline-en text-[length:var(--text-headline-lg)]">
            Digital Editions
          </h2>
          <Link
            href={`/${locale}/magazine/editions`}
            className="font-ui text-sm text-obsidian-grey hover:text-aksum-black"
          >
            View archive →
          </Link>
        </div>
        <p className="font-ui text-sm text-obsidian-grey mt-3">
          The month&apos;s best long-form work, bundled monthly.
        </p>
      </section>
    </main>
  );
}
