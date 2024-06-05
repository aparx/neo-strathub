import { CanvasNode, CanvasNodeConfig, InferNodeConfig } from "@repo/canvas";
import { EditorCommand, createCommand } from "../editorCommand";

export type EditorUpdateCommand<TNode extends CanvasNode> = EditorCommand<
  "update",
  "canvasUpdate",
  EditorUpdateCommand<TNode>
>;

export async function createUpdateCommand<TNode extends CanvasNode>(
  nodes: [oldNode: TNode, newNode: TNode][],
): Promise<EditorUpdateCommand<TNode>> {
  const fields = {} as Record<string, Partial<InferNodeConfig<TNode>>>;

  // Diff all nodes in parallel (for a significant speed boost)
  await Promise.all(
    nodes.map(async ([old, next]) => {
      fields[next.attrs.id] = diffNodeAttrs(old, next);
    }),
  );

  return createCommand({
    name: "update",
    eventType: "canvasUpdate",
    payload: { fields },
    negate: () => createUpdateCommand(nodes.map(([old, next]) => [next, old])),
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
