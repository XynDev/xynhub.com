"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Trash2, Mail, MailOpen } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function ContactMessagesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-contact-messages"],
    queryFn: () => apiFetch<{ data: ContactMessage[] }>("/api/v1/admin/contact-messages"),
  });

  const markReadMutation = useMutation({
    mutationFn: ({ id, is_read }: { id: string; is_read: boolean }) =>
      apiFetch(`/api/v1/admin/contact-messages/${id}`, {
        method: "PUT",
        body: JSON.stringify({ is_read }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/v1/admin/contact-messages/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
      toast.success("Deleted");
    },
  });

  const messages = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Messages from the contact form on the website.
          {messages.length > 0 && ` (${messages.filter(m => !m.is_read).length} unread)`}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-[var(--muted)] rounded-lg animate-pulse" />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-[var(--border)] rounded-lg">
          <p className="text-[var(--muted-foreground)]">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`border rounded-lg p-4 ${msg.is_read ? "border-[var(--border)]" : "border-[var(--primary)] bg-[var(--primary)]/5"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{msg.name}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">&lt;{msg.email}&gt;</span>
                    {!msg.is_read && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--primary)] text-[var(--primary-foreground)] font-medium">New</span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] whitespace-pre-wrap">{msg.message}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-2">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => markReadMutation.mutate({ id: msg.id, is_read: !msg.is_read })}
                    className="p-2 rounded hover:bg-[var(--muted)]"
                    title={msg.is_read ? "Mark as unread" : "Mark as read"}
                  >
                    {msg.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => { if (confirm("Delete this message?")) deleteMutation.mutate(msg.id); }}
                    className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-950 text-[var(--destructive)]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
