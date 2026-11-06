import "@/components/homepage/home.css";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  getArticlesByCategory,
  getMostReadInCategory,
} from "@/content/cms/fetchers/getArticlesByCategory";
import { CategoryHero } from "@/components/category/CategoryHero";
import { CategoryFeed } from "@/components/category/CategoryFeed";
import { CategoryPills } from "@/components/category/CategoryPills";
import { MostReadRail } from "@/components/category/MostReadRail";
import { InfiniteCategoryFeed } from "@/components/category/InfiniteCategoryFeed";
import { SectionHead } from "@/components/homepage/SectionHead";
import { getLabels } from "@/lib/labels";
import { buildCategoryMetadata } from "@/lib/seo";

type Params = { locale: string; category: string; subcategory?: string[] };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, category, subcategory } = await params;
  const name = subcategory?.[0] ?? category;
  return buildCategoryMetadata(
    name,
    locale,
    subcategory ? `${category}/${subcategory[0]}` : category,
  );
}

export const revalidate = 120;

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, category, subcategory } = await params;
  const active = subcategory?.[0];
  const L = getLabels(locale);

  const [articles, mostRead, parent] = await Promise.all([
    getArticlesByCategory(category, active),
    getMostReadInCategory(category),
    prisma.category.findUnique({ where: { slug: category } }),
  ]);
  const subs = parent
    ? (
        await prisma.category.findMany({
          where: { parentId: parent.id },
          orderBy: { name_en: "asc" },
        })
      ).map((c) => ({
        slug: c.slug,
        name: locale === "am" && c.name_am ? c.name_am : c.name_en,
      }))
    : [];

  const title = active
    ? (subs.find((s) => s.slug === active)?.name ?? active)
    : (parent?.name_en ?? category);

  return (
    <div className="hp">
      <div className="hp-w" style={{ padding: "36px 20px 64px" }}>
        <SectionHead kicker={active ? category : L.allStories} title={title} />
        <CategoryPills
          locale={locale}
          category={category}
          subs={subs}
          active={active}
          allLabel={L.allStories}
        />

        {articles.length === 0 ? (
          <p style={{ color: "var(--hp-mut)" }}>{L.noStories}</p>
        ) : (
          <>
            <CategoryHero articles={articles.slice(0, 3)} locale={locale} />
            <div className="hp-main" style={{ marginTop: 8 }}>
              <div>
                <CategoryFeed articles={articles.slice(3)} locale={locale} />
                <InfiniteCategoryFeed
                  categorySlug={active ?? category}
                  locale={locale}
                  initialHasMore={articles.length > 9}
                />
              </div>
              <MostReadRail articles={mostRead} locale={locale} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
