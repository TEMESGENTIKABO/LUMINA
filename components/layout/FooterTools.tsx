"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  return (
    <button
      type="button"
      className="ft-topbtn"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp size={16} />
    </button>
  );
}

export function FooterLang({ locale }: { locale: string }) {
  const pathname = usePathname();
  const to = (l: string) =>
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${l}`) || `/${l}`;
  return (
    <div className="ft-lang">
      <Link
        href={to("en")}
        hrefLang="en"
        className={locale === "en" ? "on" : ""}
      >
        English
      </Link>
      <Link
        href={to("am")}
        hrefLang="am"
        className={locale === "am" ? "on" : ""}
      >
        አማርኛ
      </Link>
    </div>
  );
}
