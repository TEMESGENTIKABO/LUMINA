// ArticleBody.tsx
export function ArticleBody({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="max-w-content mx-auto px-6 mt-8 flex flex-col gap-6">
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className="font-body-en text-[length:var(--text-body)] leading-[var(--leading-en-body)] text-aksum-black/90 first:mt-0 last:mb-0"
        >
          {p}
        </p>
      ))}
    </div>
  );
}
