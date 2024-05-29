"use client";
import type { BlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { createClient } from "@/utils/supabase/client";
import { createContext, useContext, useEffect, useMemo } from "react";
import { EditorRealtimeChannel } from "@/modules/editor/utils";

export interface EditorContext {
  blueprint: BlueprintData;
  channel: EditorRealtimeChannel;
}

const editorContext = createContext<EditorContext | null>(null);

export function EditorContextProvider({
  blueprint,
  children,
}: Pick<EditorContext, "blueprint"> & {
  children: React.ReactNode;
}) {
  const channel = useMemo(() => new EditorRealtimeChannel(), []);

  // Setup a channel immediately
  useEffect(() => {
    const realtimeChannel = createClient().channel(`bp_${blueprint.id}`);
    channel.initialize(realtimeChannel);
    realtimeChannel.subscribe();
    return () => {
      channel.clear();
      realtimeChannel.unsubscribe(); // TODO <- check if this leads to issues on latency
    };
  }, []);

  return (
    <editorContext.Provider value={{ blueprint, channel }}>
      {children}
    </editorContext.Provider>
  );
}

export function useEditorContext() {
  const ctx = useContext(editorContext);
  if (!ctx) throw new Error("Missing EditorContext");
  return ctx;
}
