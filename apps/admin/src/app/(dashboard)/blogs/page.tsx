"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dbList, dbDelete } from "@/lib/db";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Blog } from "@xynhub/shared";

export default function BlogsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: () => dbList<Blog>("blogs", { limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dbDelete("blogs", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Blog deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blogs</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Manage blog posts ({data?.pagination?.total ?? 0} total)
          </p>
        </div>
        <Link
          href="/blogs/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          New Blog
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[var(--muted)] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--muted)]">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Published</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {data?.data?.map((blog) => (
                <tr key={blog.id} className="hover:bg-[var(--muted)]/50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{blog.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                        /{blog.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="px-2 py-1 text-xs rounded-full bg-[var(--muted)]">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        blog.is_active
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                      }`}
                    >
                      {blog.is_active ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)] hidden lg:table-cell">
                    {blog.published_at
                      ? new Date(blog.published_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/blogs/${blog.id}`}
                        className="p-2 rounded hover:bg-[var(--muted)]"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm("Delete this blog post?")) {
                            deleteMutation.mutate(blog.id);
                          }
                        }}
                        className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-950 text-[var(--destructive)]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
