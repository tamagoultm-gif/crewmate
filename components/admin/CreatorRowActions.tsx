"use client";

import { useTransition } from "react";
import { EyeOff, Eye, Trash2, Loader2 } from "lucide-react";
import { toggleCreatorActive, deleteCreator } from "@/app/admin/actions";
import { ConfirmButton } from "./ConfirmButton";
import { useToast } from "@/components/ui/Toast";

export function CreatorRowActions({ id, active, name }: { id: string; active: boolean; name: string }) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <>
      <button
        onClick={() =>
          startTransition(async () => {
            await toggleCreatorActive(id, !active);
            toast(active ? `${name} hidden` : `${name} is now visible`, "success");
          })
        }
        disabled={pending}
        className="rounded-lg p-2 text-ink/50 hover:bg-ink/5 hover:text-ink"
        title={active ? "Hide from site" : "Show on site"}
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      <ConfirmButton
        action={deleteCreator.bind(null, id)}
        title={`Delete ${name}?`}
        body="This permanently removes the creator, their portfolio and reviews."
        confirmLabel="Delete creator"
        className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
      >
        <Trash2 className="h-4 w-4" />
      </ConfirmButton>
    </>
  );
}
