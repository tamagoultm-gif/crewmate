"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

type Props = {
  value: string;
  options: readonly string[];
  onChange: (status: string) => Promise<{ ok: boolean }>;
  size?: "sm" | "md";
};

export function StatusSelect({ value, options, onChange, size = "md" }: Props) {
  const [current, setCurrent] = useState(value);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <div className="relative inline-flex">
      <select
        value={current}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          const prev = current;
          setCurrent(next);
          startTransition(async () => {
            const res = await onChange(next);
            if (res.ok) toast(`Status updated to ${STATUS_LABELS[next] ?? next}`, "success");
            else {
              setCurrent(prev);
              toast("Could not update status", "error");
            }
          });
        }}
        className={cn(
          "cursor-pointer appearance-none rounded-full border-0 pl-3 pr-8 font-semibold ring-1 ring-inset focus:outline-none focus:ring-2",
          size === "sm" ? "py-1 text-xs" : "py-1.5 text-sm",
          STATUS_STYLES[current] ?? "bg-zinc-100 text-zinc-600 ring-zinc-200"
        )}
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-paper-card text-ink">
            {STATUS_LABELS[o] ?? o}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </span>
    </div>
  );
}
