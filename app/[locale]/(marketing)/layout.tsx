import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getBreakingArticles } from "@/content/cms/fetchers/getBreakingArticles";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const breakingItems = await getBreakingArticles();

  return (
    <>
      <Header locale={locale} breakingItems={breakingItems} />
      <main id="main-content" className="min-h-screen">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
