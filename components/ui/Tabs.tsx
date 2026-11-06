"use client";

import { useState, useRef, Children, isValidElement } from "react";

interface TabProps { label: string; children: React.ReactNode }
export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

export function Tabs({ children, defaultIndex = 0 }: { children: React.ReactElement<TabProps>[]; defaultIndex?: number }) {
  const [active, setActive] = useState(defaultIndex);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = Children.toArray(children).filter(isValidElement) as React.ReactElement<TabProps>[];

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowRight") {
      const next = (index + 1) % tabs.length;
      setActive(next);
      tabRefs.current[next]?.focus();
    } else if (e.key === "ArrowLeft") {
      const prev = (index - 1 + tabs.length) % tabs.length;
      setActive(prev);
      tabRefs.current[prev]?.focus();
    }
  }

  return (
    <div>
      <div role="tablist" className="flex gap-1 hairline-b">
        {tabs.map((tab, i) => (
          <button
            key={i}
            ref={(el) => { tabRefs.current[i] = el; }}
            role="tab"
            aria-selected={active === i}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`px-4 py-2.5 font-ui text-sm border-b-2 -mb-px transition-colors ${
              active === i ? "border-manuscript-red text-aksum-black" : "border-transparent text-obsidian-grey hover:text-aksum-black"
            }`}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-5">
        {tabs[active]}
      </div>
    </div>
  );
}
