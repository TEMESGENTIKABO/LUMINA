import "./home-next.css";
import Link from "next/link";
import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  text,
  href,
  cta,
}: {
  icon?: ReactNode;
  title: string;
  text?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="hn-empty" role="status">
      {icon && (
        <span className="hn-empty-ic" aria-hidden>
          {icon}
        </span>
      )}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {href && cta && (
        <Link href={href} className="hp-btn">
          {cta}
        </Link>
      )}
    </div>
  );
}
