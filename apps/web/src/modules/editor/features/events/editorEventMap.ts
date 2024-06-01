import { CanvasContext } from "@repo/canvas/src/context/canvasContext";
import { Nullish } from "@repo/utils";

export interface EditorEventMap {
  elementMove: EditorMoveEvent;
}

export interface EditorMoveEvent {
  deltaX: number;
  deltaY: number;
  /**
   * If true, this event is in a transaction and should not be
   * saved to the database yet.
   */
  transaction?: boolean;
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
