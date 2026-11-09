"use client";

import { usePathname } from "next/navigation";
import { SubcategoryBar } from "./SubcategoryBar";
import { getActiveNavContext } from "@/lib/getActiveNavContext";

export function ActiveSubcategoryBar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const { subcategories } = getActiveNavContext(pathname, locale);
  if (!subcategories || subcategories.length === 0) return null;

  return (
    <div className="border-b border-hairline bg-parchment-white/80 backdrop-blur-sm">
      <div className="max-w-page mx-auto">
        <SubcategoryBar items={subcategories} locale={locale} />
      </div>
    </div>
  );
}
