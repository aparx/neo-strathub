import { MultiMap } from "@/utils/generic/multiMap";
import { CanvasNode } from "@repo/canvas";
import { upsertNodes } from "../../actions";
import { EditorCommand } from "../../features/command";
import { createCreateCommand } from "../../features/command/commands/createCommand";
import { EditorEventOrigin } from "../../features/events";
import { useBatch } from "./useBatch";

export function usePushInsert(
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
      const nodesToDb = new MultiMap<number, CanvasNode>();
      data.forEach((data) => {
        if (data.origin === "user") nodesByUser.push(data.level, data.node);
        nodesToDb.push(data.level, data.node);
      });
      nodesByUser.forEach((nodes, level) => {
        nodes && send(createCreateCommand(nodes, level, stageId));
      });
      nodesToDb.forEach((nodes, level) => {
        nodes && upsertNodes(nodes, level, stageId);
      });
    },
  });
}
