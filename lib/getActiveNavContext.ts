import { primaryNav } from "@/config/navigation";

export interface SubcategoryItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export function getActiveNavContext(pathname: string, locale: string) {
  const stripped = pathname.replace(new RegExp(`^/${locale}`), "").replace(/^\//, "");
  const segments = stripped.split("/").filter(Boolean);
  const [categorySlug, subSlug] = segments;

  const section = primaryNav.find((item) => item.slug === categorySlug);
  if (!section) return { activeSlug: undefined, subcategories: undefined };

  const subcategories: SubcategoryItem[] | undefined = section.subItems?.map((sub) => {
    const subPathTail = sub.path.split("/").pop();
    return {
      label: sub.label,
      href: `/${locale}/${sub.path}`,
      isActive: subPathTail === subSlug,
    };
  });

  return { activeSlug: section.slug, subcategories };
}
