import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { ServicesAdmin } from "@/components/admin/ServicesAdmin";

export const metadata = { title: "Services" };
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { creators: true } } },
  });

  return (
    <div>
      <PageHeader title="Services" subtitle="The content types creators can offer." />
      <ServicesAdmin services={services} />
    </div>
  );
}
