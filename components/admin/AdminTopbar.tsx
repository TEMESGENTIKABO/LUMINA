import { auth, signOut } from "@/auth";
import { LogOut, Clock } from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { ThemeQuickSwitch } from "./ThemeQuickSwitch";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrator",
  EDITOR: "Editor",
  AUTHOR: "Author",
  SUBSCRIBER: "Subscriber",
};

function initials(name?: string | null, email?: string | null) {
  if (name)
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  return email?.slice(0, 2).toUpperCase() ?? "??";
}

export async function AdminTopbar({ theme }: { theme: number }) {
  const session = await auth();
  const user = session?.user;
  const role = user?.role ?? "SUBSCRIBER";

  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="h-16 sticky top-0 z-40 bg-[#f4f2ec]/90 backdrop-blur-md border-b border-[#e6e1d6] flex items-center gap-3 px-6 lg:px-8 flex-shrink-0">
      <div className="hidden sm:flex items-center gap-2 text-[13px] text-[#6b665c] tabular-nums">
        <Clock size={14} /> {time} <span className="opacity-40">|</span> {date}
      </div>

      <div className="flex-1" />

      <NotificationBell />
      <ThemeQuickSwitch current={theme} />

      <span className="w-px h-6 bg-[#e6e1d6] mx-1" />

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-aksum-black flex items-center justify-center text-[#c9a227] text-xs font-bold">
          {initials(user?.name, user?.email)}
        </div>
        <div className="hidden md:flex flex-col leading-tight">
          <span className="text-[13.5px] font-semibold text-[#12100d]">
            {user?.name ?? user?.email ?? "Unknown"}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#4b4437] bg-[#ece7da] px-2 py-0.5 rounded-full self-start mt-0.5">
            {ROLE_LABEL[role] ?? role}
          </span>
        </div>
      </div>

      <span className="w-px h-6 bg-[#e6e1d6] mx-1" />

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/en" });
        }}
      >
        <button
          type="submit"
          className="flex items-center gap-2 text-[13px] text-[#6b665c] hover:text-[#12100d] transition-colors"
        >
          <LogOut size={15} />
          <span className="hidden md:inline">Sign out</span>
        </button>
      </form>
    </header>
  );
}
