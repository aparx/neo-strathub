import { CanvasNode } from "@repo/canvas";
import { createCommand, EditorCommand } from "../editorCommand";
import { createCreateCommand } from "./createCommand";

export type EditorDeleteCommand<TNode extends CanvasNode> = EditorCommand<
  "delete",
  "canvasDelete",
  any
>;

export function createDeleteCommand<TNode extends CanvasNode>(
  nodes: TNode[],
  levelId: number,
  stageId: number,
): EditorDeleteCommand<TNode> {
  return createCommand({
    name: "delete",
    eventType: "canvasDelete",
    payload: { targets: nodes.map((node) => node.attrs.id) },
    negate: async () => createCreateCommand(nodes, levelId, stageId),
  });
}
