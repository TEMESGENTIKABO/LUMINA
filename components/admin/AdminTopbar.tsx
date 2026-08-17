import { auth, signOut } from "@/auth";
import { LogOut, Clock } from "lucide-react";

const roleStyles: Record<string, { bg: string; text: string; label: string }> =
  {
    ADMIN: {
      bg: "bg-[#3a1c1c]",
      text: "text-[#d4a5a5]",
      label: "Administrator",
    },
    EDITOR: { bg: "bg-[#1c2a3a]", text: "text-[#a5bcd4]", label: "Editor" },
    AUTHOR: { bg: "bg-[#3a301c]", text: "text-[#d4c9a5]", label: "Author" },
    SUBSCRIBER: {
      bg: "bg-[#1e2028]",
      text: "text-[#8b8f99]",
      label: "Subscriber",
    },
  };

function getInitials(
  name: string | null | undefined,
  email: string | null | undefined,
): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return email?.slice(0, 2).toUpperCase() ?? "??";
}

export async function AdminTopbar() {
  const session = await auth();
  const user = session?.user;
  const role = user?.role ?? "SUBSCRIBER";
  const roleStyle = roleStyles[role] ?? roleStyles.SUBSCRIBER;

  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="h-14 bg-[#faf9f7] border-b border-[#e5e3df] flex items-center justify-between px-6 flex-shrink-0">
      {/* Left: Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-[#8b8f99]">
          <Clock size={13} />
          <span className="font-ui text-xs tabular-nums tracking-tight">
            {timeString}
          </span>
          <span className="text-[#d4d2cd]">|</span>
          <span className="font-ui text-xs text-[#a5a39e]">{dateString}</span>
        </div>
      </div>

      {/* Right: User & Actions */}
      <div className="flex items-center gap-4">
        {/* User Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#1e2028] flex items-center justify-center border border-[#2a2c34]">
            <span className="font-ui text-xs font-semibold text-[#c9a227]">
              {getInitials(user?.name, user?.email)}
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-ui text-sm font-medium text-[#1a1c23]">
              {user?.name ?? user?.email ?? "Unknown"}
            </span>
            <span className={`inline-flex items-center gap-1.5 mt-0.5`}>
              <span
                className={`inline-block px-1.5 py-0.5 rounded-sm text-[10px] font-ui font-medium uppercase tracking-wider ${roleStyle.bg} ${roleStyle.text}`}
              >
                {roleStyle.label}
              </span>
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-[#e5e3df]" />

        {/* Sign Out */}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/en" });
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-2 font-ui text-xs text-[#6b6f7a] hover:text-[#1a1c23] transition-colors"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
