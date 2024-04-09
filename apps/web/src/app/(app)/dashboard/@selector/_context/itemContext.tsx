"use client";

import { SharedState, useSharedState } from "@repo/utils/react";
import { createContext, useContext, useEffect, useMemo } from "react";
import type { ListItemData } from "../_components/listItem";

export interface ItemContext {
  items: ReadonlyArray<Readonly<ListItemData>>;
  filter: SharedState<string | undefined>;
}

const itemContext = createContext<ItemContext | null>(null);

export function ItemContextProvider({
  children,
  elements,
}: {
  elements: ItemContext["items"];
  children: React.ReactNode;
}) {
  const filter = useSharedState<string | undefined>();

  // Reset the filter when the reference of elements themselves change
  useEffect(() => filter.update(undefined), [elements]);

  // Filter the elements whenever the elements' reference or the filter changes
  const items = useMemo(() => {
    const { state } = filter;
    if (!state) return elements;
    const needle = state.toLowerCase();
    return elements.filter(({ text }) => text.toLowerCase().includes(needle));
  }, [filter, elements]);

  return (
    <itemContext.Provider value={{ items, filter }}>
      {children}
    </itemContext.Provider>
  );
}

export function useItemContext() {
  const context = useContext(itemContext);
  if (!context) throw new Error("Missing ItemContextProvider");
  return context;
}
