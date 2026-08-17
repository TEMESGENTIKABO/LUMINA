import { parseAudioEmbed } from "@/lib/embedUrl";

export function AudioPlayer({ title, audioUrl }: { title: string; audioUrl?: string | null }) {
  const { type, embedUrl } = parseAudioEmbed(audioUrl);

  if (type === "spotify") {
    return (
      <iframe
        src={embedUrl!}
        title={title}
        className="w-full"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    );
  }

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

  if (type === "direct-audio") {
    return (
      <audio controls className="w-full" src={embedUrl!}>
        Your browser does not support audio playback.
      </audio>
    );
  }

  return (
    <div className="bg-aksum-black/[0.03] border border-obsidian-grey/10 p-6 flex items-center justify-center">
      <p className="font-ui text-sm text-obsidian-grey">
        {audioUrl ? "Unrecognized audio URL - use Spotify, YouTube, or a direct .mp3 link." : `No audio source set for "${title}"`}
      </p>
    </div>
  );
}
