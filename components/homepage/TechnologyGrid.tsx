// TechnologyGrid.tsx
import { StorySection } from "./StorySection";
import type { Article } from "@/content/types/Article";

export function TechnologyGrid({
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
      kicker="Innovation"
      title="Technology"
      href="/business-tech/technology"
    />
  );
}
