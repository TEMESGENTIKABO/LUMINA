"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { THEMES } from "@/config/themes";

export function ThemePicker({ defaultValue }: { defaultValue: number }) {
  const [value, setValue] = useState(
    THEMES.some((t) => t.id === defaultValue) ? defaultValue : 1,
  );

  return (
    <fieldset>
      <legend className="font-ui text-xs uppercase tracking-wide text-obsidian-grey block mb-2">
        Site Theme
      </legend>
      <p className="font-ui text-xs text-obsidian-grey mb-3">
        Changes the header, homepage and footer together. Applies as soon as you
        save.
      </p>
      <input type="hidden" name="headerTheme" value={value} />

      <div
        role="radiogroup"
        aria-label="Site theme"
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        {THEMES.map((t) => {
          const on = t.id === value;
          return (
            <div key={t.id}>
              <button
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setValue(t.id)}
                className={`relative w-full rounded-lg p-2 text-left bg-parchment-white transition ${
                  on
                    ? "ring-2 ring-aksum-black"
                    : "ring-1 ring-obsidian-grey/20 hover:ring-obsidian-grey/50"
                }`}
              >
                {/* tiny preview of the header */}
                <div className="overflow-hidden rounded-md border border-obsidian-grey/15">
                  <div style={{ background: t.strip, height: 8 }} />
                  <div
                    style={{ background: t.bar, height: 22 }}
                    className="flex items-center gap-1.5 px-2"
                  >
                    <span
                      style={{ background: t.accent }}
                      className="h-3 w-3 rounded-full"
                    />
                    {[0, 1, 2, 3].map((n) => (
                      <span
                        key={n}
                        className="h-1 w-5 rounded"
                        style={{
                          background: t.dark ? "#ffffff" : "#111111",
                          opacity: 0.4,
                        }}
                      />
                    ))}
                    <span
                      style={{ background: t.accent }}
                      className="ml-auto h-3 w-8 rounded-full"
                    />
                  </div>
                  <div
                    style={{ background: t.panel, height: 34 }}
                    className="flex gap-1.5 p-2"
                  >
                    {[0, 1, 2].map((n) => (
                      <span
                        key={n}
                        className="flex-1 rounded-sm"
                        style={{ background: t.accent, opacity: 0.35 }}
                      />
                    ))}
                  </div>
                </div>
                <p className="font-ui text-sm font-semibold mt-2">{t.name}</p>
                <p className="font-ui text-xs text-obsidian-grey">{t.note}</p>
                {on && (
                  <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-aksum-black text-parchment-white">
                    <Check size={12} />
                  </span>
                )}
              </button>
              <a
                href={`/en?header=${t.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-ui text-xs underline text-obsidian-grey hover:text-aksum-black mt-1 inline-block"
              >
                Preview
              </a>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
