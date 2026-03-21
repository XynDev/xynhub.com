"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { CrudList } from "@/components/forms/crud-list";

interface FooterSection { id: string; section_key: string; title: string; content: Record<string, unknown>; sort_order: number; }

export default function FooterPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-footer"],
    queryFn: () => apiFetch<{ data: FooterSection[] }>("/api/v1/admin/footer"),
  });

  return (
    <CrudList
      title="Footer Sections"
      description="Manage footer content sections"
      queryKey="admin-footer"
      apiPath="/api/v1/admin/footer"
      items={data?.data || []}
      isLoading={isLoading}
      columns={[
        { key: "section_key", label: "Key" },
        { key: "title", label: "Title" },
        { key: "sort_order", label: "Order" },
      ]}
      formFields={[
        { key: "section_key", label: "Section Key", required: true, placeholder: "brand" },
        { key: "title", label: "Title" },
        { key: "sort_order", label: "Sort Order", type: "number" },
        { key: "content", label: "Content (JSON)", type: "json", required: true },
      ]}
      defaultValues={{ section_key: "", title: "", content: "{}", sort_order: 0 }}
    />
  );
}
