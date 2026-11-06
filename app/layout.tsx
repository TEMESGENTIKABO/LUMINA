import {
  Source_Serif_4,
  Inter,
  Noto_Sans_Ethiopic,
  Noto_Serif_Ethiopic,
  Fraunces,
} from "next/font/google";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/seo";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";
import { ToastProvider } from "@/components/ui/Toast";
import { getActiveTheme } from "@/content/cms/fetchers/getActiveTheme";
import { dataSaverInitScript } from "@/lib/dataSaverScript";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#12100D",
};

const bodyEn = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body-en",
  display: "swap",
});
const headlineEn = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
  display: "swap",
});
const ui = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});
const bodyAm = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["400", "500", "700"],
  variable: "--font-body-am",
  display: "swap",
});
const serifAm = Noto_Serif_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["500", "700"],
  variable: "--font-serif-am",
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getActiveTheme();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-aksum-theme={theme}
      className={`${bodyEn.variable} ${ui.variable} ${bodyAm.variable} ${headlineEn.variable} ${serifAm.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: dataSaverInitScript }} />
      </head>
      <body
        style={
          {
            "--font-headline-en": "var(--font-fraunces), Georgia, serif",
            "--font-headline-am": "var(--font-body-am), serif",
          } as React.CSSProperties
        }
      >
        <ToastProvider>
          {children}
          <FloatingContact />
          <ServiceWorkerRegister />
        </ToastProvider>
      </body>
    </html>
  );
}
