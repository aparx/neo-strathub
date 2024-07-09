import { createMultiMap } from "@/utils/generic/multiMap";
import { CanvasNode } from "@repo/canvas";
import { useCallback } from "react";
import { upsertNodes } from "../../actions";
import { createCreateCommand } from "../../features/command/commands/createCommand";
import { EditorEventOrigin } from "../../features/events";
import { useBatch } from "../useBatch";
import { usePushCommand } from "./usePushCommand";

export function usePushInsert(stageId: number) {
  const pushCommand = usePushCommand();

  return useBatch<{
    origin: EditorEventOrigin;
    node: CanvasNode;
    level: number;
  }>({
    commit: useCallback(
      async (data) => {
        const nodesByUser = createMultiMap<number, CanvasNode>();
        const nodesToDb = createMultiMap<number, CanvasNode>();
        data.forEach((data) => {
          if (data.origin === "user") nodesByUser.push(data.level, data.node);
          nodesToDb.push(data.level, data.node);
        });
        nodesByUser.forEach((level, nodes) => {
          nodes && pushCommand(createCreateCommand(nodes, level, stageId));
        });
        nodesToDb.forEach((level, nodes) => {
          nodes && upsertNodes(nodes, level, stageId);
        });
      },
      [stageId, pushCommand],
    ),
  });
}
