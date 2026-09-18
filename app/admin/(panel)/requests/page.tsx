import Link from "next/link";
import { Search } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/ui";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateRequestStatus } from "@/app/admin/actions";
import { REQUEST_STATUSES, STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata = { title: "Requests" };
export const dynamic = "force-dynamic";

type SP = Promise<{ status?: string; q?: string }>;

export default async function RequestsPage({ searchParams }: { searchParams: SP }) {
  const { status, q } = await searchParams;

  const where: Prisma.ProjectRequestWhereInput = {};
  if (status && REQUEST_STATUSES.includes(status as any)) where.status = status as any;
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { company: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  const [requests, counts] = await Promise.all([
    prisma.projectRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { selectedCreators: { include: { creator: { select: { displayName: true } } } } },
    }),
    prisma.projectRequest.groupBy({ by: ["status"], _count: true }),
  ]);

  const countFor = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;
  const total = counts.reduce((a, c) => a + c._count, 0);

  const tabs = [{ key: "", label: "All", count: total }, ...REQUEST_STATUSES.map((s) => ({ key: s, label: STATUS_LABELS[s], count: countFor(s) }))];

  return (
    <div>
      <PageHeader title="Requests" subtitle="Client project requests submitted through the site." />

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          {tabs.map((t) => {
            const active = (status ?? "") === t.key;
            const href = t.key ? `/admin/requests?status=${t.key}` : "/admin/requests";
            return (
              <Link
                key={t.label}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition",
                  active ? "bg-night text-white" : "bg-paper-card text-ink/60 ring-1 ring-ink/[0.06] hover:text-ink"
                )}
              >
                {t.label}
                <span className={cn("rounded-full px-1.5 text-xs", active ? "bg-white/20" : "bg-ink/[0.06]")}>{t.count}</span>
              </Link>
            );
          })}
        </div>
        <form className="relative w-full lg:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input name="q" defaultValue={q} placeholder="Search client…" className="input py-2 pl-10" />
          {status && <input type="hidden" name="status" value={status} />}
        </form>
      </div>

      {requests.length === 0 ? (
        <EmptyState title="No requests found" subtitle="New requests will appear here as clients submit them." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-ink/[0.06] text-left text-xs uppercase tracking-wide text-ink/45">
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Creators</th>
                  <th className="px-5 py-3 font-semibold">Content</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/[0.06]">
                {requests.map((r) => (
                  <tr key={r.id} className="transition hover:bg-paper-soft">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/requests/${r.id}`} className="font-medium hover:underline">
                        {r.firstName} {r.lastName}
                      </Link>
                      <p className="text-xs text-ink/50">{r.company || r.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-ink/70">
                      {r.selectedCreators.length
                        ? r.selectedCreators.map((s) => s.creator.displayName).join(", ")
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-ink/70">{r.contentType || "—"}</td>
                    <td className="px-5 py-3.5 text-ink/60">{formatDate(r.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <StatusSelect
                        value={r.status}
                        options={REQUEST_STATUSES}
                        size="sm"
                        onChange={updateRequestStatus.bind(null, r.id)}
                      />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/admin/requests/${r.id}`} className="text-sm font-medium text-brand-600 hover:underline">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
