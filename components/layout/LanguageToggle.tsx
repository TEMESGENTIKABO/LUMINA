"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  currentLocale: string;
}

export function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const pathname = usePathname();
  const otherLocale = currentLocale === "en" ? "am" : "en";

  let href: string;
  if (!pathname) {
    href = `/${otherLocale}`;
  } else if (
    pathname === `/${currentLocale}` ||
    pathname === `/${currentLocale}/`
  ) {
    href = `/${otherLocale}`;
  } else if (pathname.startsWith(`/${currentLocale}/`)) {
    href = pathname.replace(`/${currentLocale}/`, `/${otherLocale}/`);
  } else {
    href = `/${otherLocale}${pathname}`;
  }

  const label = otherLocale === "am" ? "አማርኛ" : "English";
  const abbr = otherLocale === "am" ? "አማ" : "EN";

  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded-sm px-1 py-0.5 font-ui text-xs font-semibold tracking-wide text-obsidian-grey/70 transition-colors duration-200 hover:text-aksum-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksum-gold"
      aria-label={`Switch language to ${label}`}
      title={label}
    >
      <Globe size={12} className="opacity-60" />
      <span>{abbr}</span>
    </Link>
  );
}
