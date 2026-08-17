import Link from "next/link";
import Image from "next/image";
import { getAllPhotoStories } from "@/content/cms/fetchers/getPhotoStory";

export default async function PhotoStoryIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const stories = await getAllPhotoStories();

  return (
    <main className="max-w-page mx-auto px-6 pt-12 pb-20">
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
        Photo Stories
      </h1>
      <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-3 max-w-content">
        Visual journalism, treated as reporting — see §4.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {stories.map((story) => (
          <Link
            key={story.slug}
            href={`/${locale}/photo-story/${story.slug}`}
            className="group block"
          >
            <div className="relative aspect-[3/2] overflow-hidden bg-obsidian-grey/10">
              <Image
                src={story.images[0]?.url ?? ""}
                alt={story.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h2 className="font-headline-en text-[length:var(--text-headline-md)] leading-tight mt-3 group-hover:text-manuscript-red transition-colors">
              {story.title}
            </h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
