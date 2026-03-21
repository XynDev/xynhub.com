"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { FileText, BookOpen, Briefcase, Image } from "lucide-react";

export default function DashboardPage() {
  const { data: blogs } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: () => apiFetch<{ data: unknown[]; pagination: { total: number } }>("/api/v1/admin/blogs?per_page=1"),
  });

  const { data: portfolios } = useQuery({
    queryKey: ["admin-portfolios"],
    queryFn: () => apiFetch<{ data: unknown[] }>("/api/v1/admin/portfolios"),
  });

  const { data: media } = useQuery({
    queryKey: ["admin-media"],
    queryFn: () => apiFetch<{ pagination: { total: number } }>("/api/v1/admin/media?per_page=1"),
  });

  const stats = [
    { label: "Blog Posts", value: blogs?.pagination?.total ?? 0, icon: BookOpen },
    { label: "Portfolios", value: portfolios?.data?.length ?? 0, icon: Briefcase },
    { label: "Media Files", value: media?.pagination?.total ?? 0, icon: Image },
    { label: "Pages", value: 7, icon: FileText },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Welcome to XYNHub Content Management System
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--muted-foreground)]">
                {stat.label}
              </p>
              <stat.icon className="w-4 h-4 text-[var(--muted-foreground)]" />
            </div>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border border-[var(--border)]">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Edit Home Page", href: "/pages/home" },
              { label: "Create Blog Post", href: "/blogs/new" },
              { label: "Manage Portfolios", href: "/portfolios" },
              { label: "Upload Media", href: "/media" },
              { label: "Site Settings", href: "/settings" },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="block px-4 py-2.5 rounded-lg hover:bg-[var(--muted)] text-sm transition-colors"
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-lg border border-[var(--border)]">
          <h2 className="text-lg font-semibold mb-4">Manageable Pages</h2>
          <div className="space-y-2">
            {[
              { label: "Home", slug: "home" },
              { label: "About", slug: "about" },
              { label: "Services", slug: "services" },
              { label: "Service Detail", slug: "service-detail" },
              { label: "Process", slug: "process" },
              { label: "Blogs (Hero)", slug: "blogs" },
              { label: "Portfolio (Header)", slug: "portofolio" },
            ].map((page) => (
              <a
                key={page.slug}
                href={`/pages/${page.slug}`}
                className="block px-4 py-2.5 rounded-lg hover:bg-[var(--muted)] text-sm transition-colors"
              >
                {page.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
