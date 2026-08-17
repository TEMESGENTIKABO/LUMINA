import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { mockArticles } from "@/content/cms/mock/articles";
import { ArticleCard } from "@/components/ui/Card";

export default async function SavedArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const saved = await prisma.savedArticle.findMany({
    where: { userId: session?.user?.id },
  });
  const articles = saved
    .map((s) => mockArticles.find((a) => a.slug === s.articleSlug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <div>
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
        Saved Articles
      </h1>
      {articles.length === 0 ? (
        <p className="font-ui text-sm text-obsidian-grey mt-6">
          Nothing saved yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
