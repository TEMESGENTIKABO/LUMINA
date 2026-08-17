import { getAllVideos } from "@/content/cms/fetchers/getVideo";
import {
  getAllShows,
  getShowBySlug,
} from "@/content/cms/fetchers/getPodcastEpisode";
import { DocumentaryCard } from "@/components/video/DocumentaryCard";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";

export default async function VideoPodcastPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const videos = await getAllVideos();
  const shows = await getAllShows();
  const firstShowEpisodes = shows[0]
    ? ((await getShowBySlug(shows[0].slug))?.episodes ?? [])
    : [];

  return (
    <main className="max-w-page mx-auto px-6 pt-8 pb-16">
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
        Video & Podcast
      </h1>

      <section className="mt-10">
        <h2 className="font-headline-en text-[length:var(--text-headline-lg)] mb-6">
          Documentaries
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <DocumentaryCard key={video.slug} video={video} locale={locale} />
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-obsidian-grey/10 pt-8">
        <h2 className="font-headline-en text-[length:var(--text-headline-lg)] mb-6">
          Latest Episodes
        </h2>
        <div className="max-w-content">
          {firstShowEpisodes.map((episode) => (
            <EpisodeCard key={episode.slug} episode={episode} locale={locale} />
          ))}
        </div>
      </section>
    </main>
  );
}
