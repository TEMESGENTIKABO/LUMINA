"use client";

import { useState, useTransition } from "react";
import { createApiKey } from "@/lib/admin/actions/apiKeyActions";

export function ApiKeyForm() {
  const [name, setName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await createApiKey(name);
      if (result.error) setError(result.error);
      else {
        setNewKey(result.key!);
        setName("");
      }
    });
  }

  return (
    <div className="border border-obsidian-grey/10 p-6 mb-8 max-w-lg">
      <h2 className="font-ui text-sm uppercase tracking-wide text-obsidian-grey mb-4">New API Key</h2>
      {newKey ? (
        <div>
          <p className="font-ui text-xs text-manuscript-red mb-2">
            Copy this key now - it will not be shown again.
          </p>
          <code className="block bg-obsidian-grey/5 p-3 font-ui text-sm break-all select-all">{newKey}</code>
          <button onClick={() => setNewKey(null)} className="font-ui text-sm text-obsidian-grey hover:text-aksum-black mt-3">
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Key name (e.g. 'Partner integration')"
            className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
          />
          {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
          <button type="submit" disabled={isPending} className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2 self-start">
            {isPending ? "Creating..." : "Generate Key"}
          </button>
        </form>
      )}
    </div>
  );
}
