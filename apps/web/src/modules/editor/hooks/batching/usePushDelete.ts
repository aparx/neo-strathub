import { MultiMap } from "@/utils/generic/multiMap";
import { CanvasNode } from "@repo/canvas";
import { deleteNodes } from "../../actions";
import { EditorCommand } from "../../features/command";
import { createDeleteCommand } from "../../features/command/commands/deleteCommand";
import { EditorEventOrigin } from "../../features/events";
import { useBatch } from "./useBatch";

export function usePushDelete(
  stageId: number,
  send: (command: EditorCommand) => void,
) {
  return useBatch<{
    origin: EditorEventOrigin;
    node: CanvasNode;
    level: number;
  }>({
    commit: async (data) => {
      const nodesByUser = new MultiMap<number, CanvasNode>();
      const nodesToDb = new MultiMap<number, string>();

      data.forEach((data) => {
        if (data.origin === "user") nodesByUser.push(data.level, data.node);
        nodesToDb.push(data.level, data.node.attrs.id);
      });

      nodesByUser.forEach((nodes, level) => {
        nodes && send(createDeleteCommand(nodes, level, stageId));
      });
      nodesToDb.forEach((nodes) => {
        nodes && deleteNodes(nodes);
      });
    },
  });
}
