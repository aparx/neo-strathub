"use client";
import {
  ItemContext,
  ItemContextProvider,
} from "@/app/(app)/dashboard/@selector/_context";
import { useMemo } from "react";
import { MdPeople } from "react-icons/md";

export function SelectorProvider({ children }: { children: React.ReactNode }) {
  // TODO useQuery that refetches and invalidates initial data on URL change
  // TODO actually cache, re-cache & translate input into items
  const elements: ItemContext["items"] = useMemo(
    () => [
      { icon: <MdPeople />, text: "Lorem Ipsum 1", href: "/abc" },
      { icon: <MdPeople />, text: "Lorem Ipsum 2", href: "/abc" },
      { icon: <MdPeople />, text: "Lorem Ipsum 3", href: "/abc" },
      { icon: <MdPeople />, text: "Lorem Ipsum 4", href: "/abc" },
    ],
    [],
  );

  return (
    <ItemContextProvider elements={elements}>{children}</ItemContextProvider>
  );
}
