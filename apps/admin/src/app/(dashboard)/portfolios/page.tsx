"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Portfolio } from "@xynhub/shared";

export default function PortfoliosPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-portfolios"],
    queryFn: () => apiFetch<{ data: Portfolio[] }>("/api/v1/admin/portfolios"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/v1/admin/portfolios/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-portfolios"] });
      toast.success("Portfolio deleted");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portfolios</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Manage portfolio projects</p>
        </div>
        <Link href="/portfolios/new" className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> New Portfolio
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-[var(--muted)] rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="grid gap-4">
          {data?.data?.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg">
              <div>
                <h3 className="font-medium">{p.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{p.tag} &middot; /{p.slug}</p>
              </div>
              <div className="flex gap-1">
                <Link href={`/portfolios/${p.id}`} className="p-2 rounded hover:bg-[var(--muted)]"><Pencil className="w-4 h-4" /></Link>
                <button onClick={() => { if(confirm("Delete?")) deleteMutation.mutate(p.id); }} className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-950 text-[var(--destructive)]"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
