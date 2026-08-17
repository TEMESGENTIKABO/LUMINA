"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { AIAssistPanel } from "@/components/admin/AIAssistPanel";

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
    isBreaking?: boolean; // Added isBreaking to initial prop type
  };
  onSubmit: (
    bodyJson: object,
    formData: FormData,
  ) => Promise<{ error?: string; success?: boolean } | void>;
}) {
  // Existing state
  const [heroImageUrl, setHeroImageUrl] = useState(initial?.heroImageUrl ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bodyJson, setBodyJson] = useState<object>(initial?.body_en ?? {});
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(initial?.status ?? "DRAFT");
  const [bodyLang, setBodyLang] = useState<"en" | "am">("en");

  // New state for AI Assist integration
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

  // Initialize checked tags with both initial tags and any AI-suggested tags
  const [checkedTags, setCheckedTags] = useState<string[]>(
    initial?.tagIds ?? [],
  );

  // Initialize checked topics
  const [checkedTopics, setCheckedTopics] = useState<string[]>(
    initial?.topicIds ?? [],
  );

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await onSubmit(bodyJson, formData);
      if (result?.error) setError(result.error);
    });
  }

  // Handle tag checkbox changes
  const handleTagToggle = (tagId: string) => {
    setCheckedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  // Handle topic checkbox changes
  const handleTopicToggle = (topicId: string) => {
    setCheckedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId],
    );
  };

  // Update checked tags when AI suggests new ones
  const handleTagSuggestion = (suggestedTags: string[]) => {
    // Merge AI suggestions with existing checked tags (avoid duplicates)
    const mergedTags = [...new Set([...checkedTags, ...suggestedTags])];
    setCheckedTags(mergedTags);
  };

  return (
    <form
      action={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 flex flex-col gap-4">
        <input
          name="title_en"
          required
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          placeholder="Title (English)"
          className="border border-obsidian-grey/20 px-3 py-2 font-headline-en text-xl bg-parchment-white"
        />
        <input
          name="title_am"
          value={titleAm}
          onChange={(e) => setTitleAm(e.target.value)}
          placeholder="Title (Amharic, optional)"
          className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
        />
        <input
          name="dek_en"
          required
          value={dekEn}
          onChange={(e) => setDekEn(e.target.value)}
          placeholder="Dek / subheadline (English)"
          className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
        />
        <input
          name="dek_am"
          value={dekAm}
          onChange={(e) => setDekAm(e.target.value)}
          placeholder="Dek (Amharic, optional)"
          className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
        />
        <input
          name="slug"
          required
          defaultValue={initial?.slug}
          placeholder="article-slug"
          className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
        />

        {/* REPLACED BLOCK START */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-ui text-xs uppercase tracking-wide text-obsidian-grey">
              Body
            </label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setBodyLang("en")}
                className={`font-ui text-xs px-3 py-1 border ${bodyLang === "en" ? "bg-aksum-black text-parchment-white border-aksum-black" : "border-obsidian-grey/20 text-obsidian-grey"}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setBodyLang("am")}
                className={`font-ui text-xs px-3 py-1 border ${bodyLang === "am" ? "bg-aksum-black text-parchment-white border-aksum-black" : "border-obsidian-grey/20 text-obsidian-grey"}`}
              >
                Amharic {bodyAmJson ? "\u2713" : ""}
              </button>
            </div>
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
        </div>
        {/* REPLACED BLOCK END */}

        {/* Hidden field for body_am submission */}
        <input
          type="hidden"
          name="body_am"
          value={bodyAmJson ? JSON.stringify(bodyAmJson) : ""}
        />

        {/* AI Assist Panel */}
        <AIAssistPanel
          title={titleEn}
          dek={dekEn}
          bodyJson={bodyJson}
          onSeoSuggestion={(title, desc) => {
            setSeoTitle(title);
            setSeoDescription(desc);
          }}
          onTagSuggestion={(tags) => handleTagSuggestion(tags)}
          onTranslation={(tAm, dAm, bodyAm) => {
            setTitleAm(tAm);
            setDekAm(dAm);
            setBodyAmJson(bodyAm);
          }}
        />

        <div className="border-t border-obsidian-grey/10 pt-4">
          <h3 className="font-ui text-xs uppercase tracking-wide text-obsidian-grey mb-3">
            SEO
          </h3>
          <div className="flex flex-col gap-3">
            <input
              name="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="SEO title (defaults to article title if blank)"
              className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
            />
            <textarea
              name="seoDescription"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="SEO meta description"
              rows={2}
              className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
            />
            <input
              name="ogImageUrl"
              defaultValue={initial?.ogImageUrl ?? ""}
              placeholder="Open Graph image URL (optional, defaults to hero image)"
              className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="border border-obsidian-grey/10 p-4">
          <label className="font-ui text-xs uppercase tracking-wide text-obsidian-grey block mb-2">
            Featured Image
          </label>
          <input type="hidden" name="heroImageUrl" value={heroImageUrl} />
          {heroImageUrl ? (
            <div className="relative aspect-video bg-obsidian-grey/10 mb-2">
              <Image
                src={heroImageUrl}
                alt="Featured"
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-obsidian-grey/5 mb-2 flex items-center justify-center">
              <span className="font-ui text-xs text-obsidian-grey">
                No image selected
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="font-ui text-xs text-obsidian-grey hover:text-aksum-black underline"
          >
            {heroImageUrl ? "Change image" : "Select image"}
          </button>
          <input
            name="heroImageCaption"
            defaultValue={initial?.heroImageCaption ?? ""}
            placeholder="Image caption"
            className="border border-obsidian-grey/20 px-3 py-2 font-ui text-xs bg-parchment-white w-full mt-2"
          />
        </div>

        {/* NEW AUTHOR SELECTOR BLOCK */}
        {(userRole === "ADMIN" || userRole === "EDITOR") && (
          <div className="border border-obsidian-grey/10 p-4">
            <label className="font-ui text-xs uppercase tracking-wide text-obsidian-grey block mb-2">
              Author
            </label>
            <select
              name="authorId"
              defaultValue={initialAuthorId}
              className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white w-full"
            >
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name ?? a.email}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="border border-obsidian-grey/10 p-4">
          <label className="font-ui text-xs uppercase tracking-wide text-obsidian-grey block mb-2">
            Category
          </label>
          <select
            name="categoryId"
            required
            defaultValue={initial?.categoryId}
            className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white w-full"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_en}
              </option>
            ))}
          </select>
        </div>

        <div className="border border-obsidian-grey/10 p-4">
          <label className="font-ui text-xs uppercase tracking-wide text-obsidian-grey block mb-2">
            Tags
          </label>
          <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className="flex items-center gap-2 font-ui text-sm"
              >
                <input
                  type="checkbox"
                  name="tagIds"
                  value={tag.id}
                  checked={checkedTags.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>

        {/* New Topics block */}
        <div className="border border-obsidian-grey/10 p-4">
          <label className="font-ui text-xs uppercase tracking-wide text-obsidian-grey block mb-2">
            Topics
          </label>
          <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
            {topics.map((topic) => (
              <label
                key={topic.id}
                className="flex items-center gap-2 font-ui text-sm"
              >
                <input
                  type="checkbox"
                  name="topicIds"
                  value={topic.id}
                  checked={checkedTopics.includes(topic.id)}
                  onChange={() => handleTopicToggle(topic.id)}
                />
                {topic.title}
              </label>
            ))}
          </div>
        </div>

        <div className="border border-obsidian-grey/10 p-4">
          <label className="font-ui text-xs uppercase tracking-wide text-obsidian-grey block mb-2">
            Read Time (minutes)
          </label>
          <input
            name="readTimeMinutes"
            type="number"
            min={1}
            defaultValue={initial?.readTimeMinutes ?? 5}
            className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white w-full"
          />
        </div>

        <div className="border border-obsidian-grey/10 p-4">
          <label className="font-ui text-xs uppercase tracking-wide text-obsidian-grey block mb-2">
            Publishing
          </label>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white w-full mb-2"
          >
            <option value="DRAFT">Draft</option>
            <option value="IN_REVIEW">In Review</option>
            {(userRole === "ADMIN" || userRole === "EDITOR") && (
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
              defaultValue={
                initial?.scheduledAt
                  ? new Date(initial.scheduledAt).toISOString().slice(0, 16)
                  : ""
              }
              className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white w-full"
            />
          )}
        </div>

        {/* NEW ISBREAKING CHECKBOX */}
        <div className="border border-obsidian-grey/10 p-4">
          <label className="flex items-center gap-2 font-ui text-sm">
            <input
              type="checkbox"
              name="isBreaking"
              defaultChecked={initial?.isBreaking}
            />
            Mark as Breaking News
          </label>
        </div>

        {error && (
          <p className="font-ui text-xs text-manuscript-red">{error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-3"
        >
          {isPending ? "Saving..." : "Save Article"}
        </button>
      </div>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => setHeroImageUrl(url)}
      />
    </form>
  );
}
