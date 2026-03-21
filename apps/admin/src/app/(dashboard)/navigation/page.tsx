"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { CrudList } from "@/components/forms/crud-list";
import type { NavigationItem } from "@xynhub/shared";

export default function NavigationPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-navigation"],
    queryFn: () => apiFetch<{ data: NavigationItem[] }>("/api/v1/admin/navigation"),
  });

  return (
    <CrudList
      title="Navigation"
      description="Manage header navigation menu items"
      queryKey="admin-navigation"
      apiPath="/api/v1/admin/navigation"
      items={data?.data || []}
      isLoading={isLoading}
      columns={[
        { key: "label", label: "Label" },
        { key: "path", label: "Path" },
        { key: "sort_order", label: "Order" },
        { key: "is_active", label: "Active", render: (item) => item.is_active ? "Yes" : "No" },
      ]}
      formFields={[
        { key: "label", label: "Label", required: true },
        { key: "path", label: "Path", required: true, placeholder: "/about" },
        { key: "sort_order", label: "Sort Order", type: "number" },
        { key: "is_active", label: "Active", type: "checkbox" },
      ]}
      defaultValues={{ label: "", path: "", sort_order: 0, is_active: true }}
    />
  );
}
