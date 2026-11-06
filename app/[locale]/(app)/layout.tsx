import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getActiveTheme } from "@/content/cms/fetchers/getActiveTheme";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const theme = await getActiveTheme();
  return (
    <>
      <Header locale={locale} theme={theme} />
      <main
        id="main-content"
        className="max-w-page mx-auto px-6 pt-10 pb-20 min-h-[60vh]"
      >
        {children}
      </main>
      <Footer locale={locale} />
    </>
  );
}
