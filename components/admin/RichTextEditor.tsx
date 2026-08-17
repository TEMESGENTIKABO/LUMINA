"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { VideoEmbed } from "@/lib/tiptapVideoEmbed";
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Image as ImageIcon, Film } from "lucide-react";
import { MediaPickerModal } from "./MediaPickerModal";

export function RichTextEditor({
  content,
  onChange,
  lang = "en",
}: {
  content: object | null;
  onChange: (json: object) => void;
  lang?: "en" | "am";
}) {
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: lang === "am" ? "\u12A0\u122D\u1275\u12A0\u12CD\u1295 \u12ED\u133B\u1349..." : "Write the article body..." }),
      VideoEmbed,
    ],
    content: content ?? "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        lang,
        class: `${lang === "am" ? "font-body-am" : "font-body-en"} text-base leading-relaxed min-h-[300px] focus:outline-none px-4 py-3`,
      },
    },
  });

  if (!editor) return null;

  function insertVideo() {
    const url = window.prompt("Paste a YouTube, Vimeo, or direct video (.mp4) URL:");
    if (!url || !url.trim()) return;
    editor!.chain().focus().insertContent({ type: "videoEmbed", attrs: { url: url.trim() } }).run();
  }

  return (
    <div className="border border-obsidian-grey/20">
      <div className="flex items-center gap-1 border-b border-obsidian-grey/20 px-2 py-1 flex-wrap">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 ${editor.isActive("bold") ? "bg-obsidian-grey/10" : ""}`}>
          <Bold size={14} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 ${editor.isActive("italic") ? "bg-obsidian-grey/10" : ""}`}>
          <Italic size={14} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 ${editor.isActive("heading", { level: 2 }) ? "bg-obsidian-grey/10" : ""}`}>
          <Heading2 size={14} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 ${editor.isActive("bulletList") ? "bg-obsidian-grey/10" : ""}`}>
          <List size={14} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 ${editor.isActive("orderedList") ? "bg-obsidian-grey/10" : ""}`}>
          <ListOrdered size={14} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 ${editor.isActive("blockquote") ? "bg-obsidian-grey/10" : ""}`}>
          <Quote size={14} />
        </button>
        <span className="w-px h-5 bg-obsidian-grey/20 mx-1" />
        <button type="button" onClick={() => setImagePickerOpen(true)} className="p-2" title="Insert image">
          <ImageIcon size={14} />
        </button>
        <button type="button" onClick={insertVideo} className="p-2" title="Insert video">
          <Film size={14} />
        </button>
      </div>
      <EditorContent editor={editor} />

      <MediaPickerModal
        open={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onSelect={(url) => {
          editor.chain().focus().setImage({ src: url }).run();
          setImagePickerOpen(false);
        }}
      />
    </div>
  );
}
