import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { VideoEmbed } from "./tiptapVideoEmbed";

export function renderTiptapJson(json: object): string {
  try {
    return generateHTML(json as any, [
      StarterKit.configure({ link: false }),
      Image,
      Link.configure({ openOnClick: false }),
      VideoEmbed,
    ]);
  } catch {
    return "";
  }
}
