import Link from "next/link";
import { Users, Inbox, Loader, CheckCircle2, Mail, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, StatCard, StatusBadge } from "@/components/admin/ui";
import {
  RequestsOverTime,
  ProjectsStatus,
  MostRequestedServices,
  CreatorRatings,
} from "@/components/admin/DashboardCharts";
import { formatDate } from "@/lib/utils";
import { REQUEST_STATUSES } from "@/lib/constants";

export const metadata = { title: "Dashboard" };

function weekLabel(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export default async function AdminDashboard() {
  const [
    totalCreators,
    newRequests,
    activeProjects,
    completedProjects,
    contacts,
    statusGroups,
    contentGroups,
    topCreators,
    recentRequests,
    allRequestDates,
  ] = await Promise.all([
    prisma.creator.count(),
    prisma.projectRequest.count({ where: { status: "NEW" } }),
    prisma.projectRequest.count({ where: { status: "IN_PROGRESS" } }),
    prisma.projectRequest.count({ where: { status: "COMPLETED" } }),
    prisma.contactMessage.count(),
    prisma.projectRequest.groupBy({ by: ["status"], _count: true }),
    prisma.projectRequest.groupBy({ by: ["contentType"], _count: true }),
    prisma.creator.findMany({
      orderBy: [{ ratingAvg: "desc" }, { reviewsCount: "desc" }],
      take: 6,
      select: { displayName: true, ratingAvg: true },
    }),
    prisma.projectRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { selectedCreators: { include: { creator: { select: { displayName: true } } } } },
    }),
    prisma.projectRequest.findMany({ select: { createdAt: true } }),
  ]);

  // Requests over the last 8 weeks
  const now = new Date();
  const buckets: { label: string; count: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(now.getDate() - i * 7 - now.getDay());
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    const count = allRequestDates.filter((r) => r.createdAt >= start && r.createdAt < end).length;
    buckets.push({ label: weekLabel(start), count });
  }

  const statusData = REQUEST_STATUSES.map((s) => ({
    name: s.charAt(0) + s.slice(1).toLowerCase().replace("_", " "),
    value: statusGroups.find((g) => g.status === s)?._count ?? 0,
  }));

  const contentData = contentGroups
    .filter((g) => g.contentType)
    .map((g) => ({ name: g.contentType as string, count: g._count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const ratingData = topCreators.map((c) => ({
    name: c.displayName.split(" ")[0],
    rating: c.ratingAvg,
  }));

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your community and incoming requests." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Total creators" value={totalCreators} icon={Users} href="/admin/creators" tint="brand" />
        <StatCard label="New requests" value={newRequests} icon={Inbox} href="/admin/requests?status=NEW" tint="amber" />
        <StatCard label="Active projects" value={activeProjects} icon={Loader} href="/admin/requests?status=IN_PROGRESS" tint="blue" />
        <StatCard label="Completed" value={completedProjects} icon={CheckCircle2} href="/admin/requests?status=COMPLETED" tint="emerald" />
        <StatCard label="Contacts" value={contacts} icon={Mail} href="/admin/contacts" tint="rose" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <RequestsOverTime data={buckets} />
        <ProjectsStatus data={statusData} />
        <MostRequestedServices data={contentData} />
        <CreatorRatings data={ratingData} />
      </div>

      {/* Recent requests */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink/[0.06] px-5 py-4">
          <h3 className="font-semibold">Recent requests</h3>
          <Link href="/admin/requests" className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {recentRequests.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-ink/50">No requests yet.</p>
        ) : (
          <div className="divide-y divide-ink/[0.06]">
            {recentRequests.map((r) => (
              <Link key={r.id} href={`/admin/requests/${r.id}`} className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-paper-soft">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {r.firstName} {r.lastName}
                    {r.company && <span className="text-ink/50"> · {r.company}</span>}
                  </p>
                  <p className="truncate text-xs text-ink/50">
                    {r.selectedCreators.map((s) => s.creator.displayName).join(", ") || "No creators"} · {formatDate(r.createdAt)}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
