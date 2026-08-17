import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPhotoStoryBySlug } from "@/content/cms/fetchers/getPhotoStory";

export default async function PhotoStoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const story = await getPhotoStoryBySlug(slug);
  if (!story) notFound();

  return (
    <article className="pb-20">
      <header className="max-w-content mx-auto px-6 pt-12 text-center">
        <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
          {story.title}
        </h1>
        <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-4">
          {story.intro}
        </p>
        {story.author && (
          <Link
            href={`/${locale}/author/${story.author.slug}`}
            className="font-ui text-[length:var(--text-meta)] text-obsidian-grey hover:text-aksum-black mt-4 inline-block"
          >
            Photographs by {story.author.name}
          </Link>
        )}
      </header>

      <div className="flex flex-col gap-16 mt-12">
        {story.images.map((image, i) => (
          <figure key={i} className="w-full px-0">
            <div className="relative w-full aspect-[3/2] overflow-hidden bg-obsidian-grey/10">
              <Image
                src={image.url}
                alt={image.caption}
                fill
                sizes="100vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
            <figcaption className="font-ui text-[length:var(--text-meta)] text-obsidian-grey mt-3 max-w-content mx-auto px-6">
              {image.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </article>
  );
}
