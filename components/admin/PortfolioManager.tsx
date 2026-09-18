"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Plus, Trash2, Loader2, Film, ImageIcon } from "lucide-react";
import { addPortfolioItem, deletePortfolioItem } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";
import { FileUpload } from "@/components/admin/FileUpload";

const isVideoUrl = (u?: string | null) => !!u && /\.(mp4|webm|mov)(\?|$)/i.test(u);

type Item = {
  id: string;
  type: string;
  title: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  category: string | null;
};

const TYPES = ["IMAGE", "VIDEO", "REEL", "STORY", "CAMPAIGN"];

export function PortfolioManager({ creatorId, items }: { creatorId: string; items: Item[] }) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [type, setType] = useState("IMAGE");
  const [formKey, setFormKey] = useState(0);

  return (
    <div>
      {/* Existing items */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-ink/[0.06] bg-paper-soft">
              <div className="relative aspect-square">
                {item.thumbnailUrl && !isVideoUrl(item.thumbnailUrl) ? (
                  <Image src={item.thumbnailUrl} alt={item.title} fill className="object-cover" sizes="200px" />
                ) : isVideoUrl(item.mediaUrl) ? (
                  <video src={item.mediaUrl} className="h-full w-full object-cover" muted playsInline />
                ) : item.mediaUrl ? (
                  <Image src={item.mediaUrl} alt={item.title} fill className="object-cover" sizes="200px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink/30">
                    {item.type === "VIDEO" || item.type === "REEL" ? <Film /> : <ImageIcon />}
                  </div>
                )}
                <span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                  {item.type}
                </span>
                <button
                  onClick={() => {
                    setBusyId(item.id);
                    startTransition(async () => {
                      await deletePortfolioItem(item.id, creatorId);
                      toast("Item removed", "success");
                      setBusyId(null);
                    });
                  }}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-rose-600 opacity-0 transition group-hover:opacity-100"
                >
                  {busyId === item.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="truncate px-2 py-1.5 text-xs font-medium">{item.title}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink/50">No portfolio items yet. Add one below.</p>
      )}

      {/* Add form */}
      <form
        ref={formRef}
        action={(fd) => {
          if (!fd.get("mediaUrl")) {
            toast("Please upload an image/video or paste a link first", "error");
            return;
          }
          startTransition(async () => {
            await addPortfolioItem(creatorId, fd);
            toast("Portfolio item added", "success");
            formRef.current?.reset();
            setType("IMAGE");
            setFormKey((k) => k + 1);
          });
        }}
        className="mt-5 grid gap-3 rounded-2xl border border-dashed border-ink/15 bg-paper-soft p-4 sm:grid-cols-2"
      >
        <input name="title" placeholder="Title" required className="input" />
        <select name="type" value={type} onChange={(e) => setType(e.target.value)} className="input">
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <div className="sm:col-span-2">
          <FileUpload
            key={`media-${formKey}`}
            name="mediaUrl"
            label="Media — upload an image or video from your computer"
            accept="both"
            aspect="video"
            onUploaded={({ kind }) => setType(kind === "video" ? "VIDEO" : "IMAGE")}
          />
        </div>
        <div>
          <FileUpload key={`thumb-${formKey}`} name="thumbnailUrl" label="Thumbnail (optional — for videos)" accept="image" aspect="square" />
        </div>
        <input name="category" placeholder="Category (optional)" className="input self-start" />
        <input name="externalUrl" placeholder="Embed URL — YouTube/Vimeo (optional)" className="input sm:col-span-2" />
        <button type="submit" disabled={pending} className="btn-primary sm:col-span-2">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add portfolio item
        </button>
      </form>
    </div>
  );
}
