import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AKSUM - Ancient roots. Modern voice.",
    short_name: "AKSUM",
    description: "Premium bilingual Ethiopian journalism.",
    start_url: "/en",
    display: "standalone",
    background_color: "#F8F5EF",
    theme_color: "#12100D",
    icons: [
      { src: "/images/gerd.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
