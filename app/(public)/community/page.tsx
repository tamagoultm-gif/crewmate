import type { Metadata } from "next";
import { Users } from "lucide-react";
import { CommunityFilters } from "@/components/creators/CommunityFilters";
import { CreatorCard } from "@/components/creators/CreatorCard";
import { Reveal } from "@/components/ui/Reveal";
import { getCreators, getCreatorFacets, type CreatorFilters } from "@/lib/data";

export const metadata: Metadata = {
  title: "Community — meet the creators",
  description:
    "Browse Crewmate's community of content creators. Filter by service, city, language and rating, and start a project with the talent that fits.",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CommunityPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const filters: CreatorFilters = {
    q: first(sp.q),
    service: first(sp.service),
    city: first(sp.city),
    language: first(sp.language),
    specialty: first(sp.specialty),
    minRating: sp.minRating ? Number(first(sp.minRating)) : undefined,
  };

  const [creators, facets] = await Promise.all([getCreators(filters), getCreatorFacets()]);

  return (
    <div className="container-page py-12 md:py-16">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="eyebrow justify-center">
          <Users className="h-3.5 w-3.5" /> The community
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
          Meet the community
        </h1>
        <p className="mt-4 text-lg text-ink/60">
          Discover the talents behind Crewmate. Explore their work, check their ratings, and select
          the creators for your next project. Ranked by rating, updated in real time.
        </p>
      </Reveal>

      <div className="mt-10">
        <CommunityFilters facets={facets} total={creators.length} />
      </div>

      {creators.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg font-semibold">No creators match your filters</p>
          <p className="mt-1 text-ink/55">Try adjusting or clearing your filters.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {creators.map((c) => (
            <CreatorCard key={c.id} creator={c} />
          ))}
        </div>
      )}
    </div>
  );
}
