"use client";
import { createContext, useContext, useMemo, useRef } from "react";
import {
  EditorEventMap,
  EditorEventObject,
  EditorEventOrigin,
  EditorEventType,
} from "./editorEventMap";

export interface EventHandlerContext {
  readonly fire: <const TEvent extends EditorEventType>(
    type: TEvent,
    origin: EditorEventOrigin,
    payload: EditorEventMap[TEvent],
  ) => EditorEventObject<EditorEventMap[TEvent]>;

  readonly subscribe: <const TEvent extends EditorEventType>(
    type: TEvent,
    callback: EditorEventCallback<TEvent>,
  ) => EditorEventUnsubscribeFn;

  readonly unsubscribe: <const TEvent extends EditorEventType>(
    type: TEvent,
    callback: EditorEventCallback<TEvent>,
  ) => boolean;
}

export type EditorEventUnsubscribeFn = () => boolean;

export type EditorEventCallback<T extends EditorEventType> = (
  event: EditorEventObject<EditorEventMap[T]>,
) => any;

const eventHandlerContext = createContext<EventHandlerContext | null>(null);

export function useEditorEventHandler() {
  const ctx = useContext(eventHandlerContext);
  if (!ctx) throw new Error("Missing EventHandlerContext");
  return ctx;
}

type EventHandlerListenerMap = {
  [TType in EditorEventType]?: Set<EditorEventCallback<TType>>;
};

export function EditorEventHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const listenersRef = useRef<EventHandlerListenerMap>({});

  const context = useMemo<EventHandlerContext>(
    () => ({
      fire<T extends EditorEventType>(
        type: T,
        origin: EditorEventOrigin,
        payload: EditorEventMap[T],
      ) {
        const eventObject = new EditorEventObject(payload, origin);
        for (const callback of listenersRef.current[type] ?? []) {
          if (eventObject.propagationStopped) break;
          callback(eventObject);
        }
        return eventObject;
      },
      subscribe<T extends EditorEventType>(
        type: T,
        callback: EditorEventCallback<T>,
      ) {
        const set = listenersRef.current[type] ?? new Set();
        set.add(callback);
        listenersRef.current[type] = set as any;
        return () => this.unsubscribe(type, callback);
      },
      unsubscribe(type, callback) {
        return listenersRef.current[type]?.delete(callback) ?? false;
      },
    }),
    [],
  );

  return (
    <eventHandlerContext.Provider value={context}>
      {children}
    </eventHandlerContext.Provider>
  );
}
