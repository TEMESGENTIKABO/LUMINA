import { getFlagshipArticles } from "@/content/cms/fetchers/getFlagshipArticles";
import { CategoryHero } from "@/components/category/CategoryHero";
import { CategoryFeed } from "@/components/category/CategoryFeed";

export default async function InvestigationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const articles = await getFlagshipArticles("investigations");

  return (
    <main className="max-w-page mx-auto px-6 pt-8 pb-16 bg-aksum-black text-parchment-white -mx-6 px-6">
      <div className="max-w-page mx-auto">
        <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
          Investigations
        </h1>
        <p className="font-ui text-[length:var(--text-meta)] text-parchment-white/60 mt-1">
          No advertising runs alongside investigative work — see §8.
        </p>

        {articles.length === 0 ? (
          <p className="font-ui text-sm text-parchment-white/60 mt-8">
            No investigations published yet.
          </p>
        ) : (
          <>
            <div className="mt-8 [&_h2]:text-parchment-white [&_p]:text-parchment-white/70">
              <CategoryHero articles={articles.slice(0, 3)} locale={locale} />
            </div>
            <div className="[&_h3]:text-parchment-white [&_p]:text-parchment-white/70">
              <CategoryFeed articles={articles.slice(3)} locale={locale} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
