import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/content/cms/fetchers/getArticleBySlug";
import { getRelatedArticles } from "@/content/cms/fetchers/getRelatedArticles";
import { ReadingProgressBar } from "@/components/article/ReadingProgressBar";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleMeta } from "@/components/article/ArticleMeta";
import { HeroImage } from "@/components/article/HeroImage";
import { ShareRail } from "@/components/article/ShareRail";
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
  const url = `https://aksum.example.com/${locale}/article/${article.slug}`;

  return (
    <>
      <ReadingProgressBar />
      <ViewTracker articleSlug={article.slug} />
      <ShareRail
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
      <article>
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
          publishedAt={article.publishedAt}
          updatedAt={article.updatedAt}
          readTimeMinutes={article.readTimeMinutes}
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
              \u12ED\u1205 \u12A5\u1275\u12E8 \u1260\u12A0\u121B\u122D\u129B
              \u1268\u122D\u120D\u12CB
              \u12A0\u120B\u1240\u1228\u1260\u121D\u1362
              \u12E8\u12A5\u1295\u130D\u120A\u12DD\u129B\u12CD\u1295
              \u1245\u1305 \u1260\u1273\u127E
              \u12A5\u12EB\u1295\u1263\u1261\u1362
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

      <RelatedStoriesEnd articles={related} locale={locale} />
    </>
  );
}
