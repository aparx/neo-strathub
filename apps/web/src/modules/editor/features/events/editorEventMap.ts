import { CanvasNode, CanvasNodeConfig } from "@repo/canvas";
import { CanvasContext } from "@repo/canvas/src/context/canvasContext";
import { Nullish } from "@repo/utils";

export interface EditorEventObject<TEvent extends EditorEvent> {
  event: TEvent;
  canvas: CanvasContext | Nullish;
  defaultPrevented: boolean;
  propagationStopped: boolean;
  preventDefault(): void;
  stopPropagation(): void;
}

interface EditorEventObjectConstructor {
  new <TPayload extends EditorEvent>(
    event: TPayload,
    canvas: CanvasContext | Nullish,
    defaultPrevented?: boolean,
    propagationStopped?: boolean,
  ): EditorEventObject<TPayload>;
  <TPayload extends EditorEvent>(
    event: TPayload,
    canvas: CanvasContext | Nullish,
    defaultPrevented?: boolean,
    propagationStopped?: boolean,
  ): EditorEventObject<TPayload>;
}

export const EditorEventObject = function <TPayload extends EditorEvent>(
  event: TPayload,
  canvas: CanvasContext | Nullish,
  defaultPrevented: boolean = false,
  propagationStopped: boolean = false,
): EditorEventObject<TPayload> {
  return {
    event,
    canvas,
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
  canvasDelete: EditorEvent;
  canvasDuplicate: EditorEvent;
  canvasCreate: EditorCreateEvent;
  canvasUpdate: EditorUpdateEvent;
}

export type EditorEventType = keyof EditorEventMap;

// Individual Events

export type EditorEventOrigin = "self" | "foreign";

export interface EditorEvent {
  /** Array of object identifiers that define the event's targets */
  targets: string[];
  /** The origin that invoked this event */
  origin: EditorEventOrigin;
}

export interface EditorMoveEvent extends EditorEvent {
  deltaX: number;
  deltaY: number;
  /** If true, should not be committed to database directly */
  transaction?: boolean;
}

export interface EditorCreateEvent extends EditorEvent {
  node: CanvasNode;
  /** If true, should not be committed to database directly */
  transaction?: boolean;
}

export interface EditorUpdateEvent<
  TConfig extends CanvasNodeConfig = CanvasNodeConfig,
> extends EditorEvent {
  fields: Record<string, Partial<TConfig>>;
}
