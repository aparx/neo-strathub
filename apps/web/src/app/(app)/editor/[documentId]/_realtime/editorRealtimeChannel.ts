import { BlueprintCharacterData } from "@/modules/blueprint/characters/actions";
import {
  RealtimeChannel,
  RealtimeChannelSendResponse,
} from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

export interface EditorRealtimeEvents {
  updateCharacter: BlueprintCharacterData;
}

export type EditorRealtimeEventType = keyof EditorRealtimeEvents;

type EditorRealtimeEventHandler<TType extends EditorRealtimeEventType> = (
  payload: EditorRealtimeEvents[TType],
) => any;

type EditorRealtimeListenerMap = {
  [T in EditorRealtimeEventType]?: Map<string, EditorRealtimeEventHandler<T>>;
};

export class EditorRealtimeChannel {
  private _listeners: EditorRealtimeListenerMap = {};
  private _channel: RealtimeChannel | undefined;
  private _populators: Array<
    (channel: this) => EditorRealtimeEventHandler<any>
  > = [];

  channel(): RealtimeChannel | undefined {
    return this._channel;
  }

  updateChannel(channel: RealtimeChannel) {
    this._channel = channel;
    channel.on("broadcast", { event: "*" }, (data) => {
      if (!this._contains(data.event)) return;
      const handlers = this._listeners[data.event];
      if (!handlers?.size || !("payload" in data)) return;
      for (const listener of handlers?.values()) {
        listener(data.payload as any);
      }
    });
  }

  register<const TType extends EditorRealtimeEventType>(
    type: TType,
    handler: EditorRealtimeEventHandler<TType>,
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

  private _contains(event: string): event is keyof typeof this._listeners {
    return event in this._listeners;
  }
}
