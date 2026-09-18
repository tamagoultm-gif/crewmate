import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Building2, Trash2, Calendar, Clock, MapPin, Wallet, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { NotesEditor } from "@/components/admin/NotesEditor";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Avatar } from "@/components/ui/Avatar";
import { updateRequestStatus, deleteRequest } from "@/app/admin/actions";
import { REQUEST_STATUSES } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

function Row({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink/40" />
      <div>
        <p className="text-xs uppercase tracking-wide text-ink/40">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export default async function RequestDetail({ params }: { params: Params }) {
  const { id } = await params;
  const req = await prisma.projectRequest.findUnique({
    where: { id },
    include: { selectedCreators: { include: { creator: true } } },
  });
  if (!req) notFound();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/requests" className="inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to requests
        </Link>
        <ConfirmButton
          action={deleteRequest.bind(null, req.id)}
          title="Delete request?"
          body="This will permanently remove this request and its creator selections."
          confirmLabel="Delete request"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:underline"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </ConfirmButton>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            {req.firstName} {req.lastName}
          </h1>
          <p className="text-sm text-ink/55">Submitted {formatDateTime(req.createdAt)}</p>
        </div>
        <StatusSelect value={req.status} options={REQUEST_STATUSES} onChange={updateRequestStatus.bind(null, req.id)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Project */}
          <section className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Project</h2>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink/80">{req.description}</p>
            {req.message && (
              <div className="mt-4 rounded-2xl bg-paper-soft p-4 text-sm text-ink/70">
                <p className="mb-1 text-xs font-semibold uppercase text-ink/40">Additional message</p>
                {req.message}
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-x-6 border-t border-ink/[0.06] pt-3 sm:grid-cols-3">
              <Row icon={Wallet} label="Budget" value={req.budget} />
              <Row icon={Calendar} label="Preferred date" value={req.preferredDate} />
              <Row icon={Clock} label="Preferred time" value={req.preferredTime} />
              <Row icon={MapPin} label="Location" value={req.location} />
              <Row icon={Users} label="Creators wanted" value={req.creatorsCount?.toString()} />
            </div>
          </section>

          {/* Selected creators */}
          <section className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
              Selected creators ({req.selectedCreators.length})
            </h2>
            {req.selectedCreators.length === 0 ? (
              <p className="mt-3 text-sm text-ink/50">No creators were selected for this request.</p>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {req.selectedCreators.map(({ creator }) => (
                  <Link
                    key={creator.id}
                    href={`/community/${creator.slug}`}
                    target="_blank"
                    className="flex items-center gap-3 rounded-2xl border border-ink/[0.06] p-3 transition hover:bg-paper-soft"
                  >
                    <Avatar name={creator.displayName} src={creator.avatarUrl} size={40} />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{creator.displayName}</p>
                      <p className="truncate text-xs text-ink/50">{creator.profession}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Notes */}
          <section className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Internal notes</h2>
            <div className="mt-3">
              <NotesEditor id={req.id} initial={req.adminNotes ?? ""} />
            </div>
          </section>
        </div>

        {/* Client sidebar */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Client</h2>
            <div className="mt-2 divide-y divide-ink/[0.06]">
              <Row icon={Mail} label="Email" value={req.email} />
              <Row icon={Phone} label="Phone" value={req.phone} />
              <Row icon={Building2} label="Company" value={req.company} />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <a href={`mailto:${req.email}`} className="btn-primary w-full justify-center">
                <Mail className="h-4 w-4" /> Reply by email
              </a>
              {req.phone && (
                <a href={`tel:${req.phone}`} className="btn-outline w-full justify-center">
                  <Phone className="h-4 w-4" /> Call
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
