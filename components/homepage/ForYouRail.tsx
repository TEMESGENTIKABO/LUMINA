// ForYouRail.tsx
import { StorySection } from "./StorySection";
import type { Article } from "@/content/types/Article";

export function ForYouRail({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  return (
    <StorySection
      articles={articles}
      locale={locale}
      kicker="Based on the topics you follow"
      title="For You"
    />
  );
}
