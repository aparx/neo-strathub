"use client";
import { EditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { createContext, useContext } from "react";
import { EventHandlerContext } from "../../features/events";

export interface OverlayItemContext {
  handler: EventHandlerContext;
  editor: EditorContext;
}

const context = createContext<OverlayItemContext | null>(null);

export function ContextProvider({
  children,
  ...restProps
}: OverlayItemContext & {
  children: React.ReactNode;
}) {
  return <context.Provider value={restProps}>{children}</context.Provider>;
}

export function useOverlayItemContext() {
  const ctx = useContext(context);
  if (!ctx) throw new Error("Missing OverlayItemContext");
  return ctx;
}
