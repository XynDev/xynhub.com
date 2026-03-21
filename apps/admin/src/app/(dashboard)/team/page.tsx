"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { CrudList } from "@/components/forms/crud-list";
import type { TeamMember } from "@xynhub/shared";

export default function TeamPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: () => apiFetch<{ data: TeamMember[] }>("/api/v1/admin/team"),
  });

  return (
    <CrudList
      title="Team Members"
      description="Manage leadership team members"
      queryKey="admin-team"
      apiPath="/api/v1/admin/team"
      items={data?.data || []}
      isLoading={isLoading}
      columns={[
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "group_name", label: "Group" },
        { key: "sort_order", label: "Order" },
      ]}
      formFields={[
        { key: "name", label: "Name", required: true },
        { key: "role", label: "Role", required: true },
        { key: "group_name", label: "Group Name", required: true, placeholder: "Systems Architects" },
        { key: "image_url", label: "Image URL" },
        { key: "sort_order", label: "Sort Order", type: "number" },
        { key: "is_active", label: "Active", type: "checkbox" },
      ]}
      defaultValues={{ name: "", role: "", group_name: "", image_url: "", sort_order: 0, is_active: true }}
    />
  );
}
