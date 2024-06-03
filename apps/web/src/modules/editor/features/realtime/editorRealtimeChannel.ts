import {
  RealtimeChannel,
  RealtimeChannelSendResponse,
} from "@supabase/supabase-js";
import { useCallback, useEffect, useRef } from "react";
import { EditorEventMap, EditorEventType } from "../events";

export type EditorRealtimeEventType = EditorEventType | AnyEvent;
export type EditorRealtimeEventMap = EditorEventMap;

export const ANY_EVENT_TYPE = "*";
type AnyEvent = typeof ANY_EVENT_TYPE;

type EditorRealtimeListener<T extends EditorRealtimeEventType> =
  _RealEditorRealtimeListener<T extends AnyEvent ? EditorEventType : T>;

type _RealEditorRealtimeListener<
  TType extends Exclude<EditorRealtimeEventType, AnyEvent>,
> = (payload: EditorRealtimeEventMap[TType], type: TType) => any;

export interface EditorRealtimeChannelContract {
  channel(): RealtimeChannel | undefined;

  initialize(channel: RealtimeChannel): void;

  register<const TType extends EditorRealtimeEventType>(
    type: TType,
    handler: EditorRealtimeListener<TType>,
  ): () => boolean;

  broadcast<const TType extends Exclude<EditorRealtimeEventType, AnyEvent>>(
    type: TType,
    payload: EditorRealtimeEventMap[TType],
  ): Promise<RealtimeChannelSendResponse>;

  clear(): void;
}

export class EditorRealtimeChannel implements EditorRealtimeChannelContract {
  private _channel: RealtimeChannel | undefined;
  private _listeners = new Map<string, Set<EditorRealtimeListener<any>>>();

  channel(): RealtimeChannel | undefined {
    return this._channel;
  }

  register<const TType extends EditorRealtimeEventType>(
    type: TType,
    handler: EditorRealtimeListener<TType>,
  ): () => boolean {
    const newSet = this._listeners.get(type) ?? new Set();
    newSet.add(handler);
    this._listeners.set(type, newSet);
    return () => newSet.delete(handler);
  }

  initialize(channel: RealtimeChannel): void {
    this._channel = channel.on("broadcast", { event: "*" }, (data) => {
      if (!("payload" in data)) return;
      const globals = this._listeners.get(ANY_EVENT_TYPE);
      const locals = this._listeners.get(data.event);
      globals?.forEach((callbackFn) => callbackFn(data.payload, data.event));
      locals?.forEach((callbackFn) => callbackFn(data.payload, data.event));
    });
  }

  broadcast<const TType extends Exclude<EditorRealtimeEventType, AnyEvent>>(
    type: TType,
    payload: EditorRealtimeEventMap[TType],
  ): Promise<RealtimeChannelSendResponse> {
    const channel = this.channel();
    if (!channel) return Promise.reject("Channel not initialized");
    return channel.send({ type: "broadcast", event: type, payload });
  }

  clear(): void {
    this._listeners.clear();
  }
}

/**
 * Subscribes to `channel`, more specifically to the event `type`.
 *
 * @param type the type of event that should be subscribed to
 * @param callback the callback, being the listener's callback
 */
export function useSubscribeRealtimeEditor<
  const TType extends EditorRealtimeEventType,
>(
  channel: EditorRealtimeChannelContract,
  type: TType,
  callback: EditorRealtimeListener<TType>,
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const invoke = useCallback<typeof callback>((...args) => {
    return callbackRef.current?.(...args);
  }, []);
  useEffect(() => {
    const unsubscribe = channel.register(type, invoke);
    return () => {
      unsubscribe();
    };
  }, [type, invoke]);
}
