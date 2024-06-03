import { Nullish } from "@repo/utils";
import { EditorEventMap, EditorEventType } from "../events";

export interface EditorCommand<
  TName extends string = string,
  TEvent extends EditorEventType = any,
  TNegate extends EditorCommand = EditorCommand<string, any, any>,
  TData = any,
> {
  readonly name: TName;
  readonly eventType: TEvent;
  readonly data: TData;

  /** Turns this command into an editor event, that can be used locally */
  createEvent(): EditorEventMap[TEvent];

  /** Negates this command into another command */
  negate(): TNegate | Nullish;
}

/** Helper function to type safely allocate a new command */
export function createCommand<
  const TName extends string,
  const TEvent extends EditorEventType,
  const TNegate extends EditorCommand,
  TData extends object,
>(constructor: EditorCommand<TName, TEvent, TNegate, TData>) {
  return constructor;
}