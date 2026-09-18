import Link from "next/link";
import { ArrowLeft, Clapperboard } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { CreatorForm } from "@/components/admin/CreatorForm";

export const metadata = { title: "Add creator" };
export const dynamic = "force-dynamic";

export default async function NewCreatorPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } });
  return (
    <div>
      <Link href="/admin/creators" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to creators
      </Link>
      <PageHeader title="Add creator" subtitle="Create a new creator profile for the community." />

      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800">
        <Clapperboard className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
        <p>
          <strong>Portfolio (photos &amp; videos)</strong> is added right after this step: once you
          click <strong>Save creator</strong>, you&apos;ll land on the edit page where you can upload
          images and videos from your computer.
        </p>
      </div>

      <CreatorForm services={services} />
    </div>
  );
}
