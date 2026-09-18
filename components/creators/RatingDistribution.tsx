import { Star } from "lucide-react";

type Review = { rating: number };

export function RatingDistribution({
  reviews,
  avg,
}: {
  reviews: Review[];
  avg: number;
}) {
  const total = reviews.length;
  const buckets = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="text-center sm:pr-6">
        <div className="text-5xl font-black tracking-tight">{avg.toFixed(1)}</div>
        <div className="mt-1 flex justify-center gap-0.5 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < Math.round(avg) ? "fill-current" : "text-ink/15"}`}
            />
          ))}
        </div>
        <p className="mt-1 text-xs text-ink/50">{total} review{total === 1 ? "" : "s"}</p>
      </div>

      <div className="space-y-2">
        {buckets.map((b) => {
          const pct = total ? (b.count / total) * 100 : 0;
          return (
            <div key={b.star} className="flex items-center gap-3">
              <span className="flex w-8 items-center gap-1 text-xs font-medium text-ink/60">
                {b.star} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-6 text-right text-xs text-ink/40">{b.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
