import { CanvasNode } from "@repo/canvas";
import { createCommand, EditorCommand } from "../editorCommand";
import { createCreateCommand } from "./createCommand";

export type EditorDeleteCommand<TNode extends CanvasNode> = EditorCommand<
  "delete",
  "canvasDelete",
  any,
  TNode[]
>;

export function createDeleteCommand<TNode extends CanvasNode>(
  nodes: TNode[],
  levelId: number,
  stageId: number,
): EditorDeleteCommand<TNode> {
  return createCommand({
    name: "delete",
    data: nodes,
    eventType: "canvasDelete",
    createEvent: () => ({ targets: nodes.map((node) => node.attrs.id) }),
    negate: () => createCreateCommand(nodes, levelId, stageId),
  });
}
