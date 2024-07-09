import { createMultiMap } from "@/utils/generic/multiMap";
import { CanvasNode, mergeCanvasNodes } from "@repo/canvas";
import { useCallback } from "react";
import { upsertNodes } from "../../actions";
import { createUpdateCommand } from "../../features/command";
import { EditorEventOrigin } from "../../features/events";
import { useBatch } from "../useBatch";
import { usePushCommand } from "./usePushCommand";

export function usePushUpdate(stageId: number) {
  const pushCommand = usePushCommand();

  return useBatch<{
    origin: EditorEventOrigin;
    oldNode: CanvasNode;
    newNode: CanvasNode;
    level: number;
  }>({
    commit: useCallback(
      async (data) => {
        const oldMap = new Map<string, CanvasNode>();
        const newMap = new Map<number, Map<string, CanvasNode>>();

        data.forEach(({ origin, oldNode, newNode, level }) => {
          // Try put old node if not already set
          if (origin === "user" && !oldMap.has(oldNode.attrs.id))
            oldMap.set(oldNode.attrs.id, oldNode);
          // Put new node and possibly merge with previous nodes
          const outputMap = newMap.get(level) ?? new Map();
          if (!newMap.has(level)) newMap.set(level, outputMap);
          const foundNode = outputMap.get(newNode.attrs.id);
          if (!foundNode) return outputMap.set(newNode.attrs.id, newNode);
          // Node is duplicated, thus merge with existing node data
          outputMap.set(newNode.attrs.id, mergeCanvasNodes(foundNode, newNode));
        });

        const nodesByUser = new Array<[old: CanvasNode, new: CanvasNode]>();
        const nodesToDb = createMultiMap<number, CanvasNode>();

        newMap.forEach((map, level) => {
          for (const key of map.keys()) {
            const oldNode = oldMap.get(key);
            const newNode = map.get(key);
            if (newNode == null)
              // Should be impossible to reach; throw just in case
              throw new Error("new node is null");
            if (oldNode != null)
              // Since there's a previous node, it has the correct origin
              nodesByUser.push([oldNode, newNode]);
            nodesToDb.push(level, newNode);
          }
        });

        if (nodesByUser.length !== 0)
          pushCommand(await createUpdateCommand(nodesByUser));

        // TODO DATA RACE: create RPC that only updates the diffing fields
        nodesToDb.forEach((level, nodes) => {
          nodes && upsertNodes(nodes, level, stageId);
        });
      },
      [stageId, pushCommand],
    ),
  });
}
