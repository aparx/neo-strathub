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
import { EditorEventMap, EditorEventType } from "../features/events";

interface EditorRealtimeEmitEvent<T extends EditorEventType> {
  type: T;
  event: EditorEventMap[T];
}

export interface EditorRealtimeEvents {
  updateCharacter: BlueprintCharacterData;
  updateGadget: CharacterGadgetSlotData;
  emitEvent: EditorRealtimeEmitEvent<EditorEventType>;
}

export type EditorRealtimeEventType = keyof EditorRealtimeEvents;

type EditorRealtimeListener<
  TType extends EditorRealtimeEventType = EditorRealtimeEventType,
> = (payload: EditorRealtimeEvents[TType]) => any;

export class EditorRealtimeChannel {
  private _channel: RealtimeChannel | undefined;
  private _listeners: {
    [T in EditorRealtimeEventType]?: Map<string, EditorRealtimeListener<T>>;
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

  broadcast<const TType extends EditorRealtimeEventType>(
    type: TType,
    payload: EditorRealtimeEvents[TType],
  ): Promise<RealtimeChannelSendResponse> {
    const channel = this.channel();
    if (!channel) throw new Error("Channel is undefined");
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
    this._listeners = {};
  }
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
