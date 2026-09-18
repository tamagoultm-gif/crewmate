"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProjectRequestForm } from "./ProjectRequestForm";
import { ContactForm } from "./ContactForm";
import { cn } from "@/lib/utils";

export function ContactTabs({ defaultTab = "project" }: { defaultTab?: "project" | "message" }) {
  const [tab, setTab] = useState<"project" | "message">(defaultTab);

  return (
    <div>
      <div className="mb-6 inline-flex rounded-full border border-ink/10 bg-paper-card p-1">
        {(["project", "message"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative rounded-full px-5 py-2 text-sm font-semibold transition-colors",
              tab === t ? "text-white" : "text-ink/60 hover:text-ink"
            )}
          >
            {tab === t && (
              <motion.span
                layoutId="contact-tab"
                className="absolute inset-0 -z-10 rounded-full bg-night"
                transition={{ type: "spring", stiffness: 360, damping: 30 }}
              />
            )}
            {t === "project" ? "Project request" : "General enquiry"}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {tab === "project" ? <ProjectRequestForm /> : <ContactForm />}
      </motion.div>
    </div>
  );
}
