import "./home.css";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getHomeLabels } from "@/lib/homeLabels";

export function SectionHead({
  kicker,
  title,
  href,
  locale,
  label,
  id,
}: {
  kicker?: string;
  title: string;
  href?: string;
  locale?: string;
  label?: string;
  /** Put on the <h2> so the parent <section aria-labelledby> can point at it. */
  id?: string;
}) {
  const viewAll = label ?? getHomeLabels(locale).viewAll;
  return (
    <div className="hp-sh">
      <div>
        {kicker && <div className="hp-lab">{kicker}</div>}
        <h2 id={id} className="hp-title hp-serif">
          {title}
        </h2>
      </div>
      {href && (
        <Link href={locale ? `/${locale}${href}` : href} className="hp-va">
          {viewAll} <ArrowRight size={14} aria-hidden />
        </Link>
      )}
    </div>
  );
}
