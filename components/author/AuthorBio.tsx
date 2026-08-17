import type { Author } from "@/content/types/Author";

export function AuthorBio({ author }: { author: Author }) {
  return (
    <div className="flex items-start gap-5 max-w-page mx-auto px-6 pt-12">
      <div className="w-16 h-16 rounded-full bg-obsidian-grey/10 flex-shrink-0" />
      <div>
        <h1 className="font-headline-en text-[length:var(--text-headline-lg)]">
          {author.name}
        </h1>
        <p className="font-ui text-[length:var(--text-meta)] text-manuscript-red uppercase tracking-wide mt-1">
          {author.beat}
        </p>
        <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-3 max-w-content">
          {author.bio}
        </p>
      </div>
    </div>
  );
}
