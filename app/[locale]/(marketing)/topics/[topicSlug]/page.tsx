import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/content/cms/fetchers/getTopicPage";
import { ArticleCard } from "@/components/ui/Card";
import { FollowButton } from "@/components/ui/FollowButton";
export default async function TopicPage({
  params,
}: {
  params: Promise<{ locale: string; topicSlug: string }>;
}) {
  const { locale, topicSlug } = await params;
  const result = await getTopicBySlug(topicSlug);
  if (!result) notFound();

  return (
    <main className="max-w-page mx-auto px-6 pt-12 pb-20">
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
        {result.topic.title}
      </h1>

      <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-3 max-w-content">
        {result.topic.description}
      </p>
      <div className="mt-4">
        <FollowButton topicSlug={result.topic.slug} />
      </div>
      <div className="mt-10">
        {result.articles.length === 0 ? (
          <p className="font-ui text-sm text-obsidian-grey">No coverage yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {result.articles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
