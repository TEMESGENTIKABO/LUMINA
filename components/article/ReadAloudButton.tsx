"use client";

import { useEffect, useState } from "react";
import { Volume2, Square } from "lucide-react";

export function ReadAloudButton({ text, lang }: { text: string; lang: "en" | "am" }) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => window.speechSynthesis?.cancel();
  }, []);

  function toggle() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "am" ? "am-ET" : "en-US";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  if (!supported) return null;

  return (
    <button
      onClick={toggle}
      aria-label={speaking ? "Stop reading" : "Read article aloud"}
      className="flex items-center gap-1.5 px-2.5 py-2 border border-obsidian-grey/20 text-obsidian-grey hover:text-aksum-black hover:border-aksum-black transition-colors flex-shrink-0"
    >
      {speaking ? <Square size={13} /> : <Volume2 size={14} />}
    </button>
  );
}
