"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

type Props = {
  action: () => Promise<{ ok: boolean } | void>;
  title?: string;
  body?: string;
  confirmLabel?: string;
  children: React.ReactNode;
  className?: string;
  successMessage?: string;
};

/** Button that opens a confirm modal before running a server action. */
export function ConfirmButton({
  action,
  title = "Are you sure?",
  body = "This action cannot be undone.",
  confirmLabel = "Delete",
  children,
  className,
  successMessage,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        <div className="p-6">
          <p className="text-sm text-ink/60">{body}</p>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="btn-outline">
              Cancel
            </button>
            <button
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await action();
                  if (successMessage) toast(successMessage, "success");
                  setOpen(false);
                })
              }
              className={cn("btn bg-rose-600 text-white hover:bg-rose-700")}
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
