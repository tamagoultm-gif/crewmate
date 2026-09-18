"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star, Sparkles } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
];

export function Hero({ creatorStat }: { creatorStat: string }) {
  return (
    <section className="relative overflow-hidden">
      {/* soft background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span variants={item} className="eyebrow">
            <Sparkles className="h-3.5 w-3.5" /> Creator community & talent platform
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-5 text-balance text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
          >
            The creators behind
            <br />
            your next{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">great story</span>
              <svg
                className="absolute -bottom-2 left-0 z-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M2 9C60 3 140 3 298 8"
                  stroke="#E7FC5A"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-lg text-lg leading-relaxed text-ink/60">
            Crewmate connects brands and clients with a community of vetted content creators.
            Discover talent, explore their work, and send a project request — all in one place.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/community" className="btn-primary">
              Discover creators
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn-outline">
              <Play className="h-4 w-4" /> Contact us
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {AVATARS.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-paper"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-ink/60">
                <span className="font-semibold text-ink">{creatorStat}</span> creators trusted by brands
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Visual collage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <HeroImage
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&h=650&fit=crop"
                label="Reels"
                delay={0.3}
                className="aspect-[3/4]"
              />
              <HeroImage
                src="https://images.unsplash.com/photo-1554080353-a576cf803bda?w=500&h=400&fit=crop"
                label="Photography"
                delay={0.5}
                className="aspect-[4/3]"
              />
            </div>
            <div className="space-y-4 pt-10">
              <HeroImage
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&h=400&fit=crop"
                label="Brand content"
                delay={0.4}
                className="aspect-[4/3]"
              />
              <HeroImage
                src="https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=500&h=650&fit=crop"
                label="UGC"
                delay={0.6}
                className="aspect-[3/4]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroImage({
  src,
  label,
  delay,
  className,
}: {
  src: string;
  label: string;
  delay: number;
  className: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-3xl shadow-card ${className}`}
    >
      <Image src={src} alt={label} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="30vw" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-4">
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">{label}</span>
      </div>
    </motion.div>
  );
}
