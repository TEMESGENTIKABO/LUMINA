import { parseVideoEmbed } from "@/lib/embedUrl";

export function VideoPlayer({ title, videoUrl }: { title: string; videoUrl?: string | null }) {
  const { type, embedUrl } = parseVideoEmbed(videoUrl);

  if (type === "youtube" || type === "vimeo") {
    return (
      <div className="relative aspect-video bg-aksum-black">
        <iframe
          src={embedUrl!}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (type === "direct-video") {
    return (
      <video controls className="w-full aspect-video bg-aksum-black" src={embedUrl!}>
        Your browser does not support video playback.
      </video>
    );
  }

  return (
    <div className="relative aspect-video bg-aksum-black flex items-center justify-center">
      <p className="font-ui text-parchment-white/60 text-sm">
        {videoUrl ? "Unrecognized video URL - use a YouTube, Vimeo, or direct .mp4 link." : `No video source set for "${title}"`}
      </p>
    </div>
  );
}
