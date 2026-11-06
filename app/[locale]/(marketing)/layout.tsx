import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getBreakingArticles } from "@/content/cms/fetchers/getBreakingArticles";
import { getActiveTheme } from "@/content/cms/fetchers/getActiveTheme";
import { ReadingListDrawer } from "@/components/article/ReadingListDrawer";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [breakingItems, theme] = await Promise.all([
    getBreakingArticles(),
    getActiveTheme(),
  ]);

  return (
    <>
      <Header locale={locale} breakingItems={breakingItems} theme={theme} />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <ReadingListDrawer locale={locale} />
      <Footer locale={locale} />
    </>
  );
}
