import "@/components/homepage/home.css";
import { Suspense } from "react";
import type { Metadata } from "next";
import { BreakingBanner } from "@/components/homepage/BreakingBanner";
import { HeroCarousel } from "@/components/homepage/HeroCarousel";
import { LiveStatsStrip } from "@/components/homepage/LiveStatsStrip";
import { AddisWeather } from "@/components/homepage/AddisWeather";
import { BackToTop } from "@/components/homepage/BackToTop";
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
import { TechnologyGrid } from "@/components/homepage/TechnologyGrid";
import { PersonalizedRails } from "@/components/homepage/PersonalizedRails";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBoundary } from "@/components/ui/SectionBoundary";
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
import { getHomeStats } from "@/content/cms/fetchers/getHomeStats";
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

// A failing section must never take the whole homepage down.
// The label makes the server log say WHICH section failed.
async function safe<T>(
  label: string,
  promise: Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error(`[homepage] "${label}" failed:`, error);
    return fallback;
  }
}

// Remove stories that were already shown elsewhere on the page.
function without<T extends { slug: string }>(list: T[], shown: Set<string>) {
  return list.filter((a) => !shown.has(a.slug));
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
    stats,
  ] = await Promise.all([
    safe("homepage articles", getHomepageArticles(), []),
    safe("trending", getTrendingArticles(), []),
    safe("politics", getArticlesByCategory("news", "politics"), []),
    safe(
      "entertainment",
      getArticlesByCategory("culture", "entertainment"),
      [],
    ),
    safe("culture", getArticlesByCategory("culture"), []),
    safe("business-tech", getArticlesByCategory("business-tech"), []),
    safe(
      "technology",
      getArticlesByCategory("business-tech", "technology"),
      [],
    ),
    safe("investigations", getFlagshipArticles("investigations"), []),
    safe("opinion", getFlagshipArticles("opinion"), []),
    safe("videos", getAllVideos(), []),
    safe("events", getAllEvents(), []),
    safe("shows", getAllShows(), []),
    safe("most discussed", getMostDiscussed(), []),
    safe("editors picks", getEditorsPicks(), []),
    safe("featured topics", getFeaturedTopics(), []),
    safe("home stats", getHomeStats(), null),
  ]);

  // Podcast episodes: protected so a bad slug can't crash the page.
  const firstShow = shows[0];
  const firstShowEpisodes = firstShow
    ? (
        (await safe("podcast episodes", getShowBySlug(firstShow.slug), null))
          ?.episodes ?? []
      ).map((episode) => ({
        ...episode,
        createdAt: episode.createdAt
          ? new Date(episode.createdAt).toISOString()
          : "",
        publishedAt: episode.publishedAt
          ? new Date(episode.publishedAt).toISOString()
          : "",
        showSlug: firstShow.slug,
      }))
    : [];

  // Business and Technology both come from "business-tech", so they showed the
  // same stories twice. Business now excludes technology stories (falls back to
  // the full list if that would leave it too thin).
  const techSlugs = new Set(technology.map((a) => a.slug));
  const businessOnly = without(businessTech, techSlugs);
  const businessForInsights =
    businessOnly.length >= 3 ? businessOnly : businessTech;

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
      articles: businessForInsights,
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

  // ── Top of page split ───────────────────────────────────────────────
  const slides = articles.slice(0, 3);
  const latest = articles.slice(3, 8);
  const more = articles.slice(8);
  const shown = new Set([...slides, ...latest].map((a) => a.slug));

  // Only treat editorsPicks as the lead source when there are MORE than 5,
  // otherwise slice(5) leaves the strip empty.
  const picksLead = editorsPicks.length > 5;
  let focus = (picksLead ? editorsPicks : more).slice(0, 5);
  let feed = picksLead ? more : more.slice(5);
  const picksStrip = picksLead ? editorsPicks.slice(5) : editorsPicks;

  // With a small CMS (fewer than ~9 articles) "In Focus" and "More Headlines"
  // used to vanish. Borrow from Trending so they stay populated.
  if (focus.length < 3) {
    const alt = without(
      trending.map((t) => t.article),
      shown,
    ).slice(0, 5);
    if (alt.length > focus.length) {
      focus = alt;
      feed = more;
    }
  }
  feed = without(feed, new Set(focus.map((a) => a.slug)));

  // ── Server log: which CMS queries came back empty ───────────────────
  const empty = Object.entries({
    articles: articles.length,
    trending: trending.length,
    entertainment: entertainment.length,
    businessTech: businessTech.length,
    technology: technology.length,
    investigations: investigations.length,
    videos: videos.length,
    podcastEpisodes: firstShowEpisodes.length,
    events: events.length,
    discussed: discussed.length,
    editorsPicks: editorsPicks.length,
    featuredTopics: featuredTopics.length,
  })
    .filter(([, n]) => n === 0)
    .map(([name]) => name);
  if (empty.length) {
    console.warn("[homepage] empty CMS data for:", empty.join(", "));
  }

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

      {/* BreakingBanner existed but was never rendered. */}
      <SectionBoundary name="breaking banner">
        <BreakingBanner articles={articles} locale={locale} />
      </SectionBoundary>

      {articles.length === 0 ? (
        <section
          className="hp-w"
          style={{ padding: "4rem 20px", textAlign: "center" }}
        >
          <h1>Stories are loading</h1>
          <p>
            We couldn&apos;t load the latest stories right now. Please refresh
            in a moment.
          </p>
        </section>
      ) : (
        <>
          <SectionBoundary name="hero">
            <HeroCarousel articles={slides} locale={locale} />
          </SectionBoundary>

          {stats && (
            <LiveStatsStrip stats={{ ...stats, activeReaders: 0 }}>
              <Suspense fallback={null}>
                <AddisWeather />
              </Suspense>
            </LiveStatsStrip>
          )}

          <LatestCards articles={latest} locale={locale} />
          <InFocusBand articles={focus} locale={locale} />
        </>
      )}

      <FeaturedTopicsRail topics={featuredTopics} locale={locale} />

      {(feed.length > 0 || trending.length > 0) && (
        <Reveal>
          <div className="hp-w hp-main">
            {feed.length > 0 ? (
              <LatestNewsFeed articles={feed} locale={locale} />
            ) : (
              <div />
            )}
            {trending.length > 0 && (
              <TrendingRail items={trending} locale={locale} />
            )}
          </div>
        </Reveal>
      )}

      {picksStrip.length > 0 && (
        <Reveal>
          <EditorsPicksStrip articles={picksStrip} locale={locale} />
        </Reveal>
      )}

      {sections.length > 0 && (
        <Reveal>
          <SectionBoundary name="section tabs">
            <SectionTabs sections={sections} locale={locale} />
          </SectionBoundary>
        </Reveal>
      )}

      {technology.length > 0 && (
        <Reveal>
          <TechnologyGrid articles={technology} locale={locale} />
        </Reveal>
      )}

      {businessForInsights.length > 0 && (
        <Reveal>
          <BusinessInsights articles={businessForInsights} locale={locale} />
        </Reveal>
      )}

      {entertainment.length > 0 && (
        <Reveal>
          <EntertainmentSpotlight articles={entertainment} locale={locale} />
        </Reveal>
      )}

      {investigations[0] && (
        <Reveal>
          <InvestigationsFeature article={investigations[0]} locale={locale} />
        </Reveal>
      )}

      {videos.length > 0 && (
        <Reveal>
          <VideoCarousel videos={videos} locale={locale} />
        </Reveal>
      )}

      {firstShowEpisodes.length > 0 && (
        <Reveal>
          <PodcastCarousel episodes={firstShowEpisodes} locale={locale} />
        </Reveal>
      )}

      <SectionBoundary name="newsletter">
        <NewsletterBand locale={locale} />
      </SectionBoundary>

      {(discussed.length > 0 || events.length > 0) && (
        <Reveal>
          <CommunityModule
            discussed={discussed}
            events={events}
            locale={locale}
          />
        </Reveal>
      )}

      {/* Browser-only; a crash here used to take down the whole page. */}
      <SectionBoundary name="personalized rails">
        <PersonalizedRails locale={locale} />
      </SectionBoundary>

      <BackToTop />
    </div>
  );
}
