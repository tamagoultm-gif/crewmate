import type { Metadata } from "next";
import { Mail, Phone, MapPin, Instagram, Clock } from "lucide-react";
import { ContactTabs } from "@/components/forms/ContactTabs";
import { Reveal } from "@/components/ui/Reveal";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Start a project",
  description:
    "Tell Crewmate about your project and we'll connect you with the right creators. Or send us a general message.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const s = await getSettings();

  const info = [
    { icon: Mail, label: "Email", value: s.contact_email, href: `mailto:${s.contact_email}` },
    { icon: Phone, label: "Phone", value: s.contact_phone, href: `tel:${s.contact_phone}` },
    { icon: Instagram, label: "Instagram", value: s.contact_instagram, href: "#" },
    { icon: MapPin, label: "Location", value: s.contact_location },
  ];

  return (
    <div className="container-page py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <span className="eyebrow">Start a project</span>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Let&apos;s create something together.
            </h1>
            <p className="mt-4 text-lg text-ink/60">
              Tell us about your project and the creators you have in mind. Our team will handle the
              match and get back to you quickly.
            </p>
          </Reveal>

          <Reveal delay={1} className="mt-8 space-y-3">
            {info.map((item) => {
              const content = (
                <div className="card flex items-center gap-4 p-4 transition hover:shadow-card-hover">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-night text-white">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink/40">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              );
              return item.href ? (
                <a key={item.label} href={item.href} className="block">
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}
            <div className="flex items-center gap-2 px-1 pt-1 text-sm text-ink/50">
              <Clock className="h-4 w-4" /> We usually reply within 24 hours.
            </div>
          </Reveal>
        </div>

        <div>
          <ContactTabs />
        </div>
      </div>
    </div>
  );
}
