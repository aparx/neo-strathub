"use client";

import { SharedState, useSharedState } from "@repo/utils/hooks";
import { createContext, useContext, useMemo } from "react";
import type { ListItemData } from "../_components/listItem";

export interface ItemContext {
  items: ReadonlyArray<Readonly<ListItemData>>;
  filter: SharedState<string | undefined>;
  active: SharedState<ListItemData["href"] | undefined>;
  /** True if the items are re-fetched or initially fetched */
  fetching?: boolean;
}

const itemContext = createContext<ItemContext | null>(null);

export function ItemContextProvider({
  children,
  elements,
  fetching,
}: {
  children: React.ReactNode;
  elements: ItemContext["items"];
  fetching: ItemContext["fetching"];
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
    <itemContext.Provider value={{ items, filter, fetching, active }}>
      {children}
    </itemContext.Provider>
  );
}

export function useItemContext() {
  const context = useContext(itemContext);
  if (!context) throw new Error("Missing ItemContextProvider");
  return context;
}
