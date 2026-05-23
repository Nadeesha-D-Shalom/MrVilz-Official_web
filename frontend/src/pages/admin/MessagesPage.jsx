import { useEffect, useState } from "react";
import { Mail, Inbox } from "lucide-react";
import api from "../../api/client";
import {
  AdminPageShell,
  AdminListCard,
  AdminButton,
  AdminStatusBadge,
  AdminEmpty
} from "../../components/admin/AdminUi";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get("/admin/messages").then(({ data }) => setMessages(data.messages));
  }, []);

  async function markRead(id) {
    await api.patch(`/admin/messages/${id}`, { status: "read" });
    setMessages((rows) => rows.map((m) => (m.id === id ? { ...m, status: "read" } : m)));
  }

  const unread = messages.filter((m) => m.status === "new").length;

  return (
    <AdminPageShell
      description={
        unread > 0
          ? `${unread} new message${unread > 1 ? "s" : ""} waiting for review.`
          : "All contact form submissions appear here."
      }
    >
      {messages.length === 0 ? (
        <AdminEmpty icon={Inbox} title="Inbox is empty" description="New contact messages will show up here." />
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <AdminListCard key={message.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-bold text-brand-ink">{message.name}</h2>
                    <AdminStatusBadge status={message.status} />
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <Mail size={14} />
                    {message.email}
                  </p>
                  {message.subject ? (
                    <p className="mt-3 text-sm font-semibold text-slate-700">{message.subject}</p>
                  ) : null}
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{message.message}</p>
                </div>
                {message.status === "new" ? (
                  <AdminButton variant="dark" size="sm" onClick={() => markRead(message.id)}>
                    Mark as read
                  </AdminButton>
                ) : null}
              </div>
            </AdminListCard>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}
