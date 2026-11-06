import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/content/cms/fetchers/getArticleBySlug";

export const alt = "AKSUM";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori only draws JPEG/PNG, so skip WebP heroes and fall back to the gradient.
async function toDataUrl(src?: string | null) {
  if (!src) return null;
  try {
    const res = await fetch(src, { signal: AbortSignal.timeout(4000) });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !/image\/(jpeg|png)/.test(type)) return null;
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const bg = await toDataUrl(article?.heroImageUrl);
  const title = article?.title_en ?? "AKSUM";
  const cat = article?.subcategory ?? article?.category ?? "News";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#0a1424",
        color: "#fff",
      }}
    >
      {bg && (
        <img
          src={bg}
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, objectFit: "cover" }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "linear-gradient(90deg, rgba(5,11,26,.95) 0%, rgba(5,11,26,.78) 55%, rgba(5,11,26,.25) 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 44,
              background: "#f6c453",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: 4,
            }}
          >
            AKSUM
          </div>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: 4,
              color: "#f6c453",
              textTransform: "uppercase",
            }}
          >
            {cat}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: title.length > 80 ? 52 : 62,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "rgba(255,255,255,.75)",
          }}
        >
          Stories shaping tomorrow
        </div>
      </div>
    </div>,
    { ...size },
  );
}
