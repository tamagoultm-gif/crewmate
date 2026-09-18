import Link from "next/link";
import { Plus, Search, Star, Pencil, Eye } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { Avatar } from "@/components/ui/Avatar";
import { CreatorRowActions } from "@/components/admin/CreatorRowActions";

export const metadata = { title: "Creators" };
export const dynamic = "force-dynamic";

type SP = Promise<{ q?: string }>;

export default async function CreatorsPage({ searchParams }: { searchParams: SP }) {
  const { q } = await searchParams;
  const where: Prisma.CreatorWhereInput = q
    ? { OR: [{ displayName: { contains: q, mode: "insensitive" } }, { profession: { contains: q, mode: "insensitive" } }] }
    : {};

  const creators = await prisma.creator.findMany({
    where,
    orderBy: [{ ratingAvg: "desc" }, { sortOrder: "asc" }],
    include: { _count: { select: { portfolio: true, reviews: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Creators"
        subtitle={`${creators.length} creator${creators.length === 1 ? "" : "s"} in the community.`}
        action={
          <Link href="/admin/creators/new" className="btn-primary">
            <Plus className="h-4 w-4" /> Add creator
          </Link>
        }
      />

      <form className="relative mb-4 max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input name="q" defaultValue={q} placeholder="Search creators…" className="input py-2 pl-10" />
      </form>

      {creators.length === 0 ? (
        <EmptyState title="No creators yet" subtitle="Add your first creator to get started." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-ink/[0.06] text-left text-xs uppercase tracking-wide text-ink/45">
                  <th className="px-5 py-3 font-semibold">Creator</th>
                  <th className="px-5 py-3 font-semibold">Rating</th>
                  <th className="px-5 py-3 font-semibold">Portfolio</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/[0.06]">
                {creators.map((c) => (
                  <tr key={c.id} className="transition hover:bg-paper-soft">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.displayName} src={c.avatarUrl} size={40} />
                        <div>
                          <p className="font-medium">{c.displayName}</p>
                          <p className="text-xs text-ink/50">{c.profession}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {c.ratingAvg.toFixed(1)}
                        <span className="text-xs text-ink/40">({c.reviewsCount})</span>
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink/60">{c._count.portfolio} items</td>
                    <td className="px-5 py-3">
                      {c.active ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-500">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/community/${c.slug}`}
                          target="_blank"
                          className="rounded-lg p-2 text-ink/50 hover:bg-ink/5 hover:text-ink"
                          title="View profile"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/creators/${c.id}/edit`}
                          className="rounded-lg p-2 text-ink/50 hover:bg-ink/5 hover:text-ink"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <CreatorRowActions id={c.id} active={c.active} name={c.displayName} />
                      </div>
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
