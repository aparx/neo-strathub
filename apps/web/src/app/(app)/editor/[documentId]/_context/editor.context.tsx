"use client";
import { EditorRealtimeChannel } from "@/app/(app)/editor/[documentId]/_realtime/editorRealtimeChannel";
import type { DefaultBlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { createClient } from "@/utils/supabase/client";
import { createContext, useContext, useEffect, useMemo } from "react";

export interface EditorContext {
  blueprint: DefaultBlueprintData;
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
    const realtimeChannel = createClient().channel(`bp_${blueprint.id}`, {
      config: { broadcast: { self: true } },
    });
    channel.updateChannel(realtimeChannel);
    realtimeChannel.subscribe();
    return () => channel.clear();
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
