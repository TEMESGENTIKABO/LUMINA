import Link from "next/link";
import Image from "next/image";
import { getAllShows } from "@/content/cms/fetchers/getPodcastEpisode";

function isValidImageSrc(url: string | null | undefined): url is string {
  if (!url) return false;
  return (
    url.startsWith("/") ||
    url.startsWith("http://") ||
    url.startsWith("https://")
  );
}

export default async function PodcastHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const shows = await getAllShows();

  return (
    <main className="max-w-page mx-auto px-6 pt-8 pb-16">
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
        Podcast Network
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
        {shows.map((show) => (
          <Link
            key={show.slug}
            href={`/${locale}/podcast/${show.slug}`}
            className="group flex gap-4"
          >
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-obsidian-grey/10">
              {isValidImageSrc(show.coverImageUrl) ? (
                <Image
                  src={show.coverImageUrl}
                  alt={show.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-obsidian-grey/20" />
              )}
            </div>
            <div>
              <h2 className="font-headline-en text-[length:var(--text-headline-md)] group-hover:text-manuscript-red transition-colors">
                {show.title}
              </h2>
              <p className="font-ui text-[length:var(--text-meta)] text-obsidian-grey mt-1">
                {show.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
