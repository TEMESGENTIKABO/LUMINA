import { Carousel } from "@/components/ui/Carousel";
import { DocumentaryCard } from "@/components/video/DocumentaryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Video } from "@/content/types/Video";

export function VideoCarousel({
  videos,
  locale,
}: {
  videos: Video[];
  locale: string;
}) {
  if (videos.length === 0) return null;

  return (
    <section className="max-w-page mx-auto px-6 py-8 hairline-t">
      <SectionHeader
        label="Documentaries"
        href="/video-podcast"
        locale={locale}
      />
      <Carousel>
        {videos.map((video) => (
          <div
            key={video.slug}
            className="flex-shrink-0 w-72 transition-transform duration-300 hover:-translate-y-1"
          >
            <DocumentaryCard video={video} locale={locale} />
          </div>
        ))}
      </Carousel>
    </section>
  );
}
