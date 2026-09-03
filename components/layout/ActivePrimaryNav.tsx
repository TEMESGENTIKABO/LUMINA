"use client";

import { usePathname } from "next/navigation";
import { PrimaryNav } from "./PrimaryNav";
import { getActiveNavContext } from "@/lib/getActiveNavContext";

export function ActivePrimaryNav({ locale }: { locale: string }) {
  const pathname = usePathname();
  const { activeSlug } = getActiveNavContext(pathname, locale);
  return <PrimaryNav locale={locale} activeSlug={activeSlug} />;
}
