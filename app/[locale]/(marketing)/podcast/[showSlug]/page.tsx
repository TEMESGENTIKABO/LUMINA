import { notFound } from "next/navigation";
import { getShowBySlug } from "@/content/cms/fetchers/getPodcastEpisode";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";

export default async function ShowPage({
  params,
}: {
  params: Promise<{ locale: string; showSlug: string }>;
}) {
  const { locale, showSlug } = await params;
  const result = await getShowBySlug(showSlug);
  if (!result) notFound();

  return (
    <main className="max-w-page mx-auto px-6 pt-8 pb-16">
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
        {result.show.title}
      </h1>
      <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-2 max-w-content">
        {result.show.description}
      </p>
      <div className="mt-8 max-w-content">
        {result.episodes.map((episode) => (
          <EpisodeCard key={episode.slug} episode={episode} locale={locale} />
        ))}
      </div>
    </main>
  );
}
