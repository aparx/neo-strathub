import { CanvasContext } from "@repo/canvas/src/context/canvasContext";
import { Nullish } from "@repo/utils";

export interface EditorEventMap {
  canvasMove: EditorMoveEvent;
  canvasDelete: EditorDeleteEvent;
}

export interface EditorEventObject<TEvent> {
  event: TEvent;
  canvas: CanvasContext | Nullish;
  defaultPrevented: boolean;
  propagationStopped: boolean;
  preventDefault(): void;
  stopPropagation(): void;
}

interface EditorEventObjectConstructor {
  new <TPayload>(
    event: TPayload,
    canvas: CanvasContext | Nullish,
    defaultPrevented?: boolean,
    propagationStopped?: boolean,
  ): EditorEventObject<TPayload>;
  <TPayload>(
    event: TPayload,
    canvas: CanvasContext | Nullish,
    defaultPrevented?: boolean,
    propagationStopped?: boolean,
  ): EditorEventObject<TPayload>;
}

export const EditorEventObject = function <TPayload>(
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

export type EditorEventType = keyof EditorEventMap;

// Individual Events

export interface EditorMoveEvent {
  targets: string[];
  deltaX: number;
  deltaY: number;
  /** If true, should not be committed to database directly */
  transaction?: boolean;
}

export interface EditorDeleteEvent {
  targets: string[];
}
