// EditorsPicksStrip.tsx
import { StorySection } from "./StorySection";
import type { Article } from "@/content/types/Article";

export function EditorsPicksStrip({
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
      kicker="Handpicked"
      title="Editor's Picks"
      columns={4}
      limit={4}
      showDek={false}
      soft
    />
  );
}
