import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Target, Eye, Users, Sparkles } from "lucide-react";
import { Reveal, StaggerGroup } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Crewmate is a community of content creators built to connect brands and clients with the right talent. Discover our mission, vision and the community behind it.",
};

export const dynamic = "force-dynamic";

const VALUES = [
  { title: "Community first", body: "We're a crew, not a listing. Every creator is part of a real, curated community.", icon: Users },
  { title: "Quality over noise", body: "Ratings and portfolios that reflect real work, so clients choose with confidence.", icon: Sparkles },
  { title: "Made for creators", body: "A platform that puts creators' work in front of the clients who need it.", icon: Target },
];

export default async function AboutPage() {
  const s = await getSettings();

  return (
    <div>
      {/* Hero */}
      <section className="container-page py-16 md:py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="eyebrow justify-center">About Crewmate</span>
          <h1 className="mt-5 text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            We connect creative talent with the brands who need it.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/60">
            Crewmate is a community of content creators — videographers, photographers, UGC makers and
            social storytellers — brought together on one platform so brands and clients can find the
            right profiles for their projects, fast.
          </p>
        </Reveal>

        <Reveal delay={1} className="mt-12 overflow-hidden rounded-[2rem]">
          <div className="relative aspect-[16/7] w-full">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&h=600&fit=crop"
              alt="Creative team collaborating"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="border-y border-ink/[0.06] bg-paper-soft">
        <div className="container-page grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {[
            { label: "Creators", value: s.stat_creators },
            { label: "Projects delivered", value: s.stat_projects },
            { label: "Content types", value: s.stat_content_types },
            { label: "Clients served", value: s.stat_clients },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <Counter value={stat.value} className="text-4xl font-black tracking-tight md:text-5xl" />
              <p className="mt-1 text-sm text-ink/55">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container-page py-20 md:py-28">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-[2rem] bg-night p-8 text-white md:p-12">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Target className="h-6 w-6 text-accent" />
            </span>
            <h2 className="mt-6 text-3xl font-black tracking-tight">Our mission</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              To make collaboration between content creators and brands effortless — giving talent the
              visibility they deserve and clients a simple way to find and work with the right people.
            </p>
          </Reveal>

          <Reveal delay={1} className="rounded-[2rem] bg-brand-600 p-8 text-white md:p-12">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Eye className="h-6 w-6" />
            </span>
            <h2 className="mt-6 text-3xl font-black tracking-tight">Our vision</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              A creative community where talent is easy to discover, and where every brand can find the
              perfect crew for their story — no agencies, no friction, just great work.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-paper-soft py-20 md:py-28">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">What we stand for</span>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">The Crewmate way.</h2>
          </Reveal>
          <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i} className="card p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-ink/60">{v.body}</p>
              </Reveal>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* How Crewmate connects */}
      <section className="container-page py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal className="order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop"
                alt="Creators and clients collaborating"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delay={1} className="order-1 lg:order-2">
            <span className="eyebrow">The community</span>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              How Crewmate connects creators and clients.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/60">
              Creators join the community and showcase their best work. Clients browse, compare and
              select the profiles that fit their project — then send a request in a couple of clicks.
              Crewmate handles the match and follows the project through to delivery.
            </p>
            <Link href="/community" className="btn-primary mt-8">
              Meet the community <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
