import { Node, mergeAttributes } from "@tiptap/core";
import { parseVideoEmbed } from "./embedUrl";

export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      url: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-video-embed]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const url = (node.attrs.url as string) ?? "";
    const { type, embedUrl } = parseVideoEmbed(url);

    if (type === "youtube" || type === "vimeo") {
      return [
        "div",
        mergeAttributes(HTMLAttributes, { "data-video-embed": "true", class: "video-embed-wrapper" }),
        ["iframe", { src: embedUrl, allowfullscreen: "true", frameborder: "0" }],
      ];
    }

    if (type === "direct-video") {
      return [
        "div",
        mergeAttributes(HTMLAttributes, { "data-video-embed": "true", class: "video-embed-wrapper" }),
        ["video", { src: embedUrl, controls: "true" }],
      ];
    }

    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-video-embed": "true", class: "video-embed-wrapper video-embed-error" }),
      ["p", {}, `Unrecognized video URL: ${url}`],
    ];
  },
});
