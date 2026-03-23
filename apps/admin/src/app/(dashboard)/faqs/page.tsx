"use client";

import { useQuery } from "@tanstack/react-query";
import { dbList } from "@/lib/db";
import { CrudList } from "@/components/forms/crud-list";
import type { FAQ } from "@xynhub/shared";

export default function FAQsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: () => dbList<FAQ>("faqs"),
  });

  return (
    <CrudList
      title="FAQs"
      description="Manage frequently asked questions displayed on the home page"
      queryKey="admin-faqs"
      table="faqs"
      items={data?.data || []}
      isLoading={isLoading}
      columns={[
        { key: "question", label: "Question", render: (item: FAQ) => item.question?.slice(0, 50) + "..." },
        { key: "sort_order", label: "Order" },
        { key: "is_active", label: "Active", render: (item: FAQ) => item.is_active ? "Yes" : "No" },
      ]}
      formFields={[
        { key: "question", label: "Question", required: true },
        { key: "sort_order", label: "Sort Order", type: "number" },
        { key: "is_active", label: "Active", type: "checkbox" },
        { key: "answer", label: "Answer", type: "textarea", required: true },
      ]}
      defaultValues={{ question: "", answer: "", page_slug: "home", sort_order: 0, is_active: true }}
    />
  );
}
