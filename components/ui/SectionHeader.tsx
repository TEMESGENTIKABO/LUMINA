import Link from "next/link";

export function SectionHeader({
  label,
  href,
  locale,
}: {
  label: string;
  href?: string;
  locale?: string;
}) {
  return (
    <div className="flex items-center justify-between hairline-b pb-2 mb-5">
      <h2 className="section-label">{label}</h2>
      {href && locale && (
        <Link href={`/${locale}${href}`} className="section-label text-obsidian-grey/60 hover:text-aksum-black">
          View all
        </Link>
      )}
    </div>
  );
}
