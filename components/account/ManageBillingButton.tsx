"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/membership/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      <Button variant="outline" onClick={handleClick} disabled={loading}>
        {loading ? "Loading..." : "Manage Billing"}
      </Button>
      {error && <p className="font-ui text-xs text-manuscript-red mt-2">{error}</p>}
    </div>
  );
}
