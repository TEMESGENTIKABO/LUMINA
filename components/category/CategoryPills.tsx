import Link from "next/link";

export function CategoryPills({
  locale,
  category,
  subs,
  active,
  allLabel,
}: {
  locale: string;
  category: string;
  subs: { slug: string; name: string }[];
  active?: string;
  allLabel: string;
}) {
  if (subs.length === 0) return null;
  return (
    <nav className="hp-tabs" aria-label="Subsections">
      <Link
        href={`/${locale}/${category}`}
        className="hp-tab"
        aria-current={!active ? "page" : undefined}
      >
        {allLabel}
      </Link>
      {subs.map((s) => (
        <Link
          key={s.slug}
          href={`/${locale}/${category}/${s.slug}`}
          className="hp-tab"
          aria-current={active === s.slug ? "page" : undefined}
        >
          {s.name}
        </Link>
      ))}
    </nav>
  );
}
