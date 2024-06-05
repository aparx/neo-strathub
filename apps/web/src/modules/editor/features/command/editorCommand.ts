import { Nullish } from "@repo/utils";
import { EditorEventMap, EditorEventType } from "../events";

export interface EditorCommand<
  TName extends string = string,
  TEvent extends EditorEventType = any,
  TNegate extends EditorCommand = EditorCommand<string, any, any>,
> {
  readonly name: TName;
  readonly eventType: TEvent;
  readonly payload: EditorEventMap[TEvent];

  /** Negates this command into another command */
  negate(): Promise<TNegate> | Nullish;
}

/** Helper function to type safely allocate a new command */
export function createCommand<
  const TName extends string,
  const TEvent extends EditorEventType,
  const TNegate extends EditorCommand,
  TData,
>(constructor: EditorCommand<TName, TEvent, TNegate>) {
  return constructor;
}
