import {
  BlueprintCharacterData,
  CharacterGadgetSlotData,
} from "@/modules/blueprint/characters/actions";
import { CanvasNode, CanvasNodeConfig } from "@repo/canvas";

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

export interface EditorEventMap {
  canvasMove: EditorMoveEvent;
  canvasDelete: EditorTargetsEvent;
  canvasDuplicate: EditorTargetsEvent;
  canvasCreate: EditorCreateEvent;
  canvasUpdate: EditorUpdateEvent;
  editorUndo: EditorEvent;
  editorRedo: EditorEvent;
  updateCharacter: EditorUpdateCharacter;
  updateGadget: EditorUpdateGadget;
}

export type EditorEventType = keyof EditorEventMap;

// Individual Events

export interface EditorEvent {}

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

export type EditorUpdateCharacter = EditorEvent & BlueprintCharacterData;

export type EditorUpdateGadget = EditorEvent & CharacterGadgetSlotData;
