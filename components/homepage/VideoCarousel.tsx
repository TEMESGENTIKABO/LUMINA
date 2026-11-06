import "./home.css";
import { Carousel } from "@/components/ui/Carousel";
import { DocumentaryCard } from "@/components/video/DocumentaryCard";
import { SectionHead } from "./SectionHead";
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
    <section className="hp-sec">
      <div className="hp-w">
        <SectionHead
          kicker="Watch"
          title="Documentaries"
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
      </div>
    </section>
  );
}
