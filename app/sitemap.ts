import type { MetadataRoute } from "next";
import { getAllCreatorSlugs } from "@/lib/data";

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Generate on-demand, not at build (avoids any build-time DB dependency).
export const dynamic = "force-dynamic";

// Never let a slow/unreachable DB call block the build.
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]).catch(() => fallback);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const creators = await withTimeout(getAllCreatorSlugs(), 3000, []).catch(() => []);

  const staticRoutes = ["", "/about", "/community", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const creatorRoutes = creators.map((c) => ({
    url: `${base}/community/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...creatorRoutes];
}
