import Link from "next/link";
import { Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { getSettings } from "@/lib/data";

const TikTokIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M16.5 3c.3 2.1 1.6 3.6 3.7 3.8v2.4c-1.3.1-2.5-.3-3.7-1v5.6c0 3.6-2.6 5.9-5.7 5.9-2.9 0-5.1-2.1-5.1-4.9 0-3 2.5-5 5.4-4.7v2.5c-.4-.1-.9-.2-1.3-.1-1.3.2-2.1 1.1-2 2.4.1 1.3 1 2.2 2.4 2.2 1.5 0 2.4-1.1 2.4-2.7V3h3.9z" />
  </svg>
);

export async function Footer() {
  const s = await getSettings();
  const socials = [
    { href: "#", label: "Instagram", icon: Instagram },
    { href: "#", label: "TikTok", icon: TikTokIcon },
    { href: "#", label: "YouTube", icon: Youtube },
    { href: "#", label: "LinkedIn", icon: Linkedin },
  ];

  return (
    <footer className="mt-24 border-t border-ink/[0.06] bg-paper-soft">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-night text-sm font-black text-white">
                C
              </span>
              <span className="text-lg font-black tracking-tight">CREWMATE</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/60">
              A community of content creators. We connect brands and clients with the right
              talent for their next project.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-paper-card text-ink/60 transition hover:border-ink/30 hover:text-ink"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink/50">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/community", label: "Community" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink/60 transition hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink/50">For creators</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/contact" className="text-ink/60 transition hover:text-ink">Join the community</Link></li>
              <li><Link href="/community" className="text-ink/60 transition hover:text-ink">Browse talent</Link></li>
              <li><Link href="/about" className="text-ink/60 transition hover:text-ink">Our mission</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink/50">Contact</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/60">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-ink/40" />{s.contact_email}</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-ink/40" />{s.contact_phone}</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-ink/40" />{s.contact_location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink/[0.06] pt-6 text-xs text-ink/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Crewmate. All rights reserved.</p>
          <p>Creative community · Talent platform · Digital agency</p>
        </div>
      </div>
    </footer>
  );
}
