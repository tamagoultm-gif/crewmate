import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { updateContactStatus, deleteContact } from "@/app/admin/actions";
import { CONTACT_STATUSES } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { Trash2, Mail } from "lucide-react";

export const metadata = { title: "Contacts" };
export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Contacts" subtitle="Messages sent through the contact form." />

      {messages.length === 0 ? (
        <EmptyState title="No messages yet" subtitle="Contact form submissions will appear here." />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="card p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="font-semibold">{m.name}</p>
                    {m.company && <span className="text-sm text-ink/50">· {m.company}</span>}
                  </div>
                  <a href={`mailto:${m.email}`} className="text-sm text-brand-600 hover:underline">{m.email}</a>
                  {m.subject && <p className="mt-2 text-sm font-medium">{m.subject}</p>}
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink/70">{m.message}</p>
                  <p className="mt-2 text-xs text-ink/40">{formatDateTime(m.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusSelect value={m.status} options={CONTACT_STATUSES} size="sm" onChange={updateContactStatus.bind(null, m.id)} />
                  <a href={`mailto:${m.email}`} className="rounded-lg p-2 text-ink/50 hover:bg-ink/5 hover:text-ink" title="Reply">
                    <Mail className="h-4 w-4" />
                  </a>
                  <ConfirmButton
                    action={deleteContact.bind(null, m.id)}
                    title="Delete message?"
                    body="This permanently removes the message."
                    className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </ConfirmButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
