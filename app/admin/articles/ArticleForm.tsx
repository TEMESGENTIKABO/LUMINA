"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Image as ImageIcon, Loader2, RefreshCw, Save, X } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { AIAssistPanel } from "@/components/admin/AIAssistPanel";
import {
  useAutosave,
  AutosaveIndicator,
} from "@/components/admin/AutosaveIndicator";
import { ui, tabsCls, tabCls, Card } from "@/components/admin/ui";

interface Category {
  id: string;
  name_en: string;
}
interface Tag {
  id: string;
  name: string;
}
interface Topic {
  id: string;
  title: string;
}
interface Author {
  id: string;
  name: string | null;
  email: string | null;
}
type N = { text?: string; content?: N[] };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
const jsonText = (n: N | null | undefined): string =>
  !n
    ? ""
    : typeof n.text === "string"
      ? n.text
      : (n.content ?? []).map(jsonText).join(" ");

const STATUS: Record<
  string,
  { label: string; bg: string; fg: string; cta: string }
> = {
  DRAFT: { label: "Draft", bg: "#f1efe9", fg: "#5b564c", cta: "Save draft" },
  IN_REVIEW: {
    label: "In review",
    bg: "#e8f0fa",
    fg: "#245a8d",
    cta: "Submit for review",
  },
  SCHEDULED: {
    label: "Scheduled",
    bg: "#fbf1d9",
    fg: "#8a6414",
    cta: "Schedule",
  },
  PUBLISHED: {
    label: "Published",
    bg: "#e7f5ee",
    fg: "#1b6b4a",
    cta: "Publish",
  },
  ARCHIVED: { label: "Archived", bg: "#eeeeec", fg: "#6b665c", cta: "Archive" },
};

const chip = (on: boolean) =>
  `inline-flex h-[30px] cursor-pointer select-none items-center rounded-full border px-3 text-[12.5px] font-semibold transition focus-within:ring-2 focus-within:ring-[#c79a45] focus-within:ring-offset-1 ${
    on
      ? "border-transparent bg-aksum-black text-white"
      : "border-[#e6e1d6] bg-white hover:border-[#cfc8b6]"
  }`;

function Counter({ value, max }: { value: number; max: number }) {
  return (
    <span
      className={`text-xs font-semibold ${value > max ? "text-[#b3201f]" : "text-[#6b665c]"}`}
    >
      {value}/{max}
    </span>
  );
}

export function ArticleForm({
  categories,
  tags,
  topics = [],
  initial,
  userRole,
  authors,
  initialAuthorId,
  onSubmit,
}: {
  categories: Category[];
  tags: Tag[];
  topics?: Topic[];
  userRole: string;
  authors: Author[];
  initialAuthorId?: string;
  initial?: {
    id?: string;
    title_en: string;
    title_am: string | null;
    dek_en: string;
    dek_am: string | null;
    slug: string;
    categoryId: string;
    tagIds: string[];
    topicIds?: string[];
    heroImageUrl: string | null;
    heroImageCaption: string | null;
    status: string;
    scheduledAt: Date | null;
    seoTitle: string | null;
    seoDescription: string | null;
    ogImageUrl: string | null;
    readTimeMinutes: number;
    body_en: object;
    body_am: object | null;
    isBreaking?: boolean;
  };
  onSubmit: (
    bodyJson: object,
    formData: FormData,
  ) => Promise<{ error?: string; success?: boolean } | void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const slugTouched = useRef(Boolean(initial?.slug));
  const [heroImageUrl, setHeroImageUrl] = useState(initial?.heroImageUrl ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bodyJson, setBodyJson] = useState<object>(initial?.body_en ?? {});
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(initial?.status ?? "DRAFT");
  const [bodyLang, setBodyLang] = useState<"en" | "am">("en");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    initial?.seoDescription ?? "",
  );
  const [titleEn, setTitleEn] = useState(initial?.title_en ?? "");
  const [dekEn, setDekEn] = useState(initial?.dek_en ?? "");
  const [titleAm, setTitleAm] = useState(initial?.title_am ?? "");
  const [dekAm, setDekAm] = useState(initial?.dek_am ?? "");
  const [bodyAmJson, setBodyAmJson] = useState<object | null>(
    initial?.body_am ?? null,
  );
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [readTime, setReadTime] = useState(initial?.readTimeMinutes ?? 5);
  const [checkedTags, setCheckedTags] = useState<string[]>(
    initial?.tagIds ?? [],
  );
  const [checkedTopics, setCheckedTopics] = useState<string[]>(
    initial?.topicIds ?? [],
  );
  const [tagQ, setTagQ] = useState("");

  const autosaveStatus = useAutosave(initial?.id, {
    title_en: titleEn,
    dek_en: dekEn,
    body_en: bodyJson,
  });
  const canPublish = userRole === "ADMIN" || userRole === "EDITOR";
  const st = STATUS[status] ?? STATUS.DRAFT;
  const seoT = seoTitle || titleEn;
  const seoD = seoDescription || dekEn;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await onSubmit(bodyJson, formData);
      if (result?.error) setError(result.error);
    });
  }
  const toggler =
    (set: React.Dispatch<React.SetStateAction<string[]>>) => (id: string) =>
      set((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleTag = toggler(setCheckedTags);
  const toggleTopic = toggler(setCheckedTopics);

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
    >
      {/* ───────── main column ───────── */}
      <div className="flex min-w-0 flex-col gap-5">
        <section className={`${ui.card} flex flex-col gap-4 p-5`}>
          <input
            name="title_en"
            required
            value={titleEn}
            placeholder="Article title"
            className="w-full border-0 bg-transparent p-0 font-headline-en text-3xl font-bold leading-tight tracking-tight placeholder:text-[#c5bfae] focus:outline-none focus:ring-0 lg:text-4xl"
            onChange={(e) => {
              setTitleEn(e.target.value);
              if (!slugTouched.current) setSlug(slugify(e.target.value));
            }}
          />
          <input
            name="dek_en"
            required
            value={dekEn}
            onChange={(e) => setDekEn(e.target.value)}
            placeholder="Dek: one sentence that sells the story"
            className={`${ui.input} !h-11`}
          />
          <div>
            <label className={ui.label}>URL slug</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3.5 top-[11px] text-[13px] text-[#6b665c]">
                  /article/
                </span>
                <input
                  name="slug"
                  required
                  value={slug}
                  placeholder="article-slug"
                  className={`${ui.input} pl-[76px]`}
                  onChange={(e) => {
                    slugTouched.current = true;
                    setSlug(slugify(e.target.value));
                  }}
                />
              </div>
              <button
                type="button"
                title="Regenerate from title"
                aria-label="Regenerate slug"
                className={ui.btn}
                onClick={() => {
                  slugTouched.current = false;
                  setSlug(slugify(titleEn));
                }}
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>
          <details open={Boolean(titleAm || dekAm)}>
            <summary className="cursor-pointer text-[13px] font-bold text-[#8a6414]">
              Amharic title &amp; dek (optional)
            </summary>
            <div className="mt-3 flex flex-col gap-3">
              <input
                name="title_am"
                value={titleAm}
                onChange={(e) => setTitleAm(e.target.value)}
                placeholder="Title (Amharic)"
                className={ui.input}
              />
              <input
                name="dek_am"
                value={dekAm}
                onChange={(e) => setDekAm(e.target.value)}
                placeholder="Dek (Amharic)"
                className={ui.input}
              />
            </div>
          </details>
        </section>

        <div>
          <div className={`${tabsCls} mb-3`} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={bodyLang === "en"}
              className={tabCls(bodyLang === "en")}
              onClick={() => setBodyLang("en")}
            >
              English
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={bodyLang === "am"}
              className={tabCls(bodyLang === "am")}
              onClick={() => setBodyLang("am")}
            >
              Amharic{bodyAmJson ? " ✓" : ""}
            </button>
          </div>
          <div className={bodyLang === "en" ? "" : "hidden"}>
            <RichTextEditor
              content={initial?.body_en ?? null}
              onChange={setBodyJson}
              lang="en"
            />
          </div>
          <div className={bodyLang === "am" ? "" : "hidden"}>
            <RichTextEditor
              key={
                bodyAmJson
                  ? JSON.stringify(bodyAmJson).slice(0, 40)
                  : "empty-am"
              }
              content={bodyAmJson}
              onChange={setBodyAmJson}
              lang="am"
            />
          </div>
          <input
            type="hidden"
            name="body_am"
            value={bodyAmJson ? JSON.stringify(bodyAmJson) : ""}
          />
        </div>

        <AIAssistPanel
          title={titleEn}
          dek={dekEn}
          bodyJson={bodyJson}
          onSeoSuggestion={(t, d) => {
            setSeoTitle(t);
            setSeoDescription(d);
          }}
          onTagSuggestion={(t) =>
            setCheckedTags((p) => [...new Set([...p, ...t])])
          }
          onTranslation={(tAm, dAm, bodyAm) => {
            setTitleAm(tAm);
            setDekAm(dAm);
            setBodyAmJson(bodyAm);
          }}
        />

        <Card title="Search & social preview">
          <div className="mb-4 rounded-xl border border-[#e6e1d6] bg-white px-4 py-3.5">
            <small className="block truncate text-xs text-[#188038]">
              yoursite.com › article › {slug || "article-slug"}
            </small>
            <b className="my-0.5 block text-lg font-medium leading-snug text-[#1a0dab]">
              {seoT || "Your SEO title appears here"}
            </b>
            <p className="text-[13px] leading-relaxed text-[#4d5156]">
              {seoD ||
                "Your meta description appears here. Write 120–160 characters."}
            </p>
          </div>
          <div className="flex flex-col gap-3.5">
            <div>
              <div className="flex justify-between">
                <label className={ui.label}>SEO title</label>
                <Counter value={seoTitle.length} max={60} />
              </div>
              <input
                name="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Defaults to the article title"
                className={ui.input}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <label className={ui.label}>Meta description</label>
                <Counter value={seoDescription.length} max={160} />
              </div>
              <textarea
                name="seoDescription"
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Defaults to the dek"
                className={ui.textarea}
              />
            </div>
            <div>
              <label className={ui.label}>Open Graph image URL</label>
              <input
                name="ogImageUrl"
                defaultValue={initial?.ogImageUrl ?? ""}
                placeholder="Optional. Defaults to the featured image"
                className={ui.input}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* ───────── sidebar ───────── */}
      <aside className="flex flex-col gap-4 xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto xl:pr-1">
        <Card
          title="Publish"
          aside={
            <span
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wide"
              style={{ background: st.bg, color: st.fg }}
            >
              <i className="h-1.5 w-1.5 rounded-full bg-current" />
              {st.label}
            </span>
          }
        >
          <div className="flex flex-col gap-3">
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={ui.input}
            >
              <option value="DRAFT">Draft</option>
              <option value="IN_REVIEW">In review</option>
              {canPublish && (
                <>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </>
              )}
            </select>
            {status === "SCHEDULED" && (
              <input
                name="scheduledAt"
                type="datetime-local"
                className={ui.input}
                defaultValue={
                  initial?.scheduledAt
                    ? new Date(initial.scheduledAt).toISOString().slice(0, 16)
                    : ""
                }
              />
            )}
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
              <input
                type="checkbox"
                name="isBreaking"
                defaultChecked={initial?.isBreaking}
                className="h-4 w-4 accent-[#c0392b]"
              />
              Mark as breaking news
            </label>
            {error && (
              <p className="rounded-[10px] bg-[#fdecec] px-3 py-2 text-[13px] text-[#8f1d1d]">
                {error}
              </p>
            )}
            <div className="flex items-center justify-between gap-3">
              <AutosaveIndicator status={autosaveStatus} />
              <span className="text-[11px] text-[#6b665c]">⌘/Ctrl + S</span>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className={`${ui.btnPrimary} !h-11 w-full`}
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isPending ? "Saving…" : st.cta}
            </button>
          </div>
        </Card>

        <Card title="Featured image">
          <input type="hidden" name="heroImageUrl" value={heroImageUrl} />
          <div className="relative aspect-video overflow-hidden rounded-xl bg-[#ece7da]">
            {heroImageUrl ? (
              <>
                <Image
                  src={heroImageUrl}
                  alt="Featured"
                  fill
                  sizes="340px"
                  className="object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => setHeroImageUrl("")}
                  className={`${ui.iconBtn} absolute right-2 top-2`}
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="absolute inset-0 grid place-items-center text-sm font-semibold text-[#6b665c] transition hover:bg-[#e8e2d2]"
              >
                <span className="grid place-items-center gap-1">
                  <ImageIcon size={22} />
                  Choose from library
                </span>
              </button>
            )}
          </div>
          {heroImageUrl && (
            <button
              type="button"
              className={`${ui.btn} mt-3 !h-9`}
              onClick={() => setPickerOpen(true)}
            >
              Change image
            </button>
          )}
          <input
            name="heroImageCaption"
            defaultValue={initial?.heroImageCaption ?? ""}
            placeholder="Caption"
            className={`${ui.input} mt-3`}
          />
        </Card>

        <Card title="Organize">
          <div className="flex flex-col gap-4">
            {canPublish && (
              <div>
                <label className={ui.label}>Author</label>
                <select
                  name="authorId"
                  defaultValue={initialAuthorId}
                  className={ui.input}
                >
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name ?? a.email}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className={ui.label}>Category</label>
              <select
                name="categoryId"
                required
                defaultValue={initial?.categoryId}
                className={ui.input}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={ui.label}>
                Tags{checkedTags.length > 0 && ` · ${checkedTags.length}`}
              </label>
              {tags.length > 12 && (
                <input
                  value={tagQ}
                  onChange={(e) => setTagQ(e.target.value)}
                  placeholder="Filter tags…"
                  className={`${ui.input} mb-2 !h-9`}
                />
              )}
              <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
                {tags.map((t) => (
                  <label
                    key={t.id}
                    className={`${chip(checkedTags.includes(t.id))} ${t.name.toLowerCase().includes(tagQ.toLowerCase()) ? "" : "hidden"}`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      name="tagIds"
                      value={t.id}
                      checked={checkedTags.includes(t.id)}
                      onChange={() => toggleTag(t.id)}
                    />
                    {t.name}
                  </label>
                ))}
              </div>
            </div>
            {topics.length > 0 && (
              <div>
                <label className={ui.label}>Topics</label>
                <div className="flex flex-wrap gap-1.5">
                  {topics.map((t) => (
                    <label
                      key={t.id}
                      className={chip(checkedTopics.includes(t.id))}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        name="topicIds"
                        value={t.id}
                        checked={checkedTopics.includes(t.id)}
                        onChange={() => toggleTopic(t.id)}
                      />
                      {t.title}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className={ui.label}>Read time (minutes)</label>
              <div className="flex gap-2">
                <input
                  name="readTimeMinutes"
                  type="number"
                  min={1}
                  value={readTime}
                  onChange={(e) => setReadTime(Number(e.target.value) || 1)}
                  className={ui.input}
                />
                <button
                  type="button"
                  className={ui.btn}
                  onClick={() =>
                    setReadTime(
                      Math.max(
                        1,
                        Math.ceil(
                          jsonText(bodyJson as N)
                            .trim()
                            .split(/\s+/)
                            .filter(Boolean).length / 200,
                        ),
                      ),
                    )
                  }
                >
                  Auto
                </button>
              </div>
            </div>
          </div>
        </Card>
      </aside>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(urls) => setHeroImageUrl(urls[0] ?? "")}
      />
    </form>
  );
}
