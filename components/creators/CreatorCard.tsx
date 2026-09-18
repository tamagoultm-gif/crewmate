"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { RatingStars } from "@/components/ui/RatingStars";
import { Avatar } from "@/components/ui/Avatar";
import { SelectButton } from "@/components/selection/SelectButton";
import type { CreatorCard as CreatorCardData } from "@/lib/data";

const isVideoUrl = (u?: string | null) => !!u && /\.(mp4|webm|mov)(\?|$)/i.test(u);
// Only use image URLs for next/image; ignore video files.
const firstImage = (...urls: (string | null | undefined)[]) => urls.find((u) => u && !isVideoUrl(u)) || undefined;

export function CreatorCard({ creator }: { creator: CreatorCardData }) {
  const tags = creator.services.map((s) => s.title || s.service.name).slice(0, 3);
  const cover = firstImage(creator.coverUrl, creator.portfolio[0]?.thumbnailUrl, creator.portfolio[0]?.mediaUrl);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink/[0.06] bg-paper-card shadow-card transition-shadow hover:shadow-card-hover"
    >
      <Link href={`/community/${creator.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-paper-soft">
        {cover ? (
          <Image
            src={cover}
            alt={`${creator.displayName}'s work`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-100 to-paper-soft" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/50 to-transparent" />
        {creator.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
            Featured
          </span>
        )}
        <div className="absolute right-3 top-3">
          <SelectButton
            creator={{
              id: creator.id,
              slug: creator.slug,
              displayName: creator.displayName,
              avatarUrl: creator.avatarUrl,
              profession: creator.profession,
            }}
          />
        </div>

        {/* mini portfolio strip */}
        {creator.portfolio.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {creator.portfolio.slice(0, 3).map((p) => (
              <span key={p.id} className="h-8 w-8 overflow-hidden rounded-lg bg-ink/10 ring-2 ring-white/70">
                {firstImage(p.thumbnailUrl, p.mediaUrl) && (
                  <Image
                    src={firstImage(p.thumbnailUrl, p.mediaUrl)!}
                    alt={p.title}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                )}
              </span>
            ))}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <Avatar name={creator.displayName} src={creator.avatarUrl} size={48} className="ring-2 ring-white" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-ink">{creator.displayName}</h3>
            <p className="truncate text-sm text-ink/60">{creator.profession}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <RatingStars value={creator.ratingAvg} count={creator.reviewsCount} size="sm" />
        </div>

        {creator.city && (
          <p className="mt-2 flex items-center gap-1 text-xs text-ink/50">
            <MapPin className="h-3.5 w-3.5" /> {creator.city}
          </p>
        )}

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
        )}

        <Link
          href={`/community/${creator.slug}`}
          className="btn-outline mt-4 w-full justify-center group-hover:border-ink/40"
        >
          View profile
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}
