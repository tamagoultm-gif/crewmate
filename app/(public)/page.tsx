import Link from "next/link";
import { ArrowRight, Compass, MousePointerClick, Send, Rocket } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Reveal, StaggerGroup } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/ServiceCard";
import { CreatorCard } from "@/components/creators/CreatorCard";
import { Counter } from "@/components/ui/Counter";
import { getFeaturedCreators, getServices, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

const STEPS = [
  { n: "01", title: "Discover", desc: "Browse the community and explore each creator's work.", icon: Compass },
  { n: "02", title: "Choose", desc: "Select the creator — or team — that fits your project.", icon: MousePointerClick },
  { n: "03", title: "Request", desc: "Send your project request directly through Crewmate.", icon: Send },
  { n: "04", title: "Create", desc: "We handle the match-making and follow the project through.", icon: Rocket },
];

export default async function HomePage() {
  const [featured, services, settings] = await Promise.all([
    getFeaturedCreators(3),
    getServices(),
    getSettings(),
  ]);

  return (
    <>
      <Hero creatorStat={settings.stat_creators} />

      {/* Stats strip */}
      <section className="border-y border-ink/[0.06] bg-paper-soft">
        <div className="container-page grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4 md:divide-x md:divide-ink/10">
          {[
            { label: "Creators", value: settings.stat_creators },
            { label: "Projects delivered", value: settings.stat_projects },
            { label: "Content types", value: settings.stat_content_types },
            { label: "Happy clients", value: settings.stat_clients },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center text-center md:px-4">
              <Counter value={s.value} className="text-3xl font-black tracking-tight md:text-4xl" />
              <p className="mt-1 text-sm text-ink/55">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What is Crewmate */}
      <section className="container-page py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <span className="eyebrow">What is Crewmate?</span>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-5xl">
              A creative community, made discoverable.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/60">
              Crewmate brings content creators together on a single platform, so brands,
              businesses and clients can find exactly the right profiles for their projects —
              without the endless back-and-forth.
            </p>
            <Link href="/about" className="btn-ghost mt-6 px-0 hover:bg-transparent hover:text-brand-600">
              Learn more about us <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <StaggerGroup className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "For brands & clients", body: "Find vetted creators, compare work and ratings, and start a project in minutes." },
              { title: "For creators", body: "Join a community that puts your work in front of the right clients." },
              { title: "One platform", body: "Discovery, selection and requests — all handled in one seamless flow." },
              { title: "Real relationships", body: "Crewmate facilitates the match and follows every project through." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i} className="card p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="font-semibold">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{c.body}</p>
              </Reveal>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-night py-20 text-white md:py-28">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <span className="eyebrow text-accent">How it works</span>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-5xl">
              From discovery to delivery, in four steps.
            </h2>
          </Reveal>

          <StaggerGroup className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <Reveal key={s.n} className="bg-night p-8">
                <s.icon className="h-8 w-8 text-accent" />
                <span className="mt-6 block text-sm font-bold text-white/40">{s.n}</span>
                <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.desc}</p>
              </Reveal>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Featured creators */}
      {featured.length > 0 && (
        <section className="container-page py-20 md:py-28">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <Reveal>
              <span className="eyebrow">Featured creators</span>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                Meet a few of the crew.
              </h2>
            </Reveal>
            <Reveal>
              <Link href="/community" className="btn-outline">
                Discover the community <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CreatorCard key={c.id} creator={c} />
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      <section className="bg-paper-soft py-20 md:py-28">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">Services</span>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Every kind of content, one crew.
            </h2>
            <p className="mt-4 text-lg text-ink/60">
              Whatever your project needs — from a single reel to a full brand campaign.
            </p>
          </Reveal>

          <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.id} name={s.name} slug={s.slug} description={s.description} icon={s.icon} />
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-20 md:py-28">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-brand-600 px-6 py-16 text-center text-white md:px-16 md:py-24">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <h2 className="mx-auto max-w-2xl text-balance text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Have a project in mind?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
            Tell us what you&apos;re creating and we&apos;ll connect you with the creators who can make it happen.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn bg-white text-night hover:bg-paper-soft">
              Start a project <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/community" className="btn border border-white/30 text-white hover:bg-white/10">
              Browse creators
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
