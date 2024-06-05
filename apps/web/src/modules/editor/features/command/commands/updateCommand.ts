import { CanvasNode, CanvasNodeConfig, InferNodeConfig } from "@repo/canvas";
import { EditorCommand, createCommand } from "../editorCommand";

export type EditorUpdateCommand<TNode extends CanvasNode> = EditorCommand<
  "update",
  "canvasUpdate",
  EditorUpdateCommand<TNode>,
  Partial<InferNodeConfig<TNode>>
>;

export function createUpdateCommand<TNode extends CanvasNode>(
  oldNode: TNode,
  newNode: TNode,
): EditorUpdateCommand<TNode> {
  const commitData = diffNodeAttrs(oldNode, newNode);
  return createCommand({
    name: "update",
    data: commitData,
    eventType: "canvasUpdate",
    createEvent: () => ({
      targets: [newNode.attrs.id],
      fields: { [newNode.attrs.id]: structuredClone(commitData) },
    }),
    negate: () => createUpdateCommand(newNode, oldNode),
  });
}

function diffNodeAttrs<
  TNode extends CanvasNode,
  TConfig extends CanvasNodeConfig = InferNodeConfig<TNode>,
>(oldNode: TNode, newNode: TNode) {
  const diffingData = {} as Partial<TConfig>;
  const oldAttrs = oldNode.attrs as TConfig;
  const newAttrs = newNode.attrs as TConfig;
  const oldKeys = Object.keys(oldAttrs);
  const newKeys = Object.keys(newAttrs);
  const keyRange = newKeys.length >= oldKeys.length ? newKeys : oldKeys;
  keyRange.forEach((keyStr) => {
    const key = keyStr as keyof TConfig;
    const oldVal = oldAttrs[key];
    const newVal = newAttrs[key];
    if (!Object.is(oldVal, newVal)) {
      diffingData[key] = newVal;
    }
  });
  return diffingData;
}
