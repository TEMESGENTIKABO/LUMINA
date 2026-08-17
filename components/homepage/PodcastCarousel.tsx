import { EpisodeCard } from "@/components/podcast/EpisodeCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { PodcastEpisode } from "@/content/types/PodcastEpisode";

export function PodcastCarousel({
  episodes,
  locale,
}: {
  episodes: PodcastEpisode[];
  locale: string;
}) {
  if (episodes.length === 0) return null;

  return (
    <section className="max-w-page mx-auto px-6 py-8 hairline-t">
      <SectionHeader label="Podcasts" href="/podcast" locale={locale} />
      <div className="max-w-content divide-y divide-hairline">
        {episodes.map((episode) => (
          <EpisodeCard key={episode.slug} episode={episode} locale={locale} />
        ))}
      </div>
    </section>
  );
}
