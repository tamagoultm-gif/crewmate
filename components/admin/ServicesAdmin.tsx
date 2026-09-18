"use client";

import { useRef, useTransition } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { SERVICE_ICONS } from "@/lib/constants";
import { saveService, deleteService } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  active: boolean;
  _count: { creators: number };
};

export function ServicesAdmin({ services }: { services: Service[] }) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const iconNames = Object.keys(SERVICE_ICONS);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((s) => {
          const Icon = (s.icon && SERVICE_ICONS[s.icon]) || SERVICE_ICONS.Sparkles;
          return (
            <div key={s.id} className="card flex items-start gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-night text-white">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{s.name}</p>
                <p className="truncate text-xs text-ink/50">{s.description}</p>
                <p className="mt-1 text-xs text-ink/40">{s._count.creators} creators</p>
              </div>
              <button
                onClick={() =>
                  startTransition(async () => {
                    await deleteService(s.id);
                    toast("Service deleted", "success");
                  })
                }
                className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <form
          ref={formRef}
          action={(fd) =>
            startTransition(async () => {
              await saveService(null, fd);
              toast("Service added", "success");
              formRef.current?.reset();
            })
          }
          className="card space-y-3 p-5"
        >
          <h3 className="font-semibold">Add a service</h3>
          <div>
            <label className="label">Name</label>
            <input name="name" required className="input" placeholder="e.g. Podcasting" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" rows={2} className="input resize-y" placeholder="Short description" />
          </div>
          <div>
            <label className="label">Icon</label>
            <select name="icon" className="input" defaultValue="Sparkles">
              {iconNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={pending} className="btn-primary w-full justify-center">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add service
          </button>
        </form>
      </div>
    </div>
  );
}
