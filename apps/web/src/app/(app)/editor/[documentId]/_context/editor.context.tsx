"use client";
import type { DefaultBlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { createContext, useContext } from "react";

export interface EditorContext {
  blueprint: DefaultBlueprintData;
}

const editorContext = createContext<EditorContext | null>(null);

export function EditorContextProvider({
  children,
  ...context
}: EditorContext & {
  children: React.ReactNode;
}) {
  return (
    <editorContext.Provider value={context}>{children}</editorContext.Provider>
  );
}

export function useEditorContext() {
  const ctx = useContext(editorContext);
  if (!ctx) throw new Error("Missing EditorContext");
  return ctx;
}
