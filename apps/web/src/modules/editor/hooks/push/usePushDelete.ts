import { createMultiMap } from "@/utils/generic/multiMap";
import { CanvasNode } from "@repo/canvas";
import { useCallback } from "react";
import { deleteNodes } from "../../actions";
import { createDeleteCommand } from "../../features/command/commands/deleteCommand";
import { EditorEventOrigin } from "../../features/events";
import { useBatch } from "../useBatch";
import { usePushCommand } from "./usePushCommand";

export function usePushDelete(stageId: number) {
  const pushCommand = usePushCommand();

  return useBatch<{
    origin: EditorEventOrigin;
    node: CanvasNode;
    level: number;
  }>({
    commit: useCallback(
      async (data) => {
        const nodesByUser = createMultiMap<number, CanvasNode>();
        const nodesToDb = createMultiMap<number, string>();

        data.forEach((data) => {
          if (data.origin === "user") nodesByUser.push(data.level, data.node);
          nodesToDb.push(data.level, data.node.attrs.id);
        });

        nodesByUser.forEach((level, nodes) => {
          nodes && pushCommand(createDeleteCommand(nodes, level, stageId));
        });
        nodesToDb.forEach((_, nodes) => {
          nodes && deleteNodes(nodes);
        });
      },
      [stageId, pushCommand],
    ),
  });
}
