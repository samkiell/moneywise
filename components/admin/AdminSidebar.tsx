"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  Send,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Publications", href: "/admin/publications", icon: FileText },
  { name: "Editorial Team", href: "/admin/team", icon: Users },
  { name: "Subscribers", href: "/admin/subscribers", icon: Mail },
  { name: "Newsletters", href: "/admin/newsletters", icon: Send },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  // If on login page, do not render sidebar
  if (pathname === "/admin/login") {
    return null;
  }

  return (
    <aside className="w-64 bg-surface border-r border-neutral-border flex flex-col min-h-screen">
      <div className="p-6 border-b border-neutral-border">
        <Link href="/admin/dashboard" className="flex flex-col">
          <span className="font-serif text-xl font-bold tracking-tight text-neutral-main">
            MONEY <span className="text-primary">WISE</span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-neutral-secondary font-semibold">
            Editorial CMS &bull; Staff
          </span>
        </Link>
      </div>

      <nav className="p-4 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-primary font-semibold"
                  : "text-neutral-secondary hover:text-neutral-main hover:bg-slate-50"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-border space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs text-neutral-secondary hover:text-primary transition-colors rounded hover:bg-slate-50"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
