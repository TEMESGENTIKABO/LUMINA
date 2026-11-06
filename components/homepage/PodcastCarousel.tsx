import "./home.css";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";
import { SectionHead } from "./SectionHead";
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
    <section className="hp-sec">
      <div className="hp-w">
        <SectionHead
          kicker="Listen"
          title="Podcasts"
          href="/podcast"
          locale={locale}
        />
        <div className="hp-panel" style={{ maxWidth: 860 }}>
          {episodes.map((episode) => (
            <div key={episode.slug} className="hp-ep">
              <EpisodeCard episode={episode} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
