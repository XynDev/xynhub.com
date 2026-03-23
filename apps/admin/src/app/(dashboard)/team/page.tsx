"use client";

import { useQuery } from "@tanstack/react-query";
import { dbList } from "@/lib/db";
import { CrudList } from "@/components/forms/crud-list";
import type { TeamMember } from "@xynhub/shared";

export default function TeamPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: () => dbList<TeamMember>("team_members"),
  });

  return (
    <CrudList
      title="Team Members"
      description="Manage team members displayed on the About page"
      queryKey="admin-team"
      table="team_members"
      items={data?.data || []}
      isLoading={isLoading}
      columns={[
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "group_name", label: "Group" },
        { key: "sort_order", label: "Order" },
      ]}
      formFields={[
        { key: "name", label: "Full Name", required: true },
        { key: "role", label: "Job Title", required: true, placeholder: "Chief Architect" },
        { key: "group_name", label: "Team Group", required: true, placeholder: "Systems Architects" },
        { key: "image_url", label: "Photo", type: "media" },
        { key: "sort_order", label: "Sort Order", type: "number" },
        { key: "is_active", label: "Active", type: "checkbox" },
      ]}
      defaultValues={{ name: "", role: "", group_name: "Systems Architects", image_url: "", sort_order: 0, is_active: true }}
    />
  );
}
