"use client";

import { DeepReadonly } from "@repo/utils";
import { SharedState, useSharedState } from "@repo/utils/react";
import { createContext, useContext, useEffect, useMemo } from "react";
import type { ListItemData } from "../_components/listItem";

export interface ItemContext {
  items: DeepReadonly<ListItemData[]>;
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

  // Filter the elements after the filter provided
  const items = useMemo(() => {
    if (!filter.state) return elements;
    const needle = filter.state!.toLowerCase();
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
