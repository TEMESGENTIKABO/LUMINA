"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { VideoEmbed } from "@/lib/tiptapVideoEmbed";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Image as ImageIcon,
  Film,
} from "lucide-react";
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
      Placeholder.configure({
        placeholder:
          lang === "am" ? "አርትአውን ይጻፉ..." : "Write the article body...",
      }),
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
        class: `${lang === "am" ? "font-body-am" : "font-body-en"} text-base leading-relaxed min-h-[300px] focus:outline-none px-4 py-3 prose prose-sm max-w-none`,
      },
    },
  });

  if (!editor) return null;

  function insertVideo() {
    const url = window.prompt(
      "Paste a YouTube, Vimeo, or direct video (.mp4) URL:",
    );
    if (!url || !url.trim()) return;
    editor!
      .chain()
      .focus()
      .insertContent({ type: "videoEmbed", attrs: { url: url.trim() } })
      .run();
  }

  return (
    <div className="border border-[#e5e3df] rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-[#e5e3df] bg-[#faf9f7] px-2 py-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg hover:bg-[#e5e3df] transition-colors ${editor.isActive("bold") ? "bg-[#e5e3df] text-[#1e2028]" : "text-[#6b6f7a]"}`}
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg hover:bg-[#e5e3df] transition-colors ${editor.isActive("italic") ? "bg-[#e5e3df] text-[#1e2028]" : "text-[#6b6f7a]"}`}
        >
          <Italic size={15} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded-lg hover:bg-[#e5e3df] transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-[#e5e3df] text-[#1e2028]" : "text-[#6b6f7a]"}`}
        >
          <Heading2 size={15} />
        </button>

        <span className="w-px h-5 bg-[#d4d2cd] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg hover:bg-[#e5e3df] transition-colors ${editor.isActive("bulletList") ? "bg-[#e5e3df] text-[#1e2028]" : "text-[#6b6f7a]"}`}
        >
          <List size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg hover:bg-[#e5e3df] transition-colors ${editor.isActive("orderedList") ? "bg-[#e5e3df] text-[#1e2028]" : "text-[#6b6f7a]"}`}
        >
          <ListOrdered size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg hover:bg-[#e5e3df] transition-colors ${editor.isActive("blockquote") ? "bg-[#e5e3df] text-[#1e2028]" : "text-[#6b6f7a]"}`}
        >
          <Quote size={15} />
        </button>

        <span className="w-px h-5 bg-[#d4d2cd] mx-1" />

        <button
          type="button"
          onClick={() => setImagePickerOpen(true)}
          className="p-2 rounded-lg hover:bg-[#e5e3df] text-[#6b6f7a] transition-colors"
          title="Insert image"
        >
          <ImageIcon size={15} />
        </button>
        <button
          type="button"
          onClick={insertVideo}
          className="p-2 rounded-lg hover:bg-[#e5e3df] text-[#6b6f7a] transition-colors"
          title="Insert video"
        >
          <Film size={15} />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} className="cursor-text" />

      {/* The new, polished Media Picker */}
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
