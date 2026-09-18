"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { saveSettings, type FormState } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";

const initial: FormState = { ok: false };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Save settings
    </button>
  );
}

const STATS = [
  { key: "stat_creators", label: "Creators stat" },
  { key: "stat_projects", label: "Projects stat" },
  { key: "stat_content_types", label: "Content types stat" },
  { key: "stat_clients", label: "Clients stat" },
];
const CONTACT = [
  { key: "contact_email", label: "Contact email" },
  { key: "contact_phone", label: "Contact phone" },
  { key: "contact_location", label: "Location" },
  { key: "contact_instagram", label: "Instagram" },
];

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [state, formAction] = useActionState(saveSettings, initial);
  const { toast } = useToast();

  useEffect(() => {
    if (state.ok && state.message) toast(state.message, "success");
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <section className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Homepage statistics</h2>
        <p className="mt-1 text-xs text-ink/40">Shown on the home and about pages. Free text (e.g. &quot;40+&quot;).</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {STATS.map((s) => (
            <div key={s.key}>
              <label className="label">{s.label}</label>
              <input name={`setting_${s.key}`} defaultValue={settings[s.key] ?? ""} className="input" />
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Contact information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {CONTACT.map((s) => (
            <div key={s.key}>
              <label className="label">{s.label}</label>
              <input name={`setting_${s.key}`} defaultValue={settings[s.key] ?? ""} className="input" />
            </div>
          ))}
        </div>
      </section>

      <Submit />
    </form>
  );
}
