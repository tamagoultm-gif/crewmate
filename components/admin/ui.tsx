import Link from "next/link";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink/55">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  tint = "brand",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  href?: string;
  tint?: "brand" | "amber" | "emerald" | "blue" | "rose";
}) {
  const tints: Record<string, string> = {
    brand: "bg-brand-100 text-brand-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    rose: "bg-rose-100 text-rose-700",
  };
  const inner = (
    <div className="card flex items-center gap-4 p-5 transition hover:shadow-card-hover">
      <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", tints[tint])}>
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <div className="text-2xl font-black tracking-tight">{value}</div>
        <p className="text-xs text-ink/55">{label}</p>
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        STATUS_STYLES[status] ?? "bg-zinc-100 text-zinc-600 ring-zinc-200"
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="card flex flex-col items-center px-6 py-16 text-center">
      <p className="font-semibold">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-ink/55">{subtitle}</p>}
    </div>
  );
}
