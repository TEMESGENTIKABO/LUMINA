import Link from "next/link";
import { getAllTopics } from "@/content/cms/fetchers/getTopicPage";

export default async function TopicsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const topics = await getAllTopics();

  return (
    <main className="max-w-page mx-auto px-6 pt-12 pb-20">
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
        All Topics
      </h1>
      <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-3 max-w-content">
        Ongoing coverage, organized by subject rather than section — see §2.3.
      </p>
      <ul className="flex flex-col gap-4 mt-8">
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link
              href={`/${locale}/topics/${topic.slug}`}
              className="font-headline-en text-[length:var(--text-headline-md)] hover:text-manuscript-red transition-colors"
            >
              {topic.title}
            </Link>
            <p className="font-ui text-sm text-obsidian-grey mt-1">
              {topic.description}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
