import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clapperboard } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { CreatorForm } from "@/components/admin/CreatorForm";
import { PortfolioManager } from "@/components/admin/PortfolioManager";

export const metadata = { title: "Edit creator" };
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type SP = Promise<{ created?: string }>;

export default async function EditCreatorPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SP;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const [creator, services] = await Promise.all([
    prisma.creator.findUnique({
      where: { id },
      include: {
        services: { select: { serviceId: true } },
        portfolio: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.service.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!creator) notFound();

  const data = {
    ...creator,
    serviceIds: creator.services.map((s) => s.serviceId),
  };

  return (
    <div>
      <Link href="/admin/creators" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to creators
      </Link>
      <PageHeader title={`Edit ${creator.displayName}`} subtitle="Update profile details, services and portfolio." />

      {created && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <p>
            <strong>Creator created!</strong> Now scroll down to the <strong>Portfolio</strong>{" "}
            section to upload their photos and videos. 👇
          </p>
        </div>
      )}

      <CreatorForm creator={data} services={services} />

      <section className="card mt-6 border-2 border-brand-200 p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-700">
          <Clapperboard className="h-4 w-4" /> Portfolio — photos &amp; videos
        </h2>
        <p className="mt-1 text-xs text-ink/40">
          Upload images and videos from your computer. They appear on the public profile.
        </p>
        <div className="mt-4">
          <PortfolioManager creatorId={creator.id} items={creator.portfolio} />
        </div>
      </section>
    </div>
  );
}
