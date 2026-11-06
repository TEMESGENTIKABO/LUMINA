import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getTopicBySlug } from "@/content/cms/fetchers/getTopicPage";
import { FollowButton } from "@/components/ui/FollowButton";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ locale: string; topicSlug: string }>;
}) {
  const { locale, topicSlug } = await params;
  const result = await getTopicBySlug(topicSlug);
  if (!result) notFound();

  const { topic, articles } = result;
  const latest = articles[articles.length - 1];

  return (
    <main className="max-w-page mx-auto px-6 pt-12 pb-20">
      <p className="section-label text-manuscript-red mb-2">Coverage Timeline</p>
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">{topic.title}</h1>
      <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-3 max-w-content">{topic.description}</p>

      <div className="flex items-center gap-4 mt-6">
        <FollowButton topicSlug={topic.slug} />
        <span className="font-ui text-xs text-obsidian-grey">
          {articles.length} stor{articles.length !== 1 ? "ies" : "y"} - {latest ? `latest ${formatDate(latest.publishedAt)}` : ""}
        </span>
      </div>

      {articles.length === 0 ? (
        <p className="font-ui text-sm text-obsidian-grey mt-12">No coverage yet.</p>
      ) : (
        <div className="relative mt-14 pl-8 border-l-2 border-hairline-strong">
          {articles.map((article, i) => (
            <div key={article.slug} className="relative pb-12 last:pb-0">
              <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-parchment-white border-2 border-manuscript-red" />
              <p className="font-ui text-xs text-obsidian-grey/60 tabular-nums mb-2">{formatDate(article.publishedAt)}</p>
              <Link href={`/${locale}/article/${article.slug}`} className="group grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative aspect-[3/2] overflow-hidden bg-obsidian-grey/10 sm:col-span-1">
                  <Image src={article.heroImageUrl} alt={article.title_en} fill sizes="240px" className="object-cover" />
                </div>
                <div className="sm:col-span-2">
                  <p className="section-label" style={{ color: `var(--color-${article.accentColor})` }}>{article.subcategory ?? article.category}</p>
                  <h2 className="font-headline-en text-[length:var(--text-headline-md)] leading-[var(--leading-headline)] mt-1 group-hover:text-manuscript-red transition-colors">
                    {article.title_en}
                  </h2>
                  <p className="font-body-en text-[length:var(--text-meta)] text-obsidian-grey mt-2">{article.dek_en}</p>
                </div>
              </Link>
              {i === articles.length - 1 && (
                <span className="absolute -left-[47px] top-1 w-6 h-6 rounded-full border-2 border-manuscript-red animate-ping opacity-20" />
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
