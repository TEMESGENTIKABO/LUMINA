// ArticleHeader.tsx
import { clsx } from "clsx";

export function ArticleHeader({
  category,
  accentColor,
  title,
  dek,
}: {
  category: string;
  accentColor: string;
  title: string;
  dek: string;
}) {
  return (
    <header className="max-w-content mx-auto px-6 pt-10">
      <div className="flex items-center gap-3 mb-3">
        <span
          className="h-px w-8"
          style={{ backgroundColor: `var(--color-${accentColor})` }}
        />
        <p
          className="section-label font-ui text-xs font-medium uppercase tracking-widest"
          style={{ color: `var(--color-${accentColor})` }}
        >
          {category}
        </p>
      </div>

      <h1 className="font-headline-en text-[length:var(--text-headline-xl)] leading-[var(--leading-headline)] mt-2 text-aksum-black tracking-tight">
        {title}
      </h1>

      <p className="font-body-en italic text-[length:var(--text-body)] text-obsidian-grey/80 mt-3 leading-relaxed max-w-3xl">
        {dek}
      </p>
    </header>
  );
}
