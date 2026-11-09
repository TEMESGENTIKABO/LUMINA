// ContinueReadingRail.tsx
import { StorySection } from "./StorySection";
import type { Article } from "@/content/types/Article";

export function ContinueReadingRail({
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
      kicker="Pick up where you left off"
      title="Continue Reading"
    />
  );
}
