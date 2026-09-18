import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Globe,
  Instagram,
  Youtube,
  ArrowLeft,
  Languages as LanguagesIcon,
  Check,
} from "lucide-react";
import { getCreatorBySlug } from "@/lib/data";
import { RatingStars } from "@/components/ui/RatingStars";
import { RatingDistribution } from "@/components/creators/RatingDistribution";
import { PortfolioGallery } from "@/components/creators/PortfolioGallery";
import { SelectButton } from "@/components/selection/SelectButton";
import { Avatar } from "@/components/ui/Avatar";
import { Reveal, StaggerGroup } from "@/components/ui/Reveal";
import { formatDate } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const creator = await getCreatorBySlug(slug);
  if (!creator) return { title: "Creator not found" };

  const title = `${creator.displayName} — ${creator.profession}`;
  const description =
    creator.headline || `${creator.displayName}, ${creator.profession} on Crewmate. ${creator.bio.slice(0, 140)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: creator.coverUrl ? [creator.coverUrl] : creator.avatarUrl ? [creator.avatarUrl] : [],
      type: "profile",
    },
  };
}

const TikTokIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M16.5 3c.3 2.1 1.6 3.6 3.7 3.8v2.4c-1.3.1-2.5-.3-3.7-1v5.6c0 3.6-2.6 5.9-5.7 5.9-2.9 0-5.1-2.1-5.1-4.9 0-3 2.5-5 5.4-4.7v2.5c-.4-.1-.9-.2-1.3-.1-1.3.2-2.1 1.1-2 2.4.1 1.3 1 2.2 2.4 2.2 1.5 0 2.4-1.1 2.4-2.7V3h3.9z" />
  </svg>
);

export default async function CreatorProfilePage({ params }: { params: Params }) {
  const { slug } = await params;
  const creator = await getCreatorBySlug(slug);
  if (!creator || !creator.active) notFound();

  const socials = [
    creator.instagram && { href: creator.instagram, icon: Instagram, label: "Instagram" },
    creator.tiktok && { href: creator.tiktok, icon: TikTokIcon, label: "TikTok" },
    creator.youtube && { href: creator.youtube, icon: Youtube, label: "YouTube" },
    creator.website && { href: creator.website, icon: Globe, label: "Website" },
  ].filter(Boolean) as { href: string; icon: React.ElementType; label: string }[];

  const selectData = {
    id: creator.id,
    slug: creator.slug,
    displayName: creator.displayName,
    avatarUrl: creator.avatarUrl,
    profession: creator.profession,
  };

  return (
    <article className="pb-24">
      {/* Cover */}
      <div className="relative h-48 w-full overflow-hidden bg-paper-soft sm:h-64 md:h-80">
        {creator.coverUrl ? (
          <Image src={creator.coverUrl} alt="" fill className="object-cover" priority sizes="100vw" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-200 via-brand-100 to-accent/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/20 to-transparent" />
        <div className="container-page relative flex h-full items-start pt-6">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-ink shadow-card backdrop-blur transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" /> Community
          </Link>
        </div>
      </div>

      <div className="container-page">
        {/* Header — only the avatar overlaps the cover; text sits below on solid bg */}
        <div className="relative z-10 -mt-14 sm:-mt-16">
          <Avatar
            name={creator.displayName}
            src={creator.avatarUrl}
            size={128}
            rounded={false}
            className="h-28 w-28 rounded-3xl object-cover shadow-card ring-4 ring-paper md:h-32 md:w-32"
          />
        </div>

        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">{creator.displayName}</h1>
            <p className="mt-1 text-lg text-ink/60">{creator.profession}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink/55">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {creator.location}
              </span>
              <RatingStars value={creator.ratingAvg} count={creator.reviewsCount} size="sm" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-paper-card text-ink/60 transition hover:border-ink/30 hover:text-ink"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
            <SelectButton creator={selectData} variant="profile" />
          </div>
        </div>

        {creator.headline && (
          <p className="mt-5 max-w-2xl text-lg font-medium text-ink/80">{creator.headline}</p>
        )}

        {/* Body grid */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="space-y-14">
            {/* Portfolio */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight">Portfolio</h2>
              <p className="mt-1 text-ink/55">A selection of recent work.</p>
              <StaggerGroup className="mt-6">
                <PortfolioGallery items={creator.portfolio} />
              </StaggerGroup>
            </section>

            {/* About */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight">About {creator.firstName}</h2>
              <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-ink/70">{creator.bio}</p>
            </section>

            {/* Reviews */}
            {creator.reviewsCount > 0 && (
              <section>
                <h2 className="text-2xl font-bold tracking-tight">Ratings & reviews</h2>
                <div className="mt-6 card p-6">
                  <RatingDistribution reviews={creator.reviews} avg={creator.ratingAvg} />
                </div>
                {creator.reviews.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {creator.reviews.slice(0, 6).map((r) => (
                      <div key={r.id} className="card p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar name={r.authorName} size={36} />
                            <div>
                              <p className="text-sm font-semibold">{r.authorName}</p>
                              {r.authorRole && <p className="text-xs text-ink/50">{r.authorRole}</p>}
                            </div>
                          </div>
                          <RatingStars value={r.rating} size="sm" showValue={false} />
                        </div>
                        {r.comment && <p className="mt-3 text-sm leading-relaxed text-ink/70">{r.comment}</p>}
                        <p className="mt-2 text-xs text-ink/40">{formatDate(r.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Services</h3>
              <ul className="mt-3 space-y-2">
                {creator.services.map((cs) => (
                  <li key={cs.id} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-brand-600" />
                    <span>{cs.title || cs.service.name}</span>
                    {cs.priceFrom && <span className="ml-auto text-xs text-ink/40">from {cs.priceFrom}€</span>}
                  </li>
                ))}
              </ul>
            </div>

            {creator.specialties.length > 0 && (
              <div className="card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Specialties</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {creator.specialties.map((s) => (
                    <span key={s} className="chip">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {creator.skills.length > 0 && (
              <div className="card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Skills</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {creator.skills.map((s) => (
                    <span key={s} className="chip bg-brand-50 text-brand-700">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {creator.languages.length > 0 && (
              <div className="card p-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink/50">
                  <LanguagesIcon className="h-4 w-4" /> Languages
                </h3>
                <p className="mt-3 text-sm text-ink/70">{creator.languages.join(", ")}</p>
              </div>
            )}

            <div className="rounded-3xl bg-night p-6 text-white">
              <h3 className="font-semibold">Ready to collaborate?</h3>
              <p className="mt-1.5 text-sm text-white/70">
                Add {creator.firstName} to your project and send a request to the Crewmate team.
              </p>
              <div className="mt-4">
                <SelectButton creator={selectData} variant="profile" className="w-full justify-center" />
              </div>
              <Link href="/contact" className="mt-2 block text-center text-sm text-white/60 hover:text-white">
                Go to request form →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
