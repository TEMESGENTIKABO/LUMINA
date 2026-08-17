import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SessionProvider } from "next-auth/react";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <SessionProvider>
        <ServiceWorkerRegister />
        {children}
      </SessionProvider>
    </NextIntlClientProvider>
  );
}
