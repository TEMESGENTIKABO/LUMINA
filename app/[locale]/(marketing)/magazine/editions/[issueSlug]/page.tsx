import { notFound } from "next/navigation";
import { getEditionBySlug } from "@/content/cms/fetchers/getDigitalEdition";
import { ArticleCard } from "@/components/ui/Card";

export default async function EditionPage({
  params,
}: {
  params: Promise<{ locale: string; issueSlug: string }>;
}) {
  const { locale, issueSlug } = await params;
  const result = await getEditionBySlug(issueSlug);
  if (!result) notFound();

  return (
    <main className="max-w-page mx-auto px-6 pt-12 pb-20">
      <p className="font-ui text-[length:var(--text-meta)] text-manuscript-red uppercase tracking-wide">
        {result.edition.issueLabel}
      </p>
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)] mt-2">
        {result.edition.headline}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mt-10">
        {result.articles.map((article) => (
          <ArticleCard key={article.slug} article={article} locale={locale} />
        ))}
      </div>
    </main>
  );
}
