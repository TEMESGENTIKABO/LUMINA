export function tiptapDocToPlainText(doc: any): string {
  if (!doc?.content) return "";
  const lines: string[] = [];
  for (const node of doc.content) {
    if (node.type === "paragraph" || node.type === "heading") {
      const text = (node.content ?? []).map((n: any) => n.text ?? "").join("");
      if (text.trim()) lines.push(text);
    }
  }
  return lines.join("\n\n");
}

export function paragraphsToTiptapDoc(paragraphs: string[]): object {
  return {
    type: "doc",
    content: paragraphs
      .filter((p) => p.trim())
      .map((text) => ({ type: "paragraph", content: [{ type: "text", text }] })),
  };
}
