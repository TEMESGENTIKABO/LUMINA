export type EmbedType = "youtube" | "vimeo" | "spotify" | "direct-video" | "direct-audio" | "unknown";

export interface EmbedInfo {
  type: EmbedType;
  embedUrl: string | null;
}

export function parseVideoEmbed(url: string | null | undefined): EmbedInfo {
  if (!url || !url.trim()) return { type: "unknown", embedUrl: null };
  const trimmed = url.trim();

  const youtubeMatch = trimmed.match(
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch) {
    return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
    return { type: "direct-video", embedUrl: trimmed };
  }

  return { type: "unknown", embedUrl: null };
}

export function parseAudioEmbed(url: string | null | undefined): EmbedInfo {
  if (!url || !url.trim()) return { type: "unknown", embedUrl: null };
  const trimmed = url.trim();

  const spotifyMatch = trimmed.match(/open\.spotify\.com\/(episode|show)\/([a-zA-Z0-9]+)/);
  if (spotifyMatch) {
    return { type: "spotify", embedUrl: `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}` };
  }

  // A YouTube link in the audio field (video podcasts) - embed as video.
  const youtube = parseVideoEmbed(trimmed);
  if (youtube.type === "youtube" || youtube.type === "vimeo") return youtube;

  if (/\.(mp3|wav|m4a|ogg)(\?.*)?$/i.test(trimmed)) {
    return { type: "direct-audio", embedUrl: trimmed };
  }

  return { type: "unknown", embedUrl: null };
}
