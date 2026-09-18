"use client";

import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { updateRequestNotes } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";

export function NotesEditor({ id, initial }: { id: string; initial: string }) {
  const [value, setValue] = useState(initial);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const dirty = value !== initial;

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={5}
        placeholder="Internal notes — visible only to the team…"
        className="input resize-y"
      />
      <button
        disabled={pending || !dirty}
        onClick={() =>
          startTransition(async () => {
            await updateRequestNotes(id, value);
            toast("Notes saved", "success");
          })
        }
        className="btn-primary mt-3"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save notes
      </button>
    </div>
  );
}
