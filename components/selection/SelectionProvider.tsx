"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SelectedCreator = {
  id: string;
  slug: string;
  displayName: string;
  avatarUrl?: string | null;
  profession?: string | null;
};

type SelectionCtx = {
  selected: SelectedCreator[];
  count: number;
  isSelected: (id: string) => boolean;
  toggle: (creator: SelectedCreator) => void;
  add: (creator: SelectedCreator) => void;
  remove: (id: string) => void;
  clear: () => void;
  hydrated: boolean;
};

const Ctx = createContext<SelectionCtx | null>(null);
const STORAGE_KEY = "crewmate:selection";

export function useSelection() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSelection must be used within <SelectionProvider>");
  return ctx;
}

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<SelectedCreator[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSelected(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration to avoid clobbering).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch {
      /* ignore */
    }
  }, [selected, hydrated]);

  const isSelected = useCallback(
    (id: string) => selected.some((c) => c.id === id),
    [selected]
  );

  const add = useCallback((creator: SelectedCreator) => {
    setSelected((prev) => (prev.some((c) => c.id === creator.id) ? prev : [...prev, creator]));
  }, []);

  const remove = useCallback((id: string) => {
    setSelected((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const toggle = useCallback((creator: SelectedCreator) => {
    setSelected((prev) =>
      prev.some((c) => c.id === creator.id)
        ? prev.filter((c) => c.id !== creator.id)
        : [...prev, creator]
    );
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const value = useMemo<SelectionCtx>(
    () => ({
      selected,
      count: selected.length,
      isSelected,
      toggle,
      add,
      remove,
      clear,
      hydrated,
    }),
    [selected, isSelected, toggle, add, remove, clear, hydrated]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
