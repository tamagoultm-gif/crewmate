"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard,
  Inbox,
  Users,
  Sparkles,
  Star,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/requests", label: "Requests", icon: Inbox },
  { href: "/admin/creators", label: "Creators", icon: Users },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/contacts", label: "Contacts", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ email }: { email?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {LINKS.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              active ? "bg-night text-white" : "text-ink/60 hover:bg-ink/5 hover:text-ink"
            )}
          >
            <l.icon className="h-4.5 w-4.5" />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );

  const body = (
    <div className="flex h-full flex-col p-4">
      <Link href="/admin" className="mb-6 flex items-center gap-2 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-night text-sm font-black text-white">C</span>
        <span className="text-lg font-black tracking-tight">CREWMATE</span>
        <span className="rounded-md bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-700">Admin</span>
      </Link>
      {nav}
      <div className="mt-4 space-y-1 border-t border-ink/[0.06] pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/60 transition hover:bg-ink/5 hover:text-ink"
        >
          <ExternalLink className="h-4.5 w-4.5" /> View site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
        >
          <LogOut className="h-4.5 w-4.5" /> Sign out
        </button>
        <div className="flex items-center justify-between px-3 pt-2">
          {email && <p className="truncate text-xs text-ink/40">{email}</p>}
          <ThemeToggle className="h-8 w-8" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-ink/[0.06] bg-paper-card px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-night text-xs font-black text-white">C</span>
          <span className="font-black tracking-tight">CREWMATE</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle className="h-9 w-9" />
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-ink/5" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-ink/[0.06] bg-paper-card lg:block">
        <div className="sticky top-0 h-screen">{body}</div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-night/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-paper-card shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-lg p-2 hover:bg-ink/5"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {body}
          </div>
        </div>
      )}
    </>
  );
}
