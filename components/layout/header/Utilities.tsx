"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { DarkModeToggle } from "../DarkModeToggle";

export function LangSwitch({ locale }: { locale: string }) {
  const pathname = usePathname();
  const other = locale === "am" ? "en" : "am";
  const href =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${other}`) ||
    `/${other}`;
  return (
    <Link
      href={href}
      hrefLang={other}
      lang={other}
      className="hd-lang"
      aria-label={other === "am" ? "አማርኛ" : "English"}
    >
      <Globe size={13} aria-hidden="true" />
      {other === "am" ? "አማ" : "EN"}
    </Link>
  );
}

/** Language switch + dark-mode toggle, used in the strip, bar and drawer. */
export function Utilities({ locale }: { locale: string }) {
  return (
    <>
      <LangSwitch locale={locale} />
      <DarkModeToggle className="hd-ib hd-themebtn" />
    </>
  );
}
