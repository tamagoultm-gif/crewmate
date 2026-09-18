"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { submitContact, type ActionState } from "@/app/actions/public";
import { useToast } from "@/components/ui/Toast";

const initial: ActionState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full justify-center py-3.5">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Sending…
        </>
      ) : (
        <>
          <Send className="h-4 w-4" /> Send message
        </>
      )}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initial);
  const { toast } = useToast();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (state.ok) {
      setDone(true);
      toast(state.message || "Message sent!", "success");
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
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mt-5 text-2xl font-bold">Message sent!</h3>
        <p className="mt-2 max-w-sm text-ink/60">Thanks for reaching out. We&apos;ll get back to you soon.</p>
        <button onClick={() => setDone(false)} className="btn-outline mt-6">Send another</button>
      </motion.div>
    );
  }

  return (
    <form action={formAction} className="card space-y-4 p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Name *</label>
          <input id="name" name="name" className="input" placeholder="Your name" />
          {err.name && <p className="mt-1 text-xs text-rose-500">{err.name}</p>}
        </div>
        <div>
          <label className="label" htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" className="input" placeholder="you@email.com" />
          {err.email && <p className="mt-1 text-xs text-rose-500">{err.email}</p>}
        </div>
        <div>
          <label className="label" htmlFor="company">Company</label>
          <input id="company" name="company" className="input" placeholder="Optional" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" className="input" placeholder="Optional" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="subject">Subject</label>
        <input id="subject" name="subject" className="input" placeholder="What's this about?" />
      </div>
      <div>
        <label className="label" htmlFor="message">Message *</label>
        <textarea id="message" name="message" rows={5} className="input resize-y" placeholder="Your message…" />
        {err.message && <p className="mt-1 text-xs text-rose-500">{err.message}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}
