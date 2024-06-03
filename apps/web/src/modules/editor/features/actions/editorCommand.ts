import { CanvasNode, CanvasNodeConfig } from "@repo/canvas";
import { DeepReadonly, Nullish } from "@repo/utils";
import { EditorEventMap, EditorEventType } from "../events";

export interface CanvasCommandBatch {}

export interface EditorCommand<
  TEvent extends EditorEventType = any,
  TNegate extends EditorCommand = any,
  TData = any,
> {
  readonly name: string;
  readonly event: TEvent;
  readonly data: DeepReadonly<TData>;

  /** Turns this command into an editor event, that can be used locally */
  createEvent(): EditorEventMap[TEvent];

  /** Negates this command into another command */
  negate(): TNegate | Nullish;
}

export function createCommand<
  const TName extends string,
  const TEvent extends EditorEventType,
  const TNegate extends EditorCommand,
  TData extends object,
>(constructor: {
  readonly name: TName;
  readonly event: TEvent;
  readonly data: DeepReadonly<TData>;
  createEvent: () => EditorEventMap[TEvent];
  negate: () => TNegate | Nullish;
}): EditorCommand<TEvent, TNegate, TData> {
  return constructor;
}

type EditorUpdateCommand = EditorCommand<
  "canvasUpdate",
  EditorUpdateCommand,
  ReturnType<typeof diffNodeAttrs>
>;

export function createUpdateCommand<TNode extends CanvasNode>(
  oldNode: TNode,
  newNode: TNode,
): EditorUpdateCommand {
  const commitData = diffNodeAttrs(oldNode, newNode);
  return createCommand({
    name: "UPDATE",
    event: "canvasUpdate",
    data: commitData,
    createEvent: () => ({
      targets: [newNode.attrs.id],
      fields: { [newNode.attrs.id]: structuredClone(commitData) },
      origin: "self",
    }),
    negate: () => createUpdateCommand(newNode, oldNode),
  });
}

function diffNodeAttrs(oldNode: CanvasNode, newNode: CanvasNode) {
  const diffingData = {} as Partial<CanvasNodeConfig>;
  const oldKeys = Object.keys(oldNode.attrs);
  const newKeys = Object.keys(newNode.attrs);
  const keyRange = newKeys.length >= oldKeys.length ? newKeys : oldKeys;
  keyRange.forEach((keyStr) => {
    const key = keyStr as keyof CanvasNodeConfig;
    const oldVal = oldNode.attrs[key];
    const newVal = newNode.attrs[key];
    if (oldVal !== newVal) diffingData[key] = newVal;
  });
  return diffingData;
}
