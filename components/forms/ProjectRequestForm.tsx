"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, CheckCircle2, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { submitProjectRequest, type ActionState } from "@/app/actions/public";
import { useSelection } from "@/components/selection/SelectionProvider";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import { CONTENT_TYPES, BUDGET_RANGES } from "@/lib/constants";

const initial: ActionState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-accent w-full justify-center py-3.5 text-base">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Sending…
        </>
      ) : (
        <>
          <Send className="h-4 w-4" /> Send project request
        </>
      )}
    </button>
  );
}

function Field({
  label,
  name,
  error,
  children,
  required,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="label">
        {label} {required && <span className="text-brand-600">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

export function ProjectRequestForm() {
  const { selected, remove, clear } = useSelection();
  const [state, formAction] = useActionState(submitProjectRequest, initial);
  const { toast } = useToast();
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      setDone(true);
      clear();
      toast(state.message || "Request sent!", "success");
    } else if (state.message && state.errors) {
      toast(state.message, "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const err = state.errors ?? {};

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card flex flex-col items-center px-8 py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
        >
          <CheckCircle2 className="h-8 w-8" />
        </motion.div>
        <h3 className="mt-5 text-2xl font-bold">Request sent!</h3>
        <p className="mt-2 max-w-sm text-ink/60">
          Thanks for reaching out. The Crewmate team will review your project and get back to you shortly.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/community" className="btn-outline">Browse more creators</Link>
          <button onClick={() => setDone(false)} className="btn-primary">Send another</button>
        </div>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="card p-6 md:p-8">
      {/* Selected creators */}
      <div className="mb-6 rounded-2xl border border-dashed border-ink/15 bg-paper-soft p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            Selected creators <span className="text-ink/40">({selected.length})</span>
          </h3>
          {selected.length > 0 && (
            <button type="button" onClick={clear} className="text-xs text-ink/50 hover:text-ink hover:underline">
              Clear
            </button>
          )}
        </div>
        <AnimatePresence mode="popLayout">
          {selected.length === 0 ? (
            <div className="mt-3 flex items-center gap-2 text-sm text-ink/50">
              <UserPlus className="h-4 w-4" />
              <span>
                No creators selected yet.{" "}
                <Link href="/community" className="font-medium text-brand-600 hover:underline">
                  Browse the community
                </Link>{" "}
                to add some (optional).
              </span>
            </div>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-2">
              {selected.map((c) => (
                <motion.li
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 rounded-full border border-ink/10 bg-paper-card py-1 pl-1 pr-2.5"
                >
                  <Avatar name={c.displayName} src={c.avatarUrl} size={24} />
                  <span className="text-sm font-medium">{c.displayName}</span>
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    className="text-ink/30 hover:text-ink"
                    aria-label={`Remove ${c.displayName}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <input type="hidden" name="creatorIds" value={c.id} />
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </div>

      {/* Client info */}
      <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Your details</h3>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <Field label="First name" name="firstName" error={err.firstName} required>
          <input id="firstName" name="firstName" className="input" placeholder="Sarah" />
        </Field>
        <Field label="Last name" name="lastName" error={err.lastName} required>
          <input id="lastName" name="lastName" className="input" placeholder="Ben Ali" />
        </Field>
        <Field label="Company" name="company" error={err.company}>
          <input id="company" name="company" className="input" placeholder="Optional" />
        </Field>
        <Field label="Email" name="email" error={err.email} required>
          <input id="email" name="email" type="email" className="input" placeholder="you@company.com" />
        </Field>
        <Field label="Phone" name="phone" error={err.phone}>
          <input id="phone" name="phone" className="input" placeholder="+216 …" />
        </Field>
        <Field label="Number of creators" name="creatorsCount" error={err.creatorsCount}>
          <input id="creatorsCount" name="creatorsCount" type="number" min={0} className="input" placeholder="e.g. 3" />
        </Field>
      </div>

      {/* Project info */}
      <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-ink/50">Your project</h3>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <Field label="Content type" name="contentType" error={err.contentType}>
          <select id="contentType" name="contentType" className="input" defaultValue="">
            <option value="">Select…</option>
            {CONTENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Budget" name="budget" error={err.budget}>
          <select id="budget" name="budget" className="input" defaultValue="">
            <option value="">Select…</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </Field>
        <Field label="Preferred date" name="preferredDate" error={err.preferredDate}>
          <input id="preferredDate" name="preferredDate" type="date" className="input" />
        </Field>
        <Field label="Preferred time" name="preferredTime" error={err.preferredTime}>
          <input id="preferredTime" name="preferredTime" type="time" className="input" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Location" name="location" error={err.location}>
            <input id="location" name="location" className="input" placeholder="City, studio, on-site…" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Tell us about your project" name="description" error={err.description} required>
            <textarea
              id="description"
              name="description"
              rows={5}
              className="input resize-y"
              placeholder="Describe your goals, deliverables, references, timeline…"
            />
          </Field>
        </div>
      </div>

      <div className="mt-8">
        <SubmitButton />
        <p className="mt-3 text-center text-xs text-ink/40">
          By sending, you agree to be contacted by the Crewmate team about your project.
        </p>
      </div>
    </form>
  );
}
