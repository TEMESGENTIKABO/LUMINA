import { describe, it, expect } from "vitest";
import { parseVideoEmbed, parseAudioEmbed } from "@/lib/embedUrl";

describe("parseVideoEmbed", () => {
  it("parses a standard YouTube watch URL", () => {
    const result = parseVideoEmbed("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(result.type).toBe("youtube");
    expect(result.embedUrl).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("parses a youtu.be short URL", () => {
    const result = parseVideoEmbed("https://youtu.be/dQw4w9WgXcQ");
    expect(result.type).toBe("youtube");
  });

  it("parses a Vimeo URL", () => {
    const result = parseVideoEmbed("https://vimeo.com/76979871");
    expect(result.type).toBe("vimeo");
    expect(result.embedUrl).toBe("https://player.vimeo.com/video/76979871");
  });

  it("recognizes a direct .mp4 URL", () => {
    const result = parseVideoEmbed("https://example.com/video.mp4");
    expect(result.type).toBe("direct-video");
  });

  it("returns unknown for garbage input", () => {
    const result = parseVideoEmbed("adada");
    expect(result.type).toBe("unknown");
    expect(result.embedUrl).toBeNull();
  });

  it("returns unknown for empty/null input", () => {
    expect(parseVideoEmbed("").type).toBe("unknown");
    expect(parseVideoEmbed(null).type).toBe("unknown");
    expect(parseVideoEmbed(undefined).type).toBe("unknown");
  });
});

describe("parseAudioEmbed", () => {
  it("parses a Spotify episode URL", () => {
    const result = parseAudioEmbed("https://open.spotify.com/episode/abc123");
    expect(result.type).toBe("spotify");
    expect(result.embedUrl).toBe("https://open.spotify.com/embed/episode/abc123");
  });

  it("recognizes a direct .mp3 URL", () => {
    const result = parseAudioEmbed("https://example.com/episode.mp3");
    expect(result.type).toBe("direct-audio");
  });

  it("falls through to video parsing for a YouTube link in the audio field", () => {
    const result = parseAudioEmbed("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(result.type).toBe("youtube");
  });
});
