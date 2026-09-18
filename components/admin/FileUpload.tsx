"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Loader2, Link2, Film } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  name: string; // hidden input name submitted with the form
  label?: string;
  initialUrl?: string | null;
  accept?: "image" | "video" | "both";
  aspect?: "square" | "video" | "wide";
  onUploaded?: (info: { url: string; kind: "image" | "video" }) => void;
};

const ACCEPT_ATTR = {
  image: "image/*",
  video: "video/*",
  both: "image/*,video/*",
};

export function FileUpload({
  name,
  label,
  initialUrl,
  accept = "image",
  aspect = "square",
  onUploaded,
}: Props) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [kind, setKind] = useState<"image" | "video">(
    initialUrl && /\.(mp4|webm|mov)(\?|$)/i.test(initialUrl) ? "video" : "image"
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showLink, setShowLink] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUrl(data.url);
      setKind(data.kind);
      onUploaded?.({ url: data.url, kind: data.kind });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const aspectCls =
    aspect === "square" ? "aspect-square" : aspect === "video" ? "aspect-video" : "aspect-[3/1]";

  return (
    <div>
      {label && <span className="label">{label}</span>}
      <input type="hidden" name={name} value={url} />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-ink/15 bg-paper-soft transition hover:border-brand-400",
          aspectCls
        )}
      >
        {url ? (
          <>
            {kind === "video" ? (
              <video src={url} className="h-full w-full object-cover" muted playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="preview" className="h-full w-full object-cover" />
            )}
            {kind === "video" && (
              <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                <Film className="h-3 w-3" /> VIDEO
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setUrl("");
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow hover:bg-white"
              aria-label="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-ink/50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
                <span className="text-sm">Uploading…</span>
              </>
            ) : (
              <>
                <UploadCloud className="h-7 w-7" />
                <span className="text-sm font-medium">
                  {accept === "video" ? "Upload a video" : accept === "both" ? "Upload image or video" : "Upload an image"}
                </span>
                <span className="text-xs text-ink/40">Click or drag & drop — from your computer</span>
              </>
            )}
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR[accept]}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>

      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}

      {/* Optional: paste a link instead */}
      <button
        type="button"
        onClick={() => setShowLink((v) => !v)}
        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-ink/50 hover:text-ink"
      >
        <Link2 className="h-3.5 w-3.5" /> {showLink ? "Hide link field" : "…or paste a link"}
      </button>
      {showLink && (
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setKind(/\.(mp4|webm|mov)(\?|$)/i.test(e.target.value) ? "video" : "image");
          }}
          placeholder="https://…"
          className="input mt-1.5"
        />
      )}
    </div>
  );
}
