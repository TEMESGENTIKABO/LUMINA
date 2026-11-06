import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/content/cms/fetchers/getArticleBySlug";
import { getRelatedArticles } from "@/content/cms/fetchers/getRelatedArticles";
import { ReadingProgressBar } from "@/components/article/ReadingProgressBar";
import { ReadingInit } from "@/components/article/ReadingMode";
import { ShareBar } from "@/components/article/ShareBar";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleMeta } from "@/components/article/ArticleMeta";
import { HeroImage } from "@/components/article/HeroImage";
import { headers } from "next/headers";
import { PaywallGate } from "@/components/article/PaywallGate";
import { RelatedStoriesEnd } from "@/components/article/RelatedStoriesEnd";
import { CommentSection } from "@/components/article/CommentSection";
import { ArticleBodyRich } from "@/components/article/ArticleBodyRich";
import { getCommentsForArticle } from "@/content/cms/fetchers/getComments";
import { buildArticleMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { ViewTracker } from "@/components/article/ViewTracker";
import { buildArticleJsonLd } from "@/lib/structuredData";
import { tiptapDocToPlainText } from "@/lib/tiptapDoc";
import { getMostReadNow } from "@/content/cms/fetchers/getMostReadNow";
import { MostReadNowWidget } from "@/components/article/MostReadNowWidget";
import "@/components/article/article-modern.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return buildArticleMetadata({ ...article, locale });
}

export const revalidate = 300; // article pages refresh at most every 5 minutes

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  // Add paywall check right after confirming article exists
  const headersList = await headers();
  const isPaywallBlocked = headersList.get("x-paywall-blocked") === "true";

  const { comments, total, hasMore } = await getCommentsForArticle(
    article.slug,
  );
  const related = await getRelatedArticles(article.slug, article.category);
  const mostReadNow = await getMostReadNow(article.slug);
  const url = `https://aksum.example.com/${locale}/article/${article.slug}`;

  // Generate body text for ArticleMeta
  const bodyText = `${article.title_en}. ${article.dek_en}. ${tiptapDocToPlainText(
    locale === "am" && article.hasAmharicBody
      ? article.body_am
      : article.body_en,
  )}`;

  return (
    <>
      <ReadingProgressBar />
      <ReadingInit />
      <ViewTracker articleSlug={article.slug} />
      <ShareBar
        url={url}
        title={article.title_en}
        articleSlug={article.slug}
        locale={locale}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildArticleJsonLd(article)),
        }}
      />
      <article className="reading-surface">
        <ArticleHeader
          category={article.subcategory ?? article.category}
          accentColor={article.accentColor}
          title={article.title_en}
          dek={article.dek_en}
        />
        <ArticleMeta
          authorName={article.author.name}
          authorSlug={article.author.slug}
          locale={locale}
          articleSlug={article.slug}
          title={article.title_en}
          publishedAt={article.publishedAt}
          updatedAt={article.updatedAt}
          readTimeMinutes={article.readTimeMinutes}
          bodyText={bodyText}
        />
        <HeroImage
          src={article.heroImageUrl}
          alt={article.title_en}
          caption={article.heroImageCaption}
        />
        {isPaywallBlocked ? (
          <PaywallGate locale={locale} />
        ) : locale === "am" && article.hasAmharicBody ? (
          <ArticleBodyRich html={article.bodyHtmlAm!} lang="am" />
        ) : locale === "am" ? (
          <div className="max-w-content mx-auto px-6 mt-8">
            <p className="font-ui text-sm text-obsidian-grey border border-hairline p-4">
              ይህ እትየ በአማርኛ ኔርልዋ አላቀረበም። የእንግሊዝኛውን ቅጅ በታች እያንቃቁ።
              <br />
              <span className="text-xs text-obsidian-grey/60">
                This article is not yet available in Amharic. Showing the
                English version below.
              </span>
            </p>
            <div className="mt-4">
              <ArticleBodyRich html={article.bodyHtml} lang="en" />
            </div>
          </div>
        ) : (
          <ArticleBodyRich html={article.bodyHtml} lang="en" />
        )}
        <CommentSection
          articleSlug={article.slug}
          locale={locale}
          initialComments={comments}
          initialTotal={total}
          initialHasMore={hasMore}
        />
      </article>
      {mostReadNow.length > 0 && (
        <div className="max-w-content mx-auto px-6 mt-8">
          <MostReadNowWidget articles={mostReadNow} locale={locale} />
        </div>
      )}
      <RelatedStoriesEnd articles={related} locale={locale} />
    </>
  );
}
