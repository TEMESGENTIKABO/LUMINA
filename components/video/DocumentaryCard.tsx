import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { formatDuration } from "@/lib/formatDuration";
import type { Video } from "@/content/types/Video";

export function DocumentaryCard({ video, locale }: { video: Video; locale: string }) {
  return (
    <Link href={`/${locale}/video/${video.slug}`} className="group block">
      <div className="relative aspect-video overflow-hidden bg-obsidian-grey/10">
        <Image src={video.thumbnailUrl} alt={video.title_en} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        <div className="absolute inset-0 bg-aksum-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-11 h-11 rounded-full bg-parchment-white/90 flex items-center justify-center">
            <Play size={18} className="text-aksum-black ml-0.5" fill="currentColor" />
          </div>
        </div>
        <span className="absolute bottom-2 right-2 bg-aksum-black/80 text-parchment-white font-ui text-xs px-2 py-0.5 tabular-nums">
          {formatDuration(video.durationSeconds)}
        </span>
      </div>
      <p className="section-label mt-2" style={{ color: `var(--color-${video.accentColor})` }}>{video.category}</p>
      <h3 className="font-headline-en text-[length:var(--text-headline-sm)] leading-[var(--leading-headline)] mt-0.5 group-hover:text-manuscript-red transition-colors">
        {video.title_en}
      </h3>
    </Link>
  );
}
