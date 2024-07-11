import { MultiMap } from "@/utils/generic/multiMap";
import { CanvasNode, mergeCanvasNodes } from "@repo/canvas";
import { upsertNodes } from "../../actions";
import { EditorCommand, createUpdateCommand } from "../../features/command";
import { EditorEventOrigin } from "../../features/events";
import { useBatch } from "./useBatch";

export function usePushUpdate(
  stageId: number,
  send: (command: EditorCommand) => void,
) {
  return useBatch<{
    origin: EditorEventOrigin;
    oldNode: CanvasNode;
    newNode: CanvasNode;
    level: number;
  }>({
    commit: async (data) => {
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
      const nodesToDb = new MultiMap<number, CanvasNode>();

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
        send(await createUpdateCommand(nodesByUser));

      // TODO DATA RACE: create RPC that only updates the diffing fields
      nodesToDb.forEach((nodes, level) => {
        nodes && upsertNodes(nodes, level, stageId);
      });
    },
  });
}
