import { CanvasNode } from "@repo/canvas";
import { createCommand, EditorCommand } from "../editorCommand";
import { createDeleteCommand, EditorDeleteCommand } from "./deleteCommand";

export type EditorCreateCommand<TNode extends CanvasNode> = EditorCommand<
  "create",
  "canvasCreate",
  EditorDeleteCommand<TNode>,
  undefined
>;

export function createCreateCommand<TNode extends CanvasNode>(
  nodes: TNode[],
  levelId: number,
  stageId: number,
): EditorCreateCommand<TNode> {
  return createCommand({
    name: "create",
    data: undefined,
    eventType: "canvasCreate",
    createEvent: () => ({ nodes, levelId, stageId }),
    negate: () => createDeleteCommand(nodes, levelId, stageId),
  });
}
