import { headers } from "next/headers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getActiveNavContext } from "@/lib/getActiveNavContext";
import { getBreakingArticles } from "@/content/cms/fetchers/getBreakingArticles";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? `/${locale}`;

  const { activeSlug, subcategories } = getActiveNavContext(pathname, locale);
  const breakingItems = await getBreakingArticles();

  return (
    <>
      <Header locale={locale} activeSlug={activeSlug} subcategories={subcategories} breakingItems={breakingItems} />
      <main id="main-content" className="min-h-screen">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
