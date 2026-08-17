import { Source_Serif_4, Inter, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import { FloatingContact } from "@/components/layout/FloatingContact";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};
const bodyEn = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body-en",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bodyEn.variable} ${ui.variable} ${bodyAm.variable}`}
    >
      <body
        style={
          {
            "--font-headline-en": "Georgia, serif",
            "--font-headline-am": "serif",
          } as React.CSSProperties
        }
      >
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
