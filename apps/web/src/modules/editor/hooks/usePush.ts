import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { CanvasNode, mergeCanvasNodes } from "@repo/canvas";
import { useCallback } from "react";
import { deleteNodes, upsertNodes } from "../actions";
import { EditorCommand, createUpdateCommand } from "../features/command";
import { createCreateCommand } from "../features/command/commands/createCommand";
import { createDeleteCommand } from "../features/command/commands/deleteCommand";
import { EditorEventOrigin } from "../features/events";
import { useBatch } from "./useBatch";

export function usePushCommand() {
  const [editor] = useEditorContext();
  return useCallback(
    (command: EditorCommand) => {
      editor.history.push(command);
      editor.channel.broadcast(command.eventType, command.payload);
    },
    [editor],
  );
}

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

function createMultiMap<K, V>() {
  const map = new Map<K, V[]>();

  return {
    push: (key: K, value: V) => {
      const array = map.get(key) ?? [];
      map.set(key, [...array, value]);
    },
    get: (key: K) => map.get(key),
    keys: () => map.keys(),
    values: () => map.values(),
    size: () => map.size,
    forEach: (callbackFn: (key: K, value: V[] | undefined) => any) => {
      for (const key of map.keys()) callbackFn(key, map.get(key));
    },
  } as const;
}
