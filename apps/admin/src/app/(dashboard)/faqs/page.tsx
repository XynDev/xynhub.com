"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { CrudList } from "@/components/forms/crud-list";
import type { FAQ } from "@xynhub/shared";

const PAGE_OPTIONS = [
  { label: "Home", value: "home" },
  { label: "About", value: "about" },
  { label: "Services", value: "services" },
  { label: "Process", value: "process" },
  { label: "Portfolio", value: "portofolio" },
  { label: "Blogs", value: "blogs" },
];

export default function FAQsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: () => apiFetch<{ data: FAQ[] }>("/api/v1/admin/faqs"),
  });

  return (
    <CrudList
      title="FAQs"
      description="Manage frequently asked questions displayed on each page"
      queryKey="admin-faqs"
      apiPath="/api/v1/admin/faqs"
      items={data?.data || []}
      isLoading={isLoading}
      columns={[
        { key: "question", label: "Question", render: (item: FAQ) => item.question?.slice(0, 50) + "..." },
        { key: "page_slug", label: "Page" },
        { key: "sort_order", label: "Order" },
        { key: "is_active", label: "Active", render: (item: FAQ) => item.is_active ? "Yes" : "No" },
      ]}
      formFields={[
        { key: "question", label: "Question", required: true },
        { key: "page_slug", label: "Show on Page", type: "select", required: true, options: PAGE_OPTIONS },
        { key: "sort_order", label: "Sort Order", type: "number" },
        { key: "is_active", label: "Active", type: "checkbox" },
        { key: "answer", label: "Answer", type: "textarea", required: true },
      ]}
      defaultValues={{ question: "", answer: "", page_slug: "home", sort_order: 0, is_active: true }}
    />
  );
}
