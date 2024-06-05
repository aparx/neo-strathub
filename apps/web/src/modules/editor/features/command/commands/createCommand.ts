import { CanvasNode } from "@repo/canvas";
import { createCommand, EditorCommand } from "../editorCommand";
import { createDeleteCommand, EditorDeleteCommand } from "./deleteCommand";

export type EditorCreateCommand<TNode extends CanvasNode> = EditorCommand<
  "create",
  "canvasCreate",
  EditorDeleteCommand<TNode>
>;

export function createCreateCommand<TNode extends CanvasNode>(
  nodes: TNode[],
  levelId: number,
  stageId: number,
): EditorCreateCommand<TNode> {
  return createCommand({
    name: "create",
    eventType: "canvasCreate",
    payload: {
      nodes,
      levelId,
      stageId,
    },
    negate: async () => createDeleteCommand(nodes, levelId, stageId),
  });
}
