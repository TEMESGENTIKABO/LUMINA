"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/lib/actions/passwordResetActions";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = await requestPasswordReset(email);
    if (result.error) setError(result.error);
    else setSent(true);
  }

  return (
    <main className="max-w-sm mx-auto px-6 pt-16 pb-20">
      <h1 className="font-headline-en text-[length:var(--text-headline-lg)]">Reset your password</h1>
      {sent ? (
        <p className="font-ui text-sm text-obsidian-grey mt-6">
          If an account exists for that email, a reset link has been sent.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-6">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-obsidian-grey/20 px-4 py-2 font-ui text-sm bg-parchment-white"
          />
          {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
          <Button type="submit" variant="primary">Send Reset Link</Button>
        </form>
      )}
    </main>
  );
}
