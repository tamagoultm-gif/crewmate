import { prisma } from "./prisma";
import { roundRating } from "./utils";
import type { Prisma } from "@prisma/client";

export type CreatorFilters = {
  q?: string;
  service?: string; // service slug
  specialty?: string;
  city?: string;
  language?: string;
  minRating?: number;
};

const creatorCardSelect = {
  id: true,
  slug: true,
  displayName: true,
  profession: true,
  headline: true,
  location: true,
  city: true,
  avatarUrl: true,
  coverUrl: true,
  specialties: true,
  skills: true,
  ratingAvg: true,
  reviewsCount: true,
  featured: true,
  services: { select: { service: { select: { name: true, slug: true } }, title: true } },
  portfolio: {
    orderBy: { sortOrder: "asc" as const },
    take: 3,
    select: { id: true, title: true, mediaUrl: true, thumbnailUrl: true, type: true },
  },
} satisfies Prisma.CreatorSelect;

export type CreatorCard = Prisma.CreatorGetPayload<{ select: typeof creatorCardSelect }>;

/** Public creator directory — always sorted by rating (desc), then reviews. */
export async function getCreators(filters: CreatorFilters = {}): Promise<CreatorCard[]> {
  const where: Prisma.CreatorWhereInput = { active: true };
  const and: Prisma.CreatorWhereInput[] = [];

  if (filters.q) {
    and.push({
      OR: [
        { displayName: { contains: filters.q, mode: "insensitive" } },
        { profession: { contains: filters.q, mode: "insensitive" } },
        { headline: { contains: filters.q, mode: "insensitive" } },
        { specialties: { has: filters.q } },
        { skills: { has: filters.q } },
        { services: { some: { service: { name: { contains: filters.q, mode: "insensitive" } } } } },
      ],
    });
  }
  if (filters.service) {
    and.push({ services: { some: { service: { slug: filters.service } } } });
  }
  if (filters.specialty) {
    and.push({ specialties: { has: filters.specialty } });
  }
  if (filters.city) {
    and.push({ city: { equals: filters.city, mode: "insensitive" } });
  }
  if (filters.language) {
    and.push({ languages: { has: filters.language } });
  }
  if (typeof filters.minRating === "number" && filters.minRating > 0) {
    and.push({ ratingAvg: { gte: filters.minRating } });
  }
  if (and.length) where.AND = and;

  return prisma.creator.findMany({
    where,
    select: creatorCardSelect,
    orderBy: [{ ratingAvg: "desc" }, { reviewsCount: "desc" }, { sortOrder: "asc" }],
  });
}

export async function getFeaturedCreators(take = 3): Promise<CreatorCard[]> {
  const featured = await prisma.creator.findMany({
    where: { active: true, featured: true },
    select: creatorCardSelect,
    orderBy: [{ ratingAvg: "desc" }, { reviewsCount: "desc" }],
    take,
  });
  if (featured.length >= take) return featured;
  // Top-rated fallback if not enough featured creators.
  const top = await prisma.creator.findMany({
    where: { active: true, id: { notIn: featured.map((c) => c.id) } },
    select: creatorCardSelect,
    orderBy: [{ ratingAvg: "desc" }, { reviewsCount: "desc" }],
    take: take - featured.length,
  });
  return [...featured, ...top];
}

export async function getCreatorBySlug(slug: string) {
  return prisma.creator.findUnique({
    where: { slug },
    include: {
      services: { include: { service: true }, orderBy: { service: { sortOrder: "asc" } } },
      portfolio: { orderBy: { sortOrder: "asc" } },
      reviews: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getAllCreatorSlugs() {
  return prisma.creator.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
  });
}

/** Facets for the community filter UI. */
export async function getCreatorFacets() {
  const [services, creators] = await Promise.all([
    prisma.service.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.creator.findMany({
      where: { active: true },
      select: { city: true, languages: true, specialties: true },
    }),
  ]);

  const cities = new Set<string>();
  const languages = new Set<string>();
  const specialties = new Set<string>();
  for (const c of creators) {
    if (c.city) cities.add(c.city);
    c.languages.forEach((l) => languages.add(l));
    c.specialties.forEach((s) => specialties.add(s));
  }

  return {
    services,
    cities: [...cities].sort(),
    languages: [...languages].sort(),
    specialties: [...specialties].sort(),
  };
}

export async function getServices() {
  return prisma.service.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
}

/** Recompute a creator's cached ratingAvg + reviewsCount from published reviews. */
export async function recomputeCreatorRating(creatorId: string) {
  const agg = await prisma.review.aggregate({
    where: { creatorId, published: true },
    _avg: { rating: true },
    _count: true,
  });
  return prisma.creator.update({
    where: { id: creatorId },
    data: {
      ratingAvg: roundRating(agg._avg.rating ?? 0),
      reviewsCount: agg._count,
    },
  });
}

// ---- Site settings (editable stats) ----

const SETTING_DEFAULTS: Record<string, string> = {
  stat_creators: "40+",
  stat_projects: "250+",
  stat_content_types: "8",
  stat_clients: "60+",
  contact_email: "hello@crewmate.studio",
  contact_phone: "+216 55 000 000",
  contact_location: "Tunis, Tunisia",
  contact_instagram: "@crewmate.studio",
};

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  const map: Record<string, string> = { ...SETTING_DEFAULTS };
  for (const r of rows) map[r.key] = r.value;
  return map;
}

export async function getSetting(key: string): Promise<string> {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  return row?.value ?? SETTING_DEFAULTS[key] ?? "";
}
