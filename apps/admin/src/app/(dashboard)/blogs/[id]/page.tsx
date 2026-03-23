"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { dbGet } from "@/lib/db";
import { BlogForm } from "@/components/forms/blog-form";
import type { Blog } from "@xynhub/shared";

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-blog", id],
    queryFn: () => dbGet<Blog>("blogs", id),
  });

  if (isLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-[var(--muted)] rounded w-48" /><div className="h-96 bg-[var(--muted)] rounded" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Blog Post</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          {data?.data?.title}
        </p>
      </div>
      {data?.data && <BlogForm blog={data.data} />}
    </div>
  );
}
