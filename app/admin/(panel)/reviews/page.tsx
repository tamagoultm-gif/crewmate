import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { ReviewsAdmin } from "@/components/admin/ReviewsAdmin";

export const metadata = { title: "Reviews" };
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const [reviews, creators] = await Promise.all([
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: { creator: { select: { displayName: true } } },
    }),
    prisma.creator.findMany({ orderBy: { displayName: "asc" }, select: { id: true, displayName: true } }),
  ]);

  return (
    <div>
      <PageHeader title="Reviews" subtitle="Manage creator reviews. Ratings recompute automatically." />
      <ReviewsAdmin reviews={reviews} creators={creators} />
    </div>
  );
}
