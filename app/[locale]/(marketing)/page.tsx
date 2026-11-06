import "@/components/homepage/home.css";
import type { Metadata } from "next";
import { HeroCarousel } from "@/components/homepage/HeroCarousel";
import { LatestCards } from "@/components/homepage/LatestCards";
import { InFocusBand } from "@/components/homepage/InFocusBand";
import { LatestNewsFeed } from "@/components/homepage/LatestNewsFeed";
import { TrendingRail } from "@/components/homepage/TrendingRail";
import { EntertainmentSpotlight } from "@/components/homepage/EntertainmentSpotlight";
import { BusinessInsights } from "@/components/homepage/BusinessInsights";
import { InvestigationsFeature } from "@/components/homepage/InvestigationsFeature";
import { VideoCarousel } from "@/components/homepage/VideoCarousel";
import { PodcastCarousel } from "@/components/homepage/PodcastCarousel";
import { NewsletterBand } from "@/components/homepage/NewsletterBand";
import { CommunityModule } from "@/components/homepage/CommunityModule";
import { SectionTabs } from "@/components/homepage/SectionTabs";
import { FeaturedTopicsRail } from "@/components/homepage/FeaturedTopicsRail";
import { EditorsPicksStrip } from "@/components/homepage/EditorsPicksStrip";
import { PersonalizedRails } from "@/components/homepage/PersonalizedRails";
import { Reveal } from "@/components/ui/Reveal";
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
import { getEditorsPicks } from "@/content/cms/fetchers/getEditorsPicks";
import { getFeaturedTopics } from "@/content/cms/fetchers/getFeaturedTopics";
import { getSiteSettings } from "@/content/cms/fetchers/getSiteSettings";
import { buildHomepageMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildHomepageMetadata(locale);
}

export const revalidate = 60;

// A failing secondary section should never take the whole homepage down.
async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error("Homepage section failed:", error);
    return fallback;
  }
}

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
    opinion,
    videos,
    events,
    shows,
    discussed,
    editorsPicks,
    featuredTopics,
    settings,
  ] = await Promise.all([
    getHomepageArticles(),
    safe(getTrendingArticles(), []),
    safe(getArticlesByCategory("news", "politics"), []),
    safe(getArticlesByCategory("culture", "entertainment"), []),
    safe(getArticlesByCategory("culture"), []),
    safe(getArticlesByCategory("business-tech"), []),
    safe(getArticlesByCategory("business-tech", "technology"), []),
    safe(getFlagshipArticles("investigations"), []),
    safe(getFlagshipArticles("opinion"), []),
    safe(getAllVideos(), []),
    safe(getAllEvents(), []),
    safe(getAllShows(), []),
    safe(getMostDiscussed(), []),
    safe(getEditorsPicks(), []),
    safe(getFeaturedTopics(), []),
    getSiteSettings(),
  ]);

  const firstShowEpisodes = shows[0]
    ? ((await safe(getShowBySlug(shows[0].slug), null))?.episodes ?? []).map(
        (episode) => ({
          ...episode,
          createdAt: episode.createdAt
            ? new Date(episode.createdAt).toISOString()
            : "",
          publishedAt: episode.publishedAt
            ? new Date(episode.publishedAt).toISOString()
            : "",
          showSlug: shows[0].slug,
        }),
      )
    : [];

  const sections = [
    {
      id: "politics",
      label: "Politics",
      href: `/${locale}/news/politics`,
      articles: politics,
    },
    {
      id: "culture",
      label: "Culture",
      href: `/${locale}/culture`,
      articles: culture,
    },
    {
      id: "business",
      label: "Business",
      href: `/${locale}/business-tech`,
      articles: businessTech,
    },
    {
      id: "technology",
      label: "Technology",
      href: `/${locale}/business-tech/technology`,
      articles: technology,
    },
    {
      id: "opinion",
      label: "Opinion",
      href: `/${locale}/opinion`,
      articles: opinion,
    },
  ].filter((s) => s.articles.length > 0);

  const tagline =
    locale === "am" && settings.tagline_am
      ? settings.tagline_am
      : settings.tagline_en;
  const slides = articles.slice(0, 3);
  const latest = articles.slice(3, 8);
  const more = articles.slice(8);
  const focus = (editorsPicks.length >= 3 ? editorsPicks : more).slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/${locale}/search-results?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="hp">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroCarousel articles={slides} locale={locale} tagline={tagline} />
      <LatestCards articles={latest} locale={locale} />
      <InFocusBand articles={focus} locale={locale} />

      <FeaturedTopicsRail topics={featuredTopics} locale={locale} />

      {(more.length > 0 || trending.length > 0) && (
        <Reveal>
          <div className="hp-w hp-main">
            <LatestNewsFeed articles={more} locale={locale} />
            <TrendingRail items={trending} locale={locale} />
          </div>
        </Reveal>
      )}

      <EditorsPicksStrip articles={editorsPicks} locale={locale} />
      <Reveal>
        <SectionTabs sections={sections} locale={locale} />
      </Reveal>
      <Reveal>
        <BusinessInsights articles={businessTech} locale={locale} />
      </Reveal>
      <Reveal>
        <EntertainmentSpotlight articles={entertainment} locale={locale} />
      </Reveal>
      <Reveal>
        <InvestigationsFeature
          article={investigations[0] ?? null}
          locale={locale}
        />
      </Reveal>
      <Reveal>
        <VideoCarousel videos={videos} locale={locale} />
      </Reveal>
      <Reveal>
        <PodcastCarousel episodes={firstShowEpisodes} locale={locale} />
      </Reveal>
      <NewsletterBand />
      <Reveal>
        <CommunityModule
          discussed={discussed}
          events={events}
          locale={locale}
        />
      </Reveal>
      <PersonalizedRails locale={locale} />
    </div>
  );
}
