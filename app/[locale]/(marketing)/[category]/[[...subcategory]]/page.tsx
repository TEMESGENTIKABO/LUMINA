import {
  getArticlesByCategory,
  getMostReadInCategory,
} from "@/content/cms/fetchers/getArticlesByCategory";
import { CategoryHero } from "@/components/category/CategoryHero";
import { CategoryFeed } from "@/components/category/CategoryFeed";
import { MostReadRail } from "@/components/category/MostReadRail";
import { buildCategoryMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; subcategory?: string[] }>;
}): Promise<Metadata> {
  const { locale, category, subcategory } = await params;
  const name = subcategory?.[0] ?? category;
  return buildCategoryMetadata(
    name,
    locale,
    subcategory ? `${category}/${subcategory[0]}` : category,
  );
}
interface Props {
  params: Promise<{
    locale: string;
    category: string;
    subcategory?: string[];
  }>;
}
export const revalidate = 120;
export default async function CategoryPage({ params }: Props) {
  const { locale, category, subcategory } = await params;
  const activeSubcategory = subcategory?.[0];

  const articles = await getArticlesByCategory(category, activeSubcategory);
  const mostRead = await getMostReadInCategory(category);

  const heroArticles = articles.slice(0, 3);
  const feedArticles = articles.slice(3);

  return (
    <main className="max-w-page mx-auto px-6 pt-8">
      <div className="mb-8">
        <h1 className="font-headline-en text-[length:var(--text-headline-xl)] capitalize">
          {activeSubcategory ?? category}
        </h1>
        {activeSubcategory && (
          <p className="font-ui text-[length:var(--text-meta)] text-obsidian-grey mt-1 capitalize">
            {category} / {activeSubcategory}
          </p>
        )}
      </div>

      {articles.length === 0 ? (
        <p className="font-ui text-sm text-obsidian-grey pb-16">
          No stories published in this section yet.
        </p>
      ) : (
        <>
          <CategoryHero articles={heroArticles} locale={locale} />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-16">
            <div className="lg:col-span-3">
              <CategoryFeed articles={feedArticles} locale={locale} />
            </div>
            <MostReadRail articles={mostRead} locale={locale} />
          </div>
        </>
      )}
    </main>
  );
}
