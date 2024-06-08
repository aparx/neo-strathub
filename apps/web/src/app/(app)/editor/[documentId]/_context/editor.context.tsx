"use client";
import {
  BlueprintCharacterData,
  CharacterGadgetSlotData,
  PlayerSlotData,
} from "@/modules/blueprint/actions";
import type { BlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { useEditorEvent } from "@/modules/editor/features/events/hooks";
import {
  EditorRealtimeChannel,
  EditorRealtimeChannelContract,
} from "@/modules/editor/features/realtime";
import { createClient } from "@/utils/supabase/client";
import { CanvasContextInteractStatus } from "@repo/canvas/src/context/canvasContext";
import { SharedState, useSharedState } from "@repo/utils/hooks";
import { createContext, useContext, useEffect, useMemo } from "react";

export interface EditorCharacterData extends BlueprintCharacterData {
  gadgets: Record<number, CharacterGadgetSlotData>;
}

export interface EditorContextServer extends CanvasContextInteractStatus {
  blueprint: BlueprintData;
  slots: EditorSlotsData;
  characters: EditorCharactersData;
}

export interface EditorContext extends CanvasContextInteractStatus {
  channel: EditorRealtimeChannelContract;
  blueprint: EditorContextServer["blueprint"];
  slots: SharedState<EditorContextServer["slots"]>;
  characters: SharedState<EditorContextServer["characters"]>;
}

type EditorSlotsData = Record<number, PlayerSlotData>;
type EditorCharactersData = Record<number, EditorCharacterData>;

const editorContext = createContext<EditorContext | null>(null);

export function EditorContextProvider({
  children,
  slots,
  characters,
  ...restContext
}: EditorContextServer & {
  children: React.ReactNode;
}) {
  const channel = useMemo(() => new EditorRealtimeChannel(), []);

  // Setup a channel immediately
  useEffect(() => {
    const realtimeChannel = createClient().channel(
      `bp_${restContext.blueprint.id}`,
    );
    channel.initialize(realtimeChannel);
    realtimeChannel.subscribe();
    return () => {
      channel.clear();
      // TODO check if following leads to issues on latency
      realtimeChannel.unsubscribe();
    };
  }, []);

  const finalSlots = useSharedState(slots);
  const finalCharacters = useSharedState(characters);

  useEditorEvent("updateCharacter", (e) => {
    // Locally update the character state (possibly reflected on the canvas)
    finalCharacters.update((oldMap) => {
      if (!(e.event.id in oldMap)) return oldMap;
      const newMap = { ...oldMap };
      newMap[e.event.id] = { ...oldMap[e.event.id]!, ...e.event };
      return newMap;
    });
  });

  useEditorEvent("updateGadget", (e) => {
    // Locally update the gadget state (possibly reflected on the canvas)
    finalCharacters.update((oldMap) => {
      const newMap = { ...oldMap };
      Object.values(newMap).forEach((character) => {
        const gadget = character.gadgets[e.event.id];
        if (gadget == null) return;
        const oldGadgets = newMap[character.id]?.gadgets;
        if (!oldGadgets) return;
        // Create copy of gadget object and point to it through character
        const newGadgets = { ...oldGadgets };
        newGadgets[e.event.id] = { ...gadget, ...e.event };
        character.gadgets = newGadgets;
      });
      return newMap;
    });
  });

  return (
    <editorContext.Provider
      value={{
        channel,
        slots: finalSlots,
        characters: finalCharacters,
        ...restContext,
      }}
    >
      {children}
    </editorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(editorContext);
  if (!ctx) throw new Error("Missing EditorContext");
  return ctx;
}
