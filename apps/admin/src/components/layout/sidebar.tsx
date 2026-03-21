"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Image,
  Settings,
  Menu,
  Users,
  MessageSquareQuote,
  HelpCircle,
  Navigation,
  PanelBottom,
  Briefcase,
  BookOpen,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Pages", href: "/pages/home", icon: FileText },
  { label: "Blogs", href: "/blogs", icon: BookOpen },
  { label: "Portfolios", href: "/portfolios", icon: Briefcase },
  { label: "Navigation", href: "/navigation", icon: Navigation },
  { label: "Footer", href: "/footer", icon: PanelBottom },
  { label: "Testimonials", href: "/testimonials", icon: MessageSquareQuote },
  { label: "Team", href: "/team", icon: Users },
  { label: "FAQs", href: "/faqs", icon: HelpCircle },
  { label: "Media", href: "/media", icon: Image },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[var(--muted)] lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-[var(--sidebar-width)] border-r border-[var(--border)] bg-[var(--background)] transition-transform duration-200 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[var(--border)]">
          <Link href="/" className="text-lg font-bold tracking-tight">
            XYNHub <span className="text-[var(--muted-foreground)] font-normal text-sm">CMS</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
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
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[var(--muted)] flex items-center justify-center text-xs font-medium">
              {user?.email?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="text-xs text-[var(--muted-foreground)] truncate">
                {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded hover:bg-[var(--muted)]"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
