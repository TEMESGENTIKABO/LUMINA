import { getFlagshipArticles } from "@/content/cms/fetchers/getFlagshipArticles";
import { CategoryHero } from "@/components/category/CategoryHero";
import { CategoryFeed } from "@/components/category/CategoryFeed";

export default async function OpinionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const articles = await getFlagshipArticles("opinion");

  return (
    <main className="max-w-page mx-auto px-6 pt-8 pb-16">
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
        Opinion
      </h1>
      <p className="font-ui text-[length:var(--text-meta)] text-obsidian-grey mt-1">
        Clearly labeled, independently voiced — see §1.6 editorial philosophy.
      </p>

      {articles.length === 0 ? (
        <p className="font-ui text-sm text-obsidian-grey mt-8">
          No opinion pieces published yet.
        </p>
      ) : (
        <>
          <div className="mt-8">
            <CategoryHero articles={articles.slice(0, 3)} locale={locale} />
          </div>
          <CategoryFeed articles={articles.slice(3)} locale={locale} />
        </>
      )}
    </main>
  );
}
