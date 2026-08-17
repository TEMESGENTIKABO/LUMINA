"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    // Registration succeeded — sign in immediately with the same credentials
    await signIn("credentials", { email, password, redirect: false });
    router.push("/en/account");
  }

  return (
    <main className="max-w-sm mx-auto px-6 pt-16 pb-20">
      <h1 className="font-headline-en text-[length:var(--text-headline-lg)]">
        Create an account
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-8">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border border-obsidian-grey/20 px-4 py-2 font-ui text-sm bg-parchment-white"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border border-obsidian-grey/20 px-4 py-2 font-ui text-sm bg-parchment-white"
        />
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 characters)"
          className="border border-obsidian-grey/20 px-4 py-2 font-ui text-sm bg-parchment-white"
        />
        {error && (
          <p className="font-ui text-sm text-manuscript-red">{error}</p>
        )}
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Creating account…" : "Create Account"}
        </Button>
      </form>
    </main>
  );
}
