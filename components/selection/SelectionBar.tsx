"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Users, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSelection } from "./SelectionProvider";
import { Avatar } from "@/components/ui/Avatar";

/** Floating bar summarising the current creator selection. */
export function SelectionBar() {
  const { selected, count, remove, clear, hydrated } = useSelection();
  const pathname = usePathname();

  // Hide on the contact page (the form already lists selections) and in admin.
  const hidden = pathname.startsWith("/contact") || pathname.startsWith("/admin");

  return (
    <AnimatePresence>
      {hydrated && count > 0 && !hidden && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-3 sm:px-6 sm:pb-6"
        >
          <div className="container-page">
            <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-3xl border border-ink/10 bg-paper-card/90 p-3 shadow-card-hover backdrop-blur-lg sm:flex-row sm:items-center sm:gap-4 sm:p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                  <Users className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    {count} creator{count === 1 ? "" : "s"} selected
                  </p>
                  <button
                    onClick={clear}
                    className="text-xs text-ink/50 underline-offset-2 hover:text-ink hover:underline"
                  >
                    Clear selection
                  </button>
                </div>
              </div>

              <div className="hidden flex-1 items-center gap-1.5 overflow-x-auto sm:flex">
                {selected.slice(0, 6).map((c) => (
                  <span key={c.id} className="group relative">
                    <Avatar name={c.displayName} src={c.avatarUrl} size={32} />
                    <button
                      onClick={() => remove(c.id)}
                      className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-night text-white group-hover:flex"
                      aria-label={`Remove ${c.displayName}`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
                {count > 6 && <span className="chip">+{count - 6}</span>}
              </div>

              <Link href="/contact" className="btn-primary w-full justify-center sm:w-auto">
                Request a project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
