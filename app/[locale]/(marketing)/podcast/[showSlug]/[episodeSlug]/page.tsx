import { notFound } from "next/navigation";
import { getEpisodeBySlug } from "@/content/cms/fetchers/getPodcastEpisode";
import { AudioPlayer } from "@/components/podcast/AudioPlayer";

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ showSlug: string; episodeSlug: string }>;
}) {
  const { showSlug, episodeSlug } = await params;
  const result = await getEpisodeBySlug(showSlug, episodeSlug);
  if (!result) notFound();

  return (
    <article className="max-w-content mx-auto px-6 pt-8 pb-16">
      <p className="font-ui text-[length:var(--text-meta)] text-obsidian-grey">
        {result.show.title} · Episode {result.episode.episodeNumber}
      </p>
      <h1 className="font-headline-en text-[length:var(--text-headline-lg)] mt-2">
        {result.episode.title}
      </h1>
      <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-3">
        {result.episode.description}
      </p>
      <div className="mt-6">
        <AudioPlayer
          title={result.episode.title}
          audioUrl={result.episode.audioUrl}
        />
      </div>
    </article>
  );
}
