import "./home.css";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/content/types/Article";

export function InvestigationsFeature({
  article,
  locale,
}: {
  article: Article | null;
  locale: string;
}) {
  if (!article) return null;
  const am = locale === "am";
  const title = am && article.title_am ? article.title_am : article.title_en;
  const dek = am && article.dek_am ? article.dek_am : article.dek_en;

  return (
    <section className="hp-band">
      <div className="hp-w">
        <div className="hp-lab" style={{ marginBottom: 24 }}>
          Investigations
        </div>
        <Link
          href={`/${locale}/article/${article.slug}`}
          className="group grid grid-cols-1 items-center gap-10 lg:grid-cols-5"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl lg:col-span-2">
            <Image
              src={article.heroImageUrl}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <div className="lg:col-span-3">
            <h2
              className="hp-serif"
              style={{
                margin: 0,
                fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)",
                lineHeight: 1.1,
                fontWeight: 700,
                letterSpacing: "-.015em",
              }}
            >
              {title}
            </h2>
            <p
              style={{
                margin: "16px 0 26px",
                maxWidth: 620,
                fontSize: 16,
                lineHeight: 1.6,
                opacity: 0.72,
              }}
            >
              {dek}
            </p>
            <span className="hp-btn">
              Read the investigation <ArrowUpRight size={16} />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
