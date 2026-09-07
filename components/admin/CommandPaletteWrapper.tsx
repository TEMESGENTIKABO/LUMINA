"use client";

import dynamic from "next/dynamic";

const CommandPalette = dynamic(
  () =>
    import("@/components/admin/CommandPalette").then(
      (mod) => mod.CommandPalette,
    ),
  { ssr: false },
);

export function CommandPaletteWrapper() {
  return <CommandPalette />;
}
