import Link from "next/link";
import Image from "next/image";
import { getAllEditions } from "@/content/cms/fetchers/getDigitalEdition";

export default async function EditionsArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const editions = await getAllEditions();

  return (
    <main className="max-w-page mx-auto px-6 pt-12 pb-20">
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
        Digital Editions
      </h1>
      <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-3 max-w-content">
        The month&apos;s best long-form work, bundled — see §7.3.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-10">
        {editions.map((edition) => (
          <Link
            key={edition.slug}
            href={`/${locale}/magazine/editions/${edition.slug}`}
            className="group block"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-obsidian-grey/10">
              <Image
                src={edition.coverImageUrl}
                alt={edition.issueLabel}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="font-ui text-[length:var(--text-meta)] text-obsidian-grey mt-3">
              {edition.issueLabel}
            </p>
            <h2 className="font-headline-en text-[length:var(--text-headline-md)] leading-tight group-hover:text-manuscript-red transition-colors">
              {edition.headline}
            </h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
