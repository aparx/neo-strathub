import { MultiMap } from "@/utils/generic/multiMap";
import { CanvasNode } from "@repo/canvas";
import {
  createDeleteCommand,
  EditorDeleteCommand,
} from "../../features/command/commands/deleteCommand";
import { EditorEventOrigin } from "../../features/events";
import { useBatch } from "./useBatch";

export function usePushDelete({
  stageId,
  userPush,
  commitToDb,
}: {
  stageId: number;
  userPush: (command: EditorDeleteCommand<CanvasNode>) => any;
  commitToDb: (nodes: string[]) => any;
}) {
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
        nodes && userPush(createDeleteCommand(nodes, level, stageId));
      });
      nodesToDb.forEach((nodes) => {
        nodes && commitToDb(nodes);
      });
    },
  });
}
