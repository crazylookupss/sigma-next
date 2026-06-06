"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Group,
  AppWindow,
  Code2,
  Shield,
  ChevronLeft,
} from "lucide-react";
import { useSidebarStore } from "@/stores/sidebar";
import { motion } from "framer-motion";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/groups", label: "Groups", icon: Group },
  { href: "/applications", label: "Enterprise Apps", icon: AppWindow },
  { href: "/app-registrations", label: "App Registrations", icon: Code2 },
  { href: "/governance/findings", label: "Governance Findings", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const { open, toggle } = useSidebarStore();

  return (
    <motion.aside
      animate={{ width: open ? 240 : 64 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-full z-40 flex flex-col border-r border-border bg-sidebar overflow-hidden"
    >
      <div className="relative flex items-center justify-between h-16 px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Image
            src="/logo/logo-icon.png"
            alt="SIGMA Logo"
            width={24}
            height={24}
            className="object-contain flex-shrink-0"
          />
          {open && (
            <span className="text-lg font-bold text-primary tracking-tight">
              SIGMA
            </span>
          )}
        </div>
        {open && (
          <button
            onClick={toggle}
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        {!open && (
          <button
            onClick={toggle}
            className="absolute inset-0 w-full h-full flex items-center justify-center hover:bg-accent/50 transition-colors"
            title="Expand sidebar"
          >
            <Image
              src="/logo/logo-icon.png"
              alt="SIGMA Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {open && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
