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
import { GameObjectData } from "@/modules/gameObject/hooks";
import { createClient } from "@/utils/supabase/client";
import { CanvasNode } from "@repo/canvas";
import { CanvasContextInteractStatus } from "@repo/canvas/src/context/canvasContext";
import { Nullish } from "@repo/utils";
import { SharedState, useSharedState } from "@repo/utils/hooks";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";

export interface EditorCharacterData extends BlueprintCharacterData {
  gadgets: Record<number, CharacterGadgetSlotData>;
}

export interface EditorContextServer extends CanvasContextInteractStatus {
  blueprint: BlueprintData;
  slots: EditorSlotsData;
  characters: EditorCharactersData;
}

export interface EditorContext
  extends CanvasContextInteractStatus,
    EditorContextServer {
  channel: EditorRealtimeChannelContract;
  objectCache: Partial<Record<string, Record<number, GameObjectData>>>;
  focusedLevel: number | Nullish;
  /** Currently dragged node (used for drag'n'drop) */
  dragged: CanvasNode | Nullish;
}

type EditorSlotsData = Record<number, PlayerSlotData>;
type EditorCharactersData = Record<number, EditorCharacterData>;

export type EditorContextState = SharedState<EditorContext>;

const editorContext = createContext<EditorContextState | null>(null);

export function EditorContextProvider({
  children,
  ...restContext
}: EditorContextServer & {
  children: React.ReactNode;
}) {
  const channel = useMemo(() => new EditorRealtimeChannel(), []);

  const context = useSharedState<EditorContext>({
    channel,
    focusedLevel: undefined,
    dragged: undefined,
    objectCache: {},
    ...restContext,
  });

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

  useEditorEvent("updateCharacter", (e) => {
    // Locally update the character state (possibly reflected on the canvas)
    context.update((oldContext) => {
      const characters = oldContext.characters;
      if (!(e.event.id in characters)) return oldContext;
      const newMap = { ...characters };
      newMap[e.event.id] = { ...characters[e.event.id]!, ...e.event };
      return { ...oldContext, characters: newMap };
    });
  });

  useEditorEvent("updateGadget", (e) => {
    // Locally update the gadget state (possibly reflected on the canvas)
    context.update((oldContext) => {
      const characters = oldContext.characters;
      if (!(e.event.id in characters)) return oldContext;
      const newMap = { ...characters };
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
      return { ...oldContext, characters: newMap };
    });
  });

  return (
    <editorContext.Provider value={context}>{children}</editorContext.Provider>
  );
}

export type UseEditorResult = readonly [
  state: EditorContext,
  update: Dispatch<SetStateAction<EditorContext>>,
];

export function useEditor(): UseEditorResult {
  const ctx = useContext(editorContext);
  if (!ctx) throw new Error("Missing EditorContext");
  return [ctx.state, ctx.update] as const;
}
