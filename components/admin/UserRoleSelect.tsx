"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/lib/admin/actions/userActions";
import { Shield, AlertCircle, Info, Loader2 } from "lucide-react";

const roles = [
  { value: "SUBSCRIBER", label: "Subscriber", desc: "Read-only access" },
  { value: "AUTHOR", label: "Author", desc: "Create and edit own articles" },
  { value: "EDITOR", label: "Editor", desc: "Manage all content" },
  { value: "ADMIN", label: "Admin", desc: "Full system access" },
];

const roleColors: Record<string, string> = {
  SUBSCRIBER: "text-[#8b8f99]",
  AUTHOR: "text-[#9a7b1a]",
  EDITOR: "text-[#4a7c9b]",
  ADMIN: "text-[#9b4a4a]",
};

export function UserRoleSelect({
  userId,
  currentRole,
  isCurrentUser,
}: {
  userId: string;
  currentRole: string;
  isCurrentUser: boolean;
}) {
  const [role, setRole] = useState(currentRole);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(newRole: string) {
    setError("");
    setNotice("");
    const previousRole = role;
    setRole(newRole);

    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.error) {
        setRole(previousRole);
        setError(result.error);
      } else if (result.isSelf) {
        setNotice(
          "Sign out and back in for this to take effect on your session.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <select
          value={role}
          onChange={(e) => handleChange(e.target.value)}
          disabled={isPending}
          className={`
            w-full appearance-none border border-[#e5e3df] bg-white pl-3 pr-8 py-2 font-ui text-sm text-[#1a1c23]
            focus:outline-none focus:border-[#8b8f99] focus:ring-1 focus:ring-[#8b8f99]/20
            disabled:opacity-50 disabled:cursor-not-allowed transition-all
            ${error ? "border-[#9b4a4a] bg-[#faf5f5]" : ""}
          `}
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          {isPending ? (
            <Loader2 size={14} className="text-[#8b8f99] animate-spin" />
          ) : (
            <Shield
              size={14}
              className={roleColors[role] ?? "text-[#8b8f99]"}
            />
          )}
        </div>
      </div>

      {isCurrentUser && (
        <p className="flex items-center gap-1 font-ui text-[11px] text-[#a5a39e]">
          <Info size={11} />
          <span>This is your account</span>
        </p>
      )}
      {error && (
        <p className="flex items-center gap-1 font-ui text-[11px] text-[#9b4a4a]">
          <AlertCircle size={11} />
          <span>{error}</span>
        </p>
      )}
      {notice && (
        <p className="flex items-center gap-1 font-ui text-[11px] text-[#4a7c9b]">
          <Info size={11} />
          <span>{notice}</span>
        </p>
      )}
    </div>
  );
}
