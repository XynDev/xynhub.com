"use client";

import { BlogForm } from "@/components/forms/blog-form";

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Blog Post</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Create a new blog post
        </p>
      </div>
      <BlogForm />
    </div>
  );
}
