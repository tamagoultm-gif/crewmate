"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { staggerItem } from "@/components/ui/Reveal";

type Item = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  thumbnailUrl: string | null;
  category: string | null;
  externalUrl: string | null;
};

const isVideo = (item: Item) =>
  item.type === "VIDEO" ||
  item.type === "REEL" ||
  /\.(mp4|webm|mov)(\?|$)/i.test(item.mediaUrl);

export function PortfolioGallery({ items }: { items: Item[] }) {
  const [active, setActive] = useState<Item | null>(null);
  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))] as string[];
  const [filter, setFilter] = useState("All");

  const shown = filter === "All" ? items : items.filter((i) => i.category === filter);

  if (items.length === 0) {
    return <p className="text-ink/50">No portfolio items yet.</p>;
  }

  return (
    <div>
      {categories.length > 2 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                filter === c
                  ? "border-ink bg-night text-white"
                  : "border-ink/10 bg-paper-card text-ink/60 hover:border-ink/30"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
        {shown.map((item) => {
          const thumb = item.thumbnailUrl || item.mediaUrl;
          const video = isVideo(item);
          const tall = item.type === "REEL" || item.type === "STORY";
          return (
            <motion.button
              key={item.id}
              variants={staggerItem}
              onClick={() => setActive(item)}
              className={`group relative overflow-hidden rounded-2xl bg-paper-soft ${
                tall ? "row-span-2 aspect-[3/4]" : "aspect-square"
              }`}
            >
              {thumb && (
                <Image
                  src={thumb}
                  alt={item.title}
                  fill
                  sizes="(max-width:768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              {video && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-ink shadow-card transition-transform group-hover:scale-110">
                    <Play className="ml-0.5 h-5 w-5 fill-current" />
                  </span>
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-left opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                {item.category && <p className="text-xs text-white/70">{item.category}</p>}
              </div>
            </motion.button>
          );
        })}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} className="max-w-3xl">
        {active && (
          <div>
            <div className="relative aspect-video w-full bg-night">
              {isVideo(active) ? (
                active.externalUrl ? (
                  <iframe
                    src={active.externalUrl}
                    title={active.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={active.mediaUrl} controls autoPlay className="h-full w-full object-contain" />
                )
              ) : (
                <Image src={active.mediaUrl} alt={active.title} fill className="object-contain" sizes="80vw" />
              )}
              <button
                onClick={() => setActive(null)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold">{active.title}</h3>
              {active.category && <p className="mt-0.5 text-sm text-brand-600">{active.category}</p>}
              {active.description && <p className="mt-2 text-sm leading-relaxed text-ink/60">{active.description}</p>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
