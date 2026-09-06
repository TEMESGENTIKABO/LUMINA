import { Hero } from "@/components/homepage/Hero";
import { LatestNewsFeed } from "@/components/homepage/LatestNewsFeed";
import { TrendingRail } from "@/components/homepage/TrendingRail";
import { PoliticsAnalysis } from "@/components/homepage/PoliticsAnalysis";
import { EntertainmentSpotlight } from "@/components/homepage/EntertainmentSpotlight";
import { CultureStories } from "@/components/homepage/CultureStories";
import { BusinessInsights } from "@/components/homepage/BusinessInsights";
import { TechnologyGrid } from "@/components/homepage/TechnologyGrid";
import { InvestigationsFeature } from "@/components/homepage/InvestigationsFeature";
import { VideoCarousel } from "@/components/homepage/VideoCarousel";
import { PodcastCarousel } from "@/components/homepage/PodcastCarousel";
import { NewsletterBand } from "@/components/homepage/NewsletterBand";
import { CommunityModule } from "@/components/homepage/CommunityModule";
import { ForYouRail } from "@/components/homepage/ForYouRail";
import { getAllEvents } from "@/content/cms/fetchers/getEvents";
import { getHomepageArticles } from "@/content/cms/fetchers/getHomepageArticles";
import { getArticlesByCategory } from "@/content/cms/fetchers/getArticlesByCategory";
import { getTrendingArticles } from "@/content/cms/fetchers/getTrending";
import { getFlagshipArticles } from "@/content/cms/fetchers/getFlagshipArticles";
import { getAllVideos } from "@/content/cms/fetchers/getVideo";
import {
  getAllShows,
  getShowBySlug,
} from "@/content/cms/fetchers/getPodcastEpisode";
import { getMostDiscussed } from "@/content/cms/fetchers/getMostDiscussed";
import { getForYouArticles } from "@/content/cms/fetchers/getForYouArticles";
import { buildHomepageMetadata } from "@/lib/seo";
import { auth } from "@/auth";
import { getReadingHistory } from "@/content/cms/fetchers/getReadingHistory";
import { ContinueReadingRail } from "@/components/homepage/ContinueReadingRail";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildHomepageMetadata(locale);
}

export const revalidate = 60; // homepage refreshes at most once per minute

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [
    articles,
    trending,
    politics,
    entertainment,
    culture,
    businessTech,
    technology,
    investigations,
    videos,
    events,
    shows,
    discussed,
  ] = await Promise.all([
    getHomepageArticles(),
    getTrendingArticles(),
    getArticlesByCategory("news", "politics"),
    getArticlesByCategory("culture", "entertainment"),
    getArticlesByCategory("culture"),
    getArticlesByCategory("business-tech"),
    getArticlesByCategory("business-tech", "technology"),
    getFlagshipArticles("investigations"),
    getAllVideos(),
    getAllEvents(),
    getAllShows(),
    getMostDiscussed(),
  ]);
const session = await auth();
const forYouArticles = session?.user?.id
  ? await getForYouArticles(session.user.id)
  : [];
const readingHistory = session?.user?.id
  ? await getReadingHistory(session.user.id)
  : [];
  const firstShowEpisodes = shows[0]
    ? ((await getShowBySlug(shows[0].slug))?.episodes ?? []).map((episode) => ({
        ...episode,
        createdAt: episode.createdAt
          ? new Date(episode.createdAt).toISOString()
          : "",
        publishedAt: episode.publishedAt
          ? new Date(episode.publishedAt).toISOString()
          : "",
        showSlug: shows[0].slug,
      }))
    : [];

  return (
    <>
      <Hero articles={articles} locale={locale} />
      <LatestNewsFeed articles={articles} locale={locale} />

      <div className="max-w-page mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <PoliticsAnalysis articles={politics} locale={locale} />
        </div>
        <TrendingRail items={trending} locale={locale} />
      </div>

      <EntertainmentSpotlight articles={entertainment} locale={locale} />
      <CultureStories articles={culture} locale={locale} />
      <BusinessInsights articles={businessTech} locale={locale} />
      <TechnologyGrid articles={technology} locale={locale} />
      <InvestigationsFeature
        article={investigations[0] ?? null}
        locale={locale}
      />
      <VideoCarousel videos={videos} locale={locale} />
      <PodcastCarousel episodes={firstShowEpisodes} locale={locale} />
      <NewsletterBand />
      <CommunityModule discussed={discussed} events={events} locale={locale} />
      <ContinueReadingRail articles={readingHistory} locale={locale} />
      <ForYouRail articles={forYouArticles} locale={locale} />
    </>
  );
}
