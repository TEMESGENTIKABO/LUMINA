import "@/components/homepage/home.css";
import "@/components/admin/admin.css";
import type { Metadata } from "next";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata: Metadata = {
  title: "Sign in | AKSUM Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl?.startsWith("/admin")
    ? params.callbackUrl
    : "/admin";
  return (
    <AdminLoginForm
      callbackUrl={callbackUrl}
      forbidden={params.error === "forbidden"}
    />
  );
}
