"use client";

import { ThemeToggle } from "./theme-toggle";
import { useSidebarStore } from "@/stores/sidebar";
import { Menu, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { toggle } = useSidebarStore();
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "User";
  const userEmail = session?.user?.email;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-header backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-6">
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* User avatar + name */}
          {session && (
            <div className="flex items-center gap-2.5 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-xs font-semibold text-foreground">{userName}</span>
                {userEmail && (
                  <span className="text-[10px] text-muted-foreground truncate max-w-[160px]">{userEmail}</span>
                )}
              </div>
              <button
                id="btn-sign-out"
                onClick={() => signOut({ callbackUrl: "/landing" })}
                className="ml-1 p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
