"use client";

import { useEffect, useState } from "react";
import { useEditor, useEditorState, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { VideoEmbed } from "@/lib/tiptapVideoEmbed";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Image as ImageIcon,
  Film,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { MediaPickerModal } from "./MediaPickerModal";

const PROSE = [
  "min-h-[380px] px-6 py-5 text-[17px] leading-[1.75] text-[#12100d] focus:outline-none",
  "[&_p]:mb-[1.1em]",
  "[&_h2]:mb-2 [&_h2]:mt-[1.6em] [&_h2]:text-[1.55em] [&_h2]:font-bold [&_h2]:leading-tight",
  "[&_h3]:mb-1.5 [&_h3]:mt-[1.4em] [&_h3]:text-[1.25em] [&_h3]:font-bold [&_h3]:leading-snug",
  "[&_blockquote]:my-[1.4em] [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#c79a45] [&_blockquote]:py-0.5 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#4b4437]",
  "[&_ul]:mb-[1.1em] [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-[1.1em] [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_a]:text-[#8a6414] [&_a]:underline",
  "[&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl",
  "[&_code]:rounded-md [&_code]:bg-[#f1ede2] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[.9em]",
  "[&_hr]:my-8 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-[#e6e1d6]",
  "[&_p.is-editor-empty:first-child]:before:pointer-events-none [&_p.is-editor-empty:first-child]:before:float-left [&_p.is-editor-empty:first-child]:before:h-0 [&_p.is-editor-empty:first-child]:before:text-[#a8a293] [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]",
].join(" ");

const countWords = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;

function Btn({
  on,
  disabled,
  title,
  onClick,
  children,
}: {
  on?: boolean;
  disabled?: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={on}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`grid h-8 w-8 place-items-center rounded-lg transition disabled:opacity-40 disabled:hover:bg-transparent ${
        on ? "bg-aksum-black text-white" : "text-[#3d382f] hover:bg-[#f1ede2]"
      }`}
    >
      {children}
    </button>
  );
}
const Sep = () => <span className="mx-1.5 h-5 w-px bg-[#e6e1d6]" />;

export function RichTextEditor({
  content,
  onChange,
  lang = "en",
}: {
  content: object | null;
  onChange: (json: object) => void;
  lang?: "en" | "am";
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [full, setFull] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder:
          lang === "am"
            ? "\u12A0\u122D\u1275\u12A0\u12CD\u1295 \u12ED\u133B\u1349..."
            : "Start writing your story…",
      }),
      VideoEmbed,
    ],
    content: content ?? "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        lang,
        class: `${lang === "am" ? "font-body-am" : "font-body-en"} ${PROSE}`,
      },
    },
  });

  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      const text = e?.getText() ?? "";
      return {
        bold: !!e?.isActive("bold"),
        italic: !!e?.isActive("italic"),
        underline: !!e?.isActive("underline"),
        strike: !!e?.isActive("strike"),
        h2: !!e?.isActive("heading", { level: 2 }),
        h3: !!e?.isActive("heading", { level: 3 }),
        bullet: !!e?.isActive("bulletList"),
        ordered: !!e?.isActive("orderedList"),
        quote: !!e?.isActive("blockquote"),
        code: !!e?.isActive("code"),
        link: !!e?.isActive("link"),
        undo: !!e?.can().undo(),
        redo: !!e?.can().redo(),
        words: countWords(text),
        chars: text.length,
      };
    },
  });

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFull(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [full]);

  if (!editor || s == null) return null;
  const run = () => editor.chain().focus();

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt(
      "Link URL (leave empty to remove):",
      prev ?? "https://",
    );
    if (url === null) return;
    if (!url.trim())
      return void run().extendMarkRange("link").unsetLink().run();
    run().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };
  const insertVideo = () => {
    const url = window.prompt(
      "Paste a YouTube, Vimeo, or direct video (.mp4) URL:",
    );
    if (url?.trim())
      run()
        .insertContent({ type: "videoEmbed", attrs: { url: url.trim() } })
        .run();
  };

  return (
    <div
      className={`border border-[#e6e1d6] bg-white ${full ? "fixed inset-0 z-[90] overflow-auto" : "rounded-2xl"}`}
    >
      <div
        role="toolbar"
        aria-label="Formatting"
        className={`sticky z-20 flex flex-wrap items-center gap-0.5 border-b border-[#e6e1d6] bg-white/95 p-1.5 backdrop-blur ${
          full ? "top-0" : "top-16 rounded-t-2xl"
        }`}
      >
        <Btn title="Undo" disabled={!s.undo} onClick={() => run().undo().run()}>
          <Undo2 size={16} />
        </Btn>
        <Btn title="Redo" disabled={!s.redo} onClick={() => run().redo().run()}>
          <Redo2 size={16} />
        </Btn>
        <Sep />
        <Btn
          title="Heading 2"
          on={s.h2}
          onClick={() => run().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={16} />
        </Btn>
        <Btn
          title="Heading 3"
          on={s.h3}
          onClick={() => run().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={16} />
        </Btn>
        <Sep />
        <Btn title="Bold" on={s.bold} onClick={() => run().toggleBold().run()}>
          <Bold size={16} />
        </Btn>
        <Btn
          title="Italic"
          on={s.italic}
          onClick={() => run().toggleItalic().run()}
        >
          <Italic size={16} />
        </Btn>
        <Btn
          title="Underline"
          on={s.underline}
          onClick={() => run().toggleUnderline().run()}
        >
          <Underline size={16} />
        </Btn>
        <Btn
          title="Strikethrough"
          on={s.strike}
          onClick={() => run().toggleStrike().run()}
        >
          <Strikethrough size={16} />
        </Btn>
        <Btn title="Link" on={s.link} onClick={setLink}>
          <LinkIcon size={16} />
        </Btn>
        <Sep />
        <Btn
          title="Bullet list"
          on={s.bullet}
          onClick={() => run().toggleBulletList().run()}
        >
          <List size={16} />
        </Btn>
        <Btn
          title="Numbered list"
          on={s.ordered}
          onClick={() => run().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </Btn>
        <Btn
          title="Quote"
          on={s.quote}
          onClick={() => run().toggleBlockquote().run()}
        >
          <Quote size={16} />
        </Btn>
        <Btn
          title="Inline code"
          on={s.code}
          onClick={() => run().toggleCode().run()}
        >
          <Code size={16} />
        </Btn>
        <Btn title="Divider" onClick={() => run().setHorizontalRule().run()}>
          <Minus size={16} />
        </Btn>
        <Sep />
        <Btn title="Insert image" onClick={() => setPickerOpen(true)}>
          <ImageIcon size={16} />
        </Btn>
        <Btn title="Insert video" onClick={insertVideo}>
          <Film size={16} />
        </Btn>
        <span className="flex-1" />
        <Btn
          title={full ? "Exit focus mode (Esc)" : "Focus mode"}
          on={full}
          onClick={() => setFull((v) => !v)}
        >
          {full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </Btn>
      </div>

      <div className={full ? "mx-auto max-w-[760px]" : ""}>
        <EditorContent editor={editor} />
      </div>

      <div className="flex justify-between gap-3 border-t border-[#e6e1d6] px-4 py-2.5 text-xs tabular-nums text-[#6b665c]">
        <span>
          {s.words.toLocaleString()} words · {s.chars.toLocaleString()}{" "}
          characters
        </span>
        <span>~{Math.max(1, Math.ceil(s.words / 200))} min read</span>
      </div>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          editor.chain().focus().setImage({ src: url[0] }).run();
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
