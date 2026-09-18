"use client";

import { Check, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useSelection, type SelectedCreator } from "./SelectionProvider";
import { cn } from "@/lib/utils";

type Props = {
  creator: SelectedCreator;
  variant?: "card" | "profile";
  className?: string;
};

export function SelectButton({ creator, variant = "card", className }: Props) {
  const { isSelected, toggle } = useSelection();
  const selected = isSelected(creator.id);

  if (variant === "profile") {
    return (
      <button
        onClick={() => toggle(creator)}
        className={cn(
          "btn w-full sm:w-auto",
          selected
            ? "bg-emerald-500 text-white hover:bg-emerald-600"
            : "btn-accent",
          className
        )}
      >
        {selected ? (
          <>
            <Check className="h-4 w-4" /> Added to your project
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" /> Work with this creator
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggle(creator);
      }}
      aria-pressed={selected}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all",
        selected
          ? "border-emerald-500 bg-emerald-500 text-white"
          : "border-ink/15 bg-paper-card text-ink hover:border-ink/40",
        className
      )}
      title={selected ? "Remove from selection" : "Add to selection"}
    >
      <motion.span key={selected ? "on" : "off"} initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
        {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </motion.span>
    </button>
  );
}
