import {
  BlueprintCharacterData,
  CharacterGadgetSlotData,
} from "@/modules/blueprint/characters/actions";
import {
  RealtimeChannel,
  RealtimeChannelSendResponse,
} from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export interface EditorRealtimeEvents {
  updateCharacter: BlueprintCharacterData;
  updateGadget: CharacterGadgetSlotData;
}

export type EditorRealtimeEventType = keyof EditorRealtimeEvents;

type EditorRealtimeListener<
  TType extends EditorRealtimeEventType = EditorRealtimeEventType,
> = (payload: EditorRealtimeEvents[TType]) => any;

type EditorRealtimeInterceptor<
  TType extends EditorRealtimeEventType = EditorRealtimeEventType,
> = (payload: EditorRealtimeEvents[TType]) => EditorRealtimeEvents[TType];

export class EditorRealtimeChannel {
  private _channel: RealtimeChannel | undefined;
  private _listeners: {
    [T in EditorRealtimeEventType]?: Map<string, EditorRealtimeListener<T>>;
  } = {};
  private _interceptors: {
    [T in EditorRealtimeEventType]?: Map<string, EditorRealtimeInterceptor<T>>;
  } = {};

  channel(): RealtimeChannel | undefined {
    return this._channel;
  }

  initialize(channel: RealtimeChannel) {
    this._channel = channel;
    channel.on("broadcast", { event: "*" }, (data) => {
      if (!(data.event in this._listeners)) return;
      const map = this._listeners[data.event as keyof typeof this._listeners];
      if (!map?.size || !("payload" in data)) return;
      for (const listener of map?.values()) {
        listener(data.payload as any);
      }
    });
  }

  register<const TType extends EditorRealtimeEventType>(
    type: TType,
    handler: EditorRealtimeListener<TType>,
  ): () => void {
    const map = this._listeners[type] ?? new Map();
    const uid = uuidv4();
    map.set(uid, handler);
    this._listeners[type] = map;
    return () => this._listeners[type]?.delete(uid);
  }

  intercept<const TType extends EditorRealtimeEventType>(
    type: TType,
    handler: EditorRealtimeInterceptor<TType>,
  ): () => void {
    const map = this._interceptors[type] ?? new Map();
    const uid = uuidv4();
    map.set(uid, handler);
    this._interceptors[type] = map;
    return () => this._interceptors[type]?.delete(uid);
  }

  broadcast<const TType extends EditorRealtimeEventType>(
    type: TType,
    payload: EditorRealtimeEvents[TType],
  ): Promise<RealtimeChannelSendResponse> {
    const channel = this.channel();
    if (!channel) throw new Error("Channel is undefined");
    interception: if (type in this._interceptors) {
      const map = this._interceptors[type];
      if (!map?.size) break interception;
      for (const interceptor of map.values()) {
        payload = interceptor(payload);
      }
    }
    return channel.send({
      type: "broadcast",
      event: type,
      payload,
    });
  }

  clear() {
    Object.keys(this._listeners).forEach((key) => {
      // Clear the soon-to-be "dangling" map references
      this._listeners[key as keyof typeof this._listeners]?.clear();
    });
    Object.keys(this._interceptors).forEach((key) => {
      // Clear the soon-to-be "dangling" map references
      this._interceptors[key as keyof typeof this._interceptors]?.clear();
    });
    this._listeners = {};
  }
}

export function useRealtimeEditorIntercept<
  const TType extends EditorRealtimeEventType,
>(
  channel: EditorRealtimeChannel,
  type: TType,
  callback: EditorRealtimeInterceptor<TType>,
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    return channel.intercept(type, callbackRef.current!);
  }, []);
}

export function useRealtimeEditorHandle<
  const TType extends EditorRealtimeEventType,
>(
  channel: EditorRealtimeChannel,
  type: TType,
  callback: EditorRealtimeListener<TType>,
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    return channel.register(type, callbackRef.current!);
  }, []);
}
