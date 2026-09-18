"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SERVICE_ICONS } from "@/lib/constants";
import { staggerItem } from "@/components/ui/Reveal";

type Props = {
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
};

export function ServiceCard({ name, slug, description, icon }: Props) {
  const Icon = (icon && SERVICE_ICONS[icon]) || SERVICE_ICONS.Sparkles;

  return (
    <motion.div variants={staggerItem}>
      <Link
        href={`/community?service=${slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/[0.06] bg-paper-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
      >
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-100 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-night text-white transition-transform group-hover:-rotate-6">
          <Icon className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-semibold">{name}</h3>
        {description && <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink/60">{description}</p>}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
          Explore creators
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Link>
    </motion.div>
  );
}
