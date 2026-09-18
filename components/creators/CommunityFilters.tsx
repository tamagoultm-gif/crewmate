"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Search, SlidersHorizontal, X, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Facets = {
  services: { name: string; slug: string }[];
  cities: string[];
  languages: string[];
  specialties: string[];
};

export function CommunityFilters({ facets, total }: { facets: Facets; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const [isPending, setPending] = useState(false);

  const [q, setQ] = useState(params.get("q") ?? "");
  const [showMore, setShowMore] = useState(false);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      setPending(true);
      startTransition(() => {
        router.push(`${pathname}?${next.toString()}`, { scroll: false });
        setPending(false);
      });
    },
    [params, pathname, router]
  );

  // Debounced search
  useEffect(() => {
    const current = params.get("q") ?? "";
    if (q === current) return;
    const t = setTimeout(() => setParam("q", q || null), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const activeService = params.get("service");
  const activeCity = params.get("city");
  const activeLanguage = params.get("language");
  const activeSpecialty = params.get("specialty");
  const activeRating = params.get("minRating");

  const hasFilters =
    activeService || activeCity || activeLanguage || activeSpecialty || activeRating || params.get("q");

  const clearAll = () => {
    setQ("");
    startTransition(() => router.push(pathname, { scroll: false }));
  };

  return (
    <div className="sticky top-16 z-30 -mx-4 border-y border-ink/[0.06] bg-paper/85 px-4 py-4 backdrop-blur-lg md:top-20 md:mx-0 md:rounded-3xl md:border md:px-5">
      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search creators, skills, services…"
            className="input pl-11"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowMore((v) => !v)}
          className={cn("btn-outline shrink-0", showMore && "border-ink/40 bg-paper-soft")}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Service chips (always visible) */}
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
        <Chip label="All" active={!activeService} onClick={() => setParam("service", null)} />
        {facets.services.map((s) => (
          <Chip
            key={s.slug}
            label={s.name}
            active={activeService === s.slug}
            onClick={() => setParam("service", activeService === s.slug ? null : s.slug)}
          />
        ))}
      </div>

      {/* Expanded filters */}
      {showMore && (
        <div className="mt-4 grid gap-4 border-t border-ink/[0.06] pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="City"
            value={activeCity ?? ""}
            options={facets.cities}
            onChange={(v) => setParam("city", v || null)}
          />
          <Select
            label="Language"
            value={activeLanguage ?? ""}
            options={facets.languages}
            onChange={(v) => setParam("language", v || null)}
          />
          <Select
            label="Specialty"
            value={activeSpecialty ?? ""}
            options={facets.specialties}
            onChange={(v) => setParam("specialty", v || null)}
          />
          <div>
            <span className="label">Minimum rating</span>
            <div className="flex gap-1.5">
              {[4, 4.5, 4.8].map((r) => (
                <button
                  key={r}
                  onClick={() => setParam("minRating", activeRating === String(r) ? null : String(r))}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-3 py-2 text-xs font-medium transition",
                    activeRating === String(r)
                      ? "border-amber-400 bg-amber-50 text-amber-700"
                      : "border-ink/10 bg-paper-card text-ink/60 hover:border-ink/30"
                  )}
                >
                  <Star className="h-3 w-3 fill-current text-amber-400" />
                  {r}+
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-ink/50">
          {isPending ? "Updating…" : `${total} creator${total === 1 ? "" : "s"}`}
        </p>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs font-medium text-brand-600 hover:underline">
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition",
        active
          ? "border-ink bg-night text-white"
          : "border-ink/10 bg-paper-card text-ink/70 hover:border-ink/30"
      )}
    >
      {label}
    </button>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input">
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
