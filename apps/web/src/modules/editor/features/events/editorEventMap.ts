import type {
  BlueprintCharacterData,
  CharacterGadgetSlotData,
} from "@/modules/blueprint/actions";
import { CanvasNode, CanvasNodeConfig } from "@repo/canvas";
import { Layer } from "konva/lib/Layer";
import { KeyboardEvent } from "react";
import { EditorKeyMapTree } from "../keyboard";

export type EditorEventOrigin = "user" | "history" | "foreign";

export interface EditorEventObject<TPayload extends EditorEvent> {
  event: TPayload;
  origin: EditorEventOrigin;
  defaultPrevented: boolean;
  propagationStopped: boolean;
  preventDefault(): void;
  stopPropagation(): void;
}

interface EditorEventObjectConstructor {
  new <TPayload extends EditorEvent>(
    event: TPayload,
    origin?: EditorEventOrigin,
    defaultPrevented?: boolean,
    propagationStopped?: boolean,
  ): EditorEventObject<TPayload>;
  <TPayload extends EditorEvent>(
    event: TPayload,
    origin?: EditorEventOrigin,
    defaultPrevented?: boolean,
    propagationStopped?: boolean,
  ): EditorEventObject<TPayload>;
}

export const EditorEventObject = function <TPayload extends EditorEvent>(
  event: TPayload,
  origin: EditorEventOrigin = "user",
  defaultPrevented: boolean = false,
  propagationStopped: boolean = false,
): EditorEventObject<TPayload> {
  return {
    event,
    origin,
    defaultPrevented,
    propagationStopped,
    preventDefault() {
      defaultPrevented = true;
    },
    stopPropagation() {
      propagationStopped = true;
    },
  };
} as EditorEventObjectConstructor;

// Event Map

export interface BroadcastableEditorEventMap {
  canvasDelete: EditorTargetsEvent;
  canvasDuplicate: EditorTargetsEvent;
  canvasCreate: EditorCreateEvent;
  canvasUpdate: EditorUpdateEvent;
  canvasLayerChange: EditorLayerChangeEvent;
  updateCharacter: EditorUpdateCharacter;
  updateGadget: EditorUpdateGadget;
}

export interface EditorEventMap extends BroadcastableEditorEventMap {
  canvasMove: EditorMoveEvent;
  canvasDrop: EditorCreateEvent;
  editorUndo: EditorEvent;
  editorRedo: EditorEvent;
  keyPress: EditorKeyEvent;
  keyRelease: EditorKeyEvent;
}

export type EditorEventType = keyof EditorEventMap;

// Individual Events

export interface EditorEvent {
  /** If true, will ensure to NOT be pushed to local user history */
  ignoreHistory?: boolean;
}

export interface EditorKeyEvent extends KeyboardEvent, EditorEvent {
  keyMap: EditorKeyMapTree;
}

export interface EditorTargetsEvent extends EditorEvent {
  /** Array of object identifiers that define the event's targets */
  targets: string[];
}

export interface EditorMoveEvent extends EditorTargetsEvent {
  deltaX: number;
  deltaY: number;
  /** If true, should not be committed to database directly */
  transaction?: boolean;
}

export interface EditorCreateEvent extends EditorEvent {
  nodes: CanvasNode[];
  levelId: number;
  stageId: number;
}

export interface EditorUpdateEvent<
  TConfig extends CanvasNodeConfig = CanvasNodeConfig,
> extends EditorEvent {
  fields: Record<string, Partial<TConfig>>;
}

export type EditorUpdateCharacter = EditorEvent &
  Partial<BlueprintCharacterData> & {
    id: BlueprintCharacterData["id"];
  };

export type EditorUpdateGadget = EditorEvent & CharacterGadgetSlotData;

export interface EditorLayerChangeEvent extends EditorEvent {
  node: CanvasNode;
  from: Layer;
  to: Layer;
}
