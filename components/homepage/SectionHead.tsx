import "./home.css";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHead({
  kicker,
  title,
  href,
  locale,
  label = "View all",
}: {
  kicker?: string;
  title: string;
  href?: string;
  locale?: string;
  label?: string;
}) {
  return (
    <div className="hp-sh">
      <div>
        {kicker && <div className="hp-lab">{kicker}</div>}
        <h2 className="hp-title hp-serif">{title}</h2>
      </div>
      {href && (
        <Link href={locale ? `/${locale}${href}` : href} className="hp-va">
          {label} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
