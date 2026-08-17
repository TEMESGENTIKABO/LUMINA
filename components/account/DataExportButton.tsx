"use client";

export function DataExportButton() {
  return (
    
      href="/api/account/export"
      download
      className="font-ui text-sm border border-obsidian-grey/20 px-4 py-2 hover:border-aksum-black inline-block"
    >
      Download my data
    </a>
  );
}
