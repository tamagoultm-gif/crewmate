import type { MetadataRoute } from "next";
import { getAllCreatorSlugs } from "@/lib/data";

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let creators: { slug: string; updatedAt: Date }[] = [];
  try {
    creators = await getAllCreatorSlugs();
  } catch {
    creators = [];
  }

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
