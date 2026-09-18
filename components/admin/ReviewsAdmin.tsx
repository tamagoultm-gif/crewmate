"use client";

import { useRef, useState, useTransition } from "react";
import { Star, Trash2, Eye, EyeOff, Plus, Loader2 } from "lucide-react";
import { addReview, toggleReviewPublished, deleteReview } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";

type Review = {
  id: string;
  authorName: string;
  authorRole: string | null;
  rating: number;
  comment: string | null;
  published: boolean;
  createdAt: Date;
  creator: { displayName: string };
};
type CreatorOpt = { id: string; displayName: string };

export function ReviewsAdmin({ reviews, creators }: { reviews: Review[]; creators: CreatorOpt[] }) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [rating, setRating] = useState(5);
  const [creatorId, setCreatorId] = useState(creators[0]?.id ?? "");
  const [busyId, setBusyId] = useState<string | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {/* List */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="card p-8 text-center text-sm text-ink/50">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{r.authorName}</p>
                    <span className="inline-flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-current" : "text-ink/15"}`} />
                      ))}
                    </span>
                    {!r.published && <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-500">Hidden</span>}
                  </div>
                  <p className="text-xs text-ink/50">
                    {r.creator.displayName} · {r.authorRole || "Client"} · {formatDate(r.createdAt)}
                  </p>
                  {r.comment && <p className="mt-1.5 text-sm text-ink/70">{r.comment}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => {
                      setBusyId(r.id);
                      startTransition(async () => {
                        await toggleReviewPublished(r.id, !r.published);
                        toast(r.published ? "Review hidden" : "Review published", "success");
                        setBusyId(null);
                      });
                    }}
                    className="rounded-lg p-2 text-ink/50 hover:bg-ink/5 hover:text-ink"
                    title={r.published ? "Hide" : "Publish"}
                  >
                    {busyId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : r.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() =>
                      startTransition(async () => {
                        await deleteReview(r.id);
                        toast("Review deleted", "success");
                      })
                    }
                    className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add form */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <form
          ref={formRef}
          action={(fd) =>
            startTransition(async () => {
              await addReview(creatorId, fd);
              toast("Review added — rating recomputed", "success");
              formRef.current?.reset();
              setRating(5);
            })
          }
          className="card space-y-3 p-5"
        >
          <h3 className="font-semibold">Add a review</h3>
          <div>
            <label className="label">Creator</label>
            <select value={creatorId} onChange={(e) => setCreatorId(e.target.value)} className="input">
              {creators.map((c) => (
                <option key={c.id} value={c.id}>{c.displayName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Author name</label>
            <input name="authorName" required className="input" placeholder="Client name" />
          </div>
          <div>
            <label className="label">Author role</label>
            <input name="authorRole" className="input" placeholder="e.g. Brand manager" />
          </div>
          <div>
            <label className="label">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setRating(n)}
                  className="p-0.5"
                >
                  <Star className={`h-6 w-6 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-ink/20"}`} />
                </button>
              ))}
            </div>
            <input type="hidden" name="rating" value={rating} />
          </div>
          <div>
            <label className="label">Comment</label>
            <textarea name="comment" rows={3} className="input resize-y" placeholder="What did they say?" />
          </div>
          <button type="submit" disabled={pending || !creatorId} className="btn-primary w-full justify-center">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add review
          </button>
        </form>
      </div>
    </div>
  );
}
