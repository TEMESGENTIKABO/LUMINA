"use client";

const NAMES = [
  "Premium & Elegant",
  "Modern & Clean",
  "Bold & Dynamic",
  "Minimalist Cream",
  "Vibrant & Trendy",
  "Classic Magazine",
];

export function PreviewOnTheme({ path }: { path: string }) {
  // path example: "/en/article/my-story-slug"
  return (
    <label className="flex items-center gap-2 font-ui text-xs font-medium text-[#6b6f7a]">
      Preview on theme
      <select
        defaultValue=""
        onChange={(e) => {
          if (e.target.value)
            window.open(
              `${path}?header=${e.target.value}`,
              "_blank",
              "noopener",
            );
          e.target.value = "";
        }}
        className="rounded-lg border border-[#e5e3df] bg-white px-2.5 py-1.5 text-xs text-[#1a1c23] hover:border-[#d4d2cd] focus:outline-none focus:border-[#c9a227]/60 focus:ring-4 focus:ring-[#c9a227]/10 transition-all"
      >
        <option value="" disabled>
          Choose…
        </option>
        {NAMES.map((n, i) => (
          <option key={n} value={i + 1}>
            {i + 1}. {n}
          </option>
        ))}
      </select>
    </label>
  );
}
