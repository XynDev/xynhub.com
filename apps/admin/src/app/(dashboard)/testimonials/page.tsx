"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { CrudList } from "@/components/forms/crud-list";
import type { Testimonial } from "@xynhub/shared";

export default function TestimonialsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: () => apiFetch<{ data: Testimonial[] }>("/api/v1/admin/testimonials"),
  });

  return (
    <CrudList
      title="Testimonials"
      description="Manage client testimonials displayed on the home page"
      queryKey="admin-testimonials"
      apiPath="/api/v1/admin/testimonials"
      items={data?.data || []}
      isLoading={isLoading}
      columns={[
        { key: "author_name", label: "Author" },
        { key: "author_role", label: "Role" },
        { key: "quote", label: "Quote", render: (item: Testimonial) => item.quote?.slice(0, 60) + "..." },
        { key: "sort_order", label: "Order" },
      ]}
      formFields={[
        { key: "author_name", label: "Author Name", required: true },
        { key: "author_role", label: "Author Role", placeholder: "CEO at Company" },
        { key: "author_initials", label: "Initials (for avatar)", placeholder: "JD" },
        { key: "span_class", label: "Card Size", type: "select" as "text", placeholder: "col-span-12 md:col-span-6" },
        { key: "sort_order", label: "Sort Order", type: "number" },
        { key: "is_active", label: "Active", type: "checkbox" },
        { key: "quote", label: "Quote", type: "textarea", required: true },
      ]}
      defaultValues={{ author_name: "", author_role: "", author_initials: "", quote: "", span_class: "col-span-12 md:col-span-6", sort_order: 0, is_active: true }}
    />
  );
}
