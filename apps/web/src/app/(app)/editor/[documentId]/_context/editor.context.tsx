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
import { GameObjectData, useGetGameObjects } from "@/modules/gameObject/hooks";
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
import { TeamMemberData } from "../actions";

export interface EditorCharacterData extends BlueprintCharacterData {
  gadgets: Record<number, CharacterGadgetSlotData>;
}

export interface EditorContextServer extends CanvasContextInteractStatus {
  blueprint: BlueprintData;
  slots: EditorSlotsData;
  characters: EditorCharactersData;
  member: TeamMemberData | null;
}

export interface EditorContext
  extends CanvasContextInteractStatus,
    EditorContextServer {
  channel: EditorRealtimeChannelContract;
  objectCache: Record<number, GameObjectData>;
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
  blueprint,
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
    blueprint,
    ...restContext,
  });

  // Setup a channel immediately
  useEffect(() => {
    const realtimeChannel = createClient().channel(`bp_${blueprint.id}`);
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
      const newCharacterMap = { ...characters };
      newCharacterMap[e.event.id] = { ...characters[e.event.id]!, ...e.event };
      return { ...oldContext, characters: newCharacterMap };
    });
  });

  useEditorEvent("updateGadget", (e) => {
    // Locally update the gadget state (possibly reflected on the canvas)
    context.update((oldContext) => {
      const characters = oldContext.characters;
      const character = characters[e.event.character_id];
      if (!character) return oldContext;
      const gadget = character?.gadgets[e.event.id];
      const newCharacterMap = { ...characters };
      const oldGadgetMap = newCharacterMap[character.id]?.gadgets;
      if (!oldGadgetMap) return oldContext;

      // Create copy of gadget object and point to it through character
      const newGadgetMap = { ...oldGadgetMap };
      newGadgetMap[e.event.id] = { ...gadget, ...e.event };
      character.gadgets = newGadgetMap;
      return { ...oldContext, characters: newCharacterMap };
    });
  });

  const { data } = useGetGameObjects(blueprint.arena.game_id);

  useEffect(() => {
    // Update the context's object cache
    context.update((oldContext) => ({
      ...oldContext,
      objectCache: data ?? {},
    }));
  }, [data]);

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
