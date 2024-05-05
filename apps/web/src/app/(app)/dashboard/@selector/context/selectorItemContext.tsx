"use client";
import { SharedState, useSharedState } from "@repo/utils/hooks";
import { createContext, useContext, useMemo } from "react";
import type { SelectorListItemData } from "../components/selectorListItem";

export interface SelectorItemContext {
  items: ReadonlyArray<Readonly<SelectorListItemData>>;
  filter: SharedState<string | undefined>;
  active: SharedState<SelectorListItemData["href"] | undefined>;
  /** True if the items are re-fetched or initially fetched */
  loading?: boolean;
}

const itemContext = createContext<SelectorItemContext | null>(null);

export function SelectorItemContextProvider({
  children,
  elements,
  loading,
}: {
  children: React.ReactNode;
  elements: SelectorItemContext["items"];
  loading: SelectorItemContext["loading"];
}) {
  const filter = useSharedState<string | undefined>();
  const active = useSharedState<string | undefined>();

  // Filter the elements whenever the elements' reference or the filter changes
  const items = useMemo(() => {
    const { state } = filter;
    if (!state) return elements;
    const needle = state.toLowerCase();
    return elements.filter(({ text }) => text.toLowerCase().includes(needle));
  }, [filter, elements]);

  return (
    <itemContext.Provider value={{ items, filter, loading: loading, active }}>
      {children}
    </itemContext.Provider>
  );
}

export function useItemContext() {
  const context = useContext(itemContext);
  if (!context) throw new Error("Missing ItemContextProvider");
  return context;
}
