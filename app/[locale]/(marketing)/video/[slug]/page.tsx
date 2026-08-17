import { notFound } from "next/navigation";
import { getVideoBySlug } from "@/content/cms/fetchers/getVideo";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Tag } from "@/components/ui/Tag";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) notFound();

  return (
    <article className="max-w-page mx-auto px-6 pt-8 pb-16">
      <VideoPlayer title={video.title_en} videoUrl={video.videoUrl} />
      <div className="max-w-content mt-6">
        <Tag color={video.accentColor}>{video.category}</Tag>
        <h1 className="font-headline-en text-[length:var(--text-headline-lg)] mt-3">
          {video.title_en}
        </h1>
        <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-3">
          {video.description_en}
        </p>
        <p className="font-ui text-[length:var(--text-meta)] text-obsidian-grey mt-4">
          By {video.author.name}
        </p>
      </div>
    </article>
  );
}
