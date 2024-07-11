"use client";
import {
  BlueprintCharacterData,
  CharacterGadgetSlotData,
  PlayerSlotData,
} from "@/modules/blueprint/actions";
import type { BlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { BlueprintStageData } from "@/modules/blueprint/actions/getBlueprintStages";
import {
  CommandHistory,
  EditorCommand,
} from "@/modules/editor/features/command";
import { useEditorEvent } from "@/modules/editor/features/events/hooks";
import {
  EditorRealtimeChannel,
  EditorRealtimeChannelContract,
} from "@/modules/editor/features/realtime";
import { useEditorLocalStorage } from "@/modules/editor/hooks";
import { GameObjectData, useGetGameObjects } from "@/modules/gameObject/hooks";
import { createClient } from "@/utils/supabase/client";
import { CanvasNode } from "@repo/canvas";
import { CanvasContextInteractStatus } from "@repo/canvas/context";
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
import { useDebouncedCallback } from "use-debounce";
import { EditorConfig } from "../_utils";
import { TeamMemberData } from "../actions";

export interface EditorCharacterData extends BlueprintCharacterData {
  gadgets: Record<number, CharacterGadgetSlotData>;
}

export interface EditorContextServer extends CanvasContextInteractStatus {
  mode?: "edit" | "preview" | undefined;
  blueprint: BlueprintData;
  slots: EditorSlotsData;
  characters: EditorCharactersData;
  member: TeamMemberData | null;
  stages: BlueprintStageData[];
}

export interface EditorContext
  extends CanvasContextInteractStatus,
    EditorContextServer {
  channel: EditorRealtimeChannelContract;
  objectCache: Record<number, GameObjectData>;
  focusedLevel: Nullish<{
    levelId: number;
    stageId: number;
  }>;
  /** Currently dragged node (used for drag'n'drop) */
  dragged: CanvasNode | Nullish;
  history: CommandHistory<EditorCommand>;
  scale: number;
  updateScale: (arg: (oldScale: number) => number) => void;
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
  const storage = useEditorLocalStorage();
  const channel = useMemo(() => new EditorRealtimeChannel(), []);
  const saveZoom = useDebouncedCallback(storage.scale.save, 100);

  const context = useSharedState<EditorContext>(() => ({
    channel,
    focusedLevel: undefined,
    dragged: undefined,
    objectCache: {},
    history: new CommandHistory(15),
    blueprint,
    scale: storage.scale.value,
    updateScale: (mapper) => {
      context.update((old) => {
        const newScale = Math.max(
          Math.min(mapper(old.scale), EditorConfig.MAX_ZOOM_SCALE),
          EditorConfig.MIN_ZOOM_SCALE,
        );
        if (old.scale === newScale) return old;
        saveZoom(newScale);
        return { ...old, scale: newScale };
      });
    },
    ...restContext,
  }));

  useEffect(() => {
    context.state.updateScale(() => storage.scale.value);
  }, [storage.scale.value]);

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

export function useEditorContext(): [
  state: EditorContext,
  update: Dispatch<SetStateAction<EditorContext>>,
] {
  const ctx = useContext(editorContext);
  if (!ctx) throw new Error("Missing EditorContext");
  return [ctx.state, ctx.update] as const;
}
