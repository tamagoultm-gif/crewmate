import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
};

const SIZES = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };

/** Server-safe star rating with partial fill via clip. */
export function RatingStars({ value, count, size = "md", showValue = true, className }: Props) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const star = SIZES[size];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="relative inline-flex" aria-label={`Rated ${value} out of 5`}>
        <div className="flex text-ink/15">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className={cn(star, "fill-current")} />
          ))}
        </div>
        <div className="absolute inset-0 flex overflow-hidden text-amber-400" style={{ width: `${pct}%` }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className={cn(star, "shrink-0 fill-current")} />
          ))}
        </div>
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-ink">{value.toFixed(1)}</span>
      )}
      {typeof count === "number" && (
        <span className="text-xs text-ink/50">
          ({count} review{count === 1 ? "" : "s"})
        </span>
      )}
    </div>
  );
}
