"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export default function NewsletterPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-newsletter"],
    queryFn: () => apiFetch<{ data: Subscriber[] }>("/api/v1/admin/newsletter"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/v1/admin/newsletter/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-newsletter"] });
      toast.success("Subscriber removed");
    },
  });

  const subscribers = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Newsletter Subscribers</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-[var(--muted)] rounded-lg animate-pulse" />)}
        </div>
      ) : subscribers.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-[var(--border)] rounded-lg">
          <p className="text-[var(--muted-foreground)]">No subscribers yet.</p>
        </div>
      ) : (
        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--muted)]">
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Subscribed</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-[var(--muted)]/50">
                  <td className="px-4 py-3">{sub.email}</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => { if (confirm("Remove subscriber?")) deleteMutation.mutate(sub.id); }}
                      className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-950 text-[var(--destructive)]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
