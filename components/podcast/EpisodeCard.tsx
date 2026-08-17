import Link from "next/link";
import { Play } from "lucide-react";
import { formatDuration } from "@/lib/formatDuration";
import type { PodcastEpisode } from "@/content/types/PodcastEpisode";

export function EpisodeCard({ episode, locale }: { episode: PodcastEpisode; locale: string }) {
  return (
    <Link href={`/${locale}/podcast/${episode.showSlug}/${episode.slug}`} className="group flex items-center gap-4 py-3">
      <div className="w-9 h-9 rounded-full bg-aksum-gold/15 flex items-center justify-center flex-shrink-0">
        <Play size={14} className="text-aksum-gold ml-0.5" fill="currentColor" />
      </div>
      <div className="flex-1">
        <p className="section-label text-obsidian-grey/50">Episode {episode.episodeNumber}</p>
        <h3 className="font-headline-en text-[length:var(--text-headline-sm)] leading-[var(--leading-headline)] group-hover:text-manuscript-red transition-colors">
          {episode.title}
        </h3>
      </div>
      <span className="font-ui text-[length:var(--text-label)] text-obsidian-grey/50 flex-shrink-0 tabular-nums">
        {formatDuration(episode.durationSeconds)}
      </span>
    </Link>
  );
}
