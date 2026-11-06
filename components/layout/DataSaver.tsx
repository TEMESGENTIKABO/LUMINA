"use client";

import { useSyncExternalStore } from "react";
import { Gauge } from "lucide-react";
import { DATA_SAVER_KEY } from "@/lib/dataSaverScript";
import { getLabels } from "@/lib/labels";

function subscribeToDataSaver(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-saver"],
  });
  return () => observer.disconnect();
}

function getDataSaverSnapshot() {
  return document.documentElement.dataset.saver === "on";
}

function getServerDataSaverSnapshot() {
  return false;
}

export function DataSaverToggle({
  locale,
  className,
}: {
  locale: string;
  className?: string;
}) {
  const L = getLabels(locale);
  const on = useSyncExternalStore(
    subscribeToDataSaver,
    getDataSaverSnapshot,
    getServerDataSaverSnapshot,
  );

  function toggle() {
    const next = !on;
    if (next) document.documentElement.dataset.saver = "on";
    else delete document.documentElement.dataset.saver;
    try {
      localStorage.setItem(DATA_SAVER_KEY, next ? "on" : "off");
    } catch {}
  }

  return (
    <button
      type="button"
      className={className}
      aria-pressed={on}
      onClick={toggle}
    >
      <Gauge size={16} /> {L.dataSaver}: {on ? L.on : L.off}
    </button>
  );
}
