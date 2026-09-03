import Link from "next/link";

interface SubcategoryItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export function SubcategoryBar({ items }: { items: SubcategoryItem[] }) {
  return (
    <div className="flex items-center gap-5 h-10 overflow-x-auto whitespace-nowrap">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`font-ui text-xs uppercase tracking-wide flex-shrink-0 ${item.isActive ? "text-aksum-black font-semibold" : "text-obsidian-grey/60 hover:text-aksum-black"}`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
